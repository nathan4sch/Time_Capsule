const axios = require('axios');
const vision = require('@google-cloud/vision');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require('../app');
const convert = require('heic-convert');
const sharp = require('sharp');
const crypto = require('crypto')

const client = new vision.ImageAnnotatorClient();

const bucketName = process.env.BUCKET_NAME

const landscape_keywords = [
    'landscape',
    'scenery',
    'nature',
    'mountain',
    'valley',
    'hill',
    'field',
    'meadow',
    'plain',
    'prairie',
    'countryside',
    'countryscape',
    'countrysides',
    'countryscapes',
    'rural',
    'ruralscape',
    'ruralscapes',
    'country',
    'countrypark',
    'countryparks',
    'farmland',
    'farmlands',
    'farm',
    'farming',
    'vineyard',
    'vineyards',
    'orchard',
    'orchards',
    'grove',
    'groves',
    'forest',
    'woodland',
    'woods',
    'jungle',
    'rainforest',
    'tropical',
    'desert',
    'dunes',
    'oasis',
    'canyon',
    'glen',
    'cave',
    'cliff',
    'coast',
    'seashore',
    'shore',
    'beach',
    'coastline',
    'riverbank',
    'riverbed',
    'stream',
    'brook',
    'waterfall',
    'rapids',
    'lake',
    'pond',
    'lagoon',
    'reservoir',
    'marsh',
    'swamp',
    'wetland',
    'fen',
    'moor',
    'heath',
    'plateau',
    'plain',
    'prairie',
    'savanna',
    'steppe',
    'tundra',
    'glacier',
    'iceberg',
    'arctic',
    'antarctic',
    'permafrost',
    'highland',
    'lowland',
    'upland',
    'mesa',
    'butte',
    'badlands',
    'escarpment',
    'panorama',
    'view',
    'vista',
    'outlook',
    'scenic',
    'picturesque',
    'serene',
    'tranquil',
    'peaceful',
    'idyllic',
    'majestic',
    'sublime',
    'bucolic',
    'pastoral',
    'picturesque',
    'stunning',
    'breathtaking',
    'awe-inspiring',
    'exquisite',
    'marvelous',
    'wonderful',
    'fantastic',
    'amazing',
    'beautiful',
    'gorgeous',
];

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

async function analyzeImage(image) {
    const [result] = await client.annotateImage({
        image: { content: image },
        features: [{ type: 'LABEL_DETECTION', maxResults: 100 }, { type: 'FACE_DETECTION' }, { "type": "IMAGE_PROPERTIES" }],
    });
    const labels = result.labelAnnotations;
    const faces = result.faceAnnotations;
    let dominantColors = null;
    if (result.imagePropertiesAnnotation) {
        dominantColors = result.imagePropertiesAnnotation.dominantColors.colors;
    }
    let joy = 0;
    if (faces && faces.length > 0) {
        faces.forEach((face, index) => {
            const faceData = {
                confidence: face.detectionConfidence,
                joyLikelihood: face.joyLikelihood,
                sorrowLikelihood: face.sorrowLikelihood,
                angerLikelihood: face.angerLikelihood,
                surpriseLikelihood: face.surpriseLikelihood,
                underExposedLikelihood: face.underExposedLikelihood,
                blurredLikelihood: face.blurredLikelihood,
                headwearLikelihood: face.headwearLikelihood,
                bounds: face.boundingPoly.vertices
            };
            if (faceData.confidence > .8 && faceData.joyLikelihood == "LIKELY" || faceData.joyLikelihood == "VERY_LIKELY") {
                joy++;
            }
        });
    }
    let landscape = 0;
    if (labels && labels.length > 0) {
        labels.forEach((label, index) => {
            const labelData = {
                description: label.description,
                mid: label.mid,
                score: label.score,
                topicality: label.topicality,
            };
            if (labelData.description == "Smile") {
                joy++;
            }
            else if (landscape_keywords.includes(labelData.description.toLowerCase())) {
                landscape += 1;
            }
        });
    }
    console.log('joy: ', joy, 'landscape: ', landscape)
    return [joy, landscape, dominantColors];
}


async function similarPicture(dominantColors1, dominantColors2) {
    function compareColors(color1, color2) {
        color1 = color1.color;
        color2 = color2.color;
        const distance = Math.sqrt(
            Math.pow(color1.red - color2.red, 2) +
            Math.pow(color1.green - color2.green, 2) +
            Math.pow(color1.blue - color2.blue, 2)
        );
        const threshold = 8;

        return distance < threshold;
    }

    const similarColors = dominantColors1.filter(color1 =>
        dominantColors2.some(color2 => compareColors(color1, color2))
    );

    const similarityScore = similarColors.length / Math.min(dominantColors1.length, dominantColors2.length);

    return similarityScore > .5;
}

function isEqual(row1, row2) {
    if (row1.length !== row2.length) {
        return false;
    }
    for (let i = 0; i < row1.length; i++) {
        if (row1[i] !== row2[i]) {
            return false;
        }
    }
    return true;
}

exports.selectPhotos = async (req, res) => {
    const imageType = (await import('image-type')).default;
    const { id } = req.params;
    console.log(id)

    let image_data = []
    for (let image of req.files) {
        console.log("start of conversion")
        if ((await imageType(image.buffer)).mime === 'image/heic') {
            image.buffer = await convert({
                buffer: image.buffer, // the HEIC file buffer
                format: 'JPEG', // output format
            });
            image.mimetype = 'image/jpeg'
        }
        if (image.buffer.length === 0) {
            continue;
        }
        /*if ((await imageType(image.buffer)).mime === 'image/heic') {
            sharp(image.buffer)
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer()
                .then(outputBuffer => {
                    image.buffer = outputBuffer;
                    image.mimetype = 'image/jpeg';
                })
                .catch(err => {
                    console.error('Error during conversion:', err);
                });
        }
        if (image.buffer.length === 0) {
            continue;
        }*/
        console.log("after conversion, starting google vision")
        const [joy, landscape, dominantColors] = await analyzeImage(image.buffer)
        console.log("done with google vision")
        if ((joy == 0 && landscape == 0) || dominantColors == null) {
            continue;
        }
        let add = true;
        for (const [i, j, l, dC] of image_data) {
            if (j == joy && l == landscape) {
                if (await similarPicture(dC, dominantColors)) {
                    add = false;
                    break;
                }
            }
        }
        if (add)
            image_data.push([image, joy, landscape, dominantColors])
    }
    let new_image_data = []
    if (image_data.length > 6) {
        let toggle = true;
        while (new_image_data.length < 6) {
            if (toggle) {
                const maxSmile = image_data.reduce((max, curr) => curr[1] > max[1] ? curr : max);
                image_data = image_data.filter(row => !isEqual(row, maxSmile));
                if (maxSmile[1] != 0) {
                    new_image_data.push(maxSmile[0])
                }
                toggle = !toggle;
            } else {
                const maxLandscape = image_data.reduce((max, curr) => curr[2] > max[2] ? curr : max);
                image_data = image_data.filter(row => !isEqual(row, maxLandscape));
                if (maxLandscape[2] != 0) {
                    new_image_data.push(maxLandscape[0])
                }
                toggle = !toggle;
            }
        }
    }
    else {
        new_image_data = image_data.map(pair => pair[0])
    }
    let key_array = []
    for (const image of new_image_data) {
        //imageName = id + image.originalname
        imageName = randomImageName()
        key_array.push(imageName)
        const params = {
            Bucket: bucketName,
            Body: image.buffer,
            Key: imageName,  //key is the image name, unique or else rewrite image
            ContentType: image.mimetype,
        };

        try {
            await s3.send(new PutObjectCommand(params));
            console.log("File uploaded successfully to S3");
        } catch (error) {
            console.error('Error uploading image to S3:', error);
        }
    }
    for (let i = 0; i < 6 - new_image_data.length; i++) {
        key_array.push("default1.png")
    }
    //console.log("vision: ", key_array)
    //console.log(key_array)
    res.status(200).json(key_array);
};
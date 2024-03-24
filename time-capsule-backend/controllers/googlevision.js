const axios = require('axios');
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

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
  

async function analyzeImage(imageUri) {
    const [result] = await client.annotateImage({
        image: { source: { imageUri: imageUri } }, 
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
    console.log("joy ", joy, "landscape", landscape)
    return [joy, landscape, dominantColors];
  }

function similarPicture(color1, color2) {
    let sum = 0
    for (let i = 0; i < color1.length; i++) {
        d1 = (color1[i].color.red - color2[i].color.red) ** 2
        d2 = (color1[i].color.green - color2[i].color.green) ** 2
        d3 = (color1[i].color.blue - color2[i].color.blue) ** 2
        dist = (d1 + d2 + d3) ** .5
        sum += dist
    }
    return (sum / color1.length) < 45;
}

function addDefaults(image_data) {
    // ADD DEFAULTS
    return image_data;
}

exports.selectPhotos = async (req, res) => {
    const { id } = req.params;
    const image_data = []
    for (let i = 103; i <= 143; i++) {
        const imageName = "kevin-temp-" + i + ".jpg";
        const urlRes = await axios.get(`https://time-capsule-server.onrender.com/api/get/${imageName}`);
        const [joy, landscape, dominantColors] = await analyzeImage(urlRes.data.url)
        if ((joy == 0 && landscape == 0) || dominantColors == null) {
            continue;
        }
        let add = true;
        for (const [name, url, j, l, dC] of image_data) {
            if (j == joy && l == landscape && similarPicture(dC, dominantColors)) {
                add = false;
                break;
            }            
        }
        if (add)
            image_data.push([imageName, urlRes.data.url, joy, landscape, dominantColors])
        console.log("Finished ", i)
    }
    let new_image_data = []
    if (image_data.length < 6) {
        new_image_data = image_data.map(pair => pair[1])
        addDefaults(new_image_data);
    }
    else if (image_data.length > 6) {
        let sort_data = []
        for (const [name, url, j, l, dC] of image_data) {
            sort_data.push([url, j+l])          
        }
        sort_data.sort((a, b) => a[1] - b[1])
        sort_data = sort_data.slice(-6)
        new_image_data = sort_data.map(pair => pair[0])
    }
    else {
        new_image_data = image_data.map(pair => pair[1])
    }
    //CREATE CAPSULE FROM new_image_data
    console.log(new_image_data)
};
const axios = require('axios');
const vision = require('@google-cloud/vision');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require('../app');
const convert = require('heic-convert');
const sharp = require('sharp');
const crypto = require('crypto')
const onnx = require('onnxruntime-node');
const fs = require('fs');
const csv = require('csv-parser');

const client = new vision.ImageAnnotatorClient();

const bucketName = process.env.BUCKET_NAME;

const values = readLabels('./class-descriptions.csv');

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

async function analyzeImage(image) {
    const session = await onnx.InferenceSession.create('./model.onnx');
    

    const [result] = await client.annotateImage({
        image: { content: image },
        features: [{ type: 'LABEL_DETECTION', maxResults: 100 }, { "type": "IMAGE_PROPERTIES" }],
    });
    const labels = result.labelAnnotations;
    let dominantColors = null;
    if (result.imagePropertiesAnnotation) {
        dominantColors = result.imagePropertiesAnnotation.dominantColors.colors;
    }

    const xFeatures = new Array(values.length).fill(0.0);
    const indices = labels.map(label => values.indexOf(label)).filter(index => index !== -1);
    indices.forEach(index => {
        xFeatures[index] = 1.0;
    });
    const inputTensor = await new onnx.Tensor('float32', xFeatures, [values.length]);
    const feed = { 'onnx::MatMul_0' : inputTensor }
    const outputMap = await session.run(feed);
    const score = outputMap['11'].cpuData[1];
    return [score, dominantColors];
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

function readLabels(csvFilePath) {
    const values = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                values.push(row['1']);
            })
            .on('end', () => {
                resolve(values);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

exports.selectPhotos = async (req, res) => {
    const imageType = (await import('image-type')).default;

    const { id } = req.params;
    console.log(id)
    let image_data = []
    console.log("Before conversion")
    if (req.files) {
        const conversionPromises = req.files.map(async (image) => {
            let processedImage = { ...image }; // Create a new object for the processed image
            if ((await imageType(image.buffer)).mime === 'image/heic') {
                processedImage.buffer = await convert({
                    buffer: image.buffer, // the HEIC file buffer
                    format: 'JPEG', // output format
                });
                processedImage.mimetype = 'image/jpeg';
            }
            return processedImage;
        });
        const convertedImages = await Promise.all(conversionPromises);
        console.log("after conversion")
        for (let image of convertedImages) {
            console.log("before GV")
            const [score, dominantColors] = await analyzeImage(image.buffer)
            console.log("after, score: ", score)
            if (score < 0|| dominantColors == null) {
                continue;
            }
            let add = true;
            for (const [i, s, dC] of image_data) {
                if (await similarPicture(dC, dominantColors)) {
                    add = false;
                    break;
                }
            }
            if (add)
                image_data.push([image, score, dominantColors])
        }
    }
    let new_image_data = []
    if (image_data.length > 6) {
        const sortedImageData = image_data.sort((a, b) => b[1] - a[1]);
        new_image_data = sortedImageData.slice(0, 6);
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
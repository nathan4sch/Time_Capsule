const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const convert = require('heic-convert');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

async function isDirectory(filePath) {
    const stats = await stat(filePath);
    return stats.isDirectory();
}

async function convertHeicToJpeg(filePath) {
    const buffer = fs.readFileSync(filePath);
    const outputBuffer = await convert({
        buffer,
        format: 'JPEG',
        quality: 1
    });
    const newFilePath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.jpg');
    fs.writeFileSync(newFilePath, outputBuffer);
    console.log(`Converted ${filePath} to ${newFilePath}`);

    await unlink(filePath);
}

async function convertAllHeicToJpeg(directory) {
    const files = await readdir(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        if (path.extname(filePath).toLowerCase() === '.heic') {
            await convertHeicToJpeg(filePath);
        } else if (await isDirectory(filePath)) {
            await convertAllHeicToJpeg(filePath);
        }
    }
}

const directory = 'C:\\Users\\Kevin\\Documents\\CS 307\\Data Collection\\Training Data';  
convertAllHeicToJpeg(directory)
    .then(() => console.log('Conversion and deletion completed.'))
    .catch(error => console.error('Error:', error));

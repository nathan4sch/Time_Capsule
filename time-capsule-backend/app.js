const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');

const express = require('express') // Express framework for building web applications
const cors = require('cors'); // (Cross-Origin Resource Sharing) middleware for handling CORS issues
const { db } = require('./db/db');
const { readdirSync, read } = require('fs')
const app = express()

const crypto = require('crypto')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require('dotenv').config()

const PORT = process.env.PORT


const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const region = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

const upload = multer({ storage: multer.memoryStorage() });

//handle photo upload to the aws s3 bucket
app.post('/api/posts', upload.single('image'), async (req, res) => {
    console.log("Server received a request to /api/posts");
    if (!req.file) {
        console.error("No file was uploaded.");
        return res.status(400).json({ error: "File not provided" });
    }

    //use sharp to modify the height and width of the photo. 

    imageName = randomImageName()
    const params = {
        Bucket: bucketName,
        Body: req.file.buffer,
        Key: imageName,  //key is the image name, unique or else rewrite image
        ContentType: req.file.mimetype,
    };

    try {
        await s3.send(new PutObjectCommand(params));
        console.log("File uploaded successfully to S3");
        res.json({ message: "Image uploaded successfully", imageName: imageName });
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        res.status(500).json({ error: "Error uploading image to S3" });
    }
});

app.get("/api/get/:imageName", async (req, res) => {
    const { imageName } = req.params;
    const getObjectParams = {
        Bucket: bucketName,
        Key: imageName,
    }
    const command = new GetObjectCommand(getObjectParams)
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    res.send({ url });
});

app.delete("/api/del/:imageName", async (req, res) => {
    const { imageName } = req.params;
    const deleteParams = {
        Bucket: bucketName,
        Key: imageName,
    }

    try {
        await s3.send(new DeleteObjectCommand(deleteParams))
        console.log("File deleted successfully");
        res.json({ message: "Image deleted successfully", imageName: imageName });
    } catch (error) {
        console.error('Error deleting image to S3:', error);
        res.status(500).json({ error: "Error deleting image to S3" });
    }
})

//end new

// Middleware setup
app.use(express.json())
app.use(cors())

//routes
//Reads all files from routes?
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const express = require('express') // Express framework for building web applications
const cors = require('cors'); // (Cross-Origin Resource Sharing) middleware for handling CORS issues
const { db } = require('./db/db');
const { readdirSync, read } = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

//new
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

app.post('/posts', upload.single('image'), async (req, res) => {
    req.file.buffer
    const params = {
        Bucket: bucketName,
        Body: req.file.buffer,
        Key: req.file.originalName,
        ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)

    res.send({})
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

const express = require('express') // Express framework for building web applications
const cors = require('cors'); // (Cross-Origin Resource Sharing) middleware for handling CORS issues
const { db } = require('./db/db');
const {readdirSync, read} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

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
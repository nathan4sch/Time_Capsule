/**
 * This module contains a function to establish a connection to a MongoDB database using the 'mongoose' library
 */

const mongoose = require('mongoose');

// Asynchronous function that will handle the database connection.
const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Db connected');
    } catch (error) {
        console.log(error);
        console.log('DB Connection Error');
    }
}

module.exports = { db }
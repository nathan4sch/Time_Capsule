const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' //establish reference from user collection
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    message: {
        type: String
    }
})

module.exports = mongoose.model('Notification', NotificationSchema)
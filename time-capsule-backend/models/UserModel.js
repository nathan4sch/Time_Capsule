const mongoose = require('mongoose');
const Moment = require('./MomentModel')
const Capsule = require('./CapsuleModel')
const Notification = require('./NotificationModel')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    email: {
        type: String,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' //establish reference from user collection
    }],
    moments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moments'
    }],
    capsules: [Capsule.schema], //Import schema from 'CapsuleModel.js'
    friendRequests: [{
        type: String //List of usernames
    }],
    notifications: [Notification.schema],
    profileSettings: {
        darkMode: {
            type: Boolean,
            default: false 
        },
        profilePicture: {
            type: String,
            default: '' 
        },
        spotifyAccount: {
            type: String,
            default: '' 
        },
        instagramAccount: {
            type: String,
            default: ''
        }
    },
})

module.exports = mongoose.model('User', UserSchema)
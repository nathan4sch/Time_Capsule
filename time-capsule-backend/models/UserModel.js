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
    capsules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'capsules'
    }],
    friendRequests: [{
        type: String //List of usernames
    }],
    notifications: [Notification.schema],
    profileSettings: {
        darkMode: {
            type: Boolean,
            default: false 
        },
        profilePictureUrl: {
            type: String,
            default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
        },
        profilePictureKey: {
            type: String,
            default: "default"
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
const mongoose = require('mongoose');
const Moment = require('./MomentModel')
const Capsule = require('./CapsuleModel')
const Notification = require('./NotificationModel')
const Profile = require('./ProfileModel')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //establish reference from user collection
    }],
    moments: [Moment.schema], //Import schema from 'MomentModel.js'
    capsules: [Capsule.schema], //Import schema from 'CapsuleModel.js'
    friendsRequests: [{
        type: String //List of usernames
    }],
    notifications: [Notification.schema], //Import schema from 'NotificationModel.js'
    profileSettings: Profile.schema //Import schema from 'ProfileModel.js'
})

module.exports = mongoose.model('User', UserSchema)
const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
    snapshotUrl: {
        type: String,
        default: ""
    },
    snapshotKey: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    usedPhotos: [{
        photoKey: {
            type: String
        },
        photoUrl: {
            type: String,
            default: ""
        }
    }],
    quote: {
        type: String
    },
    spotifySongs: [{
        type: String
    }],
    moments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moments'
    }],
    published: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Capsule', CapsuleSchema)

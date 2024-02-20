const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
    snapshot: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    usedPhotos: [{
        type: String
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
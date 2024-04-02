const CapsuleSchema = require("../models/CapsuleModel");
const UserSchema = require("../models/UserModel");

//add functionality to automatically populate the capsule with moments from the last month
exports.createCapsule = async (req, res) => {
    const { snapshotKey, usedPhotos, quote, spotifySongs } = req.body;
    const { id } = req.params;

    try {
        if (!snapshotKey || !usedPhotos || !quote || !spotifySongs || !id) {
            return res.status(400).json({ message: 'All Fields Required' });
        }
        // Save the new moment to the database
        const capsule = CapsuleSchema({
            snapshotKey,
            usedPhotos,
            quote,
            spotifySongs,
        })

        await capsule.save()
        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's moments array with the new moment
        user.capsules.push(capsule._id);
        await user.save();

        res.status(200).json({ message: 'Capsule created and added to user' });
    } catch (error) {
        console.log(error)
        console.error('Error creating capsule:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getCapsule = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        const capsule = await CapsuleSchema.findOne({ _id: id });

        if (!capsule) {
            return res.status(404).json({ message: 'capsule not found' });
        }

        res.status(200).json(capsule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteCapsule = async (req, res) => {
    const { id } = req.params
    CapsuleSchema.findByIdAndDelete(id)
        .then((capsule) => {
            res.status(200).json({ message: 'capsule deleted' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' })
        })
}

exports.removeSongFromCapsule = async (req, res) => {
    const { capsuleId } = req.params;
    const { songName } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        const updatedSongs = capsule.spotifySongs.filter((song) => song !== songName);
        capsule.spotifySongs = updatedSongs;

        await capsule.save();

        res.status(200).json({ message: "Song removed from capsule" });
    } catch (error) {
        console.error("Error removing song from capsule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addSongToCapsule = async (req, res) => {
    const { capsuleId } = req.params;
    const { songName } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        capsule.spotifySongs.push(songName)

        await capsule.save();

        res.status(200).json({ message: "Song added to capsule" });
    } catch (error) {
        console.error("Error adding song from capsule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.replacePhoto = async(req, res) => {
    const { capsuleId } = req.params;
    const { photoKey, photoUrl, index } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        capsule.usedPhotos[index] = { photoKey, photoUrl };

        await capsule.save();

        res.status(200).json({ message: "Photo replaced" });
    } catch (error) {
        console.log("Error replacing photo to capsule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

//will not work
exports.addPhotoToCapsule = async (req, res) => {
    const { capsuleId } = req.params;
    const { photoLink } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        capsule.usedPhotos.push(photoLink)

        await capsule.save();

        res.status(200).json({ message: "Photo added to capsule" });
    } catch (error) {
        console.error("Error adding photo to capsule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

//will not work
exports.removePhotoFromCapsule = async (req, res) => {
    const { capsuleId } = req.params;
    const { photoLink } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        const updatedPhotos = capsule.usedPhotos.filter((photo) => photo !== photoLink);
        capsule.usedPhotos = updatedPhotos;

        await capsule.save();

        res.status(200).json({ message: "Photo removed from capsule" });
    } catch (error) {
        console.error("Error removing photo from capsule:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.setPublish = async (req, res) => {
    const { capsuleId } = req.params;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });
        if (!capsule) {
            return res.status(404).json({ message: 'capsule not found' });
        }

        //Switch boolean value
        capsule.published = !capsule.published;

        // Save the updated user document
        await capsule.save();

        res.status(200).json({ message: 'Capsule publish setting changed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.setQuote = async (req, res) => {
    const { capsuleId } = req.params;
    const { quote } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });
        if (!capsule) {
            return res.status(404).json({ message: 'capsule not found' });
        }

        //Switch boolean value
        capsule.quote = quote;

        // Save the updated user document
        await capsule.save();

        res.status(200).json({ message: 'Capsule quote changed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.setSnapshotKey = async (req, res) => {
    const { capsuleId } = req.params;
    const { key } = req.body;

    try {
        const capsule = await CapsuleSchema.findOne({ _id: capsuleId });
        if (!capsule) {
            return res.status(404).json({ message: 'capsule not found' });
        }

        //Switch boolean value
        capsule.snapshotKey = key;

        // Save the updated user document
        await capsule.save();

        res.status(200).json({ message: 'Capsule key changed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
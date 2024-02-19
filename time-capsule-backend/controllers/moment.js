const MomentSchema = require("../models/MomentModel");
const User = require("../models/UserModel");

exports.createMoment = async (req, res) => {
    const { description } = req.body;
    const { username } = req.params;

    try {
        if (!description) {
            return res.status(400).json({ message: 'Description Required' });
        }
        // Save the new moment to the database
        const moment = MomentSchema({
            description,
        })
        
        await moment.save()
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's moments array with the new moment
        user.moments.push(moment._id);
        await user.save();

        res.status(200).json({ message: 'Moment created and added to user' });
    } catch (error) {
        console.error('Error creating moment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

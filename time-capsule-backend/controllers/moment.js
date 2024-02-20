const MomentSchema = require("../models/MomentModel");
const UserSchema = require("../models/UserModel");

exports.addMoment = async (req, res) => {
    const { description } = req.body;
    const { id } = req.params;

    try {
        if (!description) {
            return res.status(400).json({ message: 'Description Required' });
        }
        // Save the new moment to the database
        const moment = MomentSchema({
            description,
        })
        
        await moment.save()
        const user = await UserSchema.findOne({ _id: id });
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

exports.getMoment = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        const moment = await MomentSchema.findOne({ _id: id });

        if (!moment) {
            return res.status(404).json({ message: 'id not found' });
        }

        res.status(200).json(moment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteMoment = async (req, res) => {
    const {id} = req.params
    MomentSchema.findByIdAndDelete(id)
        .then((moment) => {
            res.status(200).json({ message: 'Moment deleted' })
        })
        .catch((err)=> {
            res.status(500).json({ message: 'Server Error' })
        })
}
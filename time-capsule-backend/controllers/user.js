const UserSchema = require("../models/userModel")

exports.addUser = async (req, res) => {
    const { username } = req.body

    const user = UserSchema({
        username,
        friends: [],  // Initialize with an empty array
        moments: [],  // Initialize with an empty array
        capsules: [], // Initialize with an empty array
        friendRequests: [], // Initialize with an empty array
        notifications: [],   // Initialize with an empty array
        profileSettings: {}   // Initialize with an empty object for now
    })

    try {
        //validations
        //add one to check if existing username
        if (!username) {
            return res.status(400).json({ message: 'Username Required' })
        }
        await user.save()
        res.status(200).json({ message: 'User added' })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }

    console.log(user)
}


exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

//find user by username
exports.getUser = async (req, res) => {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        // Get all users
        const allUsers = await UserSchema.find()
        // Find the user with the specified username
        const user = allUsers.find(u => u.username === username);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

//delete a user by unique id (id in mongo object)
exports.deleteUser = async (req, res) => {
    const {id} = req.params
    UserSchema.findByIdAndDelete(id)
        .then((user) => {
            res.status(200).json({ message: 'User deleted' })
        })
        .catch((err)=> {
            res.status(500).json({ message: 'Server Error' })
        })
}
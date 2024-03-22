const UserSchema = require("../models/UserModel")

//USERS
exports.addUser = async (req, res) => {
    const { username, email } = req.body

    const user = UserSchema({
        username,
        email,
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

    //console.log(user)
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

        const user = await UserSchema.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserbyID = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        const user = await UserSchema.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'id not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.emailExist = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(200).json({ exists: false, user: ''  });
        }

        res.status(200).json({ exists: true, user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*delete a user by unique id (id in mongo object)*/
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

//FRIENDs
/*add the current user's username to the friend requests list of the specified user*/
exports.sendFriendRequest = async (req, res) => {
    const { id } = req.params;
    const { friendUsername } = req.body;

    try {
        // Validate if both usernames are provided
        if (!id || !friendUsername) {
            return res.status(400).json({ message: 'Current id and friend username required' });
        }

        // Find the user who is making the friend request
        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friend username exists in the system
        const friendUser = await UserSchema.findOne({ username: friendUsername });
        if (!friendUser) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        if (friendUser.friendRequests.includes(user.username)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        // Add the friend request to the user's friendRequests array
        friendUser.friendRequests.push(user.username);

        // Save the updated friendUser document
        await friendUser.save();

        res.status(200).json({ message: 'Friend request added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*remove the given 'requestUsername' from the user's friend requests */
exports.removeFriendRequest = async (req, res) => {
    const { id } = req.params;
    const { requestUsername } = req.body;

    try {
        if (!id || !requestUsername) {
            return res.status(400).json({ message: 'Current id and friend username required' });
        }

        // Find the user who is making the friend request
        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.friendRequests.includes(requestUsername)) {
            return res.status(400).json({ message: 'Friend request not found' });
        }

        // Remove the friend request from the user's friendRequests array
        indexToRemove = user.friendRequests.indexOf(requestUsername)
        user.friendRequests.splice(indexToRemove, 1)
        await user.save();
        res.status(200).json({ message: 'Friend request removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/* add friendUsername objectid to the user's list of friends
Mongoose will automatically replace the stored objectids with the actual documents from 
the user collection because of the red: 'User' */
exports.addFriend = async (req, res) => {
    const { id } = req.params;
    const { friendUsername } = req.body;

    try {
        if (!id || !friendUsername) {
            return res.status(400).json({ message: 'Current id and friend username required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendUser = await UserSchema.findOne({ username: friendUsername });
        if (!friendUser) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // Add the friend to the user's friends array
        user.friends.push(friendUser._id);

        await user.save();
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/* remove the friendID from the user's friends list */
exports.removeFriend = async (req, res) => {
    const { id } = req.params;
    const { friendId } = req.body;

    try {
        if (!id || !friendId) {
            return res.status(400).json({ message: 'Current id and friend ID required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const indexToRemove = user.friends.indexOf(friendId);
        if (indexToRemove === -1) {
            return res.status(400).json({ message: 'Friend not found in user\'s friends list' });
        }

        // Remove the friend from the user's friends array
        user.friends.splice(indexToRemove, 1);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

//PROFILE SETTINGS
exports.setLDMode = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: 'User id required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Switch boolean value
        user.profileSettings.darkMode = !user.profileSettings.darkMode;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Light/Dark mode setting updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.setProfilePictureUrl = async (req, res) => {
    const { id } = req.params;
    const { profilePictureUrl } = req.body;

    try {
        if (!id || profilePicture === undefined) {
            return res.status(400).json({ message: 'User id and profilePicture value required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the profilePicture setting
        user.profileSettings.profilePictureUrl = profilePictureUrl;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.setProfilePictureKey = async (req, res) => {
    const { id } = req.params;
    const { setProfilePictureKey } = req.body;

    try {
        if (!id || profilePicture === undefined) {
            return res.status(400).json({ message: 'User id and profilePicture value required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the profilePicture setting
        user.profileSettings.setProfilePictureKey = setProfilePictureKey;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'setProfilePictureKey updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.setSpotify = async (req, res) => {
    const { id } = req.params;
    const { spotify } = req.body;

    try {
        if (!id || spotify === undefined) {
            return res.status(400).json({ message: 'User id and spotify value required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the profilePicture setting
        user.profileSettings.spotifyAccount = spotify;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'spotify updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.setInstragram = async (req, res) => {
    const { id } = req.params;
    const { instagram } = req.body;

    try {
        if (!id || instagram === undefined) {
            return res.status(400).json({ message: 'User id and instagram value required' });
        }

        const user = await UserSchema.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the profilePicture setting
        user.profileSettings.instagramAccount = instagram;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'instagram updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const UserSchema = require("../models/userModel")


exports.addUser = async (req, res) => {
    const { username } = req.body

    const user = UserSchema({
        username
    })

    try {
        //validations
        if (!username) {
            return res.status(400).json({ message: 'All Fields Required' })
        }
        await user.save()
        res.status(200).json({ message: 'User added' })
    } catch (error) {
        res.status(200).json({ message: 'Server Error' })
    }

    console.log(user)
}

/*exports.getUsers = async (req, res) => {

}*/
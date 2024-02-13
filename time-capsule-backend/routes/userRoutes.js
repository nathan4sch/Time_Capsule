const { addUser, getUser, deleteUser, getAllUsers, sendFriendRequest, removeFriendRequest } = require('../controllers/user')

const router = require('express').Router()

router.post('/add-user', addUser)
    .get('/get-all-users', getAllUsers)
    .get('/get-user/:username', getUser)
    .delete('/delete-user/:id', deleteUser)
    .post('/send-friend-request/:username', sendFriendRequest)
    .delete('/remove-friend-request/:username', removeFriendRequest)

module.exports = router
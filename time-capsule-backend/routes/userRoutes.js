const { addUser, getUser, deleteUser, getAllUsers, sendFriendRequest, removeFriendRequest, addFriend } = require('../controllers/user')

const router = require('express').Router()

router.post('/add-user', addUser)
    .get('/get-all-users', getAllUsers)
    .get('/get-user/:username', getUser)
    .delete('/delete-user/:id', deleteUser)
    .post('/send-friend-request/:username', sendFriendRequest)
    .delete('/remove-friend-request/:username', removeFriendRequest)
    .post('/add-friend/:username', addFriend);

module.exports = router
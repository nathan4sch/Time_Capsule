const { addUser, getUser, deleteUser, getAllUsers, addFriendRequest } = require('../controllers/user')

const router = require('express').Router()

router.post('/add-user', addUser)
    .get('/get-all-users', getAllUsers)
    .get('/get-user/:username', getUser)
    .delete('/delete-user/:id', deleteUser)
    .post('/add-friend-request/:username', addFriendRequest)

module.exports = router
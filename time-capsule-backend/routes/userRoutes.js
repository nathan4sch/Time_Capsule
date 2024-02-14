const { 
    addUser, 
    getUser, 
    deleteUser, 
    getAllUsers, 
    sendFriendRequest,
    removeFriendRequest, 
    addFriend,
    removeFriend 
} = require('../controllers/user')

const {
    createMoment
} = require('../controllers/moment')

const router = require('express').Router()

//API endpoints for user operations
router
    .post('/add-user', addUser)
    .get('/get-all-users', getAllUsers)
    .get('/get-user/:username', getUser)
    .delete('/delete-user/:id', deleteUser)
    .post('/send-friend-request/:username', sendFriendRequest)
    .delete('/remove-friend-request/:username', removeFriendRequest)
    .post('/add-friend/:username', addFriend)
    .delete('/remove-friend/:username', removeFriend)

router
    .post('/add-moment/:username', createMoment)

module.exports = router
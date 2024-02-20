const { 
    addUser, 
    getUser, 
    deleteUser, 
    getAllUsers, 
    sendFriendRequest,
    removeFriendRequest, 
    addFriend,
    removeFriend, 
    emailExist,
    getUserbyID,
    setLDMode,
    setProfilePicture,
    setSpotify,
    setInstragram,
} = require('../controllers/user')

const {
    addMoment,
    getMoment,
    deleteMoment,
} = require('../controllers/moment')

const { 
    createCapsule, 
    getCapsule, 
    deleteCapsule,
    removeSongFromCapsule,
    addSongToCapsule,
    addPhotoToCapsule
} = require('../controllers/capsule')

const router = require('express').Router()

//API endpoints for user operations
//most requests take an id in the route to indicate the current user
router
    .post('/add-user', addUser)
    .get('/get-all-users', getAllUsers)
    .get('/get-user/:username', getUser)
    .get('/get-user-byID/:id', getUserbyID)
    .get('/email-exist/:email', emailExist)
    .delete('/delete-user/:id', deleteUser)
    .post('/send-friend-request/:id', sendFriendRequest)     
    .delete('/remove-friend-request/:id', removeFriendRequest) 
    .post('/add-friend/:id', addFriend) 
    .delete('/remove-friend/:id', removeFriend) 
    //Profile setting routes
    .post('/set-LD-mode/:id', setLDMode)
    .post('/set-profile-picture/:id', setProfilePicture)
    .post('/set-spotify-account/:id', setSpotify)
    .post('/set-instagram-account/:id', setInstragram)

//API endpoints for moment operations
//:id is the id of the moment to modify 
router
    .post('/add-moment/:id', addMoment)
    .get('/get-moment/:id', getMoment)
    .delete('/delete-moment/:id', deleteMoment)

//API endpoints for capsule operations
router
    .post('/create-capsule/:id', createCapsule)
    .post('/get-capsule/:id', getCapsule)
    .post('/delete-capsule/:id', deleteCapsule)
    .delete('/remove-song-capsule/:capsuleId', removeSongFromCapsule)
    .post('/add-song-capsule/:capsuleId', addSongToCapsule)
    .post('/add-photo-capsule/:capsuleId', addPhotoToCapsule)


module.exports = router
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
    setProfilePictureUrl,
    setProfilePictureKey,
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
    addPhotoToCapsule,
    removePhotoFromCapsule,
    setPublish,
    setQuote
} = require('../controllers/capsule')

const { 
    createNotification, 
    getNotification, 
    deleteNotification
} = require('../controllers/notification')

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
    .post('/set-profile-picture-url/:id', setProfilePictureUrl)
    .post('/set-profile-picture-key/:id', setProfilePictureKey)
    .post('/set-spotify-account/:id', setSpotify)
    .post('/set-instagram-account/:id', setInstragram)

//API endpoints for moment operations
//:id is the id of the moment to modify 
router
    .post('/add-moment/:id', addMoment)
    .get('/get-moment/:momentId', getMoment)
    .delete('/delete-moment/:momentId', deleteMoment)

//API endpoints for capsule operations
router
    .post('/create-capsule/:id', createCapsule)
    .get('/get-capsule/:id', getCapsule)
    .post('/delete-capsule/:id', deleteCapsule)
    .delete('/remove-song/:capsuleId', removeSongFromCapsule)
    .post('/add-song/:capsuleId', addSongToCapsule)
    .post('/add-photo/:capsuleId', addPhotoToCapsule)
    .delete('/remove-photo/:capsuleId', removePhotoFromCapsule)
    .post('/set-publish/:capsuleId', setPublish)
    .post('/set-quote/:capsuleId', setQuote)

//API endpoints for notification operations
router
    .post('/send-notification/:senderId', createNotification)
    .get('/get-notification/:notificationId', getNotification)
    .delete('/delete-notification/:notificationId', deleteNotification)

module.exports = routermodule.exports = router

const { addUser, getUser, deleteUser, getAllUsers } = require('../controllers/user')

const router = require('express').Router()

router.post('/add-user', addUser)
    .get('/get-all-users', getAllUsers)
    .get('/get-user/:username', getUser)
    .delete('/delete-user/:id', deleteUser)

module.exports = router
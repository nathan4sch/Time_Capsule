const { addUser } = require('../controllers/user')

const router = require('express').Router()

router.post('/add-user', addUser)

module.exports = router
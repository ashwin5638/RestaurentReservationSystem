const express = require('express')

const {register, login} = require('../controllers/authController')
const {getProfile} = require('../controllers/userController')
const authenticate = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getProfile)

module.exports = router

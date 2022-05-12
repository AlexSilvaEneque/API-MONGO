const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users.controller')
const AuthController = require('../controllers/auth.controller')
const verifyRole = require('../middleware/verify-role')
const verifyToken = require('../middleware/verify-token')

const userController = new UserController
const authController = new AuthController

router.get('/', verifyToken, verifyRole, userController.readAll)

router.get('/:id', verifyToken, verifyRole, userController.readById)

router.post('/register', userController.saveUser)

router.post('/login', authController.login)

module.exports = router
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

//register
router.post('/register', userController.register);

//login
router.post('/login', userController.login);

//list all usernames
router.get('/users', userController.listAllUsernames);

//get user username
router.get('/user/:userId', userController.getUserUsername);

module.exports = router;
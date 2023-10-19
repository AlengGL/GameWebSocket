var express = require('express');
var router = express.Router();
var userController = require('../controllers/UserController');
var authenticateToken = require('../middleware/authenticateToken');

/* register */
router.post('/register', userController.registerUser);

/* Login */
router.post('/login', userController.loginUser);

/* Logout */
router.post('/logout', authenticateToken, userController.logoutUser);

/* get me */
router.post('/getuserinfo', authenticateToken, userController.getCurrentUser );

module.exports = router;

const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

router.post('/login', loginUser);
router.post('/register', authenticateToken, authorizeRoles('admin'), registerUser);

module.exports = router;

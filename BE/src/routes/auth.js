const express = require('express');
const router = express.Router();
const { loginOrRegister } = require('../controllers/authController');

// API mới: /api/auth/loginOrRegister
router.post('/loginOrRegister', loginOrRegister);

module.exports = router;
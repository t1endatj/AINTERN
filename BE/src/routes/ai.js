const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.mentorChat);
router.post('/evaluate', aiController.checkCode);

module.exports = router;
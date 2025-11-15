const express = require('express');
const router = express.Router();
const { createTemplate, getTemplates } = require('../controllers/templateController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// GET /api/templates -> Lấy danh sách template (Bảo vệ)
router.get('/', protect, getTemplates); 


router.post('/', protect, createTemplate); 

module.exports = router;
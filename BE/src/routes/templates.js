const express = require('express');
const router = express.Router();
const { createTemplate, getTemplates } = require('../controllers/templateController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// GET /api/templates -> Lấy danh sách template (Không cần auth)
router.get('/', getTemplates); 

// POST /api/templates -> Tạo template mới (Cần auth - admin only)
router.post('/', protect, createTemplate); 

module.exports = router;
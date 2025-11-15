const express = require('express')
const router = express.Router()
const authRoutes = require('./auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const internController = require('../controllers/internController')
const projectController = require('../controllers/projectController')
const taskController = require('../controllers/taskController')
const submissionController = require('../controllers/submissionController')
const aiController = require('../controllers/aiController')
const authController = require('../controllers/authController')
const templateRoutes = require('./templates')

// ✅ 1. Import middleware 'protect'
const { protect } = require('../middleware/authMiddleware')

// Auth - Đăng nhập/Đăng ký
router.post('/auth/login', authController.loginOrRegister)
router.use('/auth', authRoutes);

// Templates
router.use('/templates', templateRoutes)

// Intern
router.post('/interns', internController.createIntern)
router.get('/interns', internController.getAllInterns)
router.get('/interns/:id', internController.getInternById)
router.put('/interns/:id', internController.updateIntern)

// Project
router.post('/projects', protect, projectController.createProject)
router.get('/projects', projectController.getAllProjects)
router.get('/projects/:id/overview', projectController.getProjectOverview)
router.get('/projects/:id/tasks', taskController.getTasksByProject)
router.get('/projects/:id/current-task', taskController.getCurrentTask)
router.get('/interns/:id/projects', projectController.getProjectsByIntern)

// Task
router.post('/tasks', taskController.createTask)
router.get('/tasks/:id', taskController.getTaskDetail)
router.get('/tasks/:id/history', submissionController.getSubmissionHistory);
router.get('/tasks/:taskId/submissions', submissionController.getSubmissionsByTask)

// Submission
router.post(
    '/submissions', 
    protect, 
    upload.single('codeFile'), 
    submissionController.createSubmission
)
router.get('/interns/:id/submissions', submissionController.getSubmissionsByIntern)

// AI
router.use('/ai', require('./ai'));

module.exports = router
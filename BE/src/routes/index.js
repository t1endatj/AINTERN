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

// ✅ 1. Import middleware 'protect'
const { protect } = require('../middleware/authMiddleware')

// Auth - Đăng nhập/Đăng ký
router.post('/auth/login', authController.loginOrRegister)

// Intern
router.post('/interns', internController.createIntern)
router.get('/interns', internController.getAllInterns)
router.get('/interns/:id', internController.getInternById)
router.put('/interns/:id', internController.updateIntern)

// Project
router.post('/projects', protect, projectController.createProject)
router.get('/projects', projectController.getAllProjects)
// Task
router.post('/tasks', taskController.createTask)
router.get('/projects/:id/tasks', taskController.getTasksByProject)
router.use('/auth', authRoutes);
// Submission

// 4. Cập nhật route:
// - Thêm 'protect' (để lấy req.user.id)
// - Thêm 'upload.single('codeFile')' để xử lý file upload
//   (Client cần gửi file dưới tên trường 'codeFile')
router.post(
    '/submissions', 
    protect, 
    upload.single('codeFile'), 
    submissionController.createSubmission
)
router.get('/tasks/:taskId/submissions', submissionController.getSubmissionsByTask)


router.get('/projects/:id/overview', projectController.getProjectOverview)
router.get('/tasks/:id', taskController.getTaskDetail)
router.get('/projects/:id/current-task', taskController.getCurrentTask)
router.get('/interns/:id/projects', projectController.getProjectsByIntern)
router.get('/tasks/:id/history', submissionController.getSubmissionHistory);
router.get('/interns/:id/submissions', submissionController.getSubmissionsByIntern)
router.use('/ai', require('./ai'));
module.exports = router
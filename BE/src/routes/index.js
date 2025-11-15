const express = require('express')
const router = express.Router()

const internController = require('../controllers/internController')
const projectController = require('../controllers/projectController')
const taskController = require('../controllers/taskController')
const submissionController = require('../controllers/submissionController')
const aiController = require('../controllers/aiController')

// Intern
router.post('/interns', internController.createIntern)
router.get('/interns', internController.getAllInterns)

// Project
router.post('/projects', projectController.createProject)
router.get('/projects', projectController.getAllProjects)
// Task
router.post('/tasks', taskController.createTask)
router.get('/projects/:id/tasks', taskController.getTasksByProject)

// Submission
router.post('/submissions', submissionController.createSubmission)
router.get('/tasks/:taskId/submissions', submissionController.getSubmissionsByTask)



router.get('/projects/:id/overview', projectController.getProjectOverview)
router.get('/tasks/:id', taskController.getTaskDetail)
router.get('/projects/:id/current-task', taskController.getCurrentTask)
router.get('/interns/:id/projects', projectController.getProjectsByIntern)
router.get('/tasks/:id/history', submissionController.getSubmissionHistory);
router.get('/interns/:id/submissions', submissionController.getSubmissionsByIntern)
router.use('/ai', require('./ai'));
module.exports = router

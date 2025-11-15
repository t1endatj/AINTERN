const Task = require('../models/Task')
const fs = require('fs')
const path = require('path')
const unlockTask = require('../utils/unlockTask')
const Project = require('../models/Project')



exports.getProjectOverview = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project không tồn tại' })
        }

        // Lấy toàn bộ task thuộc project
        const tasks = await Task.find({ projectId: project._id })

        const totalTasks = tasks.length
        const doneTasks = tasks.filter(t => t.status === "done").length

        const progress = totalTasks === 0 
            ? 0 
            : Math.round((doneTasks / totalTasks) * 100)

        // Tính thời gian còn lại
        const now = new Date()
        const endDate = new Date(project.startDate.getTime() + project.duration * 24 * 60 * 60 * 1000)
        let remainingMs = endDate - now
        if (remainingMs < 0) remainingMs = 0

        const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))

        return res.json({
            success: true,
            totalTasks,
            doneTasks,
            progress,
            timeRemaining: {
                startDate: project.startDate,
                endDate,
                remainingMs,
                remainingDays,
                isExpired: remainingMs === 0
            }
        })

    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}
exports.createProject = async (req, res) => {
    try {
        // 1) Lấy specialization từ body
        const { internId, title, specialization, duration } = req.body;

        if (!specialization) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn chuyên môn (specialization: front_end hoặc back_end)' });
        }

        // 2) Tạo project với chuyên môn đã chọn
        const project = await Project.create({
            internId,
            title,
            specialization,
            duration
        });

        // 3) ✅ Load template tasks DỰA TRÊN CHUYÊN MÔN
        // Quyết định file template nào sẽ được load
        const templateName = `${specialization.toLowerCase()}_tasks.json`; // Ví dụ: 'front_end_tasks.json'
        const templatePath = path.join(__dirname, '../templates', templateName);

        if (!fs.existsSync(templatePath)) {
            // Nếu file template (vd: front_end_tasks.json) không tồn tại
             await Project.findByIdAndDelete(project._id); // Xóa project vừa tạo
             return res.status(404).json({ success: false, message: `Không tìm thấy file template cho chuyên môn: ${templateName}` });
        }
        
        const tasksTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

        const tasks = []

        // 4) Tạo task trong DB theo template
        for (const t of tasksTemplate) {
            const newTask = await Task.create({
                projectId: project._id,
                title: t.title,
                requirement: t.requirement,
                examples: t.examples,
                order: t.order,
                duration: t.duration,
                testcases: t.testcases, // Tạm thời để trống nếu test case nằm ở Python
                isLocked: t.order !== 1   // task 1 mở, các task khác khóa
            })
            tasks.push(newTask)
        }

        // 5) Mở task đầu tiên
        if (tasks.length > 0) {
            await unlockTask(tasks[0]);
        }

        return res.json({
            success: true,
            project,
            tasks
        })

    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}


exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        res.json({ success: true, data: projects })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}
 exports.getProjectsByIntern = async (req, res) => {
    try {
        const internId = req.params.id

        const projects = await Project.find({ internId }).sort({ createdAt: -1 })

        const results = []

        for (const project of projects) {
            const tasks = await Task.find({ projectId: project._id })

            const totalTasks = tasks.length
            const doneTasks = tasks.filter(t => t.status === "done").length

            const progress = totalTasks === 0 
                ? 0 
                : Math.round((doneTasks / totalTasks) * 100)

            // thời gian còn lại
            const now = Date.now()
            const endDate = new Date(project.startDate).getTime() + project.duration * 24 * 60 * 60 * 1000
            let remainingMs = endDate - now
            if (remainingMs < 0) remainingMs = 0

            const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))

            results.push({
                project,
                progress,
                totalTasks,
                doneTasks,
                remainingDays
            })
        }

        return res.json({
            success: true,
            projects: results
        })

    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

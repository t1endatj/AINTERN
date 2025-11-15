const Task = require('../models/Task')
const fs = require('fs')
const path = require('path')
const unlockTask = require('../utils/unlockTask')
const Project = require('../models/Project')

// ... (Hàm getProjectOverview giữ nguyên) ...
exports.getProjectOverview = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project không tồn tại' })
        }

        const tasks = await Task.find({ projectId: project._id })

        const totalTasks = tasks.length
        const doneTasks = tasks.filter(t => t.status === "done").length

        const progress = totalTasks === 0 
            ? 0 
            : Math.round((doneTasks / totalTasks) * 100)

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
        // 1) Lấy specialization TỪ NGƯỜI DÙNG ĐÃ XÁC THỰC
        const specialization = req.user.specialization;
        
        if (!specialization) {
            return res.status(400).json({ success: false, message: 'Người dùng không có chuyên môn. Vui lòng đăng nhập lại.' });
        }

        // 2) Lấy dữ liệu từ body
        const { internId, title, duration, templateName } = req.body;
        
        console.log('🔍 Creating project with:', { specialization, templateName, internId, title });
        
        if (!templateName) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp "templateName"' });
        }

        // 3) Tạo project
        const project = await Project.create({
            internId, 
            title,
            specialization, 
            duration
        });

        // 4) Load template tasks - Không cần map vì specialization đã đúng format
        // File name format: {specialization}_{templateName}_tasks.json
        // Ví dụ: front_end_simpleBlog_tasks.json
        const fileName = `${specialization}_${templateName}_tasks.json`;
        const templatePath = path.join(__dirname, '../templates', fileName);
        
        console.log('📁 Looking for template file:', fileName);
        console.log('📂 Full path:', templatePath);

        if (!fs.existsSync(templatePath)) {
             await Project.findByIdAndDelete(project._id); 
             console.error('❌ Template file not found:', fileName);
             return res.status(404).json({ 
                 success: false, 
                 message: `Không tìm thấy file template: ${fileName}` 
             });
        }
        
        const tasksTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

        const tasks = []

        // 5) Tạo task trong DB theo template (như cũ)
        for (const t of tasksTemplate) {
            const newTask = await Task.create({
                projectId: project._id,
                title: t.title,
                requirement: t.requirement,
                examples: t.examples,
                order: t.order,
                duration: t.duration,
                testcases: t.testcases, 
                isLocked: t.order !== 1 
            })
            tasks.push(newTask)
        }

        // 6) Mở task đầu tiên (như cũ)
        if (tasks.length > 0) {
            await unlockTask(tasks[0]);
        }

        return res.json({
            success: true,
            project,
            tasks
        })

    } catch (error) {
        console.error('❌ Error creating project:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown error',
            error: error.message 
        })
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
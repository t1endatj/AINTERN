const Task = require('../models/Task')

exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.id }).sort({ order: 1 })

        // kiểm tra hết hạn
        for (const task of tasks) {
            if (!task.isLocked && task.deadline && task.deadline < Date.now()) {
                task.isExpired = true
                task.isLocked = true
                await task.save()
            }
        }

        res.json({ success: true, data: tasks })

    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.json({ success: true, data: task })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}
exports.getTaskDetail = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task không tồn tại"
            })
        }

        return res.json({
            success: true,
            data: task
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}
exports.getCurrentTask = async (req, res) => {
    try {
        const projectId = req.params.id

        // Task đang mở + chưa hoàn thành
        const currentTask = await Task.findOne({
            projectId,
            isLocked: false,
            status: "pending"
        }).sort({ order: 1 })

        if (!currentTask) {
            return res.json({
                success: true,
                message: "Không có task đang mở. Có thể project đã hoàn thành.",
                currentTask: null
            })
        }

        return res.json({
            success: true,
            currentTask
        })

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
}

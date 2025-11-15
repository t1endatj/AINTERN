const Submission = require('../models/Submission')
const Task = require('../models/Task')
const Project = require('../models/Project') // ✅ Cần import Project model
const unlockTask = require('../utils/unlockTask')
const aiService = require('../services/aiService') // ✅ SỬ DỤNG SERVICE LAYER

exports.createSubmission = async (req, res) => {
    try {
        const task = await Task.findById(req.body.taskId)
        if (!task)
            return res.status(404).json({ success: false, message: "Task không tồn tại" })

        // nếu task hết hạn → khóa lại + không cho làm
        if (!task.isLocked && task.deadline && task.deadline < Date.now()) {
            task.isExpired = true
            task.isLocked = true
            await task.save()

            return res.status(403).json({
                success: false,
                message: "Task đã hết hạn. Bạn không thể nộp bài."
            })
        }

        // -----------------------------------------------------
        // 📌 1) Gửi code sang Python để AI Engine chấm
        // -----------------------------------------------------
        const aiResp = await aiService.callAiCheckCode({ // ✅ DÙNG SERVICE LAYER
            code: req.body.code,
            task_id: task._id.toString() // ✅ TRUYỀN TASK_ID CẦN THIẾT CHO AI
        })

        const review = aiResp.review; // Python trả về { review: {...} }

        const passed = review.passed // ✅ Lấy giá trị chính xác
        const feedback = review.feedback // ✅ Lấy giá trị chính xác
        const score = review.score // ✅ Lấy giá trị chính xác
        // -----------------------------------------------------

        // 📌 2) Lưu submission (kèm feedback từ AI)
        const submission = await Submission.create({
            ...req.body,
            feedback,
            score,
            passed
        })

        // 📌 3) Nếu PASS → unlock task tiếp theo
        if (passed) {
            // Nếu là task cuối → hoàn thành project
const maxOrderTask = await Task.findOne({ projectId: task.projectId }).sort({ order: -1 })

if (task.order === maxOrderTask.order) {
        const project = await Project.findById(task.projectId)
        project.status = "completed"
        await project.save()

        return res.json({
            success: true,
            passed: true,
            projectCompleted: true,
            message: "Bạn đã hoàn thành toàn bộ thực tập!",
            feedback,
            score
        })
    }

            task.status = "done"
            await task.save()

            const nextTask = await Task.findOne({
                projectId: task.projectId,
                order: task.order + 1
            })

            if (nextTask) {
                await unlockTask(nextTask)
            }

            return res.json({
                success: true,
                passed: true,
                feedback,
                score,
                unlockedNextTask: nextTask ? nextTask._id : null
            })
        }

        // 📌 4) Nếu fail → trả feedback
        return res.json({
            success: true,
            passed: false,
            feedback,
            score
        })

    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

// ... (Các exports khác giữ nguyên)

exports.getSubmissionsByTask = async (req, res) => {
    try {
        const submissions = await Submission.find({ taskId: req.params.taskId }).sort({ createdAt: -1 })

        res.json({
            success: true,
            data: submissions
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
exports.getSubmissionHistory = async (req, res) => {
    try {
        const taskId = req.params.id;

        const history = await Submission.find({ taskId }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            history
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
exports.getSubmissionsByIntern = async (req, res) => {
    try {
        const internId = req.params.id;

        const submissions = await Submission.find({ internId })
            .populate("taskId")      // lấy info task
            .populate({
                path: "taskId",
                populate: { path: "projectId" }   // lấy info project
            })
            .sort({ createdAt: -1 }); // mới nhất lên đầu

        return res.json({
            success: true,
            submissions
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

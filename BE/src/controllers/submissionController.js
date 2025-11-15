const Submission = require('../models/Submission')
const Task = require('../models/Task')
const Project = require('../models/Project')
const unlockTask = require('../utils/unlockTask')
const aiService = require('../services/aiService')

exports.createSubmission = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ req (đã qua multer và protect)
        const { taskId } = req.body;
        const internId = req.user.id; // Lấy từ token đã xác thực

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "Không tìm thấy file code. (Bạn cần gửi file dưới tên trường 'codeFile')" 
            });
        }
        
        // 2. Đọc nội dung code từ file buffer
        const codeContent = req.file.buffer.toString('utf8');

        // 3. (Tùy chọn) Lấy ngôn ngữ từ đuôi file
        const language = req.file.originalname.split('.').pop() || 'javascript';

        // --- Logic kiểm tra Task (giữ nguyên) ---
        const task = await Task.findById(taskId)
        if (!task)
            return res.status(404).json({ success: false, message: "Task không tồn tại" })

        if (!task.isLocked && task.deadline && task.deadline < Date.now()) {
            task.isExpired = true
            task.isLocked = true
            await task.save()

            return res.status(403).json({
                success: false,
                message: "Task đã hết hạn. Bạn không thể nộp bài."
            })
        }
        // ------------------------------------

        // -----------------------------------------------------
        // 📌 1) Gửi code (đã đọc từ file) sang Python
        // -----------------------------------------------------
        let aiResp, review, passed, feedback, score;
        
        try {
            // Tạo template string từ requirement + examples
            const templateString = `
YÊU CẦU:
${task.requirement}

CODE MẪU:
${task.examples.join('\n\n---\n\n')}
            `.trim();

            aiResp = await aiService.callAiCheckCode({
                code: codeContent, // 4. Gửi nội dung code
                template: templateString // 5. Gửi template từ task
            })

            review = aiResp.review;
            passed = review.passed
            feedback = review.feedback
            score = review.score
        } catch (aiError) {
            console.error('❌ AI Service Error:', aiError.message);
            return res.status(500).json({
                success: false,
                message: `Lỗi AI Engine: ${aiError.message}. Vui lòng kiểm tra Python server có chạy không (port 8000)?`
            });
        }
        // -----------------------------------------------------

        // 📌 2) Lưu submission
        const submission = await Submission.create({
            taskId,
            internId,
            code: codeContent, // 5. Lưu nội dung code vào DB
            language,
            feedback,
            score,
            passed // 6. Lưu trạng thái passed
        })

        // 📌 3) Nếu PASS → unlock task tiếp theo (Giữ nguyên logic)
        if (passed) {
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
        // Thêm xử lý lỗi của multer
        if (error instanceof multer.MulterError) {
             return res.status(400).json({ success: false, message: "Lỗi upload file: " + error.message });
        }
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
            .populate("taskId")
            .populate({
                path: "taskId",
                populate: { path: "projectId" }
            })
            .sort({ createdAt: -1 });

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
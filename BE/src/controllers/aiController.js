const aiService = require('../services/aiService'); // ✅ Lấy Service Layer
const Task = require('../models/Task'); // Thêm dòng này
/**
 * Endpoint cho Chatbot Mentor: 
 * Gửi message đến Python Engine /send_chat
 */// BE/src/controllers/aiController.js (Chỉ phần hàm exports.mentorChat)

exports.mentorChat = async (req, res) => {
    const { message } = req.body;
    const projectId = req.user.projectId; 

    if (!message) {
        return res.status(400).json({ success: false, message: "Thiếu message" });
    }

    try {
        // 1. TÌM TASK ĐANG MỞ CỦA USER/PROJECT
        // Tái sử dụng logic tìm kiếm task đang mở (isLocked: false, status: "pending")
        const currentTask = await Task.findOne({
            projectId,
            isLocked: false,
            status: "pending" //
        }).sort({ order: 1 }).lean(); 

        let taskContext = {
            title: "Không có task đang mở",
            requirement: "Người dùng không có task nào đang hoạt động."
        };

        if (currentTask) {
            // Chỉ lấy các trường cần thiết để giảm tải
            taskContext = {
                title: currentTask.title,
                requirement: currentTask.requirement, //
                taskId: currentTask._id // Có thể cần để AI nhận diện task ID
            };
        }

        // 2. GỌI AI SERVICE VỚI NGỮ CẢNH TASK MỚI
        // Cập nhật payload: truyền cả message và taskContext
        const aiResponse = await aiService.callAiMentor({ 
            message, 
            taskContext 
        });

        // Python trả về { answer: '...' } và chúng ta ánh xạ thành { reply: '...' }
        return res.json({
            success: true,
            reply: aiResponse.answer
        });
    } catch (error) {
        console.error("Lỗi gọi AI Mentor:", error.message);
        return res.status(500).json({ success: false, message: "Lỗi kết nối với AI Mentor Service hoặc lỗi hệ thống." });
    }
};

/**
 * Endpoint để chấm code:
 * Gửi code và task_id đến Python Engine /send_code
 */
exports.checkCode = async (req, res) => {
    // Controller này hiện không cần logic phức tạp (chỉ proxy)
    const { code, task_id } = req.body; 

    if (!code || !task_id) {
        return res.status(400).json({ success: false, message: "Thiếu code hoặc task_id" });
    }
    
    try {
        // GỌI AI SERVICE
        const aiResponse = await aiService.callAiCheckCode({ code, task_id });
        
        // Python trả về { review: { passed, score, feedback } }
        // Ta trả trực tiếp review.passed, review.score, review.feedback
        const review = aiResponse.review
        
        return res.json({
            success: true,
            passed: review.passed,
            score: review.score,
            feedback: review.feedback,
        });

    } catch (error) {
        console.error("Lỗi gọi AI Check Code:", error.message);
        return res.status(500).json({ success: false, message: "Lỗi kết nối với AI Check Code Service." });
    }
};
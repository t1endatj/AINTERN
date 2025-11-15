const aiService = require('../services/aiService'); // ✅ Lấy Service Layer

/**
 * Endpoint cho Chatbot Mentor: 
 * Gửi message đến Python Engine /send_chat
 */
exports.mentorChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: "Thiếu message" });
    }

    try {
        // GỌI AI SERVICE
        const aiResponse = await aiService.callAiMentor({ message });

        // Python trả về { answer: '...' } và chúng ta ánh xạ thành { reply: '...' }
        return res.json({
            success: true,
            reply: aiResponse.answer
        });
    } catch (error) {
        console.error("Lỗi gọi AI Mentor:", error.message);
        return res.status(500).json({ success: false, message: "Lỗi kết nối với AI Mentor Service." });
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
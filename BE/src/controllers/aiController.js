exports.mentorChat = async (req, res) => {
    const { message } = req.body

    if (!message) {
        return res.status(400).json({ success: false, message: "Thiếu message" })
    }

    // trả về nội dung mock
    return res.json({
        success: true,
        reply: `AI Mentor (mock): Tôi đã nhận câu hỏi: "${message}". Đây là phản hồi mô phỏng.`
    })
}

exports.checkCode = async (req, res) => {
    const { code } = req.body

    if (!code) {
        return res.status(400).json({ success: false, message: "Thiếu code" })
    }

    // Mock đơn giản: nếu có chữ "return" => pass
    const passed = code.includes("return")

    if (passed) {
        return res.json({
            success: true,
            passed: true,
            score: 100,
            feedback: "Bài làm tốt! (mock)",
        })
    }

    return res.json({
        success: true,
        passed: false,
        score: 0,
        feedback: "Thiếu lệnh return. (mock)",
    })
}

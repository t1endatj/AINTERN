const axios = require('axios');
const AI_SERVER = 'http://127.0.0.1:8000';
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

// Cấu hình axios để đảm bảo tiêu đề Content-Type là JSON
const api = axios.create({
    baseURL: AI_SERVER,
    headers: {
        'Content-Type': 'application/json',
    },
});


exports.callAiCheckCode = async (payload) => {
    // Payload là { code: '...', task_id: '...' }
    const res = await api.post('/send_code', payload); 
    return res.data;
};

exports.callAiSendTask = async (payload) => {
    // Payload là { task_id: '...' }
    const res = await api.post('/send_task', payload);
    return res.data;
};

// BE/src/services/aiService.js (Cấu trúc giả định)


// CẬP NHẬT: Hàm chấp nhận payload mới
exports.callAiMentor = async ({ message, taskContext }) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/send_chat`, {
            message: message,
            taskContext: taskContext // Đảm bảo truyền cả taskContext
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ... các hàm khác (callAiCheckCode)
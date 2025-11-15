const axios = require('axios');
const AI_SERVER = 'http://127.0.0.1:8000';

// Cấu hình axios để đảm bảo tiêu đề Content-Type là JSON
const api = axios.create({
    baseURL: AI_SERVER,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000 // 30 seconds timeout
});


exports.callAiCheckCode = async (payload) => {
    try {
        // Payload là { code: '...', task_id: '...' }
        console.log('📤 Calling AI Engine /send_code with payload:', { task_id: payload.task_id, codeLength: payload.code?.length });
        const res = await api.post('/send_code', payload);
        console.log('📥 AI Engine response:', res.data);
        return res.data;
    } catch (error) {
        console.error('❌ AI Engine error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error(`AI Engine không phản hồi: ${error.message}. Kiểm tra Python server có chạy không?`);
    }
};

exports.callAiSendTask = async (payload) => {
    try {
        // Payload là { task_id: '...' }
        console.log('📤 Calling AI Engine /send_task');
        const res = await api.post('/send_task', payload);
        return res.data;
    } catch (error) {
        console.error('❌ AI Engine /send_task error:', error.message);
        throw new Error(`AI Engine không phản hồi: ${error.message}`);
    }
};

exports.callAiMentor = async (payload) => {
    try {
        // Payload là { message: '...' }
        console.log('📤 Calling AI Engine /send_chat');
        const res = await api.post('/send_chat', payload);
        return res.data;
    } catch (error) {
        console.error('❌ AI Engine /send_chat error:', error.message);
        throw new Error(`AI Engine không phản hồi: ${error.message}`);
    }
};
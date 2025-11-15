const axios = require('axios');
const AI_SERVER = 'http://127.0.0.1:8000';

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

exports.callAiMentor = async (payload) => {
    // Payload là { message: '...' }
    const res = await api.post('/send_chat', payload); 
    return res.data;
};
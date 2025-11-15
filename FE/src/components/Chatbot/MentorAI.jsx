// File: src/components/MentorAIPanel.jsx
import React, { useState} from 'react';
import { ChatInput } from './ChatInput';
import { Message } from './Message'; // Component Message đã tạo

export default function MentorAIPanel() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState(''); // State cho ChatInput
    const [isLoading, setIsLoading] = useState(false);

    // Xử lý gửi tin nhắn từ ChatInput
    const handleSendMessage = (messageText) => {
        if (messageText.trim() === '') return;

        // 1. Thêm tin nhắn người dùng
        const userMessage = { id: Date.now(), role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        
        // 2. Bắt đầu tải và gọi API
        setIsLoading(true);

        // GIẢ LẬP PHẢN HỒI TỪ AI (Thay thế bằng fetch/axios thực tế)
        setTimeout(() => {
            const aiResponse = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: `Tôi đã nhận được câu hỏi của bạn là: "${messageText}"`, 
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto min-h-0">
            
            {/* Lịch sử Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 min-h-0">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        {/* Icon và Lời chào ban đầu */}
                        <h2 className="text-3xl font-bold text-white mb-4">Chào mừng đến với AI Mentor!</h2>
                        <p className="text-gray-400">Bạn có thể hỏi về Task, quy trình nộp code, hoặc nhận các gợi ý code review.</p>
                    </div>
                )}
                {messages.map(msg => (
                    <Message key={msg.id} message={msg} />
                ))}
            </div>

            {/* Thanh Nhập Liệu */}
            <div className="p-4 border-t border-gray-800 shrink-0">
                <ChatInput 
                    question={question} 
                    setQuestion={setQuestion} 
                    onSubmit={handleSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
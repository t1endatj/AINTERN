

import React, { useState, useRef, useEffect } from 'react'; 
import { ChatInput } from './ChatInput';
import { Message } from './Message'; 
import { useScrollToBottom } from '../../lib/use-scroll-to-bottom.jsx'; 

export default function MentorAIPanel() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
  
    const [messagesContainerRef, messagesEndRef] = useScrollToBottom(); 

    
    const handleSendMessage = async (messageText) => {
        if (messageText.trim() === '' || isLoading) return;

        const userMessage = { id: Date.now(), role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập lại!');
            }

            const response = await fetch('http://localhost:3000/api/ai/chat', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageText }),
            });

            // Xử lý lỗi HTTP trước khi parse JSON
            if (!response.ok) { 
                throw new Error(`Lỗi HTTP ${response.status}: Vui lòng kiểm tra Server Backend/AI Engine.`);
            }
            
            const data = await response.json();
            console.log('📥 AI response:', data);
            
            // Đọc trường 'reply' từ aiController.js
            const aiResponse = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: data.reply || "AI Mentor không phản hồi.", 
            };
            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            console.error('❌ Error sending message:', error);
            
            // Hiển thị lỗi cho user
            const errorMessage = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: `❌ Lỗi: ${error.message}\n\nKiểm tra:\n- Backend có chạy không? (port 3000)\n- AI Engine có chạy không? (port 8000)\n- Token còn hợp lệ không?`, 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full mx-auto min-h-0">
            
            {/* Lịch sử Chat - GÁN REF CHO CONTAINER CUỘN */}
            <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-8 min-h-0 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Chào mừng đến với AI Mentor!</h2>
                        <p className="text-gray-400">Bạn có thể hỏi về Task, quy trình nộp code, hoặc nhận các gợi ý code review.</p>
                    </div>
                )}
                
                {messages.map(msg => (
                    <Message key={msg.id} message={msg} />
                ))}
                
              
                <div ref={messagesEndRef} className="h-0" /> 
                
                {/* TRẠNG THÁI LOADING */}
                {isLoading && (
                     <div className="w-full px-4 text-left">
                        <div className="inline-block max-w-[75%] px-4 py-2 rounded-xl bg-gray-700 text-gray-400">
                           AI Mentor đang phân tích và trả lời...
                        </div>
                    </div>
                )}
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
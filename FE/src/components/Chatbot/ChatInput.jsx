// File: src/components/ChatInput.jsx
import React from 'react';
import { cn } from '../../lib/utils'; // Import cn

export const ChatInput = ({ question, setQuestion, onSubmit, isLoading }) => {
    const handleSubmit = (textToSend) => {
        if (!textToSend.trim()) return;
        
        onSubmit(textToSend);
        setQuestion('');
    };

    return(
    <div className="relative w-full flex flex-col gap-4">
        
   
        {/* THANH NHẬP LIỆU CHÍNH (Tái tạo giao diện Unified Input) */}
        <div className="flex w-full bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-3 items-end">
            <textarea
            placeholder="Gửi tin nhắn..."
            className={cn(
                'flex-1 text-white bg-transparent outline-none resize-none placeholder-gray-400 max-h-40 overflow-y-auto leading-relaxed pr-4 pl-2',
            )}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    if (isLoading) {
                         // Sử dụng toast (thông báo) nếu bạn có cài đặt thư viện này
                        console.error('Please wait for the model to finish its response!');
                    } else {
                        handleSubmit(question);
                    }
                }
            }}
            rows={1} 
            autoFocus
            />

            <button 
                className="text-white h-8"
                id="bottone5"
                onClick={() => handleSubmit(question)}
                disabled={question.length === 0}
            >
                Submit
            </button>
        </div>
    </div>
    );
}
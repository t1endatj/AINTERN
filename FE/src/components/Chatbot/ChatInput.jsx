// File: src/components/ChatInput.jsx
import React, { useState } from 'react';
import { cn } from '../../lib/utils'; // Import cn

const suggestedActions = [
    { title: 'Task hiện tại là gì', label: 'Tóm tắt task', action: 'Tóm tắt các yêu cầu chính của task hiện tại' },
    { title: 'Quy trình nộp code', label: 'Hướng dẫn nộp code', action: 'Giải thích quy trình nộp code và review' },
];

export const ChatInput = ({ question, setQuestion, onSubmit, isLoading }) => {
    // Giữ lại showSuggestions để hiển thị các thẻ gợi ý
    const [showSuggestions, setShowSuggestions] = useState(true);

    const handleSubmit = (textToSend) => {
        // Cần đảm bảo hàm này được gọi với nội dung final
        if (!textToSend.trim()) return;
        
        // Bạn cần truyền hàm setQuestion và question state từ MentorAIPanel xuống
        // Hiện tại: Chỉ gọi onSubmit (được truyền từ MentorAIPanel)
        onSubmit(textToSend);
        setQuestion('');
        setShowSuggestions(false);
    };

    return(
    <div className="relative w-full flex flex-col gap-4">
        
        {showSuggestions && (
            <div className="grid grid-cols-2 gap-4 w-full px-4">
                {suggestedActions.map((suggestedAction, index) => (
                    <div
                    key={index}
                    onClick={ () => {
                        handleSubmit(suggestedAction.action);
                        setQuestion('');
                    }}
                    className="text-left border border-gray-700 bg-gray-800 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-gray-700 transition flex-1 gap-1 flex flex-col w-full h-auto justify-start items-start"
                    >
                        <span className="font-medium text-white">{suggestedAction.title}</span>
                        <span className=" text-gray-400">
                        {suggestedAction.label}
                        </span>
                    </div>
                ))}
            </div>
        )}
        
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
            rows={1} // Bắt đầu 1 dòng
            autoFocus
            />

            <button 
                className={cn("shrink-0 w-8 h-8 rounded-full ml-auto transition duration-200", 
                    question.length > 0 ? 'bg-white hover:bg-gray-100 text-black' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                )}
                onClick={() => handleSubmit(question)}
                disabled={question.length === 0}
            >
                <i className="fas fa-arrow-up text-sm"></i>
            </button>
        </div>
    </div>
    );
}
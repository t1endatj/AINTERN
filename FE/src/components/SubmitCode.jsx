import React, { useState } from 'react';

// Dữ liệu mẫu (Giả định)
const SAMPLE_REVIEW_OUTPUT = `
// Review từ AI Mentor
// Đánh giá: Tốt (9/10)
// Lỗi nghiêm trọng: 0

// 💡 Gợi ý Tối ưu hóa:
// 1. Performance: Tránh sử dụng Array.map() trong hàm render nếu không cần thiết.
// 2. Readability: Đặt tên biến 'i' thành 'itemIndex' để dễ đọc hơn.
// 3. Security: Cảnh báo XSS tiềm ẩn trong hàm handleInput.
`;

export default function SubmitCode({ task, onClose }) {
    const [submissionMode, setSubmissionMode] = useState('code'); // 'code' hoặc 'file'
    const [codeContent, setCodeContent] = useState('');
    const [reviewOutput, setReviewOutput] = useState('Nộp code để bắt đầu phân tích với AI Mentor...');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (submissionMode === 'code' && codeContent.trim() === '') {
            alert('Vui lòng dán mã nguồn vào ô nhập liệu!');
            return;
        }
        if (submissionMode === 'file') {
             alert('Chế độ Nộp File đang được phát triển. Vui lòng sử dụng Nộp Code.');
             return;
        }

        setIsSubmitting(true);
        setReviewOutput('Đang gửi mã nguồn và chờ Code Review từ AI Mentor... (Vui lòng đợi 3s)');
        
        // GIẢ LẬP GỌI API (Thay thế bằng fetch/axios thực tế)
        setTimeout(() => {
            setReviewOutput(SAMPLE_REVIEW_OUTPUT);
            setIsSubmitting(false);
        }, 3000);
    };

    return (
        <div className="w-full h-full p-0 flex flex-col">
            
            {/* HEADER & ĐIỀU HƯỚNG */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3 shrink-0">
                <h2 className="text-xl font-bold text-white">
                    Task: <span className="text-[#35C4F0]">{task?.name || 'Task Chi Tiết'}</span>
                </h2>
                
                {/* Nút chuyển đổi chế độ */}
                <div className="flex space-x-2 bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setSubmissionMode('code')}
                        className={`px-4 py-2 text-sm rounded-md transition ${submissionMode === 'code' ? 'bg-blue-white text-black font-semibold' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        Nộp Code
                    </button>
                    <button
                        onClick={() => setSubmissionMode('file')}
                        className={`px-4 py-2 text-sm rounded-md transition ${submissionMode === 'file' ? 'bg-blue-white text-black font-semibold' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        Nộp File
                    </button>
                </div>
                
                <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition">
                    &times;
                </button> 
            </div>

            {/* KHU VỰC CHÍNH (Code và Review) */}
            <div className="flex gap-4 flex-1 min-h-0 ">
                
                {/* 1. Vùng Code Editor/File Input (Tỷ lệ 40%) */}
                <div className="flex-[5] bg-gray-900 border border-gray-700 rounded-lg p-3 relative flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-2">Code Input</h3>
                    
                    {submissionMode === 'code' ? (
                        <textarea 
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            className="flex-1 border-dashed border-2 border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/50 text-gray-400"
                            placeholder="Dán mã nguồn của bạn vào đây..."
                            disabled={isSubmitting}
                        />
                    ) : (
                        <div className="flex-1 border-dashed border-2 border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/50 text-gray-400">
                            <p>Kéo thả hoặc nhấn để chọn file mã nguồn (.js, .css, ...)</p>
                            <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    )}

                    {/* Nút Nộp */}
                    <button 
                        onClick={handleSubmit} 
                        className={`mt-3 px-6 py-2 w-full font-semibold rounded-lg transition ${
                            isSubmitting ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-black'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang Xử Lý Review...' : 'Nộp'}
                    </button>
                </div>
                
                {/* 2. Vùng Review Trả về (Tỷ lệ 60%) */}
                <div className="flex-[7] bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-[#35C4F0] mb-3 border-b border-gray-800 pb-2">
                        Kết quả Code Review Trả về
                    </h3>
                    <pre className="text-gray-300 whitespace-pre-wrap font-mono overflow-auto flex-1">
                        {reviewOutput}
                    </pre>
                </div>
            </div>
        </div>
    );
}
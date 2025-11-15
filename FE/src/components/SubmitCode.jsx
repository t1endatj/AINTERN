import React, { useState } from 'react';

export default function SubmitCode({ task, onClose, onSubmitSuccess }) {
    const [submissionMode, setSubmissionMode] = useState('code'); // 'code' hoặc 'file'
    const [codeContent, setCodeContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [reviewOutput, setReviewOutput] = useState('Nộp code để bắt đầu phân tích với AI Mentor...');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (submissionMode === 'code' && codeContent.trim() === '') {
            alert('Vui lòng dán mã nguồn vào ô nhập liệu!');
            return;
        }
        if (submissionMode === 'file' && !selectedFile) {
            alert('Vui lòng chọn file để upload!');
            return;
        }

        try {
            setIsSubmitting(true);
            setReviewOutput('Đang gửi mã nguồn và chờ Code Review từ AI Mentor...');
            setSubmissionResult(null);

            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                return;
            }

            // Chuẩn bị FormData
            const formData = new FormData();
            formData.append('taskId', task._id || task.id);

            if (submissionMode === 'code') {
                // Tạo blob từ code content
                const blob = new Blob([codeContent], { type: 'text/plain' });
                formData.append('codeFile', blob, 'submission.js');
            } else {
                formData.append('codeFile', selectedFile);
            }

            // Call API
            const response = await fetch('http://localhost:3000/api/submissions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const data = result.data;
            
                
                setSubmissionResult({
                    passed: data.passed,
                    score: data.score,
                    feedback: data.feedback
                });

                // Format review output
                const reviewText = `
═══════════════════════════════════════════════
🎯 KẾT QUẢ ĐÁNH GIÁ
═══════════════════════════════════════════════

✨ Trạng thái: ${data.passed ? '✅ ĐẠT' : '❌ CHƯA ĐẠT'}
📊 Điểm số: ${data.score}/100

───────────────────────────────────────────────
📝 NHẬN XÉT TỪ AI MENTOR:
───────────────────────────────────────────────

${data.feedback || 'Không có feedback từ AI.'}

═══════════════════════════════════════════════
                `.trim();
                
                setReviewOutput(reviewText);

                // Gọi callback nếu có
                if (onSubmitSuccess) {
                    onSubmitSuccess(data);
                }

                // Hiển thị thông báo
                if (data.passed) {
                    alert('🎉 Chúc mừng! Bạn đã hoàn thành task này!');
                } else {
                    alert('💪 Cố gắng thêm! Hãy xem feedback và thử lại.');
                }
            } else {
                setReviewOutput(`❌ LỖI: ${result.message}`);
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error('❌ Submit error:', error);
            setReviewOutput(`❌ LỖI KẾT NỐI: ${error.message}\n\nKiểm tra backend có đang chạy không?`);
            alert('Không thể kết nối đến server!');
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="flex-5 bg-gray-900 border border-gray-700 rounded-lg p-3 relative flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-2">Code Input</h3>
                    
                    {submissionMode === 'code' ? (
                        <textarea 
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            className="flex-1 border-dashed border-2 border-gray-600 rounded-lg p-3 bg-gray-800 text-gray-300 font-mono resize-none focus:outline-none focus:border-blue-500"
                            placeholder="Dán mã nguồn của bạn vào đây..."
                            disabled={isSubmitting}
                        />
                    ) : (
                        <div className="flex-1 border-dashed border-2 border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-800/50 text-gray-400 relative">
                            <p className="mb-2">📁 Kéo thả hoặc nhấn để chọn file</p>
                            {selectedFile && (
                                <p className="text-green-400 text-sm">✅ {selectedFile.name}</p>
                            )}
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="absolute w-full h-full opacity-0 cursor-pointer" 
                                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {/* Nút Nộp */}
                    <button 
                        onClick={handleSubmit} 
                        className={`mt-3 px-6 py-2 w-full font-semibold rounded-lg transition ${
                            isSubmitting ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '⏳ Đang Xử Lý Review...' : '🚀 Nộp Bài'}
                    </button>
                </div>
                
                {/* 2. Vùng Review Trả về (Tỷ lệ 60%) */}
                <div className="flex-7 bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2 shrink-0">
                        <h3 className="text-lg font-bold text-[#35C4F0]">
                            🤖 Kết quả Code Review
                        </h3>
                        {submissionResult && (
                            <div className="flex gap-3">
                                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                    submissionResult.passed 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-red-600 text-white'
                                }`}>
                                    {submissionResult.passed ? '✅ ĐẠT' : '❌ CHƯA ĐẠT'}
                                </span>
                                <span className="px-3 py-1 rounded text-sm font-semibold bg-blue-600 text-white">
                                    📊 {submissionResult.score}/100
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-auto bg-gray-800 rounded p-3">
                        <pre className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {reviewOutput}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
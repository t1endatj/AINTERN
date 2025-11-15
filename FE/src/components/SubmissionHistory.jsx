import React, { useState, useEffect, useCallback } from 'react';

export default function SubmissionHistory({ task, onClose }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập lại!');
                return;
            }

            const taskId = task._id || task.id;
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/submissions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                setSubmissions(result.data || []);
            } else {
                setError(result.message || 'Không thể tải lịch sử submissions');
            }
        } catch (err) {
            console.error('❌ Error fetching submissions:', err);
            setError('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    }, [task]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full h-full p-0 flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3 shrink-0">
                <h2 className="text-xl font-bold text-white">
                    📜 Lịch Sử Nộp Bài: <span className="text-[#35C4F0]">{task?.name || 'Task'}</span>
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition">
                    &times;
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">⏳ Đang tải lịch sử...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-400">❌ {error}</div>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">📭 Chưa có submission nào</div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {submissions.map((submission, index) => (
                            <div 
                                key={submission._id || index}
                                className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 font-mono text-sm">
                                            #{submissions.length - index}
                                        </span>
                                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                            submission.passed 
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-red-600 text-white'
                                        }`}>
                                            {submission.passed ? '✅ ĐẠT' : '❌ CHƯA ĐẠT'}
                                        </span>
                                        <span className="px-3 py-1 rounded text-sm font-semibold bg-blue-600 text-white">
                                            📊 {submission.score}/100
                                        </span>
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        🕒 {formatDate(submission.submittedAt || submission.createdAt)}
                                    </span>
                                </div>

                                {/* Language */}
                                {submission.language && (
                                    <div className="mb-2">
                                        <span className="text-gray-500 text-xs">
                                            Ngôn ngữ: <span className="text-gray-300">{submission.language}</span>
                                        </span>
                                    </div>
                                )}

                                {/* Feedback */}
                                {submission.feedback && (
                                    <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                                        <h4 className="text-sm font-semibold text-[#35C4F0] mb-2">
                                            💬 Feedback từ AI:
                                        </h4>
                                        <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono max-h-40 overflow-auto">
                                            {submission.feedback}
                                        </pre>
                                    </div>
                                )}

                                {/* Code Preview (optional) */}
                                {submission.code && (
                                    <details className="mt-3">
                                        <summary className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">
                                            👁️ Xem code đã nộp
                                        </summary>
                                        <pre className="mt-2 p-3 bg-gray-800 rounded border border-gray-700 text-gray-300 text-xs whitespace-pre-wrap font-mono max-h-60 overflow-auto">
                                            {submission.code}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

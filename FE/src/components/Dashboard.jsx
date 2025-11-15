import React, { useState, useEffect, useCallback } from 'react';

import ProfileImage from '../assets/account.png'; 
import SubmitCode from './SubmitCode'; 
import MentorAIPanel from './Chatbot/MentorAI';

export default function Dashboard({ project, internData, onBackToInfo, onLogout }) {
  console.log('🎨 Dashboard rendered with:', { project, internData });
  
  const [activeMenu, setActiveMenu] = useState('task');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Hàm gọi API lấy tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Kiểm tra project object
      console.log('🔍 Project object:', project);
      console.log('🔍 Project ID:', project?.id);
      
      if (!project?.id) {
        setError('Không tìm thấy ID của project');
        setLoading(false);
        return;
      }
      
      const url = `http://localhost:3000/api/projects/${project.id}/tasks`;
      console.log('📤 Fetching tasks from:', url);
      
      const response = await fetch(url);
      console.log('📥 Response status:', response.status);
      
      const result = await response.json();
      console.log('📥 Tasks fetched:', result);
      
      if (result.success) {
        setTasks(result.data || []);
        console.log('✅ Tasks loaded:', result.data?.length || 0);
      } else {
        setError(result.message || 'Không thể tải tasks');
      }
    } catch (err) {
      console.error('❌ Error fetching tasks:', err);
      setError('Không thể kết nối đến server. Kiểm tra backend có chạy không?');
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (project?.id) {
      fetchTasks();
    }
  }, [project?.id, fetchTasks]);

  // Kiểm tra props
  if (!internData) {
    console.error('❌ Dashboard: internData is missing!');
    return <div className="text-white p-4">Loading intern data...</div>;
  }
  
  if (!project) {
    console.error('❌ Dashboard: project is missing!');
    return <div className="text-white p-4">Loading project data...</div>;
  }

  // Map status từ backend sang frontend
  const getStatusBadge = (task) => {
    let label, className;
    
    if (task.status === 'done') {
      label = 'Hoàn thành';
      className = 'bg-green-800 text-green-300';
    } else if (task.isLocked) {
      label = 'Đã khóa';
      className = 'bg-gray-700 text-gray-500';
    } else if (task.isExpired) {
      label = 'Hết hạn';
      className = 'bg-red-800 text-red-300';
    } else {
      label = 'Đang làm';
      className = 'bg-blue-800 text-blue-300';
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
        {label}
      </span>
    );
  };

  // Format deadline
  const formatDeadline = (deadline) => {
    if (!deadline) return 'Không có hạn';
    const date = new Date(deadline);
    return date.toLocaleDateString('vi-VN');
  };

  const handleViewDetails = async (task) => {
    // Fetch chi tiết task từ API
    try {
      console.log('📤 Fetching task detail:', task._id);
      
      const response = await fetch(`http://localhost:3000/api/tasks/${task._id}`);
      const result = await response.json();
      
      console.log('📥 Task detail:', result);
      
      if (result.success) {
        setSelectedTask(result.data);
      }
    } catch (err) {
      console.error('❌ Error fetching task detail:', err);
      // Fallback: dùng task hiện tại
      setSelectedTask(task);
    }
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="flex h-screen w-auto overflow-x-hidden" 
        style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)" }}
    >
      {/* sidebar */}
      <div className="w-50 bg-gray-900 border-r border-gray-800 h-screen p-4 shrink-0 flex flex-col justify-between fixed left-0 top-0">
        <div>
            <div 
              className="flex items-center gap-3 p-3 cursor-pointer rounded-lg transition border border-transparent hover:border-blue-500 hover:bg-gray-800"
              onClick={onBackToInfo} // GỌI HÀM QUAY LẠI INFO
            >
              <img 
                src={ProfileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover " 
              />
              <span className="font-semibold text-white">
                {internData?.name || 'Intern Profile'}
              </span>
            </div>
            
            <div className="mt-8 space-y-2">
                <div className="p-3 text-sm font-semibold text-gray-300 border-b border-gray-800 mb-2">
                    {project?.name || 'Project Name'}
                </div>
                
                <button
                    onClick={() => setActiveMenu('task')}
                    className={`w-full text-left py-2 px-3 rounded-lg font-medium transition ${activeMenu === 'task' ? 'bg-blue-600 text-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                    Tasks
                </button>
                <button
                    onClick={() => setActiveMenu('mentor')}
                    className={`w-full text-left py-2 px-3 rounded-lg font-medium transition ${activeMenu === 'mentor' ? 'bg-blue-600 text-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                    Mentor AI
                </button>
            </div>
        </div>
        <div className="text-xs text-gray-500 p-3 border-t border-gray-800 space-y-2">
            <p>Vị trí: {internData?.specialization?.toUpperCase() || 'DEVELOPER'}</p>
            <p>AINTERN v1.0</p>
            <button
              onClick={onLogout}
              className="w-full mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
            >
              Đăng xuất
            </button>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
    <div className="flex-1 p-6 flex flex-col min-h-0 w-auto overflow-x-auto">
        {selectedTask ? (
            // 1. HIỂN THỊ GIAO DIỆN NỘP CODE
            <SubmitCode 
                task={selectedTask}
                internData={internData}
                onClose={handleCloseDetails}
                onSubmitSuccess={fetchTasks}
            />
        ) : (
            <>
                <h1 className="text-3xl font-bold text-white mb-6">
                    {activeMenu === 'task' && 'Quản lý Task'}
                    {activeMenu === 'mentor' && 'Mentor AI'}
                </h1>
               
                {activeMenu === 'task' && (
                    <div className="space-y-6 ">
                        
                        {/* Loading state */}
                        {loading && (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Đang tải tasks...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                                <p className="text-red-400">❌ {error}</p>
                                <button 
                                    onClick={fetchTasks}
                                    className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* KPI Metrics */}
                        {!loading && !error && (
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-gray-900 rounded-lg p-4 border border-blue-600 shadow-lg text-center">
                                    <p className="text-sm text-gray-400">Tổng Task</p>
                                    <p className="text-3xl font-bold text-[#35C4F0] mt-2">{tasks.length}</p>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg text-center">
                                    <p className="text-sm text-gray-400">Hoàn thành</p>
                                    <p className="text-3xl font-bold text-green-500 mt-2">
                                        {tasks.filter(t => t.status === 'done').length}
                                    </p>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg text-center">
                                    <p className="text-sm text-gray-400">Đang làm</p>
                                    <p className="text-3xl font-bold text-blue-500 mt-2">
                                        {tasks.filter(t => !t.isLocked && t.status === 'pending').length}
                                    </p>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg text-center">
                                    <p className="text-sm text-gray-400">Đã khóa</p>
                                    <p className="text-3xl font-bold text-gray-500 mt-2">
                                        {tasks.filter(t => t.isLocked).length}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Danh sách Task chi tiết */}
                        {!loading && !error && (
                            <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl flex-1 flex flex-col min-h-0">
                                <div className="p-4 border-b border-gray-700 bg-gray-800 shrink-0 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-white">All tasks ({tasks.length})</h2>
                                    <button 
                                        onClick={fetchTasks}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                                    >
                                        🔄 Làm mới
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    {tasks.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            Chưa có task nào cho project này
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="sticky top-0 bg-gray-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">STT</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên Task</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Thời hạn</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800 bg-gray-900">
                                                {tasks.map((task) => (
                                                    <tr key={task._id} className="hover:bg-gray-800 transition">
                                                        <td className="px-6 py-4 text-sm text-gray-400">{task.order}</td>
                                                        <td className="px-6 py-4 text-sm font-medium text-white">{task.title}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-400">{formatDeadline(task.deadline)}</td>
                                                        <td className="px-6 py-4 text-sm">{getStatusBadge(task)}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <button 
                                                                onClick={() => handleViewDetails(task)} 
                                                                disabled={task.isLocked}
                                                                className={`font-medium transition ${
                                                                    task.isLocked 
                                                                        ? 'text-gray-600 cursor-not-allowed' 
                                                                        : 'text-blue-500 hover:text-blue-400'
                                                                }`}
                                                            >
                                                                {task.isLocked ? '🔒 Khóa' : 'Xem'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                  )}

                  {/* Mentor AI */}
                  {activeMenu === 'mentor' && (
                    <div className="w-full max-w-4xl h-full flex flex-col min-h-0">
                        <MentorAIPanel />
                    </div>
                  )}
              </>
           )}
    </div>
    </div>
  );
}




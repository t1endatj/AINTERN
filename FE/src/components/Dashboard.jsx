import React, { useState } from 'react';

import ProfileImage from '../assets/account.png'; 
import SubmitCode from './SubmitCode'; 

const SAMPLE_TASKS = [
  { id: 1, name: 'Thiết kế UI trang chủ', deadline: '15/11/2025', status: 'in-progress', priority: 'high' },
  { id: 2, name: 'Xây dựng component Button', deadline: '18/11/2025', status: 'todo', priority: 'medium' },
  { id: 3, name: 'Viết unit test cho Form', deadline: '20/11/2025', status: 'todo', priority: 'low' },
  { id: 4, name: 'Code review API integration', deadline: '14/11/2025', status: 'completed', priority: 'high' },
  { id: 5, name: 'Tối ưu performance', deadline: '22/11/2025', status: 'todo', priority: 'medium' },
];

export default function Dashboard({ project, internData, onBackToInfo }) {
  const [activeMenu, setActiveMenu] = useState('task'); // Đặt mặc định là 'task'
  const [tasks] = useState(SAMPLE_TASKS);
  const [selectedTask, setSelectedTask] = useState(null);


  const onBackToInfo = () => {
    setView('info');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'todo': { label: 'Chưa làm', className: 'bg-gray-700 text-gray-300' }, // Dark Mode adjusted
      'in-progress': { label: 'Đang làm', className: 'bg-blue-800 text-blue-300' }, // Dark Mode adjusted
      'completed': { label: 'Hoàn thành', className: 'bg-green-800 text-green-300' }, // Dark Mode adjusted
    };
    const config = statusConfig[status] || statusConfig.todo;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { label: 'Cao', className: 'bg-red-800 text-red-300' }, // Dark Mode adjusted
      'medium': { label: 'Trung bình', className: 'bg-yellow-800 text-yellow-300' }, // Dark Mode adjusted
      'low': { label: 'Thấp', className: 'bg-gray-700 text-gray-400' }, // Dark Mode adjusted
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };
  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="flex h-screen w-screen" 
        style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)" }}
    >
      {/* sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen p-4 shrink-0 flex flex-col justify-between">
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
        <div className="text-xs text-gray-500 p-3 border-t border-gray-800">
            <p>Vị trí: {internData?.role.toUpperCase() || 'DEVELOPER'}</p>
            <p className="mt-1">AINTERN v1.0</p>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
    <div className="flex-1 p-6 overflow-y-auto">
        {selectedTask ? (
            // 1. HIỂN THỊ GIAO DIỆN NỘP CODE
            <SubmitCode 
                task={selectedTask} 
                onClose={handleCloseDetails} 
            />
        ) : (
            <>
                <h1 className="text-3xl font-bold text-white mb-6">
                    {activeMenu === 'task' && 'Quản lý Task'}
                    {activeMenu === 'mentor' && 'Hỗ trợ Mentor AI'}
                </h1>
               
                {activeMenu === 'task' && (
                    <div className="space-y-6 ">
                        
                        {/* KPI Metrics */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gray-900 rounded-lg p-4 border border-blue-600 shadow-lg text-center">
                                <p className="text-sm text-gray-400">Tổng Task</p>
                                <p className="text-3xl font-bold text-[#35C4F0] mt-2">{tasks.length}</p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg text-center">
                                <p className="text-sm text-gray-400">Hoàn thành</p>
                                <p className="text-3xl font-bold text-green-500 mt-2">
                                    {tasks.filter(t => t.status === 'completed').length}
                                </p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg text-center">
                                <p className="text-sm text-gray-400">Đang làm</p>
                                <p className="text-3xl font-bold text-blue-500 mt-2">
                                    {tasks.filter(t => t.status === 'in-progress').length}
                                </p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg text-center">
                                <p className="text-sm text-gray-400">Chưa làm</p>
                                <p className="text-3xl font-bold text-gray-500 mt-2">
                                    {tasks.filter(t => t.status === 'todo').length}
                                </p>
                            </div>
                        </div>

                        {/* Danh sách Task chi tiết */}
                        <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl flex-1 flex flex-col min-h-0">
                            <div className="p-4 border-b border-gray-700 bg-gray-800 shrink-0">
                                <h2 className="text-lg font-semibold text-white">All tasks</h2>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên Task</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Thời hạn</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ưu tiên</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800 bg-gray-900">
                                        {tasks.map((task) => (
                                            <tr key={task.id} className="hover:bg-gray-800 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-white">{task.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-400">{task.deadline}</td>
                                                <td className="px-6 py-4 text-sm">{getPriorityBadge(task.priority)}</td>
                                                <td className="px-6 py-4 text-sm">{getStatusBadge(task.status)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button onClick={() => handleViewDetails(task)} className="text-blue-500 hover:text-blue-400 font-medium transition">Nộp</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                  )}

                  {/* Mentor AI */}
                  {activeMenu === 'mentor' && (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-white">
                        <p className="text-gray-400">Giao diện ChatInput và Chat History (Mentor AI) sẽ được đặt tại đây...</p>
                    </div>
                  )}
              </>
           )}
    </div>
    </div>
  );
}




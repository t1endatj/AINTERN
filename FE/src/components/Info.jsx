// File: Info.jsx

import React, { useState } from "react";

export default function Info({ allProjects = [], selectedProject = null, onProjectClick }) {
  const [activeTab, setActiveTab] = useState("all");
  const [modalProject, setModalProject] = useState(null);

  // Giữ nguyên logic tính toán dự án để hiển thị
  const projectsToShow = activeTab === "all" ? allProjects : selectedProject ? [selectedProject] : [];

  const handleCardClick = (project) => {
    if (activeTab === 'my') {
      if (typeof onProjectClick === 'function') {
        onProjectClick(project); // Chuyển sang Dashboard
      }
    } else {
      setModalProject(project); // Mở Modal mô tả dự án
    }
  };

  // --- START RETURN DÙNG BỐ CỤC FULL-SCREEN ---
  return (
    <div 
      className="min-h-screen w-full" 
      style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-right text-[#35C4F0] font-bold pt-6 pr-12">TRANG INFO</div>

        {/* 1. KPI Metrics */}
        <div className="grid grid-cols-3 gap-8 px-12 pt-10">
          
          {/* Card 1: Tiến Độ (Nổi bật) */}
          <div className="p-8 bg-gray-900 border border-blue-600 rounded-xl text-center shadow-lg transition duration-300 hover:shadow-blue-500/20">
            <div className="text-6xl font-extrabold text-[#35C4F0]">75%</div>
            <div className="text-xl text-gray-400 uppercase mt-3">TIẾN BỘ</div>
          </div>
          
          {/* Card 2: Số Task */}
          <div className="p-8 bg-gray-900 border border-gray-700 rounded-xl text-center shadow-lg">
            <div className="text-6xl font-extrabold text-white">12/20</div>
            <div className="text-xl text-gray-400 uppercase mt-3">SỐ TASK</div>
          </div>

          {/* Card 3: Thời Gian Còn Lại */}
          <div className="p-8 bg-gray-900 border border-gray-700 rounded-xl text-center shadow-lg">
            <div className="text-6xl font-extrabold text-white">45 NGÀY</div>
            <div className="text-xl text-gray-400 uppercase mt-3">THỜI GIAN THỰC TẬP CÒN LẠI</div>
          </div>
        </div>

        {/* 2. Project Overview Panel */}
        <div className="px-12 pt-10 pb-12">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6">
            
            {/* Tab Navigation */}
            <div className="flex gap-6 mb-6 border-b border-gray-800">
              <button
                onClick={() => setActiveTab("all")}
                className={`font-semibold py-2 px-4 transition ${activeTab === "all" ? "text-[#35C4F0] border-b-4 border-blue-500" : "text-gray-400 hover:text-white"}`}
              >
                ALL PROJECTS
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={`font-semibold py-2 px-4 transition ${activeTab === "my" ? "text-[#35C4F0] border-b-4 border-blue-500" : "text-gray-400 hover:text-white"}`}
              >
                MY PROJECTS
              </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsToShow.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 py-6">Không có dự án để hiển thị</div>
              )}

              {projectsToShow.map((p) => (
                <div key={p.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-blue-500 transition" onClick={() => handleCardClick(p)}>
                  
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-blue-700/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                       <h4 className="text-lg font-bold text-white truncate">{p.name}</h4>
                    </div>
                  </div>
                  
                  {p.description && <p className="text-sm text-gray-400 line-clamp-3">{p.description}</p>}
                  
                  <div className="mt-4">
                    {typeof p.percent !== 'undefined' && (
                      <>
                        <div className="text-xs font-bold text-right text-white mb-1">{p.percent}%</div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-[#35C4F0] to-blue-500" style={{ width: `${p.percent}%` }} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Project Detail (Giữ nguyên) */}
      {modalProject && (/* ... code modal ... */
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{modalProject.name}</h3>
              <button className="text-gray-400 hover:text-white text-2xl" onClick={() => setModalProject(null)}>×</button>
            </div>
            
            <div>
              {modalProject.description && <p className="text-sm text-gray-300 mb-4">{modalProject.description}</p>}
              {modalProject.technologies && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {modalProject.technologies.map((t, i) => (
                    <span key={i} className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <button 
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                  onClick={() => setModalProject(null)}>
                  Đóng
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    setModalProject(null);
                    if (typeof onProjectClick === 'function') {
                      onProjectClick(modalProject);
                    }
                  }}>
                  Bắt đầu dự án này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
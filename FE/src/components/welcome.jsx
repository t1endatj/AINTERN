import React, { useState } from 'react';

const PROJECT_OPTIONS = [
    { 
        id: 'alpha', 
        name: 'Project Alpha (E-commerce UI)', 
        description: 'Xây dựng giao diện trang chủ, chi tiết sản phẩm và giỏ hàng theo Design System. Tập trung vào tính tương tác và khả năng responsive.', 
        technologies: ['React', 'Tailwind CSS', 'API Mocking'] 
    },
    { 
        id: 'beta', 
        name: 'Project Beta (Task Management App)', 
        description: 'Tạo các components như Task Card, Form nhập liệu, và bộ lọc trạng thái cho ứng dụng quản lý công việc.', 
        technologies: ['Vue.js', 'SCSS', 'State Management (Pinia/Redux)'] 
    },
    { 
        id: 'gamma', 
        name: 'Project Gamma (Internal Component Library)', 
        description: 'Đóng gói các UI components cơ bản (Button, Input, Modal) và viết documentation bằng Storybook.', 
        technologies: ['Storybook', 'Styled Components', 'TypeScript'] 
    },
];

function Welcome({ internData, onProjectSubmit }) {
    const [step, setStep] = useState(1); 
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const handleNext = () => {
        setStep(2);
    };

    const handleSubmit = () => {
        if (!selectedProjectId) {
            alert('Vui lòng chọn một dự án để bắt đầu!');
            return;
        }

        // Tìm đối tượng dự án đã chọn
        const selectedProject = PROJECT_OPTIONS.find(p => p.id === selectedProjectId);
        
        // Gọi callback và truyền cả danh sách dự án + dự án đã chọn
        if (typeof onProjectSubmit === 'function') {
            onProjectSubmit({ selectedProject, allProjects: PROJECT_OPTIONS });
        }
    };

    // Lọc dự án 
    const filteredProjects = PROJECT_OPTIONS.filter(() => true); 

    // Nội dung của Slide 1
    const Slide1 = (
        <div className="text-center space-y-6 animate-fadeIn">
            <h2 className="text-5xl font-extrabold text-[#35C4F0]">
                Chào mừng, {internData.name}!
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Bạn đã sẵn sàng cho thử thách thực tập vị trí <span className="font-bold text-green-400">
                    {internData.specialization === 'frontend' ? 'Frontend Developer' : 
                     internData.specialization === 'backend' ? 'Backend Developer' : 
                     'Data Analyst'}
                </span> với chương trình mô phỏng **AINTERN**.
            </p>

            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 text-left space-y-3">
                <h3 className="text-2xl font-semibold text-white">
                    Mục Tiêu Chương Trình
                </h3>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Học cách làm việc với Design System và API thực tế.</li>
                    <li>Quản lý Task theo quy trình Agile/Kanban.</li>
                    <li>Nhận Code Review và phản hồi từ AI Mentor.</li>
                </ul>
            </div>
            
            <div className="flex justify-end">
                <button 
                    onClick={handleNext} 
                    className="relative inline-block p-px font-semibold leading-6 text- bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95  disabled:opacity-50 mt-6"
                >
                    Next <i className="ml-2 fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );

    // Nội dung của Slide 2
    const Slide2 = (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-white text-center">
                Chọn Dự Án Đầu Tiên Của Bạn
            </h2>
            <p className="text-center text-gray-400">
                Dự án bạn chọn sẽ xác định các task ban đầu trên Dashboard.
            </p>

            {/* DANH SÁCH DỰ ÁN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredProjects.map((project) => (
                    <label 
                        key={project.id} 
                        htmlFor={project.id} 
                        className="block cursor-pointer transition duration-200"
                    >
                        <div 
                            className={`p-4 rounded-xl border-2 hover:border-blue-500 
                                ${selectedProjectId === project.id 
                                    ? 'border-blue-500 bg-gray-700/50' 
                                    : 'border-gray-700 bg-gray-800'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-bold text-white">{project.name}</h4>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                </div>
                                <input 
                                    type="radio" 
                                    id={project.id} 
                                    name="selectedProject" 
                                    checked={selectedProjectId === project.id}
                                    onChange={() => setSelectedProjectId(project.id)}
                                    className=" hidden "
                                />
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className="text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded-full font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </label>
                ))}
            </div>
            
            {/* Nút Điều Hướng cho Slide 2 */}
            <div className="flex justify-end items-center pt-4">
              
                <button 
                    onClick={handleSubmit} 
                    disabled={!selectedProjectId} // Chỉ kích hoạt khi đã chọn
                    className="relative inline-block p-px font-semibold leading-6 text- bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95  disabled:opacity-50 mt-6"
                >
                    Submit
                </button>
            </div>
        </div>
    );


    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl p-10 space-y-8">
                
                {/* BỘ ĐẾM BƯỚC (STEP INDICATOR) */}
                <div className="flex justify-center space-x-2">
                    <div className={`h-2 w-10 rounded-full ${step === 1 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                    <div className={`h-2 w-10 rounded-full ${step === 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                </div>

                {/* KHU VỰC CHUYỂN ĐỔI SLIDE */}
                {step === 1 ? Slide1 : Slide2}
            </div>
        </div>
    );
}

export default Welcome;
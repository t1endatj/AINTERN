import React, { useState } from 'react';

// Frontend Projects - 3 projects
const PROJECT_OPTIONS_FE = [
    { 
        id: 'landingPage',
        templateName: 'landingPage',
        name: 'Landing Page Website', 
        description: 'Xây dựng trang Landing Page hoàn chỉnh từ Header, Hero, Features, Services, Contact đến Footer. 7 tasks về HTML/CSS responsive.', 
        technologies: ['HTML5', 'CSS3', 'Bootstrap Icons'],
        duration: '7 tasks - 24 giờ/task',
        totalTasks: 7
    },
    { 
        id: 'netflixTasks',
        templateName: 'netflixTasks',
        name: 'Netflix Clone Interface', 
        description: 'Tạo giao diện Netflix Clone với Hero showcase, Feature sections, FAQ và Footer. 4 tasks về visual design.', 
        technologies: ['HTML5', 'CSS3', 'Font Awesome'],
        duration: '4 tasks - 24-48 giờ/task',
        totalTasks: 4
    },
    { 
        id: 'simpleBlog',
        templateName: 'simpleBlog',
        name: 'Simple Blog Website', 
        description: 'Xây dựng blog cá nhân SimpleBlog với Header, Hero, Posts, Topics và Newsletter. 4 tasks về responsive design.', 
        technologies: ['HTML5', 'CSS3', 'Ionicons', 'Google Fonts'],
        duration: '4 tasks - 24-48 giờ/task',
        totalTasks: 4
    },
];

// Backend Projects - 1 project
const PROJECT_OPTIONS_BE = [
    { 
        id: 'blog',
        templateName: 'blog',
        name: 'Blog RESTful API (CRUD)', 
        description: 'Xây dựng RESTful API hoàn chỉnh cho hệ thống blog. 8 tasks bao gồm: Setup Express, MongoDB, tạo Model và CRUD operations.', 
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
        duration: '8 tasks - 24-48 giờ/task',
        totalTasks: 8
    },
];

function Welcome({ internData, onProjectSubmit }) {
    const [step, setStep] = useState(1); 
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleNext = () => {
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!selectedProjectId) {
            alert('Vui lòng chọn một dự án để bắt đầu!');
            return;
        }

        setIsCreating(true);

        try {
            // Chọn đúng danh sách dự án theo role
            const projectList = internData.specialization === 'front_end' ? PROJECT_OPTIONS_FE : PROJECT_OPTIONS_BE;
            const projectTemplate = projectList.find(p => p.id === selectedProjectId);
            
            console.log('🚀 Creating project:', projectTemplate.name);
            console.log('📋 Template:', projectTemplate.templateName);
            
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    internId: internData._id,
                    title: projectTemplate.name,
                    templateName: projectTemplate.templateName,
                    duration: 30
                })
            });

            const result = await response.json();
            console.log('📥 Project created:', result);

            if (result.success) {
                const createdProject = {
                    ...result.project,
                    id: result.project._id,
                    name: result.project.title,
                    description: projectTemplate.description,
                    technologies: projectTemplate.technologies,
                    percent: 0
                };

                // Map tất cả projects với đầy đủ thông tin
                const allProjectsWithDetails = projectList.map(proj => ({
                    id: proj.id,
                    name: proj.name,
                    description: proj.description,
                    technologies: proj.technologies,
                    templateName: proj.templateName, // ✅ Thêm templateName
                    taskCount: proj.taskCount,
                    percent: 0
                }));

                if (typeof onProjectSubmit === 'function') {
                    onProjectSubmit({ 
                        selectedProject: createdProject, 
                        allProjects: allProjectsWithDetails
                    });
                }
            } else {
                alert(`Lỗi tạo project: ${result.message || 'Unknown error'}`);
                setIsCreating(false);
            }
        } catch (error) {
            console.error('❌ Error creating project:', error);
            alert('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
            setIsCreating(false);
        }
    };

    // Chọn danh sách dự án theo role
    const filteredProjects = internData.specialization === 'front_end' ? PROJECT_OPTIONS_FE : PROJECT_OPTIONS_BE; 

    // Nội dung của Slide 1
    const Slide1 = (
        <div className="text-center space-y-6 animate-fadeIn">
            <h2 className="text-5xl font-extrabold text-[#35C4F0]">
                Chào mừng, {internData.name}!
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Bạn đã sẵn sàng cho thử thách thực tập vị trí <span className="font-bold text-green-400">
                    {internData.specialization === 'front_end' ? 'Frontend Developer' : 
                     internData.specialization === 'back_end' ? 'Backend Developer' : 
                     'Full Stack Developer'}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
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
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-white">{project.name}</h4>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                    <p className="text-xs text-blue-300 mt-2">
                                        ⏱️ {project.duration} • 📋 {project.totalTasks} tasks
                                    </p>
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
                    disabled={!selectedProjectId || isCreating}
                    className="relative inline-block p-px font-semibold leading-6 text- bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95  disabled:opacity-50 mt-6"
                >
                    {isCreating ? '⏳ Đang tạo project...' : 'Submit'}
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
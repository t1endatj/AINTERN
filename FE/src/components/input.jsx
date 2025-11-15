import React, { useState } from 'react';

const TASK_ROLES = [
  { id: 'front_end', label: 'Frontend Developer' },
  { id: 'back_end', label: 'Backend Developer' },
];

function Homepage({onStart}) { 
    const [name, setName] = useState('');
    const [selectedRole, setSelectedRole] = useState(''); 

    const handleStart = () => {
        if (name.trim() === '') {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }
        // THÊM KIỂM TRA: Nếu chưa chọn vị trí thì thông báo
        if (selectedRole === '') { 
            alert('Vui lòng chọn vị trí thực tập!');
            return;
        }

        onStart(name, selectedRole);
    };

    return (
        <div 
            className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 overflow-hidden" 
            style={{
                
                background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
                minHeight: '100vh',
                margin: 0,
                padding: 0,
            }}
        >
            {/* CARD */}
            <div className="w-full max-w-xl bg-gray-900/90 border border-gray-700 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
                
                {/* Header (Title) */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-[#35C4F0]">
                        Chào mừng Intern!
                    </h1>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    <p className="text-center text-gray-300 text-lg">
                        AINTERN đã sẵn sàng. Hãy chọn vai trò của bạn để bắt đầu chương trình mô phỏng thực tập.
                    </p>

                    {/* 1. Nhập Tên (Input) */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-gray-300 font-semibold">
                            Tên của bạn:
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 transition duration-300 outline-none placeholder-gray-400"
                            placeholder="Ví dụ: Nguyễn Văn A"
                        />
                    </div>

                    {/* 2. Chọn Vị trí/Role (SELECT DROPDOWN) */}
                    <div className="space-y-2">
                        <label htmlFor="role-select" className="block text-gray-300 font-semibold">
                            Vị trí thực tập:
                        </label>
                        <div className="relative">
                            <select
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className={`
                                    w-full appearance-none p-3 rounded-lg border focus:ring-blue-500 focus:border-blue-500 transition duration-300 outline-none pr-10 cursor-pointer
                                    ${selectedRole === '' 
                                        ? 'bg-gray-700/70 border-gray-600 text-gray-400' 
                                        : 'bg-gray-700 border-gray-600 text-white' 
                                    }
                                `}
                            >
                                {/* Option để trống (Placeholder) */}
                                <option value="" disabled>
                                    -- Chọn vị trí --
                                </option>
                                {/* Các Role còn lại */}
                                {TASK_ROLES.map((role) => (
                                    <option key={role.id} value={role.id} className="text-white">
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            {/* Icon mũi tên tùy chỉnh */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleStart} 
                        className="relative inline-block p-px font-semibold leading-6 text- bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95  disabled:opacity-50 mt-6"
                        disabled={name.trim() === '' || selectedRole === ''}
                    >
                        Bắt đầu Kỳ thực tập
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Homepage;
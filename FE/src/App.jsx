import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Homepage from './components/input';
import './App.css';
import Welcome from './components/welcome';
import Info from './components/Info';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [internData, setInternData] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'welcome' | 'info' | 'dashboard'
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Load trạng thái từ sessionStorage khi refresh
  useEffect(() => {
    const savedInternId = sessionStorage.getItem('internId');
    if (savedInternId) {
      loadInternState(savedInternId);
    }
  }, []);

  // Hàm load trạng thái intern từ database
  const loadInternState = async (internId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/interns/${internId}`);
      const result = await response.json();
      
      if (result.success) {
        const intern = result.data;
        setInternData(intern);
        
        // Restore project đã chọn
        if (intern.selectedProject && intern.selectedProject.id) {
          setSelectedProject(intern.selectedProject);
        }
        
        // Restore view
        if (intern.currentView) {
          setView(intern.currentView);
        }
        
        console.log('✅ Đã restore trạng thái:', intern);
        return intern; // ✅ Thêm return
      }
      return null; // ✅ Trả về null nếu không thành công
    } catch (error) {
      console.error('Lỗi khi load trạng thái:', error);
      return null; // ✅ Trả về null nếu có lỗi
    }
  };

  // Hàm cập nhật trạng thái lên database
  const updateInternState = async (updates) => {
    if (!internData?._id) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/interns/${internData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      if (result.success) {
        setInternData(result.data);
        console.log('✅ Đã cập nhật trạng thái:', updates);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  const handleSelectStart = async (name, role) => {
    // Gọi API login/register với username và specialization
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          specialization: role 
        }),
      });
      
      const result = await response.json();
      console.log('📥 Login response:', result);
      
      if (result.success) {
        // Lưu token vào localStorage
        localStorage.setItem('token', result.token);
        
        // Lưu internId vào sessionStorage
        sessionStorage.setItem('internId', result.internId);
        
        // Fetch intern từ database để check trạng thái
        const internResponse = await fetch(`http://localhost:3000/api/interns/${result.internId}`);
        const internResult = await internResponse.json();
        
        console.log('📥 Intern data from DB:', internResult);
        
        if (internResult.success) {
          const intern = internResult.data;
          setInternData(intern);
          
          // Check xem user đã có trạng thái chưa
          if (intern.currentView && intern.currentView !== 'home') {
            // User cũ - restore trạng thái cũ
            setView(intern.currentView);
            
            if (intern.selectedProject) {
              setSelectedProject(intern.selectedProject);
            }
            
            alert(`Chào mừng trở lại, ${name}! ✨`);
            console.log('✅ User cũ - restored view:', intern.currentView);
          } else {
            // User mới - chuyển sang welcome
            setView('welcome');
            alert(`Chào mừng ${name} đến với AINTERN! 🎉`);
            console.log('✅ User mới - chuyển sang welcome');
          }
        }
        
        console.log('✅ Đăng nhập thành công');
      } else {
        alert('Lỗi: ' + result.message);
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert('Không thể kết nối đến server!');
    }
  };

  const handleProjectSubmit = async ({ selectedProject, allProjects }) => {
    console.log('📦 handleProjectSubmit called with:', { selectedProject, allProjects });
    
    setSelectedProject(selectedProject);
    setAllProjects(allProjects || []);
    
    console.log('📦 State updated - selectedProject:', selectedProject);
    console.log('📦 internData before update:', internData);
    
    // Lưu project đã chọn vào database và chuyển thẳng sang dashboard
    await updateInternState({
      selectedProject,
      currentView: 'dashboard'
    });
    
    console.log('✅ Database updated, now setting view to dashboard');
    setView('dashboard');
    console.log('✅ View state set to dashboard');
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    
    // Cập nhật view sang dashboard
    await updateInternState({
      currentView: 'dashboard'
    });
    
    setView('dashboard');
  };

  const handleBackToInfo = async () => {
    await updateInternState({
      currentView: 'info'
    });
    setView('info');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('internId');
    setInternData(null);
    setSelectedProject(null);
    setAllProjects([]);
    setView('home');
    console.log('✅ Đã đăng xuất');
  };

  if (isLoading) {
    return <Loader onComplete={handleLoadComplete} />;
  }

  if (view === 'welcome' && internData) {
    return <Welcome internData={internData} onProjectSubmit={handleProjectSubmit} />;
  }

  if (view === 'info') {
    return <Info 
      allProjects={allProjects} 
      selectedProject={selectedProject} 
      onProjectClick={handleProjectClick}
      onLogout={handleLogout}
    />;
  }

  if (view === 'dashboard') {
    console.log('🎯 Rendering Dashboard with project:', selectedProject);
    console.log('🎯 internData:', internData);
    
    return <Dashboard 
              project={selectedProject} 
              internData={internData} 
              onBackToInfo={handleBackToInfo}
              onLogout={handleLogout}
            />;
  }

  return <Homepage onStart={handleSelectStart} />;
}

export default App;
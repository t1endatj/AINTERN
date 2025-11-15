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
      }
    } catch (error) {
      console.error('Lỗi khi load trạng thái:', error);
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
    const userData = { name, role };
    
    // Lưu vào MongoDB Database
    try {
      const response = await fetch('http://localhost:3000/api/interns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      if (result.success) {
        setInternData(result.data);
        
        // Lưu ID vào sessionStorage để restore khi refresh
        sessionStorage.setItem('internId', result.data._id);
        
        if (result.isReturningUser) {
          // User cũ - restore trạng thái
          if (result.data.currentView && result.data.currentView !== 'home') {
            setView(result.data.currentView);
            if (result.data.selectedProject) {
              setSelectedProject(result.data.selectedProject);
            }
          } else {
            setView('welcome');
          }
          alert(`Chào mừng trở lại, ${name}! ✨`);
        } else {
          // User mới
          setView('welcome');
          alert(`Chào mừng ${name} đến với AINTERN! 🎉`);
        }
        
        console.log('✅', result.message, result.data);
      } else {
        alert('Lỗi khi lưu vào database!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu vào database:', error);
      alert('Không thể kết nối đến server!');
    }
  };

  const handleProjectSubmit = async ({ selectedProject, allProjects }) => {
    setSelectedProject(selectedProject);
    setAllProjects(allProjects || []);
    
    // Lưu project đã chọn vào database
    await updateInternState({
      selectedProject,
      currentView: 'info'
    });
    
    setView('info');
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
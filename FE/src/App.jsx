import { useState, useEffect, useCallback } from 'react';
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
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Hàm fetch danh sách projects của user
  const fetchMyProjects = useCallback(async (internId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/interns/${internId}/projects`);
      const result = await response.json();
      
      if (result.success) {
        const projectsWithId = result.projects.map(p => ({
          ...p.project,
          id: p.project._id,
          name: p.project.title,
          percent: p.progress,
          totalTasks: p.totalTasks,
          doneTasks: p.doneTasks,
          pendingTasks: p.pendingTasks,
          remainingDays: p.remainingDays
        }));
        setMyProjects(projectsWithId);
        console.log('✅ Fetched my projects:', projectsWithId);
        return projectsWithId;
      }
    } catch (error) {
      console.error('❌ Error fetching my projects:', error);
      return [];
    }
  }, []);

  // Hàm load trạng thái intern từ database
  const loadInternState = useCallback(async (internId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/interns/${internId}`);
      const result = await response.json();
      
      if (result.success) {
        const intern = result.data;
        setInternData(intern);
        
        // Fetch user's projects
        await fetchMyProjects(internId);
        
        // Restore allProjects from templates API
        if (intern.specialization) {
          try {
            const templatesResponse = await fetch(`http://localhost:3000/api/templates?specialization=${intern.specialization}`);
            const templatesResult = await templatesResponse.json();
            
            if (templatesResult.success) {
              const projectsFromAPI = templatesResult.data.map(template => ({
                id: template.templateName,
                name: template.name,
                description: template.description,
                technologies: template.technologies || [],
                templateName: template.templateName,
                taskCount: template.taskCount
              }));
              setAllProjects(projectsFromAPI);
            }
          } catch (error) {
            console.error('❌ Error fetching templates:', error);
          }
        }
        
        // Restore project đã chọn
        if (intern.selectedProject && intern.selectedProject.id) {
          setSelectedProject(intern.selectedProject);
        }
        
        // Restore view
        if (intern.currentView) {
          setView(intern.currentView);
        }
        
        console.log('✅ Đã restore trạng thái:', intern);
        return intern;
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi load trạng thái:', error);
      return null;
    }
  }, [fetchMyProjects]);

  // Load trạng thái từ sessionStorage khi refresh
  useEffect(() => {
    const savedInternId = sessionStorage.getItem('internId');
    if (savedInternId) {
      loadInternState(savedInternId);
    }
  }, [loadInternState]);

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
      const response = await fetch('http://localhost:3000/api/auth/loginOrRegister', {
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
          
          // Fetch user's projects
          const projects = await fetchMyProjects(result.internId);
          
          // Restore allProjects from templates API
          try {
            const templatesResponse = await fetch(`http://localhost:3000/api/templates?specialization=${intern.specialization}`);
            const templatesResult = await templatesResponse.json();
            
            if (templatesResult.success) {
              const projectsFromAPI = templatesResult.data.map(template => ({
                id: template.templateName,
                name: template.name,
                description: template.description,
                technologies: template.technologies || [],
                templateName: template.templateName,
                taskCount: template.taskCount
              }));
              setAllProjects(projectsFromAPI);
            }
          } catch (error) {
            console.error('❌ Error fetching templates:', error);
          }
          
          // Check xem user đã có project chưa
          if (intern.selectedProject && intern.selectedProject.id) {
            // User cũ có project - restore project và chuyển thẳng sang Dashboard
            setSelectedProject(intern.selectedProject);
            
            // Update view to dashboard
            await updateInternState({
              currentView: 'dashboard'
            });
            
            setView('dashboard');
            alert(`Chào mừng trở lại, ${name}! ✨`);
            console.log('✅ User cũ - chuyển thẳng sang Dashboard với project:', intern.selectedProject);
          } else if (projects && projects.length > 0) {
            // User đã có projects nhưng chưa select - chuyển sang Info
            setView('info');
            alert(`Chào mừng trở lại, ${name}! Hãy chọn dự án để tiếp tục. 🎯`);
            console.log('✅ User có projects - chuyển sang Info');
          } else {
            // User mới hoặc chưa có project - chuyển sang welcome
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
    
    // Lưu project đã chọn vào database và chuyển TRỰC TIẾP sang Dashboard
    await updateInternState({
      selectedProject,
      currentView: 'dashboard'  // Đổi từ 'info' sang 'dashboard'
    });
    
    console.log('✅ Database updated, now setting view to dashboard');
    setView('dashboard');  // Đổi từ 'info' sang 'dashboard'
    console.log('✅ View state set to dashboard');
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    
    // Cập nhật view sang dashboard
    await updateInternState({
      selectedProject: project,
      currentView: 'dashboard'
    });
    
    setView('dashboard');
  };

  const handleProjectCreated = async (newProject) => {
    // Add to myProjects list
    setMyProjects(prev => [...prev, newProject]);
    
    // Set as selected project
    setSelectedProject(newProject);
    
    // Update database
    await updateInternState({
      selectedProject: newProject
    });
    
    console.log('✅ Project added to MY PROJECTS:', newProject);
  };

  const handleBackToInfo = async () => {
    // Restore allProjects if empty
    if (allProjects.length === 0 && internData?.specialization) {
      try {
        const response = await fetch(`http://localhost:3000/api/templates?specialization=${internData.specialization}`);
        const result = await response.json();
        
        if (result.success) {
          const projectsFromAPI = result.data.map(template => ({
            id: template.templateName,
            name: template.name,
            description: template.description,
            technologies: template.technologies || [],
            templateName: template.templateName,
            taskCount: template.taskCount
          }));
          setAllProjects(projectsFromAPI);
        }
      } catch (error) {
        console.error('❌ Error fetching templates:', error);
      }
    }
    
    // Refresh myProjects
    if (internData?._id) {
      await fetchMyProjects(internData._id);
    }
    
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
    setMyProjects([]);
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
      myProjects={myProjects}
      internData={internData}
      onProjectClick={handleProjectClick}
      onProjectCreated={handleProjectCreated}
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
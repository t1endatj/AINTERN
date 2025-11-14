import { useState } from 'react';
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

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  const handleSelectStart = (name, role) => {
    setInternData({ name, role });
    setView('welcome');
  };

  const handleProjectSubmit = ({ selectedProject, allProjects }) => {
    setSelectedProject(selectedProject);
    setAllProjects(allProjects || []);
    setView('info');
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setView('dashboard');
  };

  if (isLoading) {
    return <Loader onComplete={handleLoadComplete} />;
  }

  if (view === 'welcome' && internData) {
    return <Welcome internData={internData} onProjectSubmit={handleProjectSubmit} />;
  }

  if (view === 'info') {
    return <Info allProjects={allProjects} selectedProject={selectedProject} onProjectClick={handleProjectClick} />;
  }

  if (view === 'dashboard') {
    return <Dashboard project={selectedProject} internData={internData} />;
  }

  return <Homepage onStart={handleSelectStart} />;
}

export default App;
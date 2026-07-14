import { useState, useReducer, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import TaskList from './components/TaskList.jsx';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import UserProfile from './components/UserProfile.jsx';
import AiCopilot from './components/AiCopilot.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import { taskReducer, initialTaskState } from './reducers/taskReducer.js';
import { fetchTasks } from './data/mockApi.js';

function AppShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme } = useTheme();

  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  useEffect(() => {
    fetchTasks().then((data) => dispatch({ type: 'SET_TASKS', payload: data }));
  }, []);

  return (
    <div className={`app app--${theme}`}>
      <Navbar />
      <div className="app__body">
        <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />
        <main className="app__main">
          {activeTab === 'dashboard' && <Dashboard tasks={state.tasks} />}
          {activeTab === 'tasks' && <TaskList state={state} dispatch={dispatch} />}
          {activeTab === 'timer' && <PomodoroTimer />}
          {activeTab === 'profile' && <UserProfile />}
        </main>
      </div>
      <NotificationCenter />
      <AiCopilot dispatch={dispatch} />
      <OnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

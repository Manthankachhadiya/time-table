import React from 'react';
import { useStore } from './store/useStore';
import LoginPage from './pages/LoginPage';
import Header from './components/Common/Header';
import Sidebar from './components/Common/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TimetableGenerationPage from './pages/TimetableGenerationPage';
import TimetableViewPage from './pages/TimetableViewPage';
import FacultyManagementPage from './pages/FacultyManagementPage';
import SubjectMappingPage from './pages/SubjectMappingPage';
import ClassroomPage from './pages/ClassroomPage';
import ConflictsPage from './pages/ConflictsPage';
import ChangeHistoryPage from './pages/ChangeHistoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ChatBot from './components/Common/ChatBot';

const PAGES: Record<string, React.ReactNode> = {
  'dashboard': <DashboardPage />,
  'timetable-generation': <TimetableGenerationPage />,
  'timetable-view': <TimetableViewPage />,
  'faculty-management': <FacultyManagementPage />,
  'subject-mapping': <SubjectMappingPage />,
  'classroom-management': <ClassroomPage />,
  'conflicts': <ConflictsPage />,
  'change-history': <ChangeHistoryPage />,
  'reports': <ReportsPage />,
  'settings': <SettingsPage />,
};

export default function App() {
  const { isAuthenticated, activePage } = useStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {PAGES[activePage] || <DashboardPage />}
        </main>
      </div>
      <ChatBot />
    </div>
  );
}

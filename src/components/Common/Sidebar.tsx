import React from 'react';
import {
  LayoutDashboard, Calendar, Users, BookOpen, Building2,
  BarChart3, History, AlertTriangle, Settings, ChevronRight, Cpu
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
  { id: 'timetable-generation', label: 'Generate Timetable', icon: Cpu, group: 'Main' },
  { id: 'timetable-view', label: 'Timetable View', icon: Calendar, group: 'Main' },
  { id: 'faculty-management', label: 'Faculty Management', icon: Users, group: 'Management' },
  { id: 'subject-mapping', label: 'Subject Mapping', icon: BookOpen, group: 'Management' },
  { id: 'classroom-management', label: 'Classrooms', icon: Building2, group: 'Management' },
  { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle, group: 'Analysis' },
  { id: 'change-history', label: 'Change History', icon: History, group: 'Analysis' },
  { id: 'reports', label: 'Reports', icon: BarChart3, group: 'Analysis' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

const groups = ['Main', 'Management', 'Analysis', 'System'];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, timetables } = useStore();
  const activeConflicts = timetables.flatMap(t => t.conflicts).filter(c => !c.resolved).length;

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full flex-shrink-0">
      <div className="flex-1 overflow-y-auto py-4">
        {groups.map(group => {
          const items = navItems.filter(i => i.group === group);
          return (
            <div key={group} className="mb-2">
              <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{group}</p>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const hasAlert = item.id === 'conflicts' && activeConflicts > 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-150 group ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasAlert && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {activeConflicts}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 font-medium">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-medium">All Systems Normal</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">v2.1.0 • Academic 2024-25</p>
        </div>
      </div>
    </aside>
  );
}

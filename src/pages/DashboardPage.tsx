import React from 'react';
import { Users, BookOpen, Building2, Calendar, AlertTriangle, CheckCircle, TrendingUp, Clock, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getWorkloadData } from '../utils/algorithms';
import { SESSION_BADGE_COLORS } from '../utils/constants';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { faculties, subjects, classrooms, timetables, setActivePage } = useStore();

  const allSlots = timetables.flatMap(t => t.slots);
  const activeSlots = timetables.filter(t => t.status === 'Active').flatMap(t => t.slots);
  const allConflicts = timetables.flatMap(t => t.conflicts);
  const activeConflicts = allConflicts.filter(c => !c.resolved).length;
  const resolvedConflicts = allConflicts.filter(c => c.resolved).length;
  const activeTimetables = timetables.filter(t => t.status === 'Active').length;

  // Workload from active timetables only
  const workloadData = getWorkloadData(activeSlots, faculties);

  const subjectTypeData = [
    { name: 'Lectures', value: subjects.filter(s => s.type === 'Lecture').length, color: '#6366f1' },
    { name: 'Labs', value: subjects.filter(s => s.type === 'Lab').length, color: '#8b5cf6' },
    { name: 'Tutorials', value: subjects.filter(s => s.type === 'Tutorial').length, color: '#06b6d4' },
  ];

  const avgFitnessScore = timetables.length > 0 ? Math.round(timetables.reduce((sum, t) => sum + t.fitnessScore, 0) / timetables.length) : 0;

  const stats = [
    { label: 'Total Faculty', value: faculties.length, icon: Users, color: 'bg-blue-500', trend: '+2 this month', trendUp: true },
    { label: 'Active Subjects', value: subjects.length, icon: BookOpen, color: 'bg-purple-500', trend: `${subjects.filter(s => s.type === 'Lab').length} Labs`, trendUp: true },
    { label: 'Classrooms', value: classrooms.length, icon: Building2, color: 'bg-cyan-500', trend: `${classrooms.filter(c => c.isAvailable).length} Available`, trendUp: true },
    { label: 'Active Timetables', value: activeTimetables, icon: Calendar, color: 'bg-green-500', trend: `${timetables.length} Total Options`, trendUp: true },
    { label: 'Active Conflicts', value: activeConflicts, icon: AlertTriangle, color: 'bg-red-500', trend: `${resolvedConflicts} Resolved`, trendUp: false },
    { label: 'Avg Fitness Score', value: `${avgFitnessScore}%`, icon: TrendingUp, color: 'bg-amber-500', trend: 'Optimization score', trendUp: true },
  ];

  const recentTimetables = timetables.slice(0, 3);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-indigo-200 text-sm font-medium">Smart Scheduling Active</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Timetable Control Center</h2>
          <p className="text-indigo-200 text-sm max-w-lg">
            AI-powered scheduling with conflict detection, faculty availability optimization, and multi-view generation.
          </p>
          <button
            onClick={() => setActivePage('timetable-generation')}
            className="mt-4 bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 w-fit"
          >
            Generate New Timetable <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: `${(i + 1) * 60}px`, height: `${(i + 1) * 60}px`, top: '10%', right: `${i * 20}px` }} />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
              <p className={`text-xs mt-1 ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Workload Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Faculty Workload</h3>
              <p className="text-xs text-gray-500">Hours assigned vs maximum allowed</p>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={workloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => [value, name === 'assigned' ? 'Assigned Hours' : 'Max Hours']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="assigned" name="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="max" name="max" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Subject Distribution</h3>
              <p className="text-xs text-gray-500">By session type</p>
            </div>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={subjectTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {subjectTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {subjectTypeData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Timetables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Timetables</h3>
            <button onClick={() => setActivePage('timetable-view')} className="text-xs text-indigo-600 hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentTimetables.map(tt => (
              <div key={tt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{tt.name}</p>
                  <p className="text-xs text-gray-500">{tt.semester} • {tt.department}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-indigo-600">{tt.fitnessScore}%</p>
                    <p className="text-xs text-gray-400">fitness</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tt.status === 'Active' ? 'bg-green-100 text-green-700' :
                    tt.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>{tt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Conflicts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Active Conflicts</h3>
            <button onClick={() => setActivePage('conflicts')} className="text-xs text-indigo-600 hover:underline font-medium">Manage</button>
          </div>
          <div className="space-y-3">
            {allConflicts.filter(c => !c.resolved).slice(0, 4).map(conflict => (
              <div key={conflict.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                conflict.severity === 'High' ? 'bg-red-50 border-red-100' :
                conflict.severity === 'Medium' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
              }`}>
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  conflict.severity === 'High' ? 'text-red-500' :
                  conflict.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <div>
                  <p className="text-xs font-semibold text-gray-800">{conflict.type} Conflict</p>
                  <p className="text-xs text-gray-600 mt-0.5">{conflict.description}</p>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ml-auto flex-shrink-0 ${
                  conflict.severity === 'High' ? 'bg-red-100 text-red-700' :
                  conflict.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>{conflict.severity}</span>
              </div>
            ))}
            {allConflicts.filter(c => !c.resolved).length === 0 && (
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700 font-medium">No active conflicts! All clear.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

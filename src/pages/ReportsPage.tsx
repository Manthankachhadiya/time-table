import React, { useState } from 'react';
import { BarChart3, Download, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import { getWorkloadData } from '../utils/algorithms';
import { DAYS } from '../utils/constants';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

type ReportTab = 'faculty' | 'timetable' | 'classroom' | 'optimization';

export default function ReportsPage() {
  const { faculties, subjects, classrooms, timetables } = useStore();
  const [activeTab, setActiveTab] = useState<ReportTab>('faculty');

  const allSlots = timetables.flatMap(t => t.slots);
  const workloadData = getWorkloadData(allSlots, faculties);

  // Sessions per day
  const sessionsPerDay = DAYS.map(day => ({
    day: day.slice(0, 3),
    sessions: allSlots.filter(s => s.day === day && !s.isLabContinuation).length,
    labs: allSlots.filter(s => s.day === day && s.type === 'Lab' && !s.isLabContinuation).length,
  }));

  // Room utilization
  const roomUtilization = classrooms.slice(0, 6).map(room => ({
    name: room.name.replace('Room ', 'R').replace('Lab ', 'L'),
    fullName: room.name,
    used: allSlots.filter(s => s.classroomId === room.id).length,
    capacity: room.capacity,
    utilization: Math.round((allSlots.filter(s => s.classroomId === room.id).length / 45) * 100),
  }));

  // Timetable fitness comparison
  const fitnessData = timetables.map(t => ({
    name: `Option ${t.version}`,
    fitness: t.fitnessScore,
    conflicts: t.conflicts.filter(c => !c.resolved).length,
  }));

  // Faculty radar data
  const radarData = faculties.slice(0, 5).map(f => ({
    faculty: f.name.split(' ').slice(-1)[0],
    workload: Math.round((f.currentLoad / f.maxHoursPerWeek) * 100),
    availability: Math.round((f.availability.reduce((sum, a) => sum + a.slots.length, 0) / 45) * 100),
    subjects: subjects.filter(s => s.facultyId === f.id).length * 15,
  }));

  const tabs: Array<{ id: ReportTab; label: string; icon: React.ReactNode }> = [
    { id: 'faculty', label: 'Faculty Report', icon: <Users className="w-4 h-4" /> },
    { id: 'timetable', label: 'Timetable Analysis', icon: <Calendar className="w-4 h-4" /> },
    { id: 'classroom', label: 'Classroom Usage', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'optimization', label: 'Optimization', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Comprehensive scheduling analytics and insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Faculty Report */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workload Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Faculty Workload Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={workloadData} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v, n) => [v, n === 'assigned' ? 'Assigned' : 'Max']} />
                  <Bar dataKey="assigned" name="assigned" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="max" name="max" fill="#e0e7ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Faculty Performance Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="faculty" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Workload %" dataKey="workload" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                  <Radar name="Availability %" dataKey="availability" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Faculty Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Faculty Summary Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Faculty', 'Department', 'Specialization', 'Assigned Hrs', 'Max Hrs', 'Load %', 'Subjects', 'Availability Days'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {faculties.map(f => {
                    const assigned = allSlots.filter(s => s.facultyId === f.id && !s.isLabContinuation).length;
                    const loadPct = Math.round((assigned / f.maxHoursPerWeek) * 100);
                    return (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{f.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{f.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-36 truncate">{f.specialization}</td>
                        <td className="px-4 py-3 text-sm font-bold text-indigo-600">{assigned}h</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{f.maxHoursPerWeek}h</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${loadPct >= 90 ? 'bg-red-500' : loadPct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(loadPct, 100)}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${loadPct >= 90 ? 'text-red-600' : loadPct >= 70 ? 'text-amber-600' : 'text-green-600'}`}>{loadPct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{subjects.filter(s => s.facultyId === f.id).length}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{f.availability.length} days</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Analysis */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Sessions Per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sessionsPerDay}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="sessions" name="Total Sessions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="labs" name="Lab Sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Timetable Fitness Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={fitnessData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="fitness" name="Fitness Score %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conflicts" name="Active Conflicts" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Subject Type Timeline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sessionsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="sessions" name="Total" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="labs" name="Labs" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Classroom Usage */}
      {activeTab === 'classroom' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Room Utilization (%)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={roomUtilization}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v}%`, 'Utilization']} />
                  <Bar dataKey="utilization" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Room Type Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Lecture Halls', value: classrooms.filter(c => c.type === 'Lecture Hall').length },
                      { name: 'Labs', value: classrooms.filter(c => c.type === 'Lab').length },
                      { name: 'Tutorial Rooms', value: classrooms.filter(c => c.type === 'Tutorial Room').length },
                    ]}
                    cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}
                  >
                    {COLORS.slice(0, 3).map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Classroom Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">Classroom Usage Summary</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Room', 'Type', 'Capacity', 'Sessions Used', 'Utilization', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classrooms.map(room => {
                    const used = allSlots.filter(s => s.classroomId === room.id).length;
                    const util = Math.min(Math.round((used / 45) * 100), 100);
                    return (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{room.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{room.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{room.capacity}</td>
                        <td className="px-4 py-3 text-sm font-bold text-indigo-600">{used}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${util}%` }} />
                            </div>
                            <span className="text-xs font-bold text-cyan-600">{util}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {room.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Optimization */}
      {activeTab === 'optimization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Avg Fitness Score', value: `${Math.round(timetables.reduce((s, t) => s + t.fitnessScore, 0) / timetables.length)}%`, color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Across all timetables' },
              { label: 'Conflicts Resolved', value: `${timetables.flatMap(t => t.conflicts).filter(c => c.resolved).length}/${timetables.flatMap(t => t.conflicts).length}`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Auto + Manual' },
              { label: 'Scheduling Efficiency', value: '94%', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', desc: 'Slots filled / total' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-sm font-bold text-gray-700 mt-1">{s.label}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Optimization Metrics by Timetable</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={timetables.map(t => ({
                name: t.name.split('–')[1]?.trim() || t.name.slice(0, 20),
                fitness: t.fitnessScore,
                sessions: t.slots.filter(s => !s.isLabContinuation).length,
                resolved: t.conflicts.filter(c => c.resolved).length,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="fitness" name="Fitness %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sessions" name="Sessions" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved Conflicts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

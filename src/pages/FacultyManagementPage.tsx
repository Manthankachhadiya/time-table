import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Mail, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Faculty } from '../utils/types';
import { DEPARTMENTS, DAYS, TIME_SLOTS } from '../utils/constants';

const EMPTY_FACULTY: Partial<Faculty> = {
  name: '', email: '', department: 'Computer Science', specialization: '',
  maxHoursPerWeek: 20, currentLoad: 0, availability: []
};

export default function FacultyManagementPage() {
  const { faculties, timetables, addFaculty, updateFaculty, deleteFaculty } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Faculty>>(EMPTY_FACULTY);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  // ── Compute real workload from ACTIVE timetables ────────────────────────────
  const activeTimetables = timetables.filter(t => t.status === 'Active');

  const getFacultyLoad = (facultyId: string) => {
    const allSlots = activeTimetables.flatMap(t =>
      t.slots.filter(s => s.facultyId === facultyId && !s.isLabContinuation)
    );
    return {
      total:    allSlots.length,
      lectures: allSlots.filter(s => s.type === 'Lecture').length,
      labs:     allSlots.filter(s => s.type === 'Lab').length,
      tutorials:allSlots.filter(s => s.type === 'Tutorial').length,
    };
  };

  const filtered = faculties.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(EMPTY_FACULTY);
    setAvailability({});
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (f: Faculty) => {
    setForm({ ...f });
    const av: Record<string, string[]> = {};
    f.availability.forEach(a => { av[a.day] = [...a.slots]; });
    setAvailability(av);
    setEditingId(f.id);
    setShowModal(true);
  };

  const toggleSlot = (slot: string) => {
    setAvailability(prev => {
      const daySlots = prev[selectedDay] || [];
      return {
        ...prev,
        [selectedDay]: daySlots.includes(slot)
          ? daySlots.filter(s => s !== slot)
          : [...daySlots, slot]
      };
    });
  };

  const handleSave = () => {
    const availArr = Object.entries(availability)
      .filter(([, slots]) => slots.length > 0)
      .map(([day, slots]) => ({ day, slots }));

    if (editingId) {
      updateFaculty(editingId, { ...form, availability: availArr } as Faculty);
    } else {
      addFaculty({
        ...form,
        id: `f-${Date.now()}`,
        availability: availArr,
      } as Faculty);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      deleteFaculty(id);
    }
  };

  const getLoadColor = (load: number, max: number) => {
    const pct = (load / max) * 100;
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 70) return 'bg-amber-500';
    if (pct >= 1)  return 'bg-indigo-500';
    return 'bg-gray-200';
  };

  const getStatusBadge = (load: number, max: number) => {
    const pct = (load / max) * 100;
    if (pct >= 90)  return { label: '🔴 Full',      cls: 'bg-red-100 text-red-700' };
    if (pct >= 70)  return { label: '🟡 Busy',      cls: 'bg-amber-100 text-amber-700' };
    if (pct >= 1)   return { label: '🟢 Active',    cls: 'bg-indigo-100 text-indigo-700' };
    return             { label: '⚪ Unscheduled', cls: 'bg-gray-100 text-gray-500' };
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Faculty Management</h2>
          <p className="text-sm text-gray-500">{faculties.length} faculty members registered</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search faculty by name, department, or specialization..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Active timetable notice */}
      {activeTimetables.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <span>⚠️</span>
          <span>No active timetable found. Activate a timetable in <strong>Timetable View</strong> to see real faculty workloads.</span>
        </div>
      )}
      {activeTimetables.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Workload calculated from <strong>{activeTimetables.length} active timetable{activeTimetables.length > 1 ? 's' : ''}</strong>: {activeTimetables.map(t => `${t.semester} Div ${t.division}`).join(', ')}</span>
        </div>
      )}

      {/* Faculty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(faculty => {
          const load = getFacultyLoad(faculty.id);
          const pct  = faculty.maxHoursPerWeek > 0 ? Math.min(Math.round((load.total / faculty.maxHoursPerWeek) * 100), 100) : 0;
          const badge = getStatusBadge(load.total, faculty.maxHoursPerWeek);

          return (
          <div key={faculty.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {faculty.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{faculty.name}</p>
                  <p className="text-xs text-indigo-600 font-medium">{faculty.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>{badge.label}</span>
                <button onClick={() => openEdit(faculty)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ml-1">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(faculty.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate">{faculty.specialization}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{faculty.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {/* Live load from active timetables */}
                <span className="font-semibold text-gray-700">{load.total}</span>
                <span>/ {faculty.maxHoursPerWeek} sessions/week</span>
                {activeTimetables.length > 0 && (
                  <span className="text-indigo-500 font-medium">(from active TT)</span>
                )}
              </div>
            </div>

            {/* Lecture / Lab / Tutorial breakdown */}
            {load.total > 0 && (
              <div className="flex gap-2 mt-2">
                {load.lectures > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    📖 {load.lectures} Lectures
                  </span>
                )}
                {load.labs > 0 && (
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    🔬 {load.labs} Labs
                  </span>
                )}
                {load.tutorials > 0 && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    📝 {load.tutorials} Tutorials
                  </span>
                )}
              </div>
            )}

            {/* Workload bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Workload</span>
                <span className={`font-bold ${
                  pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : pct >= 1 ? 'text-indigo-600' : 'text-gray-400'
                }`}>{pct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${getLoadColor(load.total, faculty.maxHoursPerWeek)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Availability days */}
            <div className="flex gap-1 mt-3 flex-wrap">
              {DAYS.map(day => {
                const hasAvail = faculty.availability.some(a => a.day === day && a.slots.length > 0);
                return (
                  <span key={day} className={`text-xs px-1.5 py-0.5 rounded ${hasAvail ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {day.slice(0, 3)}
                  </span>
                );
              })}
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Dr. John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@edu.ac.in" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as any }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Hours/Week</label>
                  <input type="number" min="1" max="40" value={form.maxHoursPerWeek} onChange={e => setForm(f => ({ ...f, maxHoursPerWeek: +e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Specialization</label>
                <input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Machine Learning & AI" />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Availability Schedule</label>
                <div className="flex gap-1 flex-wrap mb-3">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedDay === day ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {day.slice(0,3)}
                      {(availability[day] || []).length > 0 && (
                        <span className="ml-1 text-xs opacity-70">({(availability[day] || []).length})</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const isSelected = (availability[selectedDay] || []).includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={`text-xs px-2 py-2 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                          isSelected ? 'bg-green-100 border-green-400 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3 h-3 flex-shrink-0" />}
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

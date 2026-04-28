import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, FlaskConical, BookOpen, GraduationCap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Subject } from '../utils/types';
import { DEPARTMENTS, SEMESTERS, DIVISIONS, SUBJECT_TYPES, SESSION_COLORS } from '../utils/constants';

const EMPTY: Partial<Subject> = {
  code: '', name: '', department: 'Computer Science', semester: 'Sem 3', division: 'A',
  type: 'Lecture', hoursPerWeek: 3, facultyId: '', requiresLab: false, labDuration: 2
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Lecture: <BookOpen className="w-4 h-4" />,
  Tutorial: <GraduationCap className="w-4 h-4" />,
  Lab: <FlaskConical className="w-4 h-4" />,
};

export default function SubjectMappingPage() {
  const { subjects, faculties, addSubject, updateSubject, deleteSubject } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Subject>>(EMPTY);

  const filtered = subjects.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())) &&
    (!filterType || s.type === filterType) &&
    (!filterDept || s.department === filterDept)
  );

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowModal(true); };
  const openEdit = (s: Subject) => { setForm({ ...s }); setEditingId(s.id); setShowModal(true); };

  const handleSave = () => {
    if (editingId) {
      updateSubject(editingId, form as Subject);
    } else {
      addSubject({ ...form, id: `s-${Date.now()}` } as Subject);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this subject?')) deleteSubject(id);
  };

  const groupedByDept = DEPARTMENTS.reduce((acc, dept) => {
    acc[dept] = filtered.filter(s => s.department === dept);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Subject Mapping</h2>
          <p className="text-sm text-gray-500">{subjects.length} subjects across all departments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Types</option>
          {SUBJECT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Subject Stats */}
      <div className="grid grid-cols-3 gap-4">
        {SUBJECT_TYPES.map(type => {
          const count = subjects.filter(s => s.type === type).length;
          const colors: Record<string, string> = { Lecture: 'bg-blue-50 border-blue-200 text-blue-700', Tutorial: 'bg-green-50 border-green-200 text-green-700', Lab: 'bg-purple-50 border-purple-200 text-purple-700' };
          return (
            <div key={type} className={`rounded-xl border p-4 ${colors[type]} cursor-pointer ${filterType === type ? 'ring-2 ring-offset-1' : ''}`} onClick={() => setFilterType(filterType === type ? '' : type)}>
              <div className="flex items-center gap-2 mb-1">
                {TYPE_ICONS[type]}
                <span className="font-semibold text-sm">{type}s</span>
              </div>
              <p className="text-3xl font-black">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Subjects grouped by department */}
      <div className="space-y-4">
        {Object.entries(groupedByDept).filter(([, subs]) => subs.length > 0).map(([dept, subs]) => (
          <div key={dept} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm">{dept}</h3>
              <span className="text-xs text-gray-500">{subs.length} subjects</span>
            </div>
            <div className="divide-y divide-gray-100">
              {subs.map(subject => {
                const faculty = faculties.find(f => f.id === subject.facultyId);
                return (
                  <div key={subject.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      subject.type === 'Lecture' ? 'bg-blue-100 text-blue-600' :
                      subject.type === 'Lab' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {TYPE_ICONS[subject.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{subject.name}</p>
                        <span className="text-xs text-gray-400">({subject.code})</span>
                      </div>
                      <p className="text-xs text-gray-500">{faculty?.name || 'Unassigned'} • {subject.hoursPerWeek}h/week</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${SESSION_COLORS[subject.type]}`}>{subject.type}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{subject.semester}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Div {subject.division}</span>
                      {subject.requiresLab && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{subject.labDuration}h Lab</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(subject)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(subject.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Subject' : 'Add Subject'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subject Code *</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="CS301" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subject Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Data Structures" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as any }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Session Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any, requiresLab: e.target.value === 'Lab' }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {SUBJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                  <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value as any }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Division</label>
                  <select value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value as any }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {DIVISIONS.map(d => <option key={d}>Div {d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hrs/Week</label>
                  <input type="number" min="1" max="10" value={form.hoursPerWeek} onChange={e => setForm(f => ({ ...f, hoursPerWeek: +e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Assign Faculty</label>
                <select value={form.facultyId} onChange={e => setForm(f => ({ ...f, facultyId: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">-- Select Faculty --</option>
                  {faculties.map(f => <option key={f.id} value={f.id}>{f.name} ({f.department})</option>)}
                </select>
              </div>
              {form.type === 'Lab' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Continuous Lab Duration (hours)</label>
                  <select value={form.labDuration} onChange={e => setForm(f => ({ ...f, labDuration: +e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {[2, 3, 4].map(n => <option key={n} value={n}>{n} hours (continuous)</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

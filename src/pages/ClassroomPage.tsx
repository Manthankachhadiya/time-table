import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Building2, Users, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Classroom } from '../utils/types';
import { DEPARTMENTS } from '../utils/constants';

const EMPTY: Partial<Classroom> = {
  name: '', capacity: 30, type: 'Lecture Hall', department: 'Computer Science', isAvailable: true, equipment: []
};

const ROOM_TYPES = ['Lecture Hall', 'Lab', 'Tutorial Room'] as const;

export default function ClassroomPage() {
  const { classrooms, addClassroom, updateClassroom, deleteClassroom } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Classroom>>(EMPTY);
  const [equipInput, setEquipInput] = useState('');

  const filtered = classrooms.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filterType || c.type === filterType)
  );

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setEquipInput(''); setShowModal(true); };
  const openEdit = (c: Classroom) => { setForm({ ...c }); setEditingId(c.id); setEquipInput(''); setShowModal(true); };

  const addEquipment = () => {
    if (equipInput.trim()) {
      setForm(f => ({ ...f, equipment: [...(f.equipment || []), equipInput.trim()] }));
      setEquipInput('');
    }
  };

  const removeEquipment = (i: number) => setForm(f => ({ ...f, equipment: (f.equipment || []).filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    if (editingId) {
      updateClassroom(editingId, form as Classroom);
    } else {
      addClassroom({ ...form, id: `c-${Date.now()}` } as Classroom);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this classroom?')) deleteClassroom(id);
  };

  const typeStats = ROOM_TYPES.map(type => ({
    type,
    total: classrooms.filter(c => c.type === type).length,
    available: classrooms.filter(c => c.type === type && c.isAvailable).length,
  }));

  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    'Lecture Hall': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Lab': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Tutorial Room': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Classroom Management</h2>
          <p className="text-sm text-gray-500">{classrooms.filter(c => c.isAvailable).length}/{classrooms.length} rooms available</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Classroom
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {typeStats.map(s => (
          <div key={s.type} className={`rounded-xl border p-4 ${typeColors[s.type].bg} ${typeColors[s.type].border}`}>
            <p className={`text-sm font-bold ${typeColors[s.type].text}`}>{s.type}s</p>
            <p className={`text-3xl font-black ${typeColors[s.type].text}`}>{s.total}</p>
            <p className={`text-xs ${typeColors[s.type].text} opacity-70`}>{s.available} available</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Types</option>
          {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Classroom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(room => (
          <div key={room.id} className={`bg-white rounded-xl border-2 p-5 hover:shadow-md transition-all ${room.isAvailable ? 'border-gray-200' : 'border-red-200 opacity-75'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[room.type].bg}`}>
                  <Building2 className={`w-5 h-5 ${typeColors[room.type].text}`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{room.name}</p>
                  <p className={`text-xs font-medium ${typeColors[room.type].text}`}>{room.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateClassroom(room.id, { isAvailable: !room.isAvailable })}
                  className={`p-1.5 rounded-lg transition-colors ${room.isAvailable ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}>
                  {room.isAvailable ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(room)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>Capacity: <strong>{room.capacity}</strong> students</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span>Dept: <strong>{room.department}</strong></span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {room.equipment.map((eq, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  <Monitor className="w-3 h-3 inline mr-1" />{eq}
                </span>
              ))}
            </div>

            <div className={`mt-3 text-xs font-semibold px-2 py-1 rounded-lg inline-block ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {room.isAvailable ? '✓ Available' : '✗ Unavailable'}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Classroom' : 'Add Classroom'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Room Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Room 101" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Capacity</label>
                  <input type="number" min="10" max="300" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as any }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} className="w-4 h-4 accent-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Mark as Available</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Equipment</label>
                <div className="flex gap-2">
                  <input value={equipInput} onChange={e => setEquipInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEquipment()} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Projector" />
                  <button onClick={addEquipment} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 font-medium">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(form.equipment || []).map((eq, i) => (
                    <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                      {eq}
                      <button onClick={() => removeEquipment(i)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { LayoutGrid, List, Filter, Download, Eye, CheckCircle, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import GridView from '../components/Timetable/GridView';
import ListView from '../components/Timetable/ListView';
import { DEPARTMENTS, SEMESTERS, DIVISIONS } from '../utils/constants';

type ViewMode = 'grid' | 'list' | 'faculty';

export default function TimetableViewPage() {
  const { timetables, faculties, selectedTimetableId, setSelectedTimetable, updateTimetableStatus } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterDept, setFilterDept] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [filterDiv, setFilterDiv] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');

  const selectedTimetable = timetables.find(t => t.id === selectedTimetableId) || timetables[0];

  const handleActivate = (id: string) => {
    timetables.forEach(t => {
      if (t.status === 'Active') updateTimetableStatus(t.id, 'Archived');
    });
    updateTimetableStatus(id, 'Active');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Timetable View</h2>
            <p className="text-xs text-gray-500">Multi-perspective schedule visualization</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              {([['grid', LayoutGrid, 'Grid'], ['list', List, 'List'], ['faculty', Eye, 'Faculty']] as const).map(([mode, Icon, label]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === mode ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Timetable Selector */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 p-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Generated Options</p>
          <div className="space-y-2">
            {timetables.map(tt => (
              <button
                key={tt.id}
                onClick={() => setSelectedTimetable(tt.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedTimetableId === tt.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{tt.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tt.semester} • {tt.division}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-1 flex-shrink-0 ${
                    tt.status === 'Active' ? 'bg-green-100 text-green-700' :
                    tt.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>{tt.status}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${tt.fitnessScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{tt.fitnessScore}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{tt.conflicts.filter(c => !c.resolved).length} conflicts</p>
                {tt.status !== 'Active' && (
                  <button
                    onClick={e => { e.stopPropagation(); handleActivate(tt.id); }}
                    className="mt-2 w-full text-xs bg-indigo-600 text-white py-1 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Activate
                  </button>
                )}
                {tt.status === 'Active' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" /> Currently Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Timetable Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedTimetable && (
            <>
              {/* Filter Bar */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {viewMode === 'faculty' ? (
                  <select
                    value={filterFaculty}
                    onChange={e => setFilterFaculty(e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All Faculty</option>
                    {faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">All Depts</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">All Sems</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={filterDiv} onChange={e => setFilterDiv(e.target.value)} className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">All Divs</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>Div {d}</option>)}
                    </select>
                  </>
                )}
                <button onClick={() => { setFilterDept(''); setFilterSem(''); setFilterDiv(''); setFilterFaculty(''); }} className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1">Clear</button>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedTimetable.slots.filter(s => !s.isLabContinuation).length} sessions scheduled
                </div>
              </div>

              {/* Timetable Content */}
              <div className="flex-1 overflow-auto p-4">
                {/* Legend */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  {[['Lecture', 'bg-blue-500'], ['Lab', 'bg-purple-500'], ['Tutorial', 'bg-green-500']].map(([type, color]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-xs text-gray-600">{type}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded border-2 border-dashed border-gray-300" />
                    <span className="text-xs text-gray-600">Lab Continuation</span>
                  </div>
                </div>

                {viewMode === 'grid' && (
                  <GridView
                    slots={selectedTimetable.slots}
                    filterDepartment={filterDept}
                    filterSemester={filterSem}
                    filterDivision={filterDiv}
                  />
                )}
                {viewMode === 'list' && (
                  <ListView slots={selectedTimetable.slots.filter(s =>
                    (!filterDept || s.department === filterDept) &&
                    (!filterSem || s.semester === filterSem) &&
                    (!filterDiv || s.division === filterDiv)
                  )} />
                )}
                {viewMode === 'faculty' && (
                  <div className="space-y-6">
                    {(filterFaculty ? faculties.filter(f => f.id === filterFaculty) : faculties).map(faculty => {
                      const facultySlots = selectedTimetable.slots.filter(s => s.facultyId === faculty.id);
                      if (facultySlots.length === 0) return null;
                      return (
                        <div key={faculty.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-4 py-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-white">{faculty.name}</h4>
                              <p className="text-indigo-200 text-xs">{faculty.specialization} • {faculty.department}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-indigo-200">Weekly Load</p>
                              <p className="text-white font-bold">{facultySlots.filter(s => !s.isLabContinuation).length}/{faculty.maxHoursPerWeek}h</p>
                            </div>
                          </div>
                          <GridView slots={facultySlots} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

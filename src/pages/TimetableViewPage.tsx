import React, { useState, useCallback } from 'react';
import { LayoutGrid, List, Filter, Download, Eye, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import GridView from '../components/Timetable/GridView';
import ListView from '../components/Timetable/ListView';
import { DEPARTMENTS, SEMESTERS, DIVISIONS, DAYS, TIME_SLOTS } from '../utils/constants';
import { TimetableSlot } from '../utils/types';

type ViewMode = 'grid' | 'list' | 'faculty';

export default function TimetableViewPage() {
  const { timetables, faculties, selectedTimetableId, setSelectedTimetable, updateTimetableStatus } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterDept, setFilterDept] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [filterDiv, setFilterDiv] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');

  const selectedTimetable = timetables.find(t => t.id === selectedTimetableId) || timetables[0];

  // ── Feature 2: Per-Sem/Division Active status ──────────────────────────────
  // Only archive OTHER timetables with the SAME (semester + division) pair
  const handleActivate = (id: string) => {
    const target = timetables.find(t => t.id === id);
    if (!target) return;
    timetables.forEach(t => {
      if (
        t.id !== id &&
        t.semester === target.semester &&
        t.division === target.division &&
        t.status === 'Active'
      ) {
        updateTimetableStatus(t.id, 'Archived');
      }
    });
    updateTimetableStatus(id, 'Active');
  };

  // ── PDF Export ──────────────────────────────────────────────────────────────
  const downloadAsPdf = useCallback(() => {
    const tt = timetables.find(t => t.id === selectedTimetableId) || timetables[0];
    if (!tt) return;

    const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const conflictCount = tt.conflicts.filter((c: { resolved: boolean }) => !c.resolved).length;

    const blocks = [
      { label: '10:45-12:45', s1: TIME_SLOTS[0], s2: TIME_SLOTS[1] },
      { label: '13:15-15:15', s1: TIME_SLOTS[2], s2: TIME_SLOTS[3] },
      { label: '15:30-17:30', s1: TIME_SLOTS[4], s2: TIME_SLOTS[5] },
    ];

    const buildCell = (day: string, s1: string, s2: string): string => {
      const labSlots = tt.slots
        .filter(s => s.day === day && s.timeSlot === s1 && s.type === 'Lab' && s.batch && !s.isLabContinuation)
        .sort((a, b) => (a.batch ?? '').localeCompare(b.batch ?? ''));

      if (labSlots.length > 0) {
        const rows = labSlots.map(s =>
          '<div class="br">' +
          '<span class="bb">' + (s.batch ?? '') + '</span> ' +
          '<b class="bs">' + s.subjectCode + '</b> ' +
          '<span class="bf">' + (s.facultyName.split(' ').pop() ?? '') + '</span>' +
          '<span class="bR">' + s.classroomName + '</span>' +
          '</div>'
        ).join('');
        return '<td class="labtd"><div class="lph">Lab Period</div>' + rows + '</td>';
      }

      const e1 = tt.slots.filter(s => s.day === day && s.timeSlot === s1 && !s.isLabContinuation && !(s.type === 'Lab' && s.batch));
      const e2 = tt.slots.filter(s => s.day === day && s.timeSlot === s2 && !s.isLabContinuation && !(s.type === 'Lab' && s.batch));

      const card = (s: (typeof e1)[0], tLabel: string) =>
        '<div class="' + (s.type === 'Tutorial' ? 'tc' : 'lc') + '">' +
        '<div class="ct">' + tLabel + '</div>' +
        '<div class="cs">' + s.subjectCode + '</div>' +
        '<div class="cn">' + s.subjectName + '</div>' +
        '<div class="cf">' + (s.facultyName.split(' ').pop() ?? '') + ' | ' + s.classroomName + '</div>' +
        '</div>';

      let inner = '';
      if (e1.length > 0) inner += card(e1[0], s1.split(' - ')[0]);
      if (e2.length > 0) inner += card(e2[0], s2.split(' - ')[0]);
      return inner ? '<td>' + inner + '</td>' : '<td class="ec"></td>';
    };

    const thRow = DAYS.map(d => '<th>' + d.toUpperCase() + '</th>').join('');
    const bodyRows = blocks.map((b, i) => {
      const cells = DAYS.map(d => buildCell(d, b.s1, b.s2)).join('');
      return '<tr class="' + (i % 2 === 0 ? 'er' : 'or') + '"><td class="tm">' + b.label.replace('-', '<br>') + '</td>' + cells + '</tr>';
    }).join('');

    // Precision-fit CSS for A4 landscape single page
    // Usable height: 202mm. Breakdown:
    //   header: 13mm | legend: 6mm | thead: 7mm | 3xrows: 56mm each | footer: 4mm = 202mm
    const css = [
      '* { box-sizing:border-box; margin:0; padding:0; }',
      'html, body { width:289mm; height:202mm; overflow:hidden; }',
      'body { font-family:Arial,sans-serif; background:#fff; color:#1e293b; font-size:8.5px; padding:0; }',

      // Header — 13mm
      '.hd { background:linear-gradient(135deg,#312e81,#7c3aed); color:#fff; border-radius:6px;',
      '       display:flex; justify-content:space-between; align-items:center;',
      '       padding:3.5mm 5mm; height:13mm; margin-bottom:1.5mm; }',
      '.hn h1 { font-size:13px; font-weight:700; }',
      '.hn p  { font-size:8px; opacity:.82; margin-top:1px; }',
      '.hi    { text-align:right; font-size:8px; opacity:.82; }',
      '.sc    { display:inline-block; background:rgba(255,255,255,.22); border-radius:12px;',
      '         padding:1px 8px; font-weight:700; font-size:10px; margin-top:2px; }',

      // Legend — 6mm
      '.lg { display:flex; gap:10px; height:6mm; align-items:center;',
      '      margin-bottom:1mm; font-size:8px; color:#64748b; }',
      '.li { display:flex; align-items:center; gap:3px; }',
      '.dot{ width:8px; height:8px; border-radius:2px; flex-shrink:0; }',
      '.dl { background:#bfdbfe; } .dp { background:#e9d5ff; } .dt { background:#bbf7d0; }',

      // Table — takes remaining space (table-layout:fixed critical for equal columns)
      'table { width:289mm; border-collapse:collapse; table-layout:fixed; }',
      'th { background:#1e1b4b; color:#c7d2fe; font-size:9px; font-weight:700;',
      '     padding:0; height:7mm; text-align:center; border:1px solid #3730a3; }',
      'td { border:1px solid #cbd5e1; padding:2mm 2.5mm; vertical-align:top; height:56mm; overflow:hidden; }',
      'td.ec { background:#f8fafc; }',
      'tr.er td { background:#f9fafb; }',
      'tr.or td { background:#eef2ff; }',

      // Time column
      '.tm { background:#1e1b4b !important; color:#818cf8; font-size:9px; font-weight:700;',
      '      text-align:center; width:60px; vertical-align:middle !important; line-height:1.6; }',

      // Lecture card — compact for 56mm row
      '.lc,.tc { border-radius:4px; padding:2.5mm 3mm; margin-bottom:2mm; line-height:1.4; }',
      '.lc { background:#dbeafe; border-left:3px solid #3b82f6; }',
      '.tc { background:#dcfce7; border-left:3px solid #22c55e; }',
      '.ct { font-size:7.5px; color:#64748b; font-weight:600; }',
      '.cs { font-weight:800; font-size:11px; color:#1e40af; margin-top:1px; }',
      '.cn { font-size:8.5px; color:#334155; margin-top:1px; }',
      '.cf { font-size:7.5px; color:#64748b; margin-top:2px; }',

      // Lab period cell
      '.labtd { background:#faf5ff; border:2px solid #a78bfa !important; padding:2mm 3mm; vertical-align:top; height:56mm; overflow:hidden; }',
      '.lph { font-weight:800; color:#6d28d9; font-size:10px; margin-bottom:2mm; padding-bottom:1.5mm; border-bottom:1px solid #ddd8fe; }',
      '.br { display:flex; align-items:center; gap:4px; font-size:8.5px; margin-bottom:2mm;',
      '      padding-bottom:1.5mm; border-bottom:1px dotted #e9d5ff; }',
      '.br:last-child { border-bottom:none; margin-bottom:0; }',
      '.bb { background:#7c3aed; color:#fff; border-radius:3px; padding:1px 4px;',
      '      font-size:8px; font-weight:700; flex-shrink:0; min-width:20px; text-align:center; }',
      '.bs { font-weight:800; color:#312e81; flex-shrink:0; font-size:9px; }',
      '.bf { color:#475569; flex-shrink:0; }',
      '.bR { color:#6d28d9; margin-left:auto; flex-shrink:0; font-size:8px; font-weight:600; }',

      // Footer — 4mm
      '.ft { height:4mm; display:flex; justify-content:space-between; align-items:center;',
      '      margin-top:1mm; font-size:7.5px; color:#94a3b8; }',

      '@media print {',
      '  @page { size:A4 landscape; margin:4mm; }',
      '  html,body { width:289mm; height:202mm; overflow:hidden; }',
      '  table { page-break-inside:avoid; }',
      '  tr { page-break-inside:avoid; page-break-after:avoid; }',
      '}'
    ].join(' ');

    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + tt.name + '</title>' +
      '<style>' + css + '</style></head><body>' +
      '<div class="hd">' +
        '<div class="hn"><h1>' + tt.name + '</h1>' +
        '<p>' + tt.semester + ' &bull; Division ' + tt.division + ' &bull; ' + tt.department + '</p></div>' +
        '<div class="hi">Generated: ' + now + '<div class="sc">Score: ' + tt.fitnessScore + '%</div></div>' +
      '</div>' +
      '<div class="lg">' +
        '<div class="li"><div class="dot dl"></div>Lecture (1hr)</div>' +
        '<div class="li"><div class="dot dp"></div>Lab Period (2hrs)</div>' +
        '<div class="li"><div class="dot dt"></div>Tutorial</div>' +
        '<div class="li" style="margin-left:auto;font-size:7.5px">[Batch][Code][Faculty][Room]</div>' +
      '</div>' +
      '<table>' +
        '<thead><tr><th style="width:60px">TIME</th>' + thRow + '</tr></thead>' +
        '<tbody>' + bodyRows + '</tbody>' +
      '</table>' +
      '<div class="ft">' +
        '<span>&copy; ' + new Date().getFullYear() + ' ' + tt.department + ' &mdash; Auto-generated</span>' +
        '<span>' + conflictCount + ' unresolved conflict(s)</span>' +
      '</div>' +
      '</body></html>';

    const win = window.open('', '_blank');
    if (!win) { alert('Please allow popups to export PDF.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 800);
  }, [timetables, selectedTimetableId]);
  // ── Aggregate ALL active timetables for faculty view ─────────────────────
  const allActiveTimetables = timetables.filter(t => t.status === 'Active');

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
            <button
              onClick={downloadAsPdf}
              disabled={!timetables.length}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Timetable Selector — hidden in faculty view */}
        {viewMode !== 'faculty' && (
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
                      <p className="text-xs text-gray-500 mt-0.5">{tt.semester} • Div {tt.division}</p>
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
        )}

        {/* Faculty View Left Panel — shows all active timetables summary */}
        {viewMode === 'faculty' && (
          <div className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 p-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Active Timetables</p>
            {allActiveTimetables.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No active timetables.<br />Activate timetables per Sem &amp; Division first.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allActiveTimetables.map(tt => (
                  <div key={tt.id} className="p-3 rounded-xl border border-green-200 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-green-800 truncate">{tt.semester} • Div {tt.division}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{tt.name}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 ml-1 flex-shrink-0">Active</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{tt.slots.filter(s => !s.isLabContinuation).length} sessions</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Timetable Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {viewMode !== 'faculty' && selectedTimetable && (
            <>
              {/* Filter Bar */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
                <button onClick={() => { setFilterDept(''); setFilterSem(''); setFilterDiv(''); }} className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1">Clear</button>
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
              </div>
            </>
          )}

          {/* ── Feature 3: Faculty View — aggregated from ALL active timetables ── */}
          {viewMode === 'faculty' && (
            <>
              {/* Filter Bar */}
              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
                <button onClick={() => setFilterFaculty('')} className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1">Clear</button>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
                  <BookOpen className="w-3.5 h-3.5" />
                  Showing {allActiveTimetables.length} active timetable{allActiveTimetables.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {allActiveTimetables.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <BookOpen className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium text-gray-500">No active timetables</p>
                    <p className="text-xs text-gray-400 mt-1">Activate a timetable per Semester &amp; Division to see faculty schedules here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(filterFaculty ? faculties.filter(f => f.id === filterFaculty) : faculties).map(faculty => {
                      // Aggregate slots from ALL active timetables for this faculty
                      const facultySlotsByTT = allActiveTimetables.map(tt => ({
                        timetable: tt,
                        slots: tt.slots.filter(s => s.facultyId === faculty.id && !s.isLabContinuation),
                      })).filter(entry => entry.slots.length > 0);

                      const totalSlots = facultySlotsByTT.reduce((sum, e) => sum + e.slots.length, 0);
                      if (totalSlots === 0) return null;

                      // Merge all slots for the grid view, adding sem+div badge info
                      const allFacultySlots = facultySlotsByTT.flatMap(entry =>
                        entry.timetable.slots.filter(s => s.facultyId === faculty.id)
                      );

                      return (
                        <div key={faculty.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-4 py-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-white">{faculty.name}</h4>
                              <p className="text-indigo-200 text-xs">{faculty.specialization} • {faculty.department}</p>
                              {/* Sem+Division badges */}
                              <div className="flex gap-1.5 mt-1 flex-wrap">
                                {facultySlotsByTT.map(entry => (
                                  <span key={entry.timetable.id} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                    {entry.timetable.semester} Div {entry.timetable.division} ({entry.slots.length} sessions)
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-indigo-200">Weekly Load</p>
                              <p className="text-white font-bold text-lg">{totalSlots}/{faculty.maxHoursPerWeek}h</p>
                              <div className={`text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
                                totalSlots >= faculty.maxHoursPerWeek
                                  ? 'bg-red-400 text-white'
                                  : totalSlots >= faculty.maxHoursPerWeek * 0.7
                                  ? 'bg-amber-400 text-white'
                                  : 'bg-green-400 text-white'
                              }`}>
                                {totalSlots >= faculty.maxHoursPerWeek ? '🔴 Full' : totalSlots >= faculty.maxHoursPerWeek * 0.7 ? '🟡 Busy' : '🟢 Available'}
                              </div>
                            </div>
                          </div>
                          {/* Grid view with all merged slots */}
                          <GridView slots={allFacultySlots} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty state for grid/list view */}
          {viewMode !== 'faculty' && !selectedTimetable && (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No timetable selected</p>
                <p className="text-xs mt-1">Generate a timetable first</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

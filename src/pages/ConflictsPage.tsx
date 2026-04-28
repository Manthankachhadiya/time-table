import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Filter, Shield, Users, Building2, Clock, BarChart2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Conflict } from '../utils/types';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Faculty: <Users className="w-4 h-4" />,
  Classroom: <Building2 className="w-4 h-4" />,
  Overload: <Clock className="w-4 h-4" />,
  Availability: <BarChart2 className="w-4 h-4" />,
};

const SEVERITY_STYLES: Record<string, { card: string; badge: string; icon: string }> = {
  High: { card: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
  Medium: { card: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  Low: { card: 'border-blue-200 bg-blue-50', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500' },
};

export default function ConflictsPage() {
  const { timetables, resolveConflict } = useStore();
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  const allConflictsWithTT: Array<Conflict & { timetableId: string; timetableName: string }> = timetables.flatMap(t =>
    t.conflicts.map(c => ({ ...c, timetableId: t.id, timetableName: t.name }))
  );

  const filtered = allConflictsWithTT.filter(c =>
    (!filterSeverity || c.severity === filterSeverity) &&
    (!filterType || c.type === filterType) &&
    (showResolved || !c.resolved)
  );

  const stats = {
    total: allConflictsWithTT.length,
    high: allConflictsWithTT.filter(c => c.severity === 'High' && !c.resolved).length,
    medium: allConflictsWithTT.filter(c => c.severity === 'Medium' && !c.resolved).length,
    low: allConflictsWithTT.filter(c => c.severity === 'Low' && !c.resolved).length,
    resolved: allConflictsWithTT.filter(c => c.resolved).length,
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Conflict Detection & Resolution</h2>
          <p className="text-sm text-gray-500">Automatically detected scheduling conflicts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Auto-detection Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'High Severity', value: stats.high, color: 'bg-red-500', textColor: 'text-red-600', bg: 'bg-red-50 border-red-200' },
          { label: 'Medium Severity', value: stats.medium, color: 'bg-amber-500', textColor: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Low Severity', value: stats.low, color: 'bg-blue-500', textColor: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Resolved', value: stats.resolved, color: 'bg-green-500', textColor: 'text-green-600', bg: 'bg-green-50 border-green-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-3xl font-black ${s.textColor}`}>{s.value}</p>
            <p className={`text-xs font-medium ${s.textColor} mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-xl border border-gray-200">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Severities</option>
          {['High', 'Medium', 'Low'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Types</option>
          {['Faculty', 'Classroom', 'Overload', 'Availability'].map(t => <option key={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-2 cursor-pointer ml-auto">
          <input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
          <span className="text-sm text-gray-600">Show Resolved</span>
        </label>
      </div>

      {/* Conflict List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">No conflicts found!</h3>
            <p className="text-sm text-gray-500 mt-1">All scheduling constraints are satisfied.</p>
          </div>
        ) : (
          filtered.map(conflict => {
            const styles = SEVERITY_STYLES[conflict.severity];
            return (
              <div key={conflict.id} className={`rounded-xl border-2 p-4 ${styles.card} ${conflict.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${styles.icon}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${styles.badge}`}>
                          {TYPE_ICONS[conflict.type]}
                          {conflict.type} Conflict
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${styles.badge}`}>
                          {conflict.severity} Severity
                        </span>
                        {conflict.resolved && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-2">{conflict.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        In: <span className="font-medium text-gray-700">{conflict.timetableName}</span>
                        {conflict.affectedSlots.length > 0 && ` • ${conflict.affectedSlots.length} slot(s) affected`}
                      </p>
                    </div>
                  </div>

                  {!conflict.resolved && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => resolveConflict(conflict.timetableId, conflict.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Auto-Fix
                      </button>
                    </div>
                  )}
                </div>

                {/* Resolution suggestions */}
                {!conflict.resolved && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Suggested Resolution:</p>
                    <p className="text-xs text-gray-600">
                      {conflict.type === 'Faculty' && 'Reassign one of the overlapping sessions to a different time slot or faculty member.'}
                      {conflict.type === 'Classroom' && 'Book an alternative classroom for one of the conflicting sessions.'}
                      {conflict.type === 'Overload' && 'Redistribute some sessions to another available faculty member.'}
                      {conflict.type === 'Availability' && 'Move the session to a time slot when the faculty is available.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

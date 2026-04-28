import React from 'react';
import { History, Clock, User, ArrowRight, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

const ACTION_STYLES: Record<string, string> = {
  'Slot Moved': 'bg-blue-100 text-blue-700',
  'Faculty Changed': 'bg-purple-100 text-purple-700',
  'Classroom Reassigned': 'bg-cyan-100 text-cyan-700',
  'Conflict Resolved': 'bg-green-100 text-green-700',
  'Subject Added': 'bg-amber-100 text-amber-700',
  'Subject Removed': 'bg-red-100 text-red-700',
};

export default function ChangeHistoryPage() {
  const { changeHistory, timetables } = useStore();

  const grouped = changeHistory.reduce((acc, entry) => {
    const date = entry.timestamp.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof changeHistory>);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Change History</h2>
          <p className="text-sm text-gray-500">{changeHistory.length} total changes tracked</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-700">
          <History className="w-4 h-4" />
          <span className="font-medium">Audit Log Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Slot Moves', value: changeHistory.filter(c => c.action === 'Slot Moved').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Faculty Changes', value: changeHistory.filter(c => c.action === 'Faculty Changed').length, color: 'bg-purple-50 border-purple-200 text-purple-700' },
          { label: 'Room Changes', value: changeHistory.filter(c => c.action === 'Classroom Reassigned').length, color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
          { label: 'Resolved', value: changeHistory.filter(c => c.action === 'Conflict Resolved').length, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {format(new Date(date), 'MMMM d, yyyy')}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-3">
              {entries.map(entry => {
                const timetable = timetables.find(t => t.id === entry.timetableId);
                const actionStyle = ACTION_STYLES[entry.action] || 'bg-gray-100 text-gray-700';
                return (
                  <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <History className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${actionStyle}`}>
                            {entry.action}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span className="font-medium">{entry.user}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(entry.timestamp), 'HH:mm')}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1.5">
                          Timetable: <span className="font-medium text-gray-700">{timetable?.name || entry.timetableId}</span>
                        </p>

                        {/* Before / After */}
                        {(Object.keys(entry.before).length > 0 || Object.keys(entry.after).length > 0) && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <div className="bg-red-50 border border-red-100 rounded-lg px-2 py-1 text-red-700 max-w-xs truncate">
                              {Object.entries(entry.before).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="bg-green-50 border border-green-100 rounded-lg px-2 py-1 text-green-700 max-w-xs truncate">
                              {Object.entries(entry.after).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {changeHistory.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">No changes yet</h3>
            <p className="text-sm text-gray-500 mt-1">All timetable modifications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

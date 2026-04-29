import React from 'react';
import { TimetableSlot } from '../../utils/types';
import { DAYS, TIME_SLOTS, SESSION_COLORS } from '../../utils/constants';

interface GridViewProps {
  slots: TimetableSlot[];
  filterFaculty?: string;
  filterDepartment?: string;
  filterSemester?: string;
  filterDivision?: string;
}

export default function GridView({ slots, filterFaculty, filterDepartment, filterSemester, filterDivision }: GridViewProps) {
  const filteredSlots = slots.filter(s => {
    if (filterFaculty && s.facultyId !== filterFaculty) return false;
    if (filterDepartment && s.department !== filterDepartment) return false;
    if (filterSemester && s.semester !== filterSemester) return false;
    if (filterDivision && s.division !== filterDivision) return false;
    return true;
  });

  const getSlots = (day: string, time: string) =>
    filteredSlots.filter(s => s.day === day && s.timeSlot === time);

  const isBreakTime = (time: string) => time === '12:00 - 13:00';

  // Build cell content:
  // Lab period = all lab-batch slots in this cell (different batches, different subjects, same time)
  // Each is shown as: [Batch] → [Subject Code] · [Room]
  const buildCellContent = (daySlots: TimetableSlot[]) => {
    // Lab-batch slots (non-continuation only — one row per batch per period)
    const labPeriodSlots = daySlots
      .filter(s => s.type === 'Lab' && s.batch && !s.isLabContinuation)
      .sort((a, b) => (a.batch ?? '').localeCompare(b.batch ?? ''));

    // Regular lectures/tutorials (no batch tag)
    const regularSlots = daySlots.filter(s => !(s.type === 'Lab' && s.batch) && !s.isLabContinuation);

    return { labPeriodSlots, regularSlots };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[900px]">
        <thead>
          <tr>
            <th className="bg-gray-100 border border-gray-200 p-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32 rounded-tl-lg">
              Time / Day
            </th>
            {DAYS.map(day => (
              <th key={day} className="bg-gray-100 border border-gray-200 p-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time, ti) => (
            <tr key={time} className={isBreakTime(time) ? 'bg-amber-50' : ti % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <td className={`border border-gray-200 p-2 text-xs font-semibold whitespace-nowrap ${isBreakTime(time) ? 'text-amber-700 bg-amber-50' : 'text-gray-500 bg-gray-50'}`}>
                {isBreakTime(time) && <div className="text-amber-500 font-bold text-center text-xs mb-0.5">🍽 BREAK</div>}
                <div className="text-center">{time}</div>
              </td>

              {DAYS.map(day => {
                const daySlots = getSlots(day, time);
                if (isBreakTime(time)) {
                  return <td key={day} className="border border-gray-200 bg-amber-50 text-center text-xs text-amber-600 italic">Break</td>;
                }

                const { labPeriodSlots, regularSlots } = buildCellContent(daySlots);
                const hasContent = labPeriodSlots.length > 0 || regularSlots.length > 0;

                return (
                  <td key={day} className="border border-gray-200 p-1 align-top min-w-[150px]">
                    {hasContent ? (
                      <div className="flex flex-col gap-1">

                        {/* ── Lab Period Card ── */}
                        {labPeriodSlots.length > 0 && (
                          <div className="rounded-lg border border-purple-300 bg-purple-50 p-1.5 cursor-pointer hover:shadow-md transition-all">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white">🔬 Lab Period</span>
                              <span className="text-xs text-purple-500 font-medium">{labPeriodSlots.length} batches</span>
                            </div>

                            {/* Each batch row: Batch → Subject · Room */}
                            <div className="flex flex-col gap-0.5">
                              {labPeriodSlots.map(s => (
                                <div key={s.id} className="flex items-center gap-1 bg-white/70 rounded px-1.5 py-1 border border-purple-100">
                                  {/* Batch badge */}
                                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full w-7 text-center flex-shrink-0">
                                    {s.batch}
                                  </span>
                                  {/* Subject code */}
                                  <span className="text-xs font-semibold text-gray-800 flex-shrink-0">{s.subjectCode}</span>
                                  {/* Faculty */}
                                  <span className="text-xs text-gray-500 flex-shrink-0">{s.facultyName.split(' ').slice(-1)[0]}</span>
                                  {/* Room (push to right) */}
                                  <span className="text-xs text-purple-600 ml-auto font-medium flex-shrink-0">{s.classroomName}</span>
                                </div>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-1 mt-1.5">
                              <span className="text-xs bg-white/60 px-1 rounded">{labPeriodSlots[0].semester}</span>
                              <span className="text-xs bg-white/60 px-1 rounded">Div {labPeriodSlots[0].division}</span>
                            </div>
                          </div>
                        )}

                        {/* ── Regular Lecture / Tutorial ── */}
                        {regularSlots.map(slot => (
                          <div key={slot.id} className={`rounded-lg border p-1.5 cursor-pointer hover:shadow-md transition-all duration-150 ${SESSION_COLORS[slot.type]}`}>
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                slot.type === 'Lecture' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                              }`}>{slot.type[0]}</span>
                              <span className="text-xs text-gray-500">{slot.subjectCode}</span>
                            </div>
                            <p className="text-xs font-bold leading-tight line-clamp-1">{slot.subjectName}</p>
                            <p className="text-xs text-gray-600 mt-0.5 truncate">{slot.facultyName.split(' ').slice(-1)[0]}</p>
                            <p className="text-xs text-gray-500 truncate">{slot.classroomName}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs bg-white/60 px-1 rounded">{slot.semester}</span>
                              <span className="text-xs bg-white/60 px-1 rounded">Div {slot.division}</span>
                            </div>
                          </div>
                        ))}

                      </div>
                    ) : (
                      <div className="h-full min-h-[4rem] flex items-center justify-center rounded-lg border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                        <span className="text-gray-300 text-xs group-hover:text-indigo-400">+ Add</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

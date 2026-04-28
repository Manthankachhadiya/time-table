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

  const getSlot = (day: string, time: string) =>
    filteredSlots.find(s => s.day === day && s.timeSlot === time);

  const isBreakTime = (time: string) => time === '12:00 - 13:00';

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
                const slot = getSlot(day, time);
                if (isBreakTime(time)) {
                  return <td key={day} className="border border-gray-200 bg-amber-50 text-center text-xs text-amber-600 italic">Break</td>;
                }
                return (
                  <td key={day} className="border border-gray-200 p-1 align-top h-20 min-w-[140px]">
                    {slot ? (
                      <div className={`h-full rounded-lg border p-2 cursor-pointer hover:shadow-md transition-all duration-150 ${SESSION_COLORS[slot.type]} ${slot.isLabContinuation ? 'opacity-75 border-dashed' : ''}`}>
                        {!slot.isLabContinuation ? (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                slot.type === 'Lecture' ? 'bg-blue-500 text-white' :
                                slot.type === 'Lab' ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
                              }`}>{slot.type[0]}</span>
                              <span className="text-xs text-gray-500">{slot.subjectCode}</span>
                            </div>
                            <p className="text-xs font-bold leading-tight line-clamp-1">{slot.subjectName}</p>
                            <p className="text-xs text-gray-600 mt-0.5 truncate">{slot.facultyName.split(' ').slice(-1)[0]}</p>
                            <p className="text-xs text-gray-500 truncate">{slot.classroomName}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs bg-white/60 px-1 rounded">{slot.semester}</span>
                              <span className="text-xs bg-white/60 px-1 rounded">Div {slot.division}</span>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-xs text-center text-purple-600 font-medium">
                              ↓ Lab Cont.<br />
                              <span className="text-purple-400">{slot.subjectCode}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center rounded-lg border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
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

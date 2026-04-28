import React from 'react';
import { TimetableSlot } from '../../utils/types';
import { DAYS } from '../../utils/constants';
import { Clock, User, Building2, BookOpen } from 'lucide-react';

interface ListViewProps {
  slots: TimetableSlot[];
}

const TYPE_STYLES: Record<string, string> = {
  Lecture: 'bg-blue-100 text-blue-700 border-blue-200',
  Tutorial: 'bg-green-100 text-green-700 border-green-200',
  Lab: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function ListView({ slots }: ListViewProps) {
  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter(s => s.day === day).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    return acc;
  }, {} as Record<string, TimetableSlot[]>);

  return (
    <div className="space-y-4">
      {DAYS.map(day => {
        const daySlots = grouped[day];
        if (daySlots.length === 0) return null;
        return (
          <div key={day} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-white">{day}</h3>
              <span className="text-indigo-200 text-sm">{daySlots.filter(s => !s.isLabContinuation).length} sessions</span>
            </div>
            <div className="divide-y divide-gray-100">
              {daySlots.map(slot => (
                <div key={slot.id} className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors ${slot.isLabContinuation ? 'opacity-60' : ''}`}>
                  <div className="w-28 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{slot.timeSlot}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{slot.subjectName}</p>
                      <span className="text-xs text-gray-400">({slot.subjectCode})</span>
                      {slot.isLabContinuation && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">Cont.</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{slot.facultyName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Building2 className="w-3 h-3" />
                        <span>{slot.classroomName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${TYPE_STYLES[slot.type]}`}>{slot.type}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{slot.semester}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Div {slot.division}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

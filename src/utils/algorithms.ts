import { TimetableSlot, Faculty, Classroom, Conflict, Subject, Timetable } from './types';
import { TIME_SLOTS, DAYS } from './constants';

// Constraint Validator
export function validateConstraints(
  slots: TimetableSlot[],
  faculties: Faculty[],
  subjects: Subject[],
  classrooms: Classroom[]
): Conflict[] {
  const conflicts: Conflict[] = [];
  let conflictId = 1;

  // 1. Faculty double-booking detection
  const facultySlotMap: Record<string, string[]> = {};
  slots.forEach(slot => {
    const key = `${slot.facultyId}-${slot.day}-${slot.timeSlot}`;
    if (!facultySlotMap[key]) facultySlotMap[key] = [];
    facultySlotMap[key].push(slot.id);
  });
  Object.entries(facultySlotMap).forEach(([key, ids]) => {
    if (ids.length > 1) {
      const [facultyId, day, time] = key.split('-');
      const faculty = faculties.find(f => f.id === facultyId);
      conflicts.push({
        id: `con-${conflictId++}`,
        type: 'Faculty',
        severity: 'High',
        description: `${faculty?.name || facultyId} is double-booked on ${day} at ${time}`,
        affectedSlots: ids,
        resolved: false,
      });
    }
  });

  // 2. Classroom double-booking
  const classroomSlotMap: Record<string, string[]> = {};
  slots.forEach(slot => {
    const key = `${slot.classroomId}-${slot.day}-${slot.timeSlot}`;
    if (!classroomSlotMap[key]) classroomSlotMap[key] = [];
    classroomSlotMap[key].push(slot.id);
  });
  Object.entries(classroomSlotMap).forEach(([key, ids]) => {
    if (ids.length > 1) {
      const [classroomId, day, time] = key.split('-');
      const classroom = classrooms.find(c => c.id === classroomId);
      conflicts.push({
        id: `con-${conflictId++}`,
        type: 'Classroom',
        severity: 'High',
        description: `${classroom?.name || classroomId} is double-booked on ${day} at ${time}`,
        affectedSlots: ids,
        resolved: false,
      });
    }
  });

  // 3. Faculty availability check
  // ONLY check if the faculty has explicitly set availability constraints.
  // If availability array is empty, it means NO restrictions (available everywhere).
  slots.forEach(slot => {
    const faculty = faculties.find(f => f.id === slot.facultyId);
    if (faculty && faculty.availability.length > 0) {
      const dayAvailability = faculty.availability.find(a => a.day === slot.day);
      if (!dayAvailability || !dayAvailability.slots.includes(slot.timeSlot)) {
        conflicts.push({
          id: `con-${conflictId++}`,
          type: 'Availability',
          severity: 'Medium',
          description: `${faculty.name} is not available on ${slot.day} at ${slot.timeSlot}`,
          affectedSlots: [slot.id],
          resolved: false,
        });
      }
    }
  });

  // 4. Overload check
  faculties.forEach(faculty => {
    const facultySlots = slots.filter(s => s.facultyId === faculty.id && !s.isLabContinuation);
    const weeklyHours = facultySlots.length;
    if (weeklyHours > faculty.maxHoursPerWeek) {
      conflicts.push({
        id: `con-${conflictId++}`,
        type: 'Overload',
        severity: 'Medium',
        description: `${faculty.name} exceeds max weekly hours (${weeklyHours}/${faculty.maxHoursPerWeek})`,
        affectedSlots: facultySlots.map(s => s.id),
        resolved: false,
      });
    }
  });

  return conflicts;
}

// Fitness Evaluator
export function evaluateFitness(slots: TimetableSlot[], conflicts: Conflict[]): number {
  let score = 100;

  // Deduct for unresolved conflicts
  const unresolvedHigh = conflicts.filter(c => !c.resolved && c.severity === 'High').length;
  const unresolvedMedium = conflicts.filter(c => !c.resolved && c.severity === 'Medium').length;
  const unresolvedLow = conflicts.filter(c => !c.resolved && c.severity === 'Low').length;

  score -= unresolvedHigh * 15;
  score -= unresolvedMedium * 7;
  score -= unresolvedLow * 3;

  // Check for idle gaps per faculty per day
  const facultyDaySlots: Record<string, string[]> = {};
  slots.forEach(slot => {
    const key = `${slot.facultyId}-${slot.day}`;
    if (!facultyDaySlots[key]) facultyDaySlots[key] = [];
    if (!facultyDaySlots[key].includes(slot.timeSlot)) {
      facultyDaySlots[key].push(slot.timeSlot);
    }
  });

  Object.values(facultyDaySlots).forEach(daySlots => {
    const sortedSlots = daySlots
      .map(s => TIME_SLOTS.indexOf(s))
      .filter(i => i >= 0)
      .sort((a, b) => a - b);

    for (let i = 1; i < sortedSlots.length; i++) {
      const gap = sortedSlots[i] - sortedSlots[i - 1] - 1;
      if (gap > 0) score -= gap * 2; // Penalty for idle gaps
    }
  });

  return Math.max(0, Math.min(100, score));
}

// Generate alternative timetable (shuffled version)
export function generateAlternativeTimetable(slots: TimetableSlot[]): TimetableSlot[] {
  const shuffled = [...slots];
  for (let i = 0; i < 3; i++) {
    const idx1 = Math.floor(Math.random() * shuffled.length);
    const idx2 = Math.floor(Math.random() * shuffled.length);
    if (shuffled[idx1].type !== 'Lab' && shuffled[idx2].type !== 'Lab') {
      const temp = { ...shuffled[idx1] };
      shuffled[idx1] = { ...shuffled[idx1], day: shuffled[idx2].day, timeSlot: shuffled[idx2].timeSlot };
      shuffled[idx2] = { ...shuffled[idx2], day: temp.day, timeSlot: temp.timeSlot };
    }
  }
  return shuffled;
}

export function getWorkloadData(slots: TimetableSlot[], faculties: Faculty[]) {
  return faculties.map(f => {
    const assigned = slots.filter(s => s.facultyId === f.id && !s.isLabContinuation).length;
    return {
      name: f.name.split(' ').slice(-1)[0],
      fullName: f.name,
      assigned,
      max: f.maxHoursPerWeek,
      percentage: Math.round((assigned / f.maxHoursPerWeek) * 100),
    };
  });
}

/**
 * Generate a REAL, compact timetable for a given department/semester/division.
 * 
 * - Fills the week compactly: Monday first, then Tuesday, etc.
 * - Time slots are filled top-to-bottom (morning to evening) per day.
 * - Labs are scheduled as contiguous 2-hour blocks.
 * - Cross-semester conflicts are prevented by checking existingTimetables.
 * - The same faculty won't be double-booked across different semester timetables.
 */
export function generateSchedule(
  subjects: Subject[],
  faculties: Faculty[],
  classrooms: Classroom[],
  config: { department: string; semester: string; division: string },
  existingTimetables: Timetable[] = []
): TimetableSlot[] {
  const slots: TimetableSlot[] = [];
  let slotId = 1;

  // Filter subjects for the selected department + semester + division
  const activeSubjects = subjects.filter(
    s =>
      s.department === config.department &&
      s.semester === config.semester &&
      s.division === config.division
  );

  if (activeSubjects.length === 0) return [];

  // ─── Build "already occupied" sets from existing timetables ───
  const occupiedFacultySlots = new Set<string>();
  const occupiedRoomSlots = new Set<string>();

  existingTimetables.forEach(tt => {
    // Skip timetables for the same semester+division (we're regenerating those)
    if (tt.semester === config.semester && tt.division === config.division && tt.department === config.department) {
      return;
    }
    tt.slots.forEach(slot => {
      occupiedFacultySlots.add(`${slot.facultyId}||${slot.day}||${slot.timeSlot}`);
      occupiedRoomSlots.add(`${slot.classroomId}||${slot.day}||${slot.timeSlot}`);
    });
  });

  // Working sets for this timetable
  const usedFacultySlots = new Set<string>(occupiedFacultySlots);
  const usedRoomSlots = new Set<string>(occupiedRoomSlots);
  const classSchedule = new Set<string>(); // this division's schedule (no two lectures at same time)

  const getKey = (a: string, b: string, c: string) => `${a}||${b}||${c}`;

  // Separate labs and lectures
  const labSubjects = activeSubjects.filter(s => s.type === 'Lab');
  const lectureSubjects = activeSubjects.filter(s => s.type !== 'Lab');

  // ─── Build the schedule grid: fill day-by-day, slot-by-slot ───
  // This creates a compact, realistic timetable

  // Create a pool of (subject, remaining hours) to schedule
  interface ScheduleItem { subject: Subject; remaining: number; }
  const lecturePool: ScheduleItem[] = lectureSubjects.map(s => ({ subject: s, remaining: s.hoursPerWeek }));
  
  // Shuffle the pool to get variation between different generated options
  for (let i = lecturePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lecturePool[i], lecturePool[j]] = [lecturePool[j], lecturePool[i]];
  }

  // Track how many times each subject is scheduled per day (max 1 per day ideally)
  const subjectDayCount: Record<string, number> = {};
  const getSubjectDayKey = (subId: string, day: string) => `${subId}||${day}`;

  // Helper to find an available room for a day+time
  const findRoom = (day: string, time: string): Classroom | null => {
    for (const room of classrooms) {
      if (!room.isAvailable) continue;
      if (!usedRoomSlots.has(getKey(room.id, day, time))) {
        return room;
      }
    }
    return null;
  };

  // Helper to check if a faculty is free at a given day+time
  const isFacultyFree = (facultyId: string, day: string, time: string): boolean => {
    return !usedFacultySlots.has(getKey(facultyId, day, time));
  };

  // Helper to check if the class (division) is free at a given day+time
  const isClassFree = (day: string, time: string): boolean => {
    return !classSchedule.has(getKey('class', day, time));
  };

  // Helper to add a slot
  const addSlot = (subject: Subject, day: string, time: string, room: Classroom, isLabCont: boolean = false) => {
    const facultyName = faculties.find(f => f.id === subject.facultyId)?.name || 'Unknown';
    slots.push({
      id: `gen-slot-${slotId++}`,
      day,
      timeSlot: time,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      facultyId: subject.facultyId,
      facultyName,
      classroomId: room.id,
      classroomName: room.name,
      type: subject.type,
      semester: config.semester as any,
      division: config.division as any,
      department: config.department as any,
      isLabContinuation: isLabCont,
    });
    usedFacultySlots.add(getKey(subject.facultyId, day, time));
    usedRoomSlots.add(getKey(room.id, day, time));
    classSchedule.add(getKey('class', day, time));
  };

  // ─── PASS 1: Schedule LAB sessions first (need 2 contiguous hours) ───
  const shuffledLabDays = [...DAYS].sort(() => Math.random() - 0.5);
  
  for (const labSubject of labSubjects) {
    let scheduled = false;

    for (const day of shuffledLabDays) {
      if (scheduled) break;

      // Look for contiguous time slot pairs
      for (let t = 0; t < TIME_SLOTS.length - 1; t++) {
        const time1 = TIME_SLOTS[t];
        const time2 = TIME_SLOTS[t + 1];

        if (
          isFacultyFree(labSubject.facultyId, day, time1) &&
          isFacultyFree(labSubject.facultyId, day, time2) &&
          isClassFree(day, time1) &&
          isClassFree(day, time2)
        ) {
          // Find a room available for BOTH slots
          let labRoom: Classroom | null = null;
          for (const room of classrooms) {
            if (!room.isAvailable) continue;
            if (
              !usedRoomSlots.has(getKey(room.id, day, time1)) &&
              !usedRoomSlots.has(getKey(room.id, day, time2))
            ) {
              labRoom = room;
              break;
            }
          }

          if (labRoom) {
            addSlot(labSubject, day, time1, labRoom, false);
            addSlot(labSubject, day, time2, labRoom, true);
            scheduled = true;
            break;
          }
        }
      }
    }
  }

  // ─── PASS 2: Spread lectures across the week (1 per subject per day) ───
  // Go day by day, slot by slot, and assign subjects that still need hours
  for (const day of DAYS) {
    for (const time of TIME_SLOTS) {
      if (!isClassFree(day, time)) continue; // already occupied (lab or other)

      // Find a subject that needs hours and hasn't been scheduled today yet
      const candidate = lecturePool.find(item => {
        if (item.remaining <= 0) return false;
        const dayKey = getSubjectDayKey(item.subject.id, day);
        if ((subjectDayCount[dayKey] || 0) >= 1) return false; // already has 1 lecture today
        if (!isFacultyFree(item.subject.facultyId, day, time)) return false;
        return true;
      });

      if (candidate) {
        const room = findRoom(day, time);
        if (room) {
          addSlot(candidate.subject, day, time, room);
          candidate.remaining--;
          const dayKey = getSubjectDayKey(candidate.subject.id, day);
          subjectDayCount[dayKey] = (subjectDayCount[dayKey] || 0) + 1;
        }
      }
    }
  }

  // ─── PASS 3: Fill remaining hours (some subjects may need 2nd lecture on same day) ───
  for (const day of DAYS) {
    for (const time of TIME_SLOTS) {
      if (!isClassFree(day, time)) continue;

      // Find any subject that still needs hours
      const candidate = lecturePool.find(item => {
        if (item.remaining <= 0) return false;
        if (!isFacultyFree(item.subject.facultyId, day, time)) return false;
        return true;
      });

      if (candidate) {
        const room = findRoom(day, time);
        if (room) {
          addSlot(candidate.subject, day, time, room);
          candidate.remaining--;
        }
      }
    }
  }

  // Sort slots chronologically
  slots.sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return TIME_SLOTS.indexOf(a.timeSlot) - TIME_SLOTS.indexOf(b.timeSlot);
  });

  return slots;
}

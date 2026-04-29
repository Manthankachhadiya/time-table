import { TimetableSlot, Faculty, Classroom, Conflict, Subject, Timetable, Batch } from './types';
import { TIME_SLOTS, DAYS, BATCHES_PER_DIVISION } from './constants';

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
  // NOTE: Lab-batch slots are EXCLUDED — multiple batches of the same lab can share
  // the same faculty in the same slot (different rooms). This is intentional and valid.
  const facultySlotMap: Record<string, string[]> = {};
  slots
    .filter(s => !(s.type === 'Lab' && s.batch)) // exclude lab-batch slots
    .forEach(slot => {
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

  const unresolvedHigh = conflicts.filter(c => !c.resolved && c.severity === 'High').length;
  const unresolvedMedium = conflicts.filter(c => !c.resolved && c.severity === 'Medium').length;
  const unresolvedLow = conflicts.filter(c => !c.resolved && c.severity === 'Low').length;

  score -= unresolvedHigh * 15;
  score -= unresolvedMedium * 7;
  score -= unresolvedLow * 3;

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
      if (gap > 0) score -= gap * 2;
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
 * Generate a timetable for a given department/semester/division.
 *
 * Lab model (matching real college timetable):
 *  - EVERY day has ONE 2-hour lab period at a DIFFERENT time slot
 *  - In each lab period: all 4 batches are in labs SIMULTANEOUSLY
 *  - Each batch does a DIFFERENT subject's lab that day (rotation)
 *  - Preferred lab times cycle: 15:30 → 13:15 → 10:45 → 15:30 → ...
 *
 * Lecture model:
 *  - Lectures fill remaining slots, max 1 per subject per day (Pass 1)
 *  - Remaining hours filled in Pass 2
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

  // Filter subjects for this department + semester + division
  const activeSubjects = subjects.filter(
    s =>
      s.department === config.department &&
      s.semester === config.semester &&
      s.division === config.division
  );

  if (activeSubjects.length === 0) return [];

  // ── Build "already occupied" sets from existing timetables ──────────────────
  const occupiedFacultySlots = new Set<string>();
  const occupiedRoomSlots = new Set<string>();

  existingTimetables.forEach(tt => {
    if (
      tt.semester === config.semester &&
      tt.division === config.division &&
      tt.department === config.department
    ) return;
    tt.slots.forEach(slot => {
      occupiedFacultySlots.add(`${slot.facultyId}||${slot.day}||${slot.timeSlot}`);
      occupiedRoomSlots.add(`${slot.classroomId}||${slot.day}||${slot.timeSlot}`);
    });
  });

  const usedFacultySlots = new Set<string>(occupiedFacultySlots);
  const usedRoomSlots    = new Set<string>(occupiedRoomSlots);
  const classSchedule    = new Set<string>(); // this division's occupied slots

  const getKey = (a: string, b: string, c: string) => `${a}||${b}||${c}`;

  const labSubjects     = activeSubjects.filter(s => s.type === 'Lab');
  const lectureSubjects = activeSubjects.filter(s => s.type !== 'Lab');

  interface ScheduleItem { subject: Subject; remaining: number; }
  const lecturePool: ScheduleItem[] = lectureSubjects.map(s => ({ subject: s, remaining: s.hoursPerWeek }));

  // Shuffle lecture pool for variety
  for (let i = lecturePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lecturePool[i], lecturePool[j]] = [lecturePool[j], lecturePool[i]];
  }

  const subjectDayCount: Record<string, number> = {};
  const getSubjectDayKey = (subId: string, day: string) => `${subId}||${day}`;

  const findRoom = (day: string, time: string): Classroom | null => {
    for (const room of classrooms) {
      if (!room.isAvailable) continue;
      if (!usedRoomSlots.has(getKey(room.id, day, time))) return room;
    }
    return null;
  };

  const isFacultyFree = (facultyId: string, day: string, time: string): boolean =>
    !usedFacultySlots.has(getKey(facultyId, day, time));

  const isClassFree = (day: string, time: string): boolean =>
    !classSchedule.has(getKey('class', day, time));

  // Helper to add a regular lecture/tutorial slot
  const addSlot = (subject: Subject, day: string, time: string, room: Classroom, isLabCont = false) => {
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

  // Helper to add a lab slot (with batch tag)
  const addLabSlot = (
    subject: Subject, day: string, time: string,
    room: Classroom, isLabCont: boolean, batch: Batch
  ) => {
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
      batch,
    });
    usedRoomSlots.add(getKey(room.id, day, time));
  };

  // ── PASS 1: Lab Rotation – one lab period per day ───────────────────────────
  //
  // Each day has a 2-hour lab period at a DIFFERENT time:
  //   Day 0 (Mon) → prefer slot index 4 (15:30–16:30 + 16:30–17:30)
  //   Day 1 (Tue) → prefer slot index 2 (13:15–14:15 + 14:15–15:15)
  //   Day 2 (Wed) → prefer slot index 0 (10:45–11:45 + 11:45–12:45)
  //   Day 3 (Thu) → prefer slot index 4
  //   Day 4 (Fri) → prefer slot index 2
  //   Day 5 (Sat) → prefer slot index 0
  //
  // Batch rotation: day D, batch[i] → labSubject[(i + D) % numLabs]

  const divisionBatches: string[] = BATCHES_PER_DIVISION[config.division]
    ?? [`${config.division}1`, `${config.division}2`, `${config.division}3`, `${config.division}4`];
  const numLabs = labSubjects.length;

  // Preferred starting slot index per day (cycles every 3 days)
  const preferredStartPerDay = [4, 2, 0, 4, 2, 0];
  const maxStart = TIME_SLOTS.length - 1; // max valid start index (needs t+1 to exist)

  DAYS.forEach((day, dayIndex) => {
    if (numLabs === 0) return;

    // Rotation assignment for this day
    const assignment = divisionBatches.map((batch, i) => ({
      batch,
      subject: labSubjects[(i + dayIndex) % numLabs],
    }));

    // Build ordered scan list starting from preferred time, wrapping around
    const startT = Math.min(preferredStartPerDay[dayIndex] ?? 0, maxStart - 1);
    const slotOrder: number[] = [];
    for (let i = 0; i < maxStart; i++) {
      slotOrder.push((startT + i) % maxStart);
    }

    for (const t of slotOrder) {
      const time1 = TIME_SLOTS[t];
      const time2 = TIME_SLOTS[t + 1];

      // Skip break slot pair (12:45 doesn't connect to 13:15 cleanly)
      if (!time1 || !time2) continue;

      // Division must be free in both slots
      if (!isClassFree(day, time1) || !isClassFree(day, time2)) continue;

      // ALL assigned faculty must be free in both slots
      const uniqueFacultyIds = [...new Set(assignment.map(a => a.subject.facultyId))];
      const allFacultyFree = uniqueFacultyIds.every(fId =>
        isFacultyFree(fId, day, time1) && isFacultyFree(fId, day, time2)
      );
      if (!allFacultyFree) continue;

      // Find one unique room per batch (all free in both slots)
      const takenRooms = new Set<string>();
      const roomAssignments: Classroom[] = [];
      for (const _a of assignment) {
        const room = classrooms.find(r =>
          r.isAvailable &&
          !takenRooms.has(r.id) &&
          !usedRoomSlots.has(getKey(r.id, day, time1)) &&
          !usedRoomSlots.has(getKey(r.id, day, time2))
        );
        if (!room) break;
        takenRooms.add(room.id);
        roomAssignments.push(room);
      }
      if (roomAssignments.length < assignment.length) continue;

      // ✅ Commit this day's lab period
      assignment.forEach((a, i) => {
        addLabSlot(a.subject, day, time1, roomAssignments[i], false, a.batch as Batch);
        addLabSlot(a.subject, day, time2, roomAssignments[i], true,  a.batch as Batch);
        usedFacultySlots.add(getKey(a.subject.facultyId, day, time1));
        usedFacultySlots.add(getKey(a.subject.facultyId, day, time2));
      });

      // Block the class schedule for this day's lab period
      classSchedule.add(getKey('class', day, time1));
      classSchedule.add(getKey('class', day, time2));
      break; // one lab period per day — move on
    }
  });

  // ── PASS 2: Lectures – max 1 per subject per day ────────────────────────────
  for (const day of DAYS) {
    for (const time of TIME_SLOTS) {
      if (!isClassFree(day, time)) continue;

      const candidate = lecturePool.find(item => {
        if (item.remaining <= 0) return false;
        const dayKey = getSubjectDayKey(item.subject.id, day);
        if ((subjectDayCount[dayKey] || 0) >= 1) return false;
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

  // ── PASS 3: Fill remaining lecture hours ────────────────────────────────────
  for (const day of DAYS) {
    for (const time of TIME_SLOTS) {
      if (!isClassFree(day, time)) continue;

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

  // Sort chronologically
  slots.sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return TIME_SLOTS.indexOf(a.timeSlot) - TIME_SLOTS.indexOf(b.timeSlot);
  });

  return slots;
}

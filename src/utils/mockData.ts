import { Faculty, Subject, Classroom, Timetable, TimetableSlot, ChangeHistory, Conflict } from './types';

export const mockFaculty: Faculty[] = [
  { id: 'f1', name: 'Prof. NBN', email: 'nbn@edu.ac.in', department: 'Information Technology', specialization: 'COA', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f2', name: 'Prof. DBV', email: 'dbv@edu.ac.in', department: 'Information Technology', specialization: 'COA', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f3', name: 'Prof. DKK', email: 'dkk@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f4', name: 'Prof. ADM', email: 'adm@edu.ac.in', department: 'Information Technology', specialization: 'OOP', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f5', name: 'Prof. PBT', email: 'pbt@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f6', name: 'Prof. SJV', email: 'sjv@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f7', name: 'Prof. BKB', email: 'bkb@edu.ac.in', department: 'Information Technology', specialization: 'CN', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f8', name: 'Prof. PMC', email: 'pmc@edu.ac.in', department: 'Information Technology', specialization: 'OOP', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f9', name: 'Prof. NSS', email: 'nss@edu.ac.in', department: 'Information Technology', specialization: 'CN', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f10', name: 'Prof. KVP', email: 'kvp@edu.ac.in', department: 'Information Technology', specialization: 'OS', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f11', name: 'Prof. SSC', email: 'ssc@edu.ac.in', department: 'Information Technology', specialization: 'COA', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f12', name: 'Prof. KGK', email: 'kgk@edu.ac.in', department: 'Information Technology', specialization: 'ESSRE', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f13', name: 'Prof. CHM', email: 'chm@edu.ac.in', department: 'Information Technology', specialization: 'OS', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f14', name: 'Prof. HNB', email: 'hnb@edu.ac.in', department: 'Information Technology', specialization: 'ESSRE', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f15', name: 'Prof. PHL', email: 'phl@edu.ac.in', department: 'Information Technology', specialization: 'ESSRE', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
  { id: 'f16', name: 'Prof. PBA', email: 'pba@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 25, currentLoad: 0, availability: [] },
];

export const mockSubjects: Subject[] = [
  // ==================== Sem 1 - Div A ====================
  { id: 's1-1', code: 'IT101', name: 'Mathematics-I', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's1-2', code: 'IT102', name: 'Physics', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's1-3', code: 'IT103', name: 'BEE', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's1-4', code: 'IT104', name: 'PPS', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's1-5', code: 'IT105', name: 'Engg. Graphics', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's1-6', code: 'IT106', name: 'Engg. Mechanics', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's1-7', code: 'IT107', name: 'PPS Lab', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },
  { id: 's1-8', code: 'IT108', name: 'Physics Lab', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },
  { id: 's1-9', code: 'IT109', name: 'Workshop', department: 'Information Technology', semester: 'Sem 1', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f16', requiresLab: true },

  // ==================== Sem 2 - Div A ====================
  { id: 's2-1', code: 'IT201', name: 'Mathematics-II', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's2-2', code: 'IT202', name: 'Chemistry', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f12', requiresLab: false },
  { id: 's2-3', code: 'IT203', name: 'EME', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's2-4', code: 'IT204', name: 'EG-II', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's2-5', code: 'IT205', name: 'Comm. Skills', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's2-6', code: 'IT206', name: 'Env. Studies', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's2-7', code: 'IT207', name: 'Chemistry Lab', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f12', requiresLab: true },
  { id: 's2-8', code: 'IT208', name: 'Workshop-II', department: 'Information Technology', semester: 'Sem 2', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f15', requiresLab: true },

  // ==================== Sem 3 - Div A ====================
  { id: 's3-1', code: 'IT301', name: 'DSA', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f4', requiresLab: false },
  { id: 's3-2', code: 'IT302', name: 'DBMS', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's3-3', code: 'IT303', name: 'Digital Logic', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's3-4', code: 'IT304', name: 'Mathematics-III', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's3-5', code: 'IT305', name: 'EVS', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f13', requiresLab: false },
  { id: 's3-6', code: 'IT306', name: 'Comm. Skills-II', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f16', requiresLab: false },
  { id: 's3-7', code: 'IT307', name: 'DSA Lab', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
  { id: 's3-8', code: 'IT308', name: 'DBMS Lab', department: 'Information Technology', semester: 'Sem 3', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f1', requiresLab: true },

  // ==================== Sem 4 - Div A ====================
  { id: 's4-1', code: 'IT401', name: 'COA', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's4-2', code: 'IT402', name: 'DM', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's4-3', code: 'IT403', name: 'OOP', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's4-4', code: 'IT404', name: 'CN', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's4-5', code: 'IT405', name: 'OS', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's4-6', code: 'IT406', name: 'ESSRE', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f12', requiresLab: false },
  { id: 's4-7', code: 'IT407', name: 'OOP Lab', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },
  { id: 's4-8', code: 'IT408', name: 'CN Lab', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f9', requiresLab: true },
  { id: 's4-9', code: 'IT409', name: 'COA Lab', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f11', requiresLab: true },
  { id: 's4-10', code: 'IT410', name: 'OS Lab', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f13', requiresLab: true },
  { id: 's4-11', code: 'IT411', name: 'DM Lab', department: 'Information Technology', semester: 'Sem 4', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f16', requiresLab: true },

  // ==================== Sem 5 - Div A ====================
  { id: 's5-1', code: 'IT501', name: 'Web Technology', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's5-2', code: 'IT502', name: 'Software Engg.', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's5-3', code: 'IT503', name: 'Java Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's5-4', code: 'IT504', name: 'Adv. DBMS', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's5-5', code: 'IT505', name: 'Python Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's5-6', code: 'IT506', name: 'Soft Computing', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f6', requiresLab: false },
  { id: 's5-7', code: 'IT507', name: 'Web Tech Lab', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f9', requiresLab: true },
  { id: 's5-8', code: 'IT508', name: 'Java Lab', department: 'Information Technology', semester: 'Sem 5', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },

  // ==================== Sem 6 - Div A ====================
  { id: 's6-1', code: 'IT601', name: 'AI', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's6-2', code: 'IT602', name: 'Cloud Computing', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's6-3', code: 'IT603', name: 'Info. Security', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's6-4', code: 'IT604', name: 'Compiler Design', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's6-5', code: 'IT605', name: 'IoT', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's6-6', code: 'IT606', name: 'Data Mining', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f3', requiresLab: false },
  { id: 's6-7', code: 'IT607', name: 'AI Lab', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f1', requiresLab: true },
  { id: 's6-8', code: 'IT608', name: 'IoT Lab', department: 'Information Technology', semester: 'Sem 6', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },

  // ==================== Sem 7 - Div A ====================
  { id: 's7-1', code: 'IT701', name: 'Machine Learning', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's7-2', code: 'IT702', name: 'Big Data', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's7-3', code: 'IT703', name: 'Blockchain', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's7-4', code: 'IT704', name: 'DevOps', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's7-5', code: 'IT705', name: 'Project Mgmt.', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's7-6', code: 'IT706', name: 'Adv. Networks', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's7-7', code: 'IT707', name: 'ML Lab', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f6', requiresLab: true },
  { id: 's7-8', code: 'IT708', name: 'DevOps Lab', department: 'Information Technology', semester: 'Sem 7', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f15', requiresLab: true },

  // ==================== Sem 8 - Div A ====================
  { id: 's8-1', code: 'IT801', name: 'Deep Learning', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's8-2', code: 'IT802', name: 'Cyber Security', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's8-3', code: 'IT803', name: 'NLP', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f3', requiresLab: false },
  { id: 's8-4', code: 'IT804', name: 'Cloud DevOps', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's8-5', code: 'IT805', name: 'Project Work', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f12', requiresLab: false },
  { id: 's8-6', code: 'IT806', name: 'Mobile App Dev', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's8-7', code: 'IT807', name: 'DL Lab', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f6', requiresLab: true },
  { id: 's8-8', code: 'IT808', name: 'Mobile App Lab', department: 'Information Technology', semester: 'Sem 8', division: 'A', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },

  // =====================================================
  // ============ DIVISION B — ALL SEMESTERS =============
  // =====================================================

  // ==================== Sem 1 - Div B ====================
  { id: 's1b-1', code: 'IT101', name: 'Mathematics-I', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's1b-2', code: 'IT102', name: 'Physics', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's1b-3', code: 'IT103', name: 'BEE', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f12', requiresLab: false },
  { id: 's1b-4', code: 'IT104', name: 'PPS', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's1b-5', code: 'IT105', name: 'Engg. Graphics', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's1b-6', code: 'IT106', name: 'Engg. Mechanics', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's1b-7', code: 'IT107', name: 'PPS Lab', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
  { id: 's1b-8', code: 'IT108', name: 'Physics Lab', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },
  { id: 's1b-9', code: 'IT109', name: 'Workshop', department: 'Information Technology', semester: 'Sem 1', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f11', requiresLab: true },

  // ==================== Sem 2 - Div B ====================
  { id: 's2b-1', code: 'IT201', name: 'Mathematics-II', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's2b-2', code: 'IT202', name: 'Chemistry', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's2b-3', code: 'IT203', name: 'EME', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f12', requiresLab: false },
  { id: 's2b-4', code: 'IT204', name: 'EG-II', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's2b-5', code: 'IT205', name: 'Comm. Skills', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's2b-6', code: 'IT206', name: 'Env. Studies', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's2b-7', code: 'IT207', name: 'Chemistry Lab', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f14', requiresLab: true },
  { id: 's2b-8', code: 'IT208', name: 'Workshop-II', department: 'Information Technology', semester: 'Sem 2', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f15', requiresLab: true },

  // ==================== Sem 3 - Div B ====================
  { id: 's3b-1', code: 'IT301', name: 'DSA', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f8', requiresLab: false },
  { id: 's3b-2', code: 'IT302', name: 'DBMS', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's3b-3', code: 'IT303', name: 'Digital Logic', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's3b-4', code: 'IT304', name: 'Mathematics-III', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's3b-5', code: 'IT305', name: 'EVS', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f13', requiresLab: false },
  { id: 's3b-6', code: 'IT306', name: 'Comm. Skills-II', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f16', requiresLab: false },
  { id: 's3b-7', code: 'IT307', name: 'DSA Lab', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },
  { id: 's3b-8', code: 'IT308', name: 'DBMS Lab', department: 'Information Technology', semester: 'Sem 3', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f2', requiresLab: true },

  // ==================== Sem 4 - Div B ====================
  { id: 's4b-1', code: 'IT401', name: 'COA', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's4b-2', code: 'IT402', name: 'DM', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f5', requiresLab: false },
  { id: 's4b-3', code: 'IT403', name: 'OOP', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's4b-4', code: 'IT404', name: 'CN', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's4b-5', code: 'IT405', name: 'OS', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's4b-6', code: 'IT406', name: 'ESSRE', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's4b-7', code: 'IT407', name: 'OOP Lab', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
  { id: 's4b-8', code: 'IT408', name: 'CN Lab', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f7', requiresLab: true },
  { id: 's4b-9', code: 'IT409', name: 'COA Lab', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f2', requiresLab: true },
  { id: 's4b-10', code: 'IT410', name: 'OS Lab', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f10', requiresLab: true },
  { id: 's4b-11', code: 'IT411', name: 'DM Lab', department: 'Information Technology', semester: 'Sem 4', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },

  // ==================== Sem 5 - Div B ====================
  { id: 's5b-1', code: 'IT501', name: 'Web Technology', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's5b-2', code: 'IT502', name: 'Software Engg.', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's5b-3', code: 'IT503', name: 'Java Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's5b-4', code: 'IT504', name: 'Adv. DBMS', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's5b-5', code: 'IT505', name: 'Python Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's5b-6', code: 'IT506', name: 'Soft Computing', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's5b-7', code: 'IT507', name: 'Web Tech Lab', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f9', requiresLab: true },
  { id: 's5b-8', code: 'IT508', name: 'Java Lab', department: 'Information Technology', semester: 'Sem 5', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },

  // ==================== Sem 6 - Div B ====================
  { id: 's6b-1', code: 'IT601', name: 'AI', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's6b-2', code: 'IT602', name: 'Cloud Computing', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's6b-3', code: 'IT603', name: 'Info. Security', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's6b-4', code: 'IT604', name: 'Compiler Design', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's6b-5', code: 'IT605', name: 'IoT', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's6b-6', code: 'IT606', name: 'Data Mining', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f6', requiresLab: false },
  { id: 's6b-7', code: 'IT607', name: 'AI Lab', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f1', requiresLab: true },
  { id: 's6b-8', code: 'IT608', name: 'IoT Lab', department: 'Information Technology', semester: 'Sem 6', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },

  // ==================== Sem 7 - Div B ====================
  { id: 's7b-1', code: 'IT701', name: 'Machine Learning', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's7b-2', code: 'IT702', name: 'Big Data', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's7b-3', code: 'IT703', name: 'Blockchain', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's7b-4', code: 'IT704', name: 'DevOps', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's7b-5', code: 'IT705', name: 'Project Mgmt.', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's7b-6', code: 'IT706', name: 'Adv. Networks', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's7b-7', code: 'IT707', name: 'ML Lab', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f6', requiresLab: true },
  { id: 's7b-8', code: 'IT708', name: 'DevOps Lab', department: 'Information Technology', semester: 'Sem 7', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f15', requiresLab: true },

  // ==================== Sem 8 - Div B ====================
  { id: 's8b-1', code: 'IT801', name: 'Deep Learning', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's8b-2', code: 'IT802', name: 'Cyber Security', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's8b-3', code: 'IT803', name: 'NLP', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f3', requiresLab: false },
  { id: 's8b-4', code: 'IT804', name: 'Cloud DevOps', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's8b-5', code: 'IT805', name: 'Project Work', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f12', requiresLab: false },
  { id: 's8b-6', code: 'IT806', name: 'Mobile App Dev', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's8b-7', code: 'IT807', name: 'DL Lab', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f6', requiresLab: true },
  { id: 's8b-8', code: 'IT808', name: 'Mobile App Lab', department: 'Information Technology', semester: 'Sem 8', division: 'B', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },


  // =====================================================
  // ============ DIVISION C — ALL SEMESTERS =============
  // =====================================================
  // ==================== Sem 1 - Div C ====================
  { id: 's1c-1', code: 'IT101', name: 'Mathematics-I', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f5', requiresLab: false },
  { id: 's1c-2', code: 'IT102', name: 'Physics', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's1c-3', code: 'IT103', name: 'BEE', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's1c-4', code: 'IT104', name: 'PPS', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's1c-5', code: 'IT105', name: 'Engg. Graphics', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's1c-6', code: 'IT106', name: 'Engg. Mechanics', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's1c-7', code: 'IT107', name: 'PPS Lab', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
  { id: 's1c-8', code: 'IT108', name: 'Physics Lab', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f14', requiresLab: true },
  { id: 's1c-9', code: 'IT109', name: 'Workshop', department: 'Information Technology', semester: 'Sem 1', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f11', requiresLab: true },

  // ==================== Sem 2 - Div C ====================
  { id: 's2c-1', code: 'IT201', name: 'Mathematics-II', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's2c-2', code: 'IT202', name: 'Chemistry', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f12', requiresLab: false },
  { id: 's2c-3', code: 'IT203', name: 'EME', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's2c-4', code: 'IT204', name: 'EG-II', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's2c-5', code: 'IT205', name: 'Comm. Skills', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's2c-6', code: 'IT206', name: 'Env. Studies', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's2c-7', code: 'IT207', name: 'Chemistry Lab', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f12', requiresLab: true },
  { id: 's2c-8', code: 'IT208', name: 'Workshop-II', department: 'Information Technology', semester: 'Sem 2', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f16', requiresLab: true },

  // ==================== Sem 3 - Div C ====================
  { id: 's3c-1', code: 'IT301', name: 'DSA', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f2', requiresLab: false },
  { id: 's3c-2', code: 'IT302', name: 'DBMS', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's3c-3', code: 'IT303', name: 'Digital Logic', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's3c-4', code: 'IT304', name: 'Mathematics-III', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f5', requiresLab: false },
  { id: 's3c-5', code: 'IT305', name: 'EVS', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f13', requiresLab: false },
  { id: 's3c-6', code: 'IT306', name: 'Comm. Skills-II', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f15', requiresLab: false },
  { id: 's3c-7', code: 'IT307', name: 'DSA Lab', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f2', requiresLab: true },
  { id: 's3c-8', code: 'IT308', name: 'DBMS Lab', department: 'Information Technology', semester: 'Sem 3', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f11', requiresLab: true },

  // ==================== Sem 4 - Div C ====================
  { id: 's4c-1', code: 'IT401', name: 'COA', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's4c-2', code: 'IT402', name: 'DM', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's4c-3', code: 'IT403', name: 'OOP', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's4c-4', code: 'IT404', name: 'CN', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's4c-5', code: 'IT405', name: 'OS', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's4c-6', code: 'IT406', name: 'ESSRE', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's4c-7', code: 'IT407', name: 'OOP Lab', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
  { id: 's4c-8', code: 'IT408', name: 'CN Lab', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f9', requiresLab: true },
  { id: 's4c-9', code: 'IT409', name: 'COA Lab', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f1', requiresLab: true },
  { id: 's4c-10', code: 'IT410', name: 'OS Lab', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f13', requiresLab: true },
  { id: 's4c-11', code: 'IT411', name: 'DM Lab', department: 'Information Technology', semester: 'Sem 4', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f3', requiresLab: true },

  // ==================== Sem 5 - Div C ====================
  { id: 's5c-1', code: 'IT501', name: 'Web Technology', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's5c-2', code: 'IT502', name: 'Software Engg.', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's5c-3', code: 'IT503', name: 'Java Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's5c-4', code: 'IT504', name: 'Adv. DBMS', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f6', requiresLab: false },
  { id: 's5c-5', code: 'IT505', name: 'Python Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's5c-6', code: 'IT506', name: 'Soft Computing', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's5c-7', code: 'IT507', name: 'Web Tech Lab', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f11', requiresLab: true },
  { id: 's5c-8', code: 'IT508', name: 'Java Lab', department: 'Information Technology', semester: 'Sem 5', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },

  // ==================== Sem 6 - Div C ====================
  { id: 's6c-1', code: 'IT601', name: 'AI', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's6c-2', code: 'IT602', name: 'Cloud Computing', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's6c-3', code: 'IT603', name: 'Info. Security', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's6c-4', code: 'IT604', name: 'Compiler Design', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's6c-5', code: 'IT605', name: 'IoT', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's6c-6', code: 'IT606', name: 'Data Mining', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f6', requiresLab: false },
  { id: 's6c-7', code: 'IT607', name: 'AI Lab', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f10', requiresLab: true },
  { id: 's6c-8', code: 'IT608', name: 'IoT Lab', department: 'Information Technology', semester: 'Sem 6', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },

  // ==================== Sem 7 - Div C ====================
  { id: 's7c-1', code: 'IT701', name: 'Machine Learning', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's7c-2', code: 'IT702', name: 'Big Data', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's7c-3', code: 'IT703', name: 'Blockchain', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's7c-4', code: 'IT704', name: 'DevOps', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's7c-5', code: 'IT705', name: 'Project Mgmt.', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's7c-6', code: 'IT706', name: 'Adv. Networks', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's7c-7', code: 'IT707', name: 'ML Lab', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f3', requiresLab: true },
  { id: 's7c-8', code: 'IT708', name: 'DevOps Lab', department: 'Information Technology', semester: 'Sem 7', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f14', requiresLab: true },

  // ==================== Sem 8 - Div C ====================
  { id: 's8c-1', code: 'IT801', name: 'Deep Learning', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f8', requiresLab: false },
  { id: 's8c-2', code: 'IT802', name: 'Cyber Security', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's8c-3', code: 'IT803', name: 'NLP', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f6', requiresLab: false },
  { id: 's8c-4', code: 'IT804', name: 'Cloud DevOps', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's8c-5', code: 'IT805', name: 'Project Work', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f12', requiresLab: false },
  { id: 's8c-6', code: 'IT806', name: 'Mobile App Dev', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's8c-7', code: 'IT807', name: 'DL Lab', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },
  { id: 's8c-8', code: 'IT808', name: 'Mobile App Lab', department: 'Information Technology', semester: 'Sem 8', division: 'C', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },


  // =====================================================
  // ============ DIVISION D — ALL SEMESTERS =============
  // =====================================================
  // ==================== Sem 1 - Div D ====================
  { id: 's1d-1', code: 'IT101', name: 'Mathematics-I', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's1d-2', code: 'IT102', name: 'Physics', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's1d-3', code: 'IT103', name: 'BEE', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's1d-4', code: 'IT104', name: 'PPS', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's1d-5', code: 'IT105', name: 'Engg. Graphics', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's1d-6', code: 'IT106', name: 'Engg. Mechanics', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's1d-7', code: 'IT107', name: 'PPS Lab', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },
  { id: 's1d-8', code: 'IT108', name: 'Physics Lab', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },
  { id: 's1d-9', code: 'IT109', name: 'Workshop', department: 'Information Technology', semester: 'Sem 1', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f15', requiresLab: true },

  // ==================== Sem 2 - Div D ====================
  { id: 's2d-1', code: 'IT201', name: 'Mathematics-II', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f3', requiresLab: false },
  { id: 's2d-2', code: 'IT202', name: 'Chemistry', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f12', requiresLab: false },
  { id: 's2d-3', code: 'IT203', name: 'EME', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's2d-4', code: 'IT204', name: 'EG-II', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's2d-5', code: 'IT205', name: 'Comm. Skills', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's2d-6', code: 'IT206', name: 'Env. Studies', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's2d-7', code: 'IT207', name: 'Chemistry Lab', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f12', requiresLab: true },
  { id: 's2d-8', code: 'IT208', name: 'Workshop-II', department: 'Information Technology', semester: 'Sem 2', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f14', requiresLab: true },

  // ==================== Sem 3 - Div D ====================
  { id: 's3d-1', code: 'IT301', name: 'DSA', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f4', requiresLab: false },
  { id: 's3d-2', code: 'IT302', name: 'DBMS', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's3d-3', code: 'IT303', name: 'Digital Logic', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's3d-4', code: 'IT304', name: 'Mathematics-III', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's3d-5', code: 'IT305', name: 'EVS', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f13', requiresLab: false },
  { id: 's3d-6', code: 'IT306', name: 'Comm. Skills-II', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lecture', hoursPerWeek: 3, facultyId: 'f16', requiresLab: false },
  { id: 's3d-7', code: 'IT307', name: 'DSA Lab', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
  { id: 's3d-8', code: 'IT308', name: 'DBMS Lab', department: 'Information Technology', semester: 'Sem 3', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f7', requiresLab: true },

  // ==================== Sem 4 - Div D ====================
  { id: 's4d-1', code: 'IT401', name: 'COA', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's4d-2', code: 'IT402', name: 'DM', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f5', requiresLab: false },
  { id: 's4d-3', code: 'IT403', name: 'OOP', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's4d-4', code: 'IT404', name: 'CN', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's4d-5', code: 'IT405', name: 'OS', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's4d-6', code: 'IT406', name: 'ESSRE', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's4d-7', code: 'IT407', name: 'OOP Lab', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },
  { id: 's4d-8', code: 'IT408', name: 'CN Lab', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f7', requiresLab: true },
  { id: 's4d-9', code: 'IT409', name: 'COA Lab', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f11', requiresLab: true },
  { id: 's4d-10', code: 'IT410', name: 'OS Lab', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f10', requiresLab: true },
  { id: 's4d-11', code: 'IT411', name: 'DM Lab', department: 'Information Technology', semester: 'Sem 4', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f16', requiresLab: true },

  // ==================== Sem 5 - Div D ====================
  { id: 's5d-1', code: 'IT501', name: 'Web Technology', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's5d-2', code: 'IT502', name: 'Software Engg.', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's5d-3', code: 'IT503', name: 'Java Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f8', requiresLab: false },
  { id: 's5d-4', code: 'IT504', name: 'Adv. DBMS', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f2', requiresLab: false },
  { id: 's5d-5', code: 'IT505', name: 'Python Prog.', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's5d-6', code: 'IT506', name: 'Soft Computing', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f6', requiresLab: false },
  { id: 's5d-7', code: 'IT507', name: 'Web Tech Lab', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f9', requiresLab: true },
  { id: 's5d-8', code: 'IT508', name: 'Java Lab', department: 'Information Technology', semester: 'Sem 5', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f8', requiresLab: true },

  // ==================== Sem 6 - Div D ====================
  { id: 's6d-1', code: 'IT601', name: 'AI', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f1', requiresLab: false },
  { id: 's6d-2', code: 'IT602', name: 'Cloud Computing', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's6d-3', code: 'IT603', name: 'Info. Security', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's6d-4', code: 'IT604', name: 'Compiler Design', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f11', requiresLab: false },
  { id: 's6d-5', code: 'IT605', name: 'IoT', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f5', requiresLab: false },
  { id: 's6d-6', code: 'IT606', name: 'Data Mining', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f3', requiresLab: false },
  { id: 's6d-7', code: 'IT607', name: 'AI Lab', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f1', requiresLab: true },
  { id: 's6d-8', code: 'IT608', name: 'IoT Lab', department: 'Information Technology', semester: 'Sem 6', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f5', requiresLab: true },

  // ==================== Sem 7 - Div D ====================
  { id: 's7d-1', code: 'IT701', name: 'Machine Learning', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's7d-2', code: 'IT702', name: 'Big Data', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f16', requiresLab: false },
  { id: 's7d-3', code: 'IT703', name: 'Blockchain', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f9', requiresLab: false },
  { id: 's7d-4', code: 'IT704', name: 'DevOps', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f15', requiresLab: false },
  { id: 's7d-5', code: 'IT705', name: 'Project Mgmt.', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f14', requiresLab: false },
  { id: 's7d-6', code: 'IT706', name: 'Adv. Networks', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f7', requiresLab: false },
  { id: 's7d-7', code: 'IT707', name: 'ML Lab', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f6', requiresLab: true },
  { id: 's7d-8', code: 'IT708', name: 'DevOps Lab', department: 'Information Technology', semester: 'Sem 7', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f15', requiresLab: true },

  // ==================== Sem 8 - Div D ====================
  { id: 's8d-1', code: 'IT801', name: 'Deep Learning', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f6', requiresLab: false },
  { id: 's8d-2', code: 'IT802', name: 'Cyber Security', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f13', requiresLab: false },
  { id: 's8d-3', code: 'IT803', name: 'NLP', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f3', requiresLab: false },
  { id: 's8d-4', code: 'IT804', name: 'Cloud DevOps', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f10', requiresLab: false },
  { id: 's8d-5', code: 'IT805', name: 'Project Work', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lecture', hoursPerWeek: 5, facultyId: 'f12', requiresLab: false },
  { id: 's8d-6', code: 'IT806', name: 'Mobile App Dev', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lecture', hoursPerWeek: 4, facultyId: 'f4', requiresLab: false },
  { id: 's8d-7', code: 'IT807', name: 'DL Lab', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f6', requiresLab: true },
  { id: 's8d-8', code: 'IT808', name: 'Mobile App Lab', department: 'Information Technology', semester: 'Sem 8', division: 'D', type: 'Lab', hoursPerWeek: 2, facultyId: 'f4', requiresLab: true },
];

export const mockClassrooms: Classroom[] = [
  { id: 'c1', name: 'Room 101', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c2', name: 'Room 102', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c3', name: 'Room 103', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c4', name: 'Room 105', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c5', name: 'Room 107', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c6', name: 'Room 201-B', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c7', name: 'Room 206', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c8', name: 'Room 207', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c9', name: 'Room B-119', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c10', name: 'Room B-113', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
  { id: 'c11', name: 'Room 118/LRC-104', capacity: 60, type: 'Lecture Hall', department: 'Information Technology', isAvailable: true, equipment: [] },
];

export const mockConflicts: Conflict[] = [];

// Start with no pre-generated timetables — user will generate them dynamically
export const mockTimetables: Timetable[] = [];

export const mockChangeHistory: ChangeHistory[] = [];

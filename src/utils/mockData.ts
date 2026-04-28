import { Faculty, Subject, Classroom, Timetable, TimetableSlot, ChangeHistory, Conflict } from './types';

export const mockFaculty: Faculty[] = [
  { id: 'f1', name: 'Prof. NBN', email: 'nbn@edu.ac.in', department: 'Information Technology', specialization: 'COA', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f2', name: 'Prof. DBV', email: 'dbv@edu.ac.in', department: 'Information Technology', specialization: 'COA', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f3', name: 'Prof. DKK', email: 'dkk@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f4', name: 'Prof. ADM', email: 'adm@edu.ac.in', department: 'Information Technology', specialization: 'OOP', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f5', name: 'Prof. PBT', email: 'pbt@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f6', name: 'Prof. SJV', email: 'sjv@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f7', name: 'Prof. BKB', email: 'bkb@edu.ac.in', department: 'Information Technology', specialization: 'CN', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f8', name: 'Prof. PMC', email: 'pmc@edu.ac.in', department: 'Information Technology', specialization: 'OOP', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f9', name: 'Prof. NSS', email: 'nss@edu.ac.in', department: 'Information Technology', specialization: 'CN', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f10', name: 'Prof. KVP', email: 'kvp@edu.ac.in', department: 'Information Technology', specialization: 'OS', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f11', name: 'Prof. SSC', email: 'ssc@edu.ac.in', department: 'Information Technology', specialization: 'COA', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f12', name: 'Prof. KGK', email: 'kgk@edu.ac.in', department: 'Information Technology', specialization: 'ESSRE', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f13', name: 'Prof. CHM', email: 'chm@edu.ac.in', department: 'Information Technology', specialization: 'OS', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f14', name: 'Prof. HNB', email: 'hnb@edu.ac.in', department: 'Information Technology', specialization: 'ESSRE', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f15', name: 'Prof. PHL', email: 'phl@edu.ac.in', department: 'Information Technology', specialization: 'ESSRE', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
  { id: 'f16', name: 'Prof. PBA', email: 'pba@edu.ac.in', department: 'Information Technology', specialization: 'DM', maxHoursPerWeek: 20, currentLoad: 10, availability: [] },
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

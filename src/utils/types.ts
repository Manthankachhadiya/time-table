export type SubjectType = 'Lecture' | 'Tutorial' | 'Lab';
export type Department = 'Computer Science' | 'Information Technology' | 'Electronics' | 'Mechanical' | 'Civil';
export type Semester = 'Sem 1' | 'Sem 2' | 'Sem 3' | 'Sem 4' | 'Sem 5' | 'Sem 6' | 'Sem 7' | 'Sem 8';
export type Division = 'A' | 'B' | 'C' | 'D';
export type Batch = 'A1' | 'A2' | 'A3' | 'A4' | 'B1' | 'B2' | 'B3' | 'B4' | 'C1' | 'C2' | 'C3' | 'C4' | 'D1' | 'D2' | 'D3' | 'D4';

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: Department;
  specialization: string;
  maxHoursPerWeek: number;
  availability: FacultyAvailability[];
  currentLoad: number;
}

export interface FacultyAvailability {
  day: string;
  slots: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: Department;
  semester: Semester;
  division: Division;
  type: SubjectType;
  hoursPerWeek: number;
  facultyId: string;
  requiresLab: boolean;
  labDuration?: number; // in hours (e.g., 2 or 3 for continuous)
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'Lecture Hall' | 'Lab' | 'Tutorial Room';
  department: Department;
  isAvailable: boolean;
  equipment: string[];
}

export interface TimetableSlot {
  id: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  classroomId: string;
  classroomName: string;
  type: SubjectType;
  semester: Semester;
  division: Division;
  department: Department;
  isLabContinuation?: boolean;
  batch?: Batch; // Only set for Lab sessions; undefined = all batches (lectures/tutorials)
}

export interface Timetable {
  id: string;
  name: string;
  version: number;
  semester: Semester;
  department: Department;
  division: Division;
  slots: TimetableSlot[];
  createdAt: string;
  status: 'Draft' | 'Active' | 'Archived';
  fitnessScore: number;
  conflicts: Conflict[];
}

export interface Conflict {
  id: string;
  type: 'Faculty' | 'Classroom' | 'Overload' | 'Availability';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  affectedSlots: string[];
  resolved: boolean;
}

export interface ChangeHistory {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  before: Partial<TimetableSlot>;
  after: Partial<TimetableSlot>;
  timetableId: string;
}

export interface DashboardStats {
  totalFaculty: number;
  totalSubjects: number;
  totalClassrooms: number;
  activeTimetables: number;
  conflictsDetected: number;
  conflictsResolved: number;
  avgFacultyLoad: number;
  schedulingEfficiency: number;
}

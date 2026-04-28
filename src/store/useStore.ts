import { create } from 'zustand';
import { Faculty, Subject, Classroom, Timetable, Conflict, ChangeHistory } from '../utils/types';
import { mockFaculty, mockSubjects, mockClassrooms, mockTimetables, mockChangeHistory } from '../utils/mockData';

interface AppState {
  // Auth
  currentUser: { name: string; role: 'Admin' | 'Coordinator' | 'Faculty' } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Data
  faculties: Faculty[];
  subjects: Subject[];
  classrooms: Classroom[];
  timetables: Timetable[];
  changeHistory: ChangeHistory[];
  selectedTimetableId: string | null;

  // Actions
  addFaculty: (faculty: Faculty) => void;
  updateFaculty: (id: string, data: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;

  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addClassroom: (classroom: Classroom) => void;
  updateClassroom: (id: string, data: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;

  setSelectedTimetable: (id: string | null) => void;
  updateTimetableStatus: (id: string, status: 'Draft' | 'Active' | 'Archived') => void;
  addTimetable: (timetable: Timetable) => void;
  resolveConflict: (timetableId: string, conflictId: string) => void;
  addChangeHistory: (entry: ChangeHistory) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  login: (email, password) => {
    const validUsers: Record<string, { name: string; role: 'Admin' | 'Coordinator' | 'Faculty' }> = {
      'admin@edu.ac.in': { name: 'Admin User', role: 'Admin' },
      'coordinator@edu.ac.in': { name: 'Dept. Coordinator', role: 'Coordinator' },
      'faculty@edu.ac.in': { name: 'Dr. Anita Sharma', role: 'Faculty' },
    };
    if (validUsers[email] && password === 'password123') {
      set({ currentUser: validUsers[email], isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null, isAuthenticated: false, activePage: 'dashboard' }),

  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  faculties: mockFaculty,
  subjects: mockSubjects,
  classrooms: mockClassrooms,
  timetables: mockTimetables,
  changeHistory: mockChangeHistory,
  selectedTimetableId: null,

  addFaculty: (faculty) => set(s => ({ faculties: [...s.faculties, faculty] })),
  updateFaculty: (id, data) => set(s => ({
    faculties: s.faculties.map(f => f.id === id ? { ...f, ...data } : f)
  })),
  deleteFaculty: (id) => set(s => ({ faculties: s.faculties.filter(f => f.id !== id) })),

  addSubject: (subject) => set(s => ({ subjects: [...s.subjects, subject] })),
  updateSubject: (id, data) => set(s => ({
    subjects: s.subjects.map(sub => sub.id === id ? { ...sub, ...data } : sub)
  })),
  deleteSubject: (id) => set(s => ({ subjects: s.subjects.filter(sub => sub.id !== id) })),

  addClassroom: (classroom) => set(s => ({ classrooms: [...s.classrooms, classroom] })),
  updateClassroom: (id, data) => set(s => ({
    classrooms: s.classrooms.map(c => c.id === id ? { ...c, ...data } : c)
  })),
  deleteClassroom: (id) => set(s => ({ classrooms: s.classrooms.filter(c => c.id !== id) })),

  setSelectedTimetable: (id) => set({ selectedTimetableId: id }),
  updateTimetableStatus: (id, status) => set(s => ({
    timetables: s.timetables.map(t => t.id === id ? { ...t, status } : t)
  })),
  addTimetable: (timetable) => set(s => ({ timetables: [...s.timetables, timetable] })),
  resolveConflict: (timetableId, conflictId) => set(s => ({
    timetables: s.timetables.map(t =>
      t.id === timetableId
        ? { ...t, conflicts: t.conflicts.map(c => c.id === conflictId ? { ...c, resolved: true } : c) }
        : t
    )
  })),
  addChangeHistory: (entry) => set(s => ({ changeHistory: [entry, ...s.changeHistory] })),
}));

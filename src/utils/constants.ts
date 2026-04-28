export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const TIME_SLOTS = [
  '10:45 - 11:45',
  '11:45 - 12:45',
  '13:15 - 14:15',
  '14:15 - 15:15',
  '15:30 - 16:30',
  '16:30 - 17:30'
];

export const SUBJECT_TYPES = ['Lecture', 'Tutorial', 'Lab'] as const;
export const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'] as const;
export const SEMESTERS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'] as const;
export const DIVISIONS = ['A', 'B'] as const;

export const SESSION_COLORS: Record<string, string> = {
  Lecture: 'bg-blue-100 text-blue-800 border-blue-300',
  Tutorial: 'bg-green-100 text-green-800 border-green-300',
  Lab: 'bg-purple-100 text-purple-800 border-purple-300',
};

export const SESSION_BADGE_COLORS: Record<string, string> = {
  Lecture: 'bg-blue-500',
  Tutorial: 'bg-green-500',
  Lab: 'bg-purple-500',
};

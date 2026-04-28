const mockData = require('./mockData.js');
const fs = require('fs');
const path = require('path');

const db = {
  faculties: mockData.mockFaculty,
  subjects: mockData.mockSubjects,
  classrooms: mockData.mockClassrooms,
  timetables: mockData.mockTimetables || [],
  conflicts: mockData.mockConflicts || [],
  history: mockData.mockChangeHistory || []
};

fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
console.log('Seed successful');

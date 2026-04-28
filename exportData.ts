import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockFaculty, mockSubjects, mockClassrooms, mockConflicts, mockTimetables, mockChangeHistory } from './src/utils/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  faculties: mockFaculty,
  subjects: mockSubjects,
  classrooms: mockClassrooms,
  timetables: mockTimetables,
  conflicts: mockConflicts,
  history: mockChangeHistory
};

const backendDataDir = path.join(__dirname, 'backend', 'data');
if (!fs.existsSync(backendDataDir)) {
  fs.mkdirSync(backendDataDir, { recursive: true });
}

fs.writeFileSync(path.join(backendDataDir, 'db.json'), JSON.stringify(data, null, 2));
console.log('Successfully created db.json from mockData.ts');

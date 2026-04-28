import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Initialize with some default structure if empty
let db = { faculties: [], subjects: [], classrooms: [], timetables: [], conflicts: [], history: [] };

// Load data
const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (err) {
      console.error('Error reading db.json', err);
    }
  } else {
    // Attempt to seed data if not found
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  }
};

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
};

loadData();

// --- API Endpoints ---

// Faculties
app.get('/api/faculties', (req, res) => res.json(db.faculties || []));
app.post('/api/faculties', (req, res) => {
  const newFaculty = { id: `f${Date.now()}`, ...req.body };
  db.faculties.push(newFaculty);
  saveData();
  res.status(201).json(newFaculty);
});
app.put('/api/faculties/:id', (req, res) => {
  const index = db.faculties.findIndex(f => f.id === req.params.id);
  if (index !== -1) {
    db.faculties[index] = { ...db.faculties[index], ...req.body };
    saveData();
    res.json(db.faculties[index]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});
app.delete('/api/faculties/:id', (req, res) => {
  db.faculties = db.faculties.filter(f => f.id !== req.params.id);
  saveData();
  res.status(204).end();
});

// Subjects
app.get('/api/subjects', (req, res) => res.json(db.subjects || []));
app.post('/api/subjects', (req, res) => {
  const newSubject = { id: `s${Date.now()}`, ...req.body };
  db.subjects.push(newSubject);
  saveData();
  res.status(201).json(newSubject);
});
app.put('/api/subjects/:id', (req, res) => {
  const index = db.subjects.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    db.subjects[index] = { ...db.subjects[index], ...req.body };
    saveData();
    res.json(db.subjects[index]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});
app.delete('/api/subjects/:id', (req, res) => {
  db.subjects = db.subjects.filter(s => s.id !== req.params.id);
  saveData();
  res.status(204).end();
});

// Classrooms
app.get('/api/classrooms', (req, res) => res.json(db.classrooms || []));

// Timetables
app.get('/api/timetables', (req, res) => res.json(db.timetables || []));
app.post('/api/timetables', (req, res) => {
  db.timetables = req.body;
  saveData();
  res.status(201).json(db.timetables);
});
app.post('/api/timetables/:id/save', (req, res) => {
  const index = db.timetables.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    db.timetables[index] = req.body;
  } else {
    db.timetables.push(req.body);
  }
  saveData();
  res.json(req.body);
});

// Replace all timetables
app.put('/api/timetables', (req, res) => {
  db.timetables = req.body;
  saveData();
  res.json(db.timetables);
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

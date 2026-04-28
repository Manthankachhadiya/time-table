import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, CheckCircle, AlertTriangle, Zap, Settings2, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEPARTMENTS, SEMESTERS, DIVISIONS } from '../utils/constants';
import { Timetable } from '../utils/types';
import { validateConstraints, evaluateFitness, generateSchedule } from '../utils/algorithms';

const ALGORITHM_OPTIONS = [
  { id: 'genetic', label: 'Genetic Algorithm', desc: 'Evolutionary optimization with crossover & mutation. Best for complex constraints.', badge: 'Recommended', color: 'border-indigo-500 bg-indigo-50' },
  { id: 'constraint', label: 'Constraint-Based CSP', desc: 'Systematic constraint satisfaction. Faster, deterministic results.', badge: 'Fast', color: 'border-green-500 bg-green-50' },
  { id: 'greedy', label: 'Greedy Heuristic', desc: 'Priority-based slot filling. Labs first, then lectures, then tutorials.', badge: 'Simple', color: 'border-amber-500 bg-amber-50' },
];

type GenerationStep = 'idle' | 'configuring' | 'generating' | 'done';

export default function TimetableGenerationPage() {
  const { subjects, faculties, classrooms, timetables, addTimetable, setActivePage } = useStore();

  const [step, setStep] = useState<GenerationStep>('idle');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('genetic');
  const [config, setConfig] = useState({ department: 'Information Technology', semester: 'Sem 1', division: 'A', numOptions: 2, maxIterations: 100, prioritizeLabs: true, balanceWorkload: true, minimizeGaps: true });
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [generatedTimetables, setGeneratedTimetables] = useState<Timetable[]>([]);

  const simulateGeneration = async () => {
    setStep('generating');
    setProgress(0);

    const msgs = [
      'Initializing population...',
      'Checking existing timetables for conflicts...',
      'Mapping faculty availability across semesters...',
      'Detecting hard constraints...',
      'Scheduling lab sessions (priority)...',
      'Assigning lecture slots...',
      'Running fitness evaluation...',
      'Resolving cross-semester conflicts...',
      'Optimizing workload distribution...',
      'Generating alternative options...',
      'Finalizing schedules...',
    ];

    for (let i = 0; i < msgs.length; i++) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
      setProgressMsg(msgs[i]);
      setProgress(Math.round(((i + 1) / msgs.length) * 100));
    }

    // Get the latest timetables from the store (includes previously generated ones)
    const currentTimetables = useStore.getState().timetables;

    const newTimetables: Timetable[] = [];
    
    for (let i = 0; i < config.numOptions; i++) {
      // Pass existing timetables so the algorithm avoids faculty/room conflicts
      const generatedSlots = generateSchedule(
        subjects, faculties, classrooms,
        { department: config.department, semester: config.semester, division: config.division },
        [...currentTimetables, ...newTimetables] // include previously generated options in this batch
      );

      const conflicts = validateConstraints(generatedSlots, faculties, subjects, classrooms);
      const fitnessScore = evaluateFitness(generatedSlots, conflicts);

      const id = `tt-gen-${Date.now()}-${i}`;
      const name = `${config.department} ${config.semester} – Div ${config.division} (Option ${i + 1})`;
      
      const finalSlots = generatedSlots.map(s => ({ ...s, id: `${s.id}-${id}` }));

      newTimetables.push({
        id, name, version: i + 1,
        semester: config.semester as any,
        department: config.department as any,
        division: config.division as any,
        slots: finalSlots,
        createdAt: new Date().toISOString(),
        status: 'Draft',
        fitnessScore,
        conflicts,
      });
    }

    newTimetables.forEach(t => addTimetable(t));
    setGeneratedTimetables(newTimetables);
    setStep('done');
  };

  const handleReset = () => {
    setStep('idle');
    setProgress(0);
    setProgressMsg('');
    setGeneratedTimetables([]);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Timetable Generation</h2>
          <p className="text-sm text-gray-500">Configure constraints and generate optimized schedules</p>
        </div>
        {step === 'done' && (
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> New Generation
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {[['1', 'Configure'], ['2', 'Algorithm'], ['3', 'Generate'], ['4', 'Review']].map(([num, label], i) => (
          <React.Fragment key={num}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              (step === 'idle' && i === 0) || (step === 'configuring' && i === 1) || (step === 'generating' && i === 2) || (step === 'done' && i === 3)
                ? 'bg-indigo-600 text-white' : i < (['idle','configuring','generating','done'].indexOf(step))
                ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="text-sm font-bold">{num}</span>
              <span className="text-sm font-medium hidden sm:block">{label}</span>
            </div>
            {i < 3 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />}
          </React.Fragment>
        ))}
      </div>

      {step !== 'generating' && step !== 'done' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Config Panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Schedule Configuration</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                  <select value={config.department} onChange={e => setConfig(c => ({ ...c, department: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                  <select value={config.semester} onChange={e => setConfig(c => ({ ...c, semester: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Division</label>
                  <select value={config.division} onChange={e => setConfig(c => ({ ...c, division: e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {DIVISIONS.map(d => <option key={d} value={d}>Div {d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Options to Generate</label>
                  <select value={config.numOptions} onChange={e => setConfig(c => ({ ...c, numOptions: +e.target.value }))} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {[1,2,3,5].map(n => <option key={n} value={n}>{n} Option{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Iterations: {config.maxIterations}</label>
                <input type="range" min="50" max="500" step="50" value={config.maxIterations} onChange={e => setConfig(c => ({ ...c, maxIterations: +e.target.value }))} className="w-full accent-indigo-600" />
                <div className="flex justify-between text-xs text-gray-400"><span>50 (Fast)</span><span>500 (Optimal)</span></div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">Optimization Goals</p>
                {[
                  ['prioritizeLabs', 'Prioritize Lab Sessions (Labs > Lectures > Tutorials)'],
                  ['balanceWorkload', 'Balance Faculty Workload Evenly'],
                  ['minimizeGaps', 'Minimize Idle Gaps in Schedules'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(config as any)[key]}
                      onChange={e => setConfig(c => ({ ...c, [key]: e.target.checked }))}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Scheduling Algorithm</h3>
            </div>
            <div className="space-y-3">
              {ALGORITHM_OPTIONS.map(algo => (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgorithm(algo.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAlgorithm === algo.id ? algo.color + ' border-2' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${selectedAlgorithm === algo.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`} />
                      <p className="font-semibold text-sm text-gray-900">{algo.label}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      algo.badge === 'Recommended' ? 'bg-indigo-100 text-indigo-700' :
                      algo.badge === 'Fast' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{algo.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">{algo.desc}</p>
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-600 mb-2">Input Summary</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center"><p className="text-lg font-bold text-indigo-600">{subjects.length}</p><p className="text-xs text-gray-500">Subjects</p></div>
                <div className="text-center"><p className="text-lg font-bold text-purple-600">{faculties.length}</p><p className="text-xs text-gray-500">Faculty</p></div>
                <div className="text-center"><p className="text-lg font-bold text-cyan-600">{classrooms.filter(c=>c.isAvailable).length}</p><p className="text-xs text-gray-500">Rooms</p></div>
              </div>
            </div>

            <button
              onClick={simulateGeneration}
              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <Play className="w-4 h-4" /> Generate {config.numOptions} Timetable Option{config.numOptions > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Generation Progress */}
      {step === 'generating' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cpu className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Generating Optimized Timetables</h3>
          <p className="text-sm text-gray-500 mb-6">Using {ALGORITHM_OPTIONS.find(a => a.id === selectedAlgorithm)?.label}</p>
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">{progressMsg}</span>
              <span className="font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs font-medium text-blue-700">Labs Scheduled</p>
                <p className="text-lg font-bold text-blue-600">{Math.min(subjects.filter(s=>s.type==='Lab').length, Math.round(progress / 25))}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs font-medium text-green-700">Conflicts</p>
                <p className="text-lg font-bold text-green-600">{Math.max(0, 5 - Math.round(progress / 25))}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <p className="text-xs font-medium text-purple-700">Iterations</p>
                <p className="text-lg font-bold text-purple-600">{Math.round(progress / 100 * config.maxIterations)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {step === 'done' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-semibold text-green-800">Generation Complete!</p>
              <p className="text-sm text-green-600">{generatedTimetables.length} timetable option{generatedTimetables.length > 1 ? 's' : ''} generated successfully.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedTimetables.map((tt, i) => (
              <div key={tt.id} className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-indigo-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Option {i + 1}</span>
                    <h4 className="font-bold text-gray-900 mt-1 text-sm">{tt.name}</h4>
                  </div>
                  <div className={`text-2xl font-black ${tt.fitnessScore >= 85 ? 'text-green-600' : tt.fitnessScore >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                    {tt.fitnessScore}%
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${tt.fitnessScore >= 85 ? 'bg-green-500' : tt.fitnessScore >= 70 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${tt.fitnessScore}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="font-bold text-gray-900">{tt.slots.filter(s=>!s.isLabContinuation).length}</p>
                    <p className="text-gray-500">Sessions</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className={`font-bold ${tt.conflicts.length === 0 ? 'text-green-600' : 'text-red-500'}`}>{tt.conflicts.filter(c=>!c.resolved).length}</p>
                    <p className="text-gray-500">Conflicts</p>
                  </div>
                </div>
                {tt.conflicts.filter(c=>!c.resolved).length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg mb-3">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {tt.conflicts.filter(c=>!c.resolved).length} conflict{tt.conflicts.filter(c=>!c.resolved).length>1?'s':''} detected
                  </div>
                )}
                <button
                  onClick={() => { useStore.getState().setSelectedTimetable(tt.id); setActivePage('timetable-view'); }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" /> View & Activate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

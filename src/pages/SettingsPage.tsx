import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Palette, Save, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    institutionName: 'National Institute of Technology',
    academicYear: '2024-2025',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slotsPerDay: 9,
    slotDuration: 60,
    breakTime: '12:00 - 13:00',
    emailNotifications: true,
    conflictAlerts: true,
    autoResolve: false,
    maxGenerationTime: 30,
    populationSize: 100,
    mutationRate: 0.1,
    theme: 'light',
    language: 'en',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (key: string) => setSettings(s => ({ ...s, [key]: !(s as any)[key] }));

  const sectionClass = "bg-white rounded-xl border border-gray-200 p-6";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
          <p className="text-sm text-gray-500">Configure institution and scheduling parameters</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          {saved ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      {/* Institution Settings */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Institution Configuration</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Institution Name</label>
            <input value={settings.institutionName} onChange={e => setSettings(s => ({ ...s, institutionName: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Academic Year</label>
            <input value={settings.academicYear} onChange={e => setSettings(s => ({ ...s, academicYear: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Break Time Slot</label>
            <input value={settings.breakTime} onChange={e => setSettings(s => ({ ...s, breakTime: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slot Duration (minutes)</label>
            <select value={settings.slotDuration} onChange={e => setSettings(s => ({ ...s, slotDuration: +e.target.value }))} className={inputClass}>
              {[45, 50, 60, 90].map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Working Days</label>
          <div className="flex gap-2 flex-wrap">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <label key={day} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${settings.workingDays.includes(day) ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                <input
                  type="checkbox"
                  checked={settings.workingDays.includes(day)}
                  onChange={() => setSettings(s => ({
                    ...s,
                    workingDays: s.workingDays.includes(day)
                      ? s.workingDays.filter(d => d !== day)
                      : [...s.workingDays, day]
                  }))}
                  className="sr-only"
                />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm Settings */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Algorithm Parameters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Max Generation Time (sec)</label>
            <input type="number" value={settings.maxGenerationTime} onChange={e => setSettings(s => ({ ...s, maxGenerationTime: +e.target.value }))} min="10" max="300" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Population Size</label>
            <input type="number" value={settings.populationSize} onChange={e => setSettings(s => ({ ...s, populationSize: +e.target.value }))} min="20" max="500" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mutation Rate: {(settings.mutationRate * 100).toFixed(0)}%</label>
            <input type="range" min="0.01" max="0.5" step="0.01" value={settings.mutationRate} onChange={e => setSettings(s => ({ ...s, mutationRate: +e.target.value }))} className="w-full accent-indigo-600 mt-2" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-bold text-amber-700 mb-1">Priority Order</p>
            <p className="text-xs text-amber-600">1. Labs (continuous slots) → 2. Lectures → 3. Tutorials</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-bold text-blue-700 mb-1">Constraints</p>
            <p className="text-xs text-blue-600">Faculty availability • Room capacity • No double-booking</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Notifications & Alerts</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email alerts for schedule changes' },
            { key: 'conflictAlerts', label: 'Conflict Alerts', desc: 'Real-time conflict detection notifications' },
            { key: 'autoResolve', label: 'Auto-Resolve Minor Conflicts', desc: 'Automatically fix low-severity conflicts' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(settings as any)[key] ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(settings as any)[key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Security & Access</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { role: 'Admin', perms: ['Generate', 'Edit', 'Delete', 'Approve', 'Export'], color: 'bg-red-50 border-red-200' },
            { role: 'Coordinator', perms: ['View', 'Edit', 'Export', 'Request Changes'], color: 'bg-amber-50 border-amber-200' },
            { role: 'Faculty', perms: ['View Own Schedule', 'Export'], color: 'bg-green-50 border-green-200' },
          ].map(({ role, perms, color }) => (
            <div key={role} className={`rounded-lg border p-3 ${color}`}>
              <p className="text-sm font-bold text-gray-800 mb-2">{role}</p>
              <div className="flex flex-wrap gap-1">
                {perms.map(p => (
                  <span key={p} className="text-xs bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Appearance</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Indigo (Default)', primary: 'bg-indigo-600', selected: true },
            { label: 'Blue', primary: 'bg-blue-600', selected: false },
            { label: 'Green', primary: 'bg-green-600', selected: false },
            { label: 'Purple', primary: 'bg-purple-600', selected: false },
          ].map(theme => (
            <button key={theme.label} className={`p-3 rounded-lg border-2 text-center transition-all ${theme.selected ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className={`w-8 h-8 ${theme.primary} rounded-lg mx-auto mb-2`} />
              <p className="text-xs text-gray-600 font-medium">{theme.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

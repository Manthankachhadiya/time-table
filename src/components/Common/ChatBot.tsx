import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// ─── Smart rule-based AI engine ───────────────────────────────────────────────
function generateBotResponse(input: string, storeState: ReturnType<typeof useStore.getState>): string {
  const q = input.toLowerCase().trim();
  const { timetables, faculties, subjects, classrooms } = storeState;
  const activeTimetables = timetables.filter(t => t.status === 'Active');

  // ─── Fuzzy faculty matcher ─────────────────────────────────────────────────
  // Matches names like "NBN sir", "prof. nbn", "nbn", "prof nbn", etc.
  const findFaculty = () => {
    // Strip common honorifics
    const cleaned = q.replace(/\b(prof\.?|professor|sir|ma'?am|dr\.?|mr\.?|ms\.?|mrs\.?)\b/g, '').trim();
    // Try matching any word from the cleaned query against faculty name tokens
    const queryWords = cleaned.split(/\s+/).filter(w => w.length >= 2);
    return faculties.find(f => {
      const nameWords = f.name.toLowerCase().split(/[\s.]+/).filter(w => w.length >= 2);
      return queryWords.some(qw => nameWords.some(nw => nw.includes(qw) || qw.includes(nw)));
    }) ?? null;
  };

  // Greeting
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste)/.test(q)) {
    return "Hello! 👋 I'm your Timetable Assistant. Ask me about schedules, faculty lectures, conflicts, rooms, batches, and more!";
  }

  // Active timetables
  if (/active timetable|currently active|which timetable/.test(q)) {
    if (activeTimetables.length === 0) return "No timetable is currently active. Please go to Timetable View and activate one.";
    return `Currently active timetables:\n${activeTimetables.map(t => `• ${t.name} (${t.semester}, Div ${t.division}) — Score: ${t.fitnessScore}%`).join('\n')}`;
  }

  // Conflicts
  if (/conflict|clash|overlap/.test(q)) {
    const total = timetables.flatMap(t => t.conflicts).filter(c => !c.resolved).length;
    if (total === 0) return "✅ Great news! There are currently no unresolved conflicts in any timetable.";
    const byTT = timetables
      .filter(t => t.conflicts.filter(c => !c.resolved).length > 0)
      .map(t => `• ${t.name}: ${t.conflicts.filter(c => !c.resolved).length} conflict(s)`)
      .join('\n');
    return `⚠️ There are ${total} unresolved conflict(s) across timetables:\n${byTT}\n\nGo to the Conflicts page to resolve them.`;
  }

  // ─── Lecture / lab COUNT queries ──────────────────────────────────────────
  // "how many lectures of NBN sir", "lecture count for prof dkk", "how many labs does nbn take"
  const isCountQuery = /how many|count|number of|total lecture|total lab|lecture.*sir|lab.*sir/.test(q);
  const isLectureQ = /lecture/.test(q) && !/lab/.test(q);
  const isLabQ = /\blab\b/.test(q) && !/lecture/.test(q);

  if (isCountQuery || /lecture|lab/.test(q)) {
    const matchedFaculty = findFaculty();
    if (matchedFaculty) {
      const allSlots = activeTimetables.flatMap(t =>
        t.slots.filter(s => s.facultyId === matchedFaculty.id && !s.isLabContinuation)
      );
      const lectures = allSlots.filter(s => s.type === 'Lecture');
      const labs = allSlots.filter(s => s.type === 'Lab');
      const tutorials = allSlots.filter(s => s.type === 'Tutorial');

      if (isLectureQ) {
        return `📊 ${matchedFaculty.name} has ${lectures.length} lecture session${lectures.length !== 1 ? 's' : ''} this week across active timetables.\n\nBreakdown:\n${lectures.length === 0 ? '  • No lectures scheduled' : lectures.map(s => `  • ${s.day} ${s.timeSlot}: ${s.subjectName} (${s.semester} Div ${s.division})`).join('\n')}`;
      }
      if (isLabQ) {
        return `🔬 ${matchedFaculty.name} has ${labs.length} lab session${labs.length !== 1 ? 's' : ''} this week.\n\n${labs.length === 0 ? 'No labs scheduled.' : labs.map(s => `• ${s.day} ${s.timeSlot}: ${s.subjectName} — Batch ${s.batch || 'All'}`).join('\n')}`;
      }
      // General faculty info with counts
      return `👨‍🏫 ${matchedFaculty.name}\n• Department: ${matchedFaculty.department}\n• Specialization: ${matchedFaculty.specialization}\n• Lectures this week: ${lectures.length}\n• Lab sessions: ${labs.length}\n• Tutorials: ${tutorials.length}\n• Total sessions: ${allSlots.length} / ${matchedFaculty.maxHoursPerWeek}h max\n• Status: ${allSlots.length >= matchedFaculty.maxHoursPerWeek ? '🔴 Fully loaded' : allSlots.length >= matchedFaculty.maxHoursPerWeek * 0.7 ? '🟡 Nearly full' : '🟢 Available capacity'}`;
    }
  }

  // ─── General faculty workload / info ──────────────────────────────────────
  if (/faculty|professor|teacher|workload|load|who teach|who take|who handles/.test(q) || findFaculty()) {
    const matchedFaculty = findFaculty();
    if (matchedFaculty) {
      const allSlots = activeTimetables.flatMap(t =>
        t.slots.filter(s => s.facultyId === matchedFaculty.id && !s.isLabContinuation)
      );
      const lectures = allSlots.filter(s => s.type === 'Lecture');
      const labs = allSlots.filter(s => s.type === 'Lab');
      const tutorials = allSlots.filter(s => s.type === 'Tutorial');
      return `👨‍🏫 ${matchedFaculty.name}\n• Department: ${matchedFaculty.department}\n• Specialization: ${matchedFaculty.specialization}\n• Lectures this week: ${lectures.length}\n• Lab sessions: ${labs.length}\n• Tutorials: ${tutorials.length}\n• Total sessions: ${allSlots.length} / ${matchedFaculty.maxHoursPerWeek}h max\n• Status: ${allSlots.length >= matchedFaculty.maxHoursPerWeek ? '🔴 Fully loaded' : allSlots.length >= matchedFaculty.maxHoursPerWeek * 0.7 ? '🟡 Nearly full' : '🟢 Available capacity'}`;
    }
    const overloaded = faculties.filter(f => {
      const load = activeTimetables.flatMap(t => t.slots.filter(s => s.facultyId === f.id && !s.isLabContinuation)).length;
      return load >= f.maxHoursPerWeek;
    });
    return `👥 Faculty Summary:\n• Total faculty: ${faculties.length}\n• Overloaded: ${overloaded.length > 0 ? overloaded.map(f => f.name).join(', ') : 'None'}\n\nAsk me about a specific faculty by name! E.g. "How many lectures does NBN sir have?"`;
  }

  // ─── Batch queries ─────────────────────────────────────────────────────────
  if (/batch|a1|a2|a3|a4|b1|b2|b3|b4/.test(q)) {
    const batchMatch = q.match(/\b([abcd][1-4])\b/i);
    if (batchMatch) {
      const batch = batchMatch[1].toUpperCase();
      const batchSlots = activeTimetables.flatMap(t =>
        t.slots.filter(s => s.batch === batch && !s.isLabContinuation)
      );
      if (batchSlots.length === 0) return `No lab sessions found for Batch ${batch} in active timetables.`;
      return `🔬 Batch ${batch} Lab Schedule:\n${batchSlots.map(s => `• ${s.day} ${s.timeSlot}: ${s.subjectName} (${s.semester} Div ${s.division}) — ${s.classroomName}`).join('\n')}`;
    }
    return "Each division has 4 batches (e.g., A1, A2, A3, A4). Labs are distributed — each batch has a separate lab slot. Ask me about a specific batch like 'A1 schedule'.";
  }

  // Rooms / classrooms
  if (/room|classroom|lab room|hall/.test(q)) {
    const available = classrooms.filter(c => c.isAvailable).length;
    return `🏫 Classroom Summary:\n• Total rooms: ${classrooms.length}\n• Available: ${available}\n• Lecture Halls: ${classrooms.filter(c => c.type === 'Lecture Hall').length}\n• Labs: ${classrooms.filter(c => (c.type as string).toLowerCase().includes('lab')).length}`;
  }

  // Subjects
  if (/subject|course|syllabus/.test(q)) {
    const semMatch = q.match(/sem\s*(\d)/i);
    const divMatch = q.match(/div(?:ision)?\s*([abcd])/i);
    let filtered = subjects;
    if (semMatch) filtered = filtered.filter(s => s.semester === `Sem ${semMatch[1]}`);
    if (divMatch) filtered = filtered.filter(s => s.division === divMatch[1].toUpperCase());
    if (filtered.length === 0) return "No subjects found for that filter. Try 'Sem 4 subjects' or 'Div A subjects'.";
    const lectures = filtered.filter(s => s.type === 'Lecture').length;
    const labs = filtered.filter(s => s.type === 'Lab').length;
    return `📚 Subjects${semMatch ? ` (Sem ${semMatch[1]})` : ''}${divMatch ? ` Div ${divMatch[1].toUpperCase()}` : ''}:\n• Total: ${filtered.length}\n• Lectures: ${lectures}\n• Labs: ${labs}\n\nSample subjects: ${filtered.slice(0, 3).map(s => s.name).join(', ')}${filtered.length > 3 ? ` and ${filtered.length - 3} more` : ''}`;
  }

  // Generate timetable help
  if (/generat|creat|make|build.*timetable/.test(q)) {
    return "🚀 To generate a timetable:\n1. Go to 'Generate Timetable' in the sidebar\n2. Select Department, Semester, and Division\n3. Choose an algorithm (Genetic Algorithm recommended)\n4. Click 'Generate'\n\nLabs are automatically split into 4 batches (e.g. A1–A4)!";
  }

  // Schedule / today
  if (/today|schedule|what.*class|when.*class/.test(q)) {
    if (activeTimetables.length === 0) return "No active timetable found. Please activate a timetable first in the Timetable View page.";
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todaySlots = activeTimetables.flatMap(t =>
      t.slots.filter(s => s.day === today && !s.isLabContinuation)
        .map(s => ({ ...s, ttName: `${t.semester} Div ${t.division}` }))
    );
    if (todaySlots.length === 0) return `📅 Today is ${today}. No classes scheduled today in the active timetables.`;
    return `📅 Today (${today}) — ${todaySlots.length} sessions:\n${todaySlots.slice(0, 6).map(s => `• ${s.timeSlot}: ${s.subjectName} [${(s as any).ttName}]${(s as any).batch ? ` (Batch ${(s as any).batch})` : ''}`).join('\n')}${todaySlots.length > 6 ? `\n...and ${todaySlots.length - 6} more` : ''}`;
  }

  // Stats / overview
  if (/stat|overview|summary|total|count|how many/.test(q)) {
    return `📊 System Overview:\n• Timetables: ${timetables.length} (${activeTimetables.length} active)\n• Faculty: ${faculties.length}\n• Subjects: ${subjects.length}\n• Classrooms: ${classrooms.length}\n• Unresolved Conflicts: ${timetables.flatMap(t => t.conflicts).filter(c => !c.resolved).length}`;
  }

  // Help
  if (/help|what can you|what do you|how to/.test(q)) {
    return "🤖 I can help with:\n• **Faculty sessions** — 'How many lectures does NBN sir have?'\n• **Lab batches** — 'A1 batch schedule'\n• **Active timetables** — 'which timetable is active?'\n• **Conflicts** — 'show me conflicts'\n• **Rooms** — 'available classrooms'\n• **Today's schedule** — 'what classes today?'\n• **Subjects** — 'Sem 4 subjects'\n• **Stats** — 'system overview'\n\nJust ask naturally — I understand faculty names, abbreviations, and more!";
  }

  // Last resort: check if there's a faculty name anywhere in the query
  const lastChanceFaculty = findFaculty();
  if (lastChanceFaculty) {
    const allSlots = activeTimetables.flatMap(t =>
      t.slots.filter(s => s.facultyId === lastChanceFaculty.id && !s.isLabContinuation)
    );
    return `👨‍🏫 ${lastChanceFaculty.name}\n• Specialization: ${lastChanceFaculty.specialization}\n• Total sessions this week: ${allSlots.length}\n• Lectures: ${allSlots.filter(s => s.type === 'Lecture').length}\n• Labs: ${allSlots.filter(s => s.type === 'Lab').length}\n• Tutorials: ${allSlots.filter(s => s.type === 'Tutorial').length}\n• Load: ${allSlots.length}/${lastChanceFaculty.maxHoursPerWeek}h`;
  }

  return "I'm not sure about that. Try asking:\n• 'How many lectures does NBN sir have this week?'\n• 'Show conflicts'\n• 'Today's schedule'\n• 'A2 batch labs'\n• Type 'help' to see all capabilities!";
}

// ─── Web Speech API types ──────────────────────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hello! 👋 I'm your AI Timetable Assistant. Ask me anything about schedules, faculty, conflicts, or rooms! You can also use the 🎤 button to speak.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const storeState = useStore.getState;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, minimized]);

  // Mark unread when closed and bot sends message
  useEffect(() => {
    if (!open) setHasUnread(true);
  }, [messages.length]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*•\n]/g, ' '));
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    // Try to pick a natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (preferred) utterance.voice = preferred;
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const responseText = generateBotResponse(text, storeState());
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'bot',
      text: responseText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
    speak(responseText);
  }, [speak, storeState]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognition.start();
  }, [isListening, sendMessage]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const openChat = () => {
    setOpen(true);
    setMinimized(false);
    setHasUnread(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          id="chatbot-toggle"
          onClick={openChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-all duration-200 z-50 group"
          title="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-bounce">
              1
            </span>
          )}
          <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            AI Assistant
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          id="chatbot-panel"
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${
            minimized ? 'h-14 w-72' : 'w-80 sm:w-96 h-[580px]'
          }`}
          style={{ maxHeight: 'calc(100vh - 6rem)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 flex-shrink-0 cursor-pointer" onClick={() => setMinimized(m => !m)}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-indigo-700 rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Timetable AI</p>
                <p className="text-indigo-200 text-xs">
                  {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Online • Ready to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                id="chatbot-voice-toggle"
                onClick={e => { e.stopPropagation(); isSpeaking ? stopSpeaking() : setVoiceEnabled(v => !v); }}
                className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
              </button>
              <button
                onClick={e => { e.stopPropagation(); setMinimized(m => !m); }}
                className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                id="chatbot-close"
                onClick={e => { e.stopPropagation(); setOpen(false); }}
                className="w-7 h-7 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Quick action chips */}
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex gap-1.5 overflow-x-auto flex-shrink-0 scrollbar-hide">
                {['Active timetables', 'Conflicts', 'NBN sir lectures', 'A1 batch labs', 'Today\'s schedule'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="flex-shrink-0 text-xs px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-full hover:bg-indigo-50 transition-colors font-medium shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${msg.role === 'bot' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-gray-600 to-gray-800'}`}>
                      {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm'
                          : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                <div className={`flex items-center gap-2 bg-gray-50 rounded-xl border-2 transition-colors ${isListening ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-indigo-400'}`}>
                  <input
                    ref={inputRef}
                    id="chatbot-input"
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? 'Listening... speak now' : 'Ask anything about timetables...'}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
                    disabled={isListening}
                  />
                  <div className="flex items-center gap-1 pr-1.5">
                    {/* Mic button */}
                    <button
                      id="chatbot-mic"
                      onClick={toggleVoiceInput}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-gray-200 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    {/* Send button */}
                    <button
                      id="chatbot-send"
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isTyping}
                      className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-1.5">
                  Powered by AI • {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

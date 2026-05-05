"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Flag, AlertTriangle, Clock } from 'lucide-react';

const TOTAL_QUESTIONS = 120;
const TOTAL_TIME = 120 * 60;

export default function LiveArena() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role || !['student', 'admin'].includes(role)) {
      router.replace('/auth/login');
    }
  }, []);
  
const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/questions?mockTestName=Grand Mock Test 1`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.data || []);
        setLoading(false);
      }).catch(err => {
        console.error('Fetch error', err);
        setLoading(false);
      });
  }, []);


  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false); // Data pehle se hai toh loading false
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reviewed, setReviewed] = useState<Record<number, boolean>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- DYNAMIC MARKS SCHEME ---
  const getMetaData = (idx: number) => {
    const q = idx + 1;
    if (q <= 50) return { name: "Mathematics", pos: 12, neg: 3, theme: "text-blue-600", bg: "bg-blue-100" };
    if (q <= 90) return { name: "Reasoning", pos: 6, neg: 1.5, theme: "text-orange-600", bg: "bg-orange-100" };
    if (q <= 110) return { name: "Computer Science", pos: 6, neg: 1.5, theme: "text-emerald-600", bg: "bg-emerald-100" };
    return { name: "General English", pos: 4, neg: 1, theme: "text-purple-600", bg: "bg-purple-100" };
  };

  const meta = getMetaData(currentIdx);
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="h-screen bg-slate-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* HEADER: NO USER INFO, ONLY TEST INFO */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-8 shadow-2xl z-50">
        <div className="flex items-center gap-4">
          <div className={`px-4 py-1.5 rounded-md ${meta.bg} ${meta.theme} text-[10px] font-black uppercase tracking-widest border-b-2 border-white/20`}>
            {meta.name}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-slate-800 px-5 py-2 rounded-lg border border-slate-700 flex items-center gap-3">
            <Clock size={18} className="text-blue-400" />
            <span className="font-mono text-xl font-bold tracking-tighter text-blue-50">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
          >
            Submit Exam
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* CENTER: QUESTION BOARD */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            
            {/* SCORE CARD */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-300 mb-4 shadow-sm">
              <div>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Current Question</span>
                <p className="text-2xl font-black text-slate-800">#{currentIdx + 1}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Correct</p>
                  <p className="text-emerald-600 text-lg font-black">+{meta.pos}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Negative</p>
                  <p className="text-red-500 text-lg font-black">-{meta.neg}</p>
                </div>
              </div>
            </div>

            {/* MAIN QUESTION */}
            <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden">
              <div className="p-10 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 leading-relaxed">
                  {questions[currentIdx]?.text}
                </h2>
              </div>

              {/* OPTIONS GRID */}
              <div className="p-8 bg-slate-50 space-y-3">
                {questions[currentIdx]?.options.map((opt, i) => (
                  <button 
                    key={i}
onClick={() => setAnswers({...answers, [currentIdx]: String.fromCharCode(65 + i) })}
                    className={`w-full flex items-center gap-5 p-5 rounded-xl border-2 transition-all text-left group ${
                      answers[currentIdx] === String.fromCharCode(65 + i)
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xl translate-x-2' 
                      : 'border-slate-300 bg-white hover:border-blue-400 text-slate-700'

                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                      answers[currentIdx] === String.fromCharCode(65 + i) ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'

                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-bold text-lg">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: NAVIGATION PANEL */}
        <aside className="w-80 bg-slate-100 border-l border-slate-300 flex flex-col">
          <div className="p-4 bg-slate-200 border-b border-slate-300 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Question Palette
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-2">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => {
              let style = "bg-white text-slate-400 border-slate-300";
              if (currentIdx === i) style = "bg-yellow-400 text-slate-900 border-yellow-600 ring-4 ring-yellow-100 scale-105 z-10 shadow-lg";
              else if (reviewed[i+1]) style = "bg-purple-600 text-white border-purple-800 shadow-md";
              else if (answers[i]) style = "bg-emerald-500 text-white border-emerald-700 shadow-md";

              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-11 rounded-lg text-xs font-black border-b-4 transition-all hover:-translate-y-1 ${style}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          
          {/* LEGEND SECTION */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Attempted</span>
              <span>{Object.keys(answers).length}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-600 rounded-full"></div> Reviewed</span>
              <span>{Object.keys(reviewed).length}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER ACTIONS */}
      <footer className="h-20 bg-white border-t-4 border-slate-300 flex items-center justify-between px-10 shadow-inner z-50">
        <div className="flex gap-4">
          <button 
            onClick={() => setAnswers({...answers, [currentIdx]: ""})}
            className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-black hover:bg-red-50 hover:text-red-600 border border-slate-300 transition-all"
          >
            CLEAR RESPONSE
          </button>
          <button 
            onClick={() => setReviewed(prev => ({ ...prev, [currentIdx+1]: !prev[currentIdx+1] }))}
            className={`px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2 border-b-4 transition-all ${
              reviewed[currentIdx+1] ? 'bg-purple-700 text-white border-purple-900 shadow-lg' : 'bg-slate-800 text-white border-slate-950 hover:bg-black'
            }`}
          >
            <Flag size={14} /> {reviewed[currentIdx+1] ? 'MARK REMOVED' : 'MARK FOR REVIEW'}
          </button>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentIdx(p => Math.max(0, p-1))}
            className="px-8 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-100 active:bg-slate-200"
          >
            PREVIOUS
          </button>
          <button 
            onClick={() => setCurrentIdx(p => Math.min(TOTAL_QUESTIONS - 1, p+1))}
            className="px-14 py-3 bg-blue-600 text-white rounded-xl text-xs font-black border-b-4 border-blue-900 hover:bg-blue-700 hover:shadow-xl active:border-b-0 transition-all flex items-center gap-2"
          >
            SAVE & NEXT <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      {/* CONFIRMATION POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full border-t-8 border-red-600 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-900">Are you sure?</h3>
            <p className="text-slate-500 text-center mt-3 font-medium">You have answered <span className="text-blue-600 font-bold">{Object.keys(answers).length}</span> out of 120 questions. No changes can be made after submission.</p>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-200 border-b-4 border-slate-300">BACK TO TEST</button>
              <button onClick={() => router.push('/exam/result')} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs hover:bg-red-700 border-b-4 border-red-900 shadow-lg">SUBMIT NOW</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
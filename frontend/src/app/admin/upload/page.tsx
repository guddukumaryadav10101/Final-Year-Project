"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Zap, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast'; 
import Sidebar from '../../../components/ui/Sidebar';

const BASE_URL = 'http://localhost:5000';

export default function AdminUpload() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [mockTestName, setMockTestName] = useState("NIMCET MOCK TEST - 01");
  const questionRefs = useRef([]);

  // Schema-compatible initial state
  const [manualQuestions, setManualQuestions] = useState(
    Array.from({ length: 120 }, (_, i) => ({
      questionNumber: i + 1,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
      section: i < 50 ? 'MATHEMATICS' : i < 90 ? 'ANALYTICAL' : i < 110 ? 'COMPUTER' : 'ENGLISH'
    }))
  );

  const handlePushToDB = async () => {
    // Logic: Only send fully completed questions
    const activeQuestions = manualQuestions.filter(q => 
      q.text.trim() !== "" && 
      q.options.every(opt => opt.trim() !== "")
    );
    
    if (activeQuestions.length === 0) return toast.error("Bhai, data toh bhariye!");

    setIsUploading(true);
    const loadingToast = toast.loading("Checking Schema & Deploying...");

    try {
      const res = await fetch(`${BASE_URL}/api/questions/bulk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-auth-token': localStorage.getItem('token') 
        },
        body: JSON.stringify({ 
          mockTestName, 
          questions: activeQuestions.map(q => ({
            mockTestName: mockTestName,
            questionNumber: Number(q.questionNumber),
            text: q.text.trim(),
            options: q.options.map(opt => opt.trim()), // Exactly 4 strings for Schema
            correctAnswer: q.correctAnswer.toUpperCase(), // Schema uppercase: true
            section: q.section, // MATHEMATICS, ANALYTICAL, COMPUTER, ENGLISH
            marks: { positive: 4, negative: 1 } 
          }))
        })
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("DB Match Success! 🎉", { id: loadingToast });
      } else {
        console.error("REJECTED_LOG:", result);
        toast.error(`Reject: ${result.msg || "Check Fields"}`, { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server Link Broken!", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070707] text-white selection:bg-yellow-500">
      <Toaster position="bottom-right" /> 
      <Sidebar />
      
      <div className="ml-64 flex-1 flex overflow-hidden">
        {/* LEFT SIDE: QUESTION FEED */}
        <div className="flex-1 p-6 overflow-y-auto h-screen custom-scrollbar">
          <header className="flex justify-between items-center mb-8 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 shadow-2xl">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight italic">NIMCET <span className="text-yellow-500">PRO</span></h1>
              <input 
                value={mockTestName}
                onChange={(e) => setMockTestName(e.target.value)}
                className="bg-transparent border-b border-zinc-800 text-xs text-zinc-500 outline-none mt-1 w-64 focus:border-yellow-500 transition-all font-bold"
                placeholder="MOCK NAME..."
              />
            </div>
            <button onClick={handlePushToDB} disabled={isUploading} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-yellow-400 transition-all">
              {isUploading ? <Loader2 className="animate-spin" size={18}/> : <><Zap size={18}/> DEPLOY</>}
            </button>
          </header>

          <div className="space-y-6 pb-24">
            {manualQuestions.map((q, i) => (
              <div 
                key={i} 
                ref={el => questionRefs.current[i] = el} 
                className={`p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                  q.text ? 'bg-zinc-900 border-yellow-500/40' : 'bg-zinc-900/10 border-zinc-800'
                }`}
              >
                <div className="flex gap-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${q.text ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                    {q.questionNumber}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <textarea 
                        placeholder={`Type ${q.section} problem...`}
                        className="w-full bg-transparent text-lg font-bold placeholder:text-zinc-800 outline-none resize-none"
                        rows={1}
                        value={q.text}
                        onChange={(e) => {
                          const newQ = [...manualQuestions];
                          newQ[i].text = e.target.value;
                          setManualQuestions(newQ);
                        }}
                      />
                      <span className="text-[9px] font-black text-zinc-600 border border-zinc-800 px-2 py-1 rounded h-fit uppercase">{q.section}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {['A', 'B', 'C', 'D'].map((opt, idx) => (
                        <div key={opt} className="flex items-center gap-3 bg-black/40 border border-zinc-800 rounded-xl p-2 px-4 focus-within:border-zinc-600 transition-all">
                          <span className="text-zinc-600 font-black text-xs">{opt}</span>
                          <input 
                            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-zinc-300"
                            placeholder="Option content..."
                            value={q.options[idx]}
                            onChange={(e) => {
                              const newQ = [...manualQuestions];
                              newQ[i].options[idx] = e.target.value;
                              setManualQuestions(newQ);
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/50">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Key:</span>
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D'].map(ans => (
                          <button 
                            key={ans}
                            onClick={() => {
                              const newQ = [...manualQuestions];
                              newQ[i].correctAnswer = ans;
                              setManualQuestions(newQ);
                            }}
                            className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                              q.correctAnswer === ans 
                              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' 
                              : 'bg-zinc-800 text-zinc-500 hover:text-white'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                      {q.text && <CheckCircle2 size={16} className="text-yellow-500 ml-auto" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: GRID NAVIGATION MAP (BACK AGAIN) */}
        <div className="w-64 bg-zinc-900/10 border-l border-white/5 p-4 h-screen sticky top-0 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 px-2">
            <LayoutGrid size={14} className="text-zinc-500" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Navigation</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {manualQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => questionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className={`h-9 rounded-lg text-[10px] font-bold border transition-all ${
                  q.text 
                  ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/10' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-500'
                }`}
              >
                {q.questionNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
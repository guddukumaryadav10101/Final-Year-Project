"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, LayoutGrid, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast'; 
import Sidebar from '../../../components/ui/Sidebar';

const BASE_URL = 'http://localhost:5000';

export default function AdminUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [mockTestName, setMockTestName] = useState("NIMCET MOCK TEST - 01");
  const fileInputRef = useRef(null);
  const questionRefs = useRef([]);

  // Initialize 120 questions with proper sections
  const [manualQuestions, setManualQuestions] = useState(
    Array.from({ length: 120 }, (_, i) => ({
      questionNumber: i + 1,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
      section: i < 50 ? 'MATHEMATICS' : i < 90 ? 'ANALYTICAL' : i < 110 ? 'COMPUTER' : 'ENGLISH'
    }))
  );

  // --- 1. EXCEL UPLOAD LOGIC ---
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mockTestName', mockTestName);

    setIsUploading(true);
    const loadingToast = toast.loading("Processing Excel Sheet...");

    try {
      const res = await fetch(`${BASE_URL}/api/admin/upload-excel`, {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) toast.success(result.msg || "Excel Uploaded!", { id: loadingToast });
      else toast.error(result.error || "Excel Upload Failed", { id: loadingToast });
    } catch (err) {
      toast.error("Network Error! Check if Backend is running.", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  // AdminUpload.js ke andar is function ko replace karein
const handlePushToDB = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return toast.error("Token missing! Please login again.");
  }

  const rawActiveQuestions = manualQuestions.filter(q => q.text.trim() !== "");
  if (rawActiveQuestions.length === 0) return toast.error("No questions to deploy!");

  setIsUploading(true);
  const loadingToast = toast.loading("Deploying...");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/upload-manual`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        // Dono bhej rahe hain taaki galti ki gunjayish na rahe
        'x-auth-token': token, 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        mockTestName: mockTestName.trim(), 
        questions: rawActiveQuestions 
      })
    });

    const result = await res.json();
    if (res.ok) {
      toast.success("Success!", { id: loadingToast });
    } else {
      toast.error(result.msg || "Token Invalid", { id: loadingToast });
    }
  } catch (err) {
    toast.error("Server error", { id: loadingToast });
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-[#070707] text-white selection:bg-yellow-500 font-sans">
      <Toaster position="bottom-right" /> 
      <Sidebar />
      
      <div className="ml-64 flex-1 flex overflow-hidden">
        {/* LEFT SIDE: FEED */}
        <div className="flex-1 p-6 overflow-y-auto h-screen scroll-smooth custom-scrollbar">
          <header className="flex justify-between items-center mb-8 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md sticky top-0 z-20">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight italic">NIMCET <span className="text-yellow-500">PRO</span></h1>
              <input 
                value={mockTestName}
                onChange={(e) => setMockTestName(e.target.value)}
                className="bg-transparent border-b border-zinc-800 text-xs text-zinc-500 outline-none mt-1 w-64 focus:border-yellow-500 transition-all font-bold"
                placeholder="MOCK TEST NAME..."
              />
            </div>
            
            <div className="flex gap-3">
              <input type="file" hidden ref={fileInputRef} onChange={handleExcelUpload} accept=".xlsx, .xls" />
              
              <button 
                onClick={() => fileInputRef.current.click()}
                className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-zinc-700 transition-all border border-white/5"
              >
                <FileSpreadsheet size={18} className="text-green-500"/> EXCEL UPLOAD
              </button>

              <button 
                onClick={handlePushToDB} 
                disabled={isUploading} 
                className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="animate-spin" size={18}/> : <><Zap size={18}/> DEPLOY MANUAL</>}
              </button>
            </div>
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
                      <span className="text-[9px] font-black text-zinc-400 border border-zinc-800 px-2 py-1 rounded h-fit uppercase">{q.section}</span>
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
                      <span className="text-[10px] font-black text-zinc-500 uppercase">Correct Answer:</span>
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
                              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
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

        {/* RIGHT SIDE: QUICK NAV */}
        <div className="w-64 bg-zinc-900/20 border-l border-white/5 p-4 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 px-2">
            <LayoutGrid size={14} className="text-zinc-500" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jump To Question</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {manualQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => questionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className={`h-9 rounded-lg text-[10px] font-bold border transition-all ${
                  q.text 
                  ? 'bg-yellow-500 border-yellow-500 text-black' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-400'
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
"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Zap, Loader2, LayoutGrid, CheckCircle2, FileSpreadsheet, Plus, RotateCcw } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast'; 
import Sidebar from '../../../components/ui/Sidebar';
import { useSearchParams } from 'next/navigation';

const BASE_URL = 'http://localhost:5000';

// Main Component Wrapper for Suspense (Next.js requirement for useSearchParams)
export default function AdminUploadPage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen text-white flex items-center justify-center">Loading...</div>}>
      <AdminUploadContent />
    </Suspense>
  );
}

function AdminUploadContent() {
  const searchParams = useSearchParams();
  const [isUploading, setIsUploading] = useState(false);
  const [existingMocks, setExistingMocks] = useState([]);
  const [selectedMock, setSelectedMock] = useState("");
  const [newMockName, setNewMockName] = useState("");
  const [isNewMock, setIsNewMock] = useState(false);
  
  const fileInputRef = useRef(null);
  const questionRefs = useRef([]);

  const createEmptyQuestions = () => Array.from({ length: 120 }, (_, i) => ({
    questionNumber: i + 1,
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 'A',
    section: i < 50 ? 'MATHEMATICS' : i < 90 ? 'ANALYTICAL' : i < 110 ? 'COMPUTER' : 'ENGLISH'
  }));

  const [manualQuestions, setManualQuestions] = useState(createEmptyQuestions());

  // --- 1. FETCH MOCKS (Fixing Dropdown Data) ---
  const fetchMocks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/mock-list`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      const result = await res.json();
      // Handle both formats: direct array or {success, data}
      const data = Array.isArray(result) ? result : (result.data || []);
      setExistingMocks(data);
    } catch (err) {
      console.error("Mocks fetch error:", err);
    }
  };

  // --- 2. LOAD QUESTIONS ---
  const loadMockQuestions = async (mockName) => {
    if (!mockName) {
      setManualQuestions(createEmptyQuestions());
      return;
    }
    
    const loadingToast = toast.loading(`Fetching ${mockName}...`);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/mock-questions/${encodeURIComponent(mockName)}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      const result = await res.json();
      const questionsData = result.questions || result.data || [];
      
      if (result.success && questionsData.length > 0) {
        const updatedQuestions = Array.from({ length: 120 }, (_, i) => {
          const found = questionsData.find(q => q.questionNumber === i + 1);
          return found ? { ...found } : {
            questionNumber: i + 1,
            text: '',
            options: ['', '', '', ''],
            correctAnswer: 'A',
            section: i < 50 ? 'MATHEMATICS' : i < 90 ? 'ANALYTICAL' : i < 110 ? 'COMPUTER' : 'ENGLISH'
          };
        });
        setManualQuestions(updatedQuestions);
        toast.success("Questions Loaded!", { id: loadingToast });
      } else {
        setManualQuestions(createEmptyQuestions());
        toast.error("No questions found, starting fresh.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Failed to load data", { id: loadingToast });
    }
  };

  // Handle URL "edit" param
  useEffect(() => {
    fetchMocks();
    const editMockName = searchParams.get('edit');
    if (editMockName) {
      const decodedName = decodeURIComponent(editMockName);
      setSelectedMock(decodedName);
      loadMockQuestions(decodedName);
    }
  }, [searchParams]);

  const handleExcelUpload = async (e) => {
    const finalName = isNewMock ? newMockName : selectedMock;
    if (!finalName) return toast.error("Bhai, pehle Mock Name select kijiye!");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mockTestName', finalName.trim());

    setIsUploading(true);
    const loadingToast = toast.loading("Syncing Excel...");
    try {
      const res = await fetch(`${BASE_URL}/api/admin/upload-excel`, {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') },
        body: formData,
      });
      if (res.ok) {
        toast.success("Excel Synced Successfully!", { id: loadingToast });
        fetchMocks();
        loadMockQuestions(finalName);
      } else {
        toast.error("Excel Sync Failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network Error!", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePushToDB = async () => {
    const finalName = isNewMock ? newMockName : selectedMock;
    if (!finalName) return toast.error("Please select or enter a Mock Name!");
    const rawActiveQuestions = manualQuestions.filter(q => q.text.trim() !== "");
    if (rawActiveQuestions.length === 0) return toast.error("No questions to deploy!");

    setIsUploading(true);
    const loadingToast = toast.loading("Deploying to Database...");
    try {
      const res = await fetch(`${BASE_URL}/api/admin/upload-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') },
        body: JSON.stringify({ mockTestName: finalName.trim(), questions: rawActiveQuestions })
      });
      if (res.ok) {
        toast.success("Database Updated! 🚀", { id: loadingToast });
        fetchMocks();
      } else {
        toast.error("Sync Failed", { id: loadingToast });
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
        <div className="flex-1 p-6 overflow-y-auto h-screen scroll-smooth custom-scrollbar">
          
          {/* STICKY HEADER */}
          <header className="flex justify-between items-center mb-8 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md sticky top-0 z-20">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-black uppercase tracking-tight italic">NIMCET <span className="text-yellow-500">PRO</span></h1>
              
              <div className="flex items-center gap-3">
                {isNewMock ? (
                  <input 
                    value={newMockName}
                    onChange={(e) => setNewMockName(e.target.value)}
                    className="bg-transparent border-b border-yellow-500 text-sm text-white outline-none w-56 font-bold h-9"
                    placeholder="ENTER NEW MOCK NAME..."
                  />
                ) : (
                  <select 
                    value={selectedMock}
                    onChange={(e) => {
                      setSelectedMock(e.target.value);
                      loadMockQuestions(e.target.value);
                    }}
                    className="bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-yellow-500 min-w-[200px] h-9"
                  >
                    <option value="">-- SELECT EXISTING MOCK --</option>
                    {existingMocks.map((m, idx) => (
                      <option key={idx} value={m.name || m}>
                        {m.name || m} {m.count ? `(${m.count})` : ''}
                      </option>
                    ))}
                  </select>
                )}

                <button 
                  onClick={() => {
                    setIsNewMock(!isNewMock);
                    setSelectedMock("");
                    setManualQuestions(createEmptyQuestions());
                  }}
                  className="bg-zinc-800 p-2 rounded-lg hover:bg-zinc-700 text-yellow-500 transition-all border border-white/5"
                >
                  {isNewMock ? <RotateCcw size={16}/> : <Plus size={16}/>}
                </button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <input type="file" hidden ref={fileInputRef} onChange={handleExcelUpload} accept=".xlsx, .xls" />
              <button onClick={() => fileInputRef.current.click()} className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-zinc-700 transition-all border border-white/5">
                <FileSpreadsheet size={18} className="text-green-500"/> EXCEL
              </button>

              <button onClick={handlePushToDB} disabled={isUploading} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50">
                {isUploading ? <Loader2 className="animate-spin" size={18}/> : <><Zap size={18}/> SYNC DATABASE</>}
              </button>
            </div>
          </header>

          {/* QUESTIONS LIST */}
          <div className="space-y-6 pb-24">
            {manualQuestions.map((q, i) => (
              <div key={i} ref={el => questionRefs.current[i] = el} className={`p-6 rounded-[2rem] border-2 transition-all duration-300 ${q.text ? 'bg-zinc-900 border-yellow-500/40' : 'bg-zinc-900/10 border-zinc-800'}`}>
                <div className="flex gap-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${q.text ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>{q.questionNumber}</div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <textarea 
                        placeholder={`Type ${q.section} problem...`} 
                        className="w-full bg-transparent text-lg font-bold placeholder:text-zinc-800 outline-none resize-none" 
                        rows={1} value={q.text} 
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
                        <div key={opt} className="flex items-center gap-3 bg-black/40 border border-zinc-800 rounded-xl p-2 px-4">
                          <span className="text-zinc-600 font-black text-xs">{opt}</span>
                          <input className="bg-transparent border-none text-sm w-full outline-none text-zinc-300" placeholder="Option..." value={q.options[idx]} 
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
                      <span className="text-[10px] font-black text-zinc-500 uppercase">Answer:</span>
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D'].map(ans => (
                          <button key={ans} onClick={() => {
                            const newQ = [...manualQuestions];
                            newQ[i].correctAnswer = ans;
                            setManualQuestions(newQ);
                          }} className={`w-8 h-8 rounded-lg font-black text-xs ${q.correctAnswer === ans ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>{ans}</button>
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

        {/* RIGHT NAVIGATION */}
        <div className="w-64 bg-zinc-900/20 border-l border-white/5 p-4 h-screen overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 px-2">
            <LayoutGrid size={14} className="text-zinc-500" />
            <h2 className="text-[10px] font-black text-zinc-500 uppercase">Navigation</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {manualQuestions.map((q, idx) => (
              <button key={idx} onClick={() => questionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className={`h-9 rounded-lg text-[10px] font-bold border ${q.text ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                {q.questionNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
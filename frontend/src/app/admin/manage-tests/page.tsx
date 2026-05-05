"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, BookOpen, AlertCircle, PlusCircle, Loader2 } from 'lucide-react';
import Sidebar from '../../../components/ui/Sidebar';

const BASE_URL = 'http://localhost:5000';

export default function ManageTests() {
  const router = useRouter();
  const [mocks, setMocks] = useState([]);
  const [selectedMock, setSelectedMock] = useState('');
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const LIMIT = 20;

  // 1. Auth Check
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role || role !== 'admin') {
      router.replace('/auth/login');
    }
    fetchMocks();
  }, [router]);

  // 2. Fetch Mock Sets List
  const fetchMocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/mocks`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      // Data mapping to handle both string array and object array from backend
      const mockList = Array.isArray(data) ? data.map(m => typeof m === 'string' ? m : m.name) : [];
      setMocks(mockList);
    } catch (err) {
      console.error("Fetch Mocks Error:", err);
    }
  };

  // 3. Fetch Questions (Memoized for pagination)
  const fetchQuestions = useCallback(async (mockName, currentPage) => {
    if (!mockName) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/mocks/${mockName}?page=${currentPage}&limit=${LIMIT}`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Fetch Questions Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Auto-fetch when page or selection changes
  useEffect(() => {
    if (selectedMock) {
      fetchQuestions(selectedMock, page);
    }
  }, [selectedMock, page, fetchQuestions]);

  const handleMockSelect = (mockName) => {
    setSelectedMock(mockName);
    setPage(1);
  };

  // 5. Delete Entire Mock Set
  const handleDeleteMockSet = async (mockName) => {
    if (!window.confirm(`Kya aap sach mein "${mockName}" ke saare questions delete karna chahte hain?`)) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/mocks/${mockName}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setSelectedMock('');
        setQuestions([]);
        fetchMocks();
        alert("Mock Set Deleted Successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      
      <div className="ml-64 flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <BookOpen className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">MOCK MANAGER</h1>
          </div>
          <button 
            onClick={() => router.push('/admin/upload')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
          >
            <PlusCircle size={20} /> NEW MOCK TEST
          </button>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* SIDEBAR: Mock Sets List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Available Sets</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {mocks.map(mock => (
                  <div key={mock} className="group relative">
                    <button 
                      onClick={() => handleMockSelect(mock)}
                      className={`w-full p-4 rounded-2xl text-left font-bold transition-all border ${
                        selectedMock === mock 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {mock}
                    </button>
                    {selectedMock === mock && (
                      <button 
                        onClick={() => handleDeleteMockSet(mock)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-200 hover:bg-red-500 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN: Questions Table */}
          <div className="lg:col-span-3 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-xl p-8 relative">
            {!selectedMock ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="p-6 bg-slate-800 rounded-full">
                  <Search size={48} className="opacity-20" />
                </div>
                <p className="text-xl font-black">Select a test set to manage questions</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-white">{selectedMock}</h3>
                    <p className="text-slate-500 font-bold">Total {total} Questions Found</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-black">ACTIVE</span>
                  </div>
                </div>

                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-slate-500 font-bold animate-pulse">LOADING QUESTIONS...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-slate-800">
                      <table className="w-full text-left">
                        <thead className="bg-slate-800/50">
                          <tr>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase">Num</th>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase">Section</th>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase">Question Text</th>
                            <th className="p-4 text-xs font-black text-slate-400 uppercase">Ans</th>
                            <th className="p-4 text-center text-xs font-black text-slate-400 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {questions.map(q => (
                            <tr key={q._id} className="hover:bg-blue-500/5 transition-colors group">
                              <td className="p-4 font-black text-blue-400">#{q.questionNumber}</td>
                              <td className="p-4">
                                <span className="px-2 py-1 bg-slate-800 rounded-lg text-[10px] font-black border border-slate-700">
                                  {q.section}
                                </span>
                              </td>
                              <td className="p-4 max-w-xs truncate text-slate-300 group-hover:text-white transition-colors" title={q.text}>
                                {q.text}
                              </td>
                              <td className="p-4 font-black text-emerald-400">{q.correctAnswer}</td>
                              <td className="p-4">
                                <div className="flex justify-center gap-2">
                                  <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors"><Edit size={16} /></button>
                                  <button className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                      <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 disabled:opacity-20 transition-all"
                      >
                        <ChevronLeft size={20} /> PREV
                      </button>
                      <div className="text-slate-500 font-black tracking-widest">
                        PAGE <span className="text-blue-500">{page}</span> OF {Math.ceil(total / LIMIT)}
                      </div>
                      <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * LIMIT >= total}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 disabled:opacity-20 transition-all"
                      >
                        NEXT <ChevronRight size={20} />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
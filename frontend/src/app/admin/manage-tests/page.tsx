"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import { Trash2, Search, Loader2, ArrowLeft, AlertCircle, FileText, Activity, RefreshCw, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BASE_URL = 'http://localhost:5000';

export default function ManageTests() {
  const router = useRouter();
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingName, setDeletingName] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMocks();
  }, []);

  const fetchMocks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/mock-list`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      
      const finalData = Array.isArray(data) ? data : (data.data || []);
      setMocks(finalData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setMocks([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 YE RAHA ACTIVE DELETE LOGIC
  const handleDelete = async (e, mockName) => {
    // 1. Isse card ka redirect trigger nahi hoga
    e.stopPropagation(); 
    
    const confirmDelete = window.confirm(`⚠️ Are you sure? This will wipe all questions for "${mockName}"`);
    if (!confirmDelete) return;

    setDeletingName(mockName);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/mock/${encodeURIComponent(mockName)}`, {
        method: 'DELETE',
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        // UI se turant gayab karne ke liye
        setMocks(prev => prev.filter(m => {
          const currentName = typeof m === 'string' ? m : m.name;
          return currentName !== mockName;
        }));
        console.log(`${mockName} deleted successfully`);
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message || "Could not delete"}`);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Network Error! Backend check karo.");
    } finally {
      setDeletingName(null);
    }
  };

  const filteredMocks = mocks.filter(mock => {
    const name = typeof mock === 'string' ? mock : mock.name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex bg-[#070707] min-h-screen text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
          </div>
          <p className="mt-6 text-slate-500 font-black tracking-[0.2em] text-xs uppercase">Scanning Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070707] text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 overflow-y-auto custom-scrollbar">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/admin/dashboard')} 
              className="flex items-center gap-2 text-slate-500 hover:text-blue-400 font-black transition-all group text-[10px] tracking-[0.3em] uppercase"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
            </button>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Manage <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Tests</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH MOCK ID..."
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all text-xs font-bold tracking-widest placeholder:text-zinc-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchMocks} 
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all text-blue-400 active:scale-95 shadow-lg"
            >
               <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* MOCK GRID */}
        {filteredMocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMocks.map((mock) => {
              const mockName = typeof mock === 'string' ? mock : mock.name;
              const mockCount = mock.count || 0;

              return (
                <div 
                  key={mockName} 
                  onClick={() => router.push(`/admin/upload?edit=${encodeURIComponent(mockName)}`)}
                  className="group relative cursor-pointer bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] hover:bg-zinc-900/50 hover:border-blue-500/40 transition-all duration-500 shadow-2xl backdrop-blur-sm overflow-hidden"
                >
                  
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 blur-[50px] group-hover:bg-blue-500/10 transition-all"></div>

                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <FileText className="text-blue-400" size={28} />
                    </div>
                    
                    {/* 🔥 ACTIVE DELETE BUTTON */}
                    <button 
                      onClick={(e) => handleDelete(e, mockName)} 
                      disabled={deletingName === mockName}
                      className="relative z-20 text-zinc-700 hover:text-red-500 p-2 transition-all hover:bg-red-500/10 rounded-xl disabled:opacity-50"
                    >
                      {deletingName === mockName ? (
                        <Loader2 size={20} className="animate-spin text-red-500" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                    {mockName}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      {mockCount} Questions Registered
                    </span>
                  </div>

                  <div className="w-full py-4 bg-zinc-800 group-hover:bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20">
                    Enter Control Room <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/10 rounded-[4rem] border-2 border-dashed border-zinc-800/50">
             <div className="p-8 bg-zinc-900/50 rounded-full mb-6 border border-zinc-800">
                <AlertCircle size={48} className="text-zinc-700" />
             </div>
             <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">No Mock Sequence Found</p>
             <p className="text-zinc-700 text-[10px] font-bold mt-4 tracking-widest">INITIATE DATABASE SYNC OR UPLOAD NEW SOURCE</p>
          </div>
        )}
      </div>
    </div>
  );
}
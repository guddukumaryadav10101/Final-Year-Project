"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, Database, Layout, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    text: '', optA: '', optB: '', optC: '', optD: '', correct: '', section: 'MATHS'
  });

  // Load questions to see total count
  const loadQuestions = async () => {
    const res = await fetch('/api/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => { loadQuestions(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Question Added!");
      setFormData({ text: '', optA: '', optB: '', optC: '', optD: '', correct: '', section: 'MATHS' });
      loadQuestions(); // Refresh list
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Stats */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-3 mb-10">
          <Layout className="text-blue-400" />
          <h1 className="font-black text-xl tracking-tighter">EXAM PANEL</h1>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-[10px] font-bold uppercase">Total Questions</p>
            <p className="text-3xl font-black text-blue-400">{questions.length} / 120</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <PlusCircle className="text-blue-600" /> Add New Question
          </h2>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">Question Content</label>
              <textarea 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
                rows={3}
                placeholder="Type your question here..."
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['optA', 'optB', 'optC', 'optD'].map((opt, i) => (
                <div key={opt}>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Option {String.fromCharCode(65+i)}</label>
                  <input 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="text"
                    value={formData[opt]}
                    onChange={(e) => setFormData({...formData, [opt]: e.target.value})}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Correct Answer Value</label>
                <input 
                  className="w-full p-3 bg-emerald-50 border-2 border-emerald-100 rounded-xl text-emerald-700 font-bold"
                  type="text"
                  placeholder="Must match one option exactly"
                  value={formData.correct}
                  onChange={(e) => setFormData({...formData, correct: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Assign Section</label>
                <select 
                  className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700"
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                >
                  <option value="MATHS">Mathematics (+12/-3)</option>
                  <option value="REASONING">Reasoning (+6/-1.5)</option>
                  <option value="COMPUTER">Computer Science (+6/-1.5)</option>
                  <option value="ENGLISH">General English (+4/-1)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all transform active:scale-[0.98]">
              PUSH TO LIVE DATABASE
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
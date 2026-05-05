"use client";
import React, { useState } from 'react';
import { Upload, Database, CheckCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminUpload() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        console.log("Loaded Questions:", data);
        setQuestions(data);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-black text-white p-12 font-['Roboto']">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">Admin <span className="text-yellow-500">Engine.</span></h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mb-12">Bulk Question Processor v1.0</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-white/[0.02] hover:border-yellow-500/50 transition-all group">
            <input type="file" id="excel-up" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <label htmlFor="excel-up" className="cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="text-black" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">Upload Excel Sheet</span>
            </label>
          </div>

          {/* Status Box */}
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem]">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Process Status</h3>
            {status === 'success' ? (
              <div className="text-green-500 flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
                <CheckCircle size={20} /> {questions.length} Questions Processed
              </div>
            ) : status === 'error' ? (
              <div className="text-red-500 flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
                <AlertTriangle size={20} /> Failed to read file
              </div>
            ) : (
              <div className="text-gray-700 font-bold text-xs uppercase tracking-widest italic">Waiting for input...</div>
            )}
          </div>
        </div>
        
        {/* Preview Table */}
        {questions.length > 0 && (
          <div className="mt-12 overflow-hidden border border-white/5 rounded-2xl">
            <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Question Text</th>
                  <th className="p-4 text-yellow-500">Ans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {questions.slice(0, 5).map((q, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-4 text-gray-500">{idx + 1}</td>
                    <td className="p-4 truncate max-w-xs">{q.Question || q.question}</td>
                    <td className="p-4 text-yellow-500">{q.Answer || q.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
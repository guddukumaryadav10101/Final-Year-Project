"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Play, Calculator, 
  Brain, Monitor, Languages, Timer, Lock, AlertCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExamLobby() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartExam = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/exam/live'); 
    }, 2000);
  };

  // Detailed Sectional Data as per your rules
  const sections = [
    { label: 'Mathematics', icon: Calculator, q: 50, marks: '+12', neg: '-3.0', time: '70 Min', color: 'border-blue-500/20' },
    { label: 'Reasoning', icon: Brain, q: 40, marks: '+6', neg: '-1.5', time: '30 Min', color: 'border-purple-500/20' },
    { label: 'Computer', icon: Monitor, q: 20, marks: '+6', neg: '-1.5', time: '20 Min*', color: 'border-green-500/20' },
    { label: 'English', icon: Languages, q: 10, marks: '+4', neg: '-1.0', time: '20 Min*', color: 'border-pink-500/20' },
  ];

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full mb-4"
        />
        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">Configuring Arena...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Roboto'] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Personalized Header */}
        <header className="mb-12 border-l-4 border-yellow-500 pl-8">
          <div className="flex items-center gap-2 text-yellow-500 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <ShieldCheck size={14} /> GUDDU KUMAR | UID: 23STUCJHN014
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
            GUDDU'S <span className="text-yellow-500">COMMAND.</span>
            <span className="block text-2xl mt-2 text-gray-600 not-italic tracking-widest uppercase">The NIMCET Protocol</span>
          </h1>
          <p className="text-xl text-gray-400 italic font-bold">
            "मैदान-ए-जंग में उतरने से पहले, खुद को जीत के लिए तैयार कर लो।"
          </p>
        </header>

        {/* Global Stats Bar */}
        <div className="flex flex-wrap gap-6 mb-10">
           <div className="bg-white/[0.03] border border-white/5 px-8 py-5 rounded-[2rem] flex items-center gap-4">
              <Timer className="text-yellow-500" size={24} />
              <div>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total Mission Time</p>
                <p className="text-xl font-black italic">120 MINUTES</p>
              </div>
           </div>
           <div className="bg-white/[0.03] border border-white/5 px-8 py-5 rounded-[2rem] flex items-center gap-4">
              <Lock className="text-red-500" size={24} />
              <div>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Sectional Lock</p>
                <p className="text-xl font-black italic text-red-500 uppercase">Hard-Active</p>
              </div>
           </div>
        </div>

        {/* Section Cards - All 4 Separate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {sections.map((s) => (
            <div key={s.label} className={`bg-white/[0.02] border ${s.color} p-8 rounded-[2.5rem] group hover:bg-white/[0.04] transition-all`}>
              <s.icon className="text-yellow-500 mb-6" size={28} />
              <h3 className="text-xl font-black uppercase italic mb-1">{s.label}</h3>
              <p className="text-[10px] font-bold text-gray-600 mb-6 uppercase tracking-wider">{s.q} Questions</p>
              
              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex justify-between text-[9px] font-black uppercase">
                  <span className="text-gray-500">Correct</span>
                  <span className="text-green-500">{s.marks}</span>
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase">
                  <span className="text-gray-500">Wrong</span>
                  <span className="text-red-500">{s.neg}</span>
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase mt-2 pt-2 border-t border-white/5">
                  <span className="text-gray-400">Time Limit</span>
                  <span className="text-white">{s.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Time Note */}
        <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-2xl mb-12 flex items-start gap-4">
          <AlertCircle className="text-yellow-500 shrink-0" size={20} />
          <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wide">
            <span className="text-yellow-500">Note:</span> Computer aur English sections ko <span className="text-white">Combine (20 Minutes)</span> kiya gaya hai. 
            Jab aap in dono mein se kisi bhi section par honge, timer 20 minute ka common chalega.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setReady(!ready)}
            className={`mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${ready ? 'text-white' : 'text-gray-600'}`}
          >
            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${ready ? 'bg-yellow-500 border-transparent shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-white/10'}`}>
              {ready && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
            </div>
            I have verified all sectional marking schemes
          </button>

          <button
            disabled={!ready}
            onClick={handleStartExam}
            className={`
              w-full md:w-auto px-28 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.5em] transition-all
              ${ready 
                ? 'bg-yellow-500 text-black shadow-[0_15px_60px_rgba(234,179,8,0.15)] hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-gray-800 cursor-not-allowed'}
            `}
          >
            Initiate Arena
          </button>
        </div>

      </div>
    </div>
  );
}
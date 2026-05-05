"use client";
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-10 text-center">
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
        <CheckCircle size={48} className="text-black" />
      </div>
      <h1 className="text-5xl font-black italic mb-4 uppercase tracking-tighter">Mission Accomplished!</h1>
      <p className="text-slate-400 max-w-md mb-10 font-medium">
        Guddu, aapka test successfully submit ho gaya hai. Ab aap apne detailed analytics aur correct answers dekh sakte hain.
      </p>
      <button 
        onClick={() => router.push('/dashboard')}
        className="px-10 py-4 bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all"
      >
        Return to HQ (Dashboard)
      </button>
    </div>
  );
}
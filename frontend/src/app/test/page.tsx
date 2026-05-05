"use client";
import React, { useState, useEffect } from 'react';

export default function TestEngine() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(7200); // 120 Minutes

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOptionSelect = (qId: string, optionIndex: number) => {
        setAnswers({ ...answers, [qId]: optionIndex });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            {/* Header with Timer */}
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
                <h1 className="text-xl font-bold text-blue-400">NIMCET Mock Test #01</h1>
                <div className="text-2xl font-mono font-bold text-red-500 bg-red-500/10 px-4 py-1 rounded-lg border border-red-500/20">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Question Area */}
                <div className="col-span-12 lg:col-span-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 min-h-[400px]">
                    <div className="flex justify-between mb-4">
                        <span className="text-slate-500 font-medium">Question {currentIndex + 1} of 120</span>
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">Mathematics</span>
                    </div>
                    
                    <h2 className="text-2xl mb-8 leading-relaxed">Example Question: What is the value of ∫ sin(x) dx?</h2>

                    <div className="space-y-4">
                        {['cos(x) + C', '-cos(x) + C', 'tan(x) + C', 'sin(x) + C'].map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleOptionSelect("q1", i)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${answers["q1"] === i ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                            >
                                <span className="mr-4 text-slate-500 font-bold">{String.fromCharCode(65 + i)}.</span> {opt}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 flex justify-between">
                        <button className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold">Previous</button>
                        <button className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold">Save & Next</button>
                    </div>
                </div>

                {/* Question Palette */}
                <div className="col-span-12 lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[300px] p-2">
                        {Array.from({ length: 120 }).map((_, i) => (
                            <div key={i} className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer text-sm font-bold border ${i === 0 ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-400'}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all">
                        Submit Full Test
                    </button>
                </div>
            </div>
        </div>
    );
}
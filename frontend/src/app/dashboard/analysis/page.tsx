"use client";
import React from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function AnalysisPage({ resultData }: any) {
  // Mock Data (Ye tumhare backend response se aayega)
  const data = {
    labels: ['Maths', 'Reasoning', 'Computer', 'English'],
    datasets: [
      {
        label: 'Your Score',
        data: [480, 120, 90, 40], // Example data
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        AI Performance Insights
      </h1>

      <div className="grid grid-cols-12 gap-8">
        
        {/* 🤖 AI Rank Card */}
        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col justify-center items-center text-center">
          <p className="text-blue-300 font-bold tracking-widest uppercase text-sm mb-4">Predicted NIMCET Rank</p>
          <h2 className="text-7xl font-black text-white drop-shadow-2xl">#452</h2>
          <div className="mt-6 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 font-bold text-sm">
            92% Probability: NIT Trichy / Surathkal
          </div>
        </div>

        {/* 📊 Score Statistics */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold mb-6">Subject-wise Breakdown</h3>
          <div className="h-[300px]">
            <Bar data={data} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>

        {/* 🧠 AI Recommendations */}
        <div className="col-span-12 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold mb-4 text-amber-400">AI Personalised Feedback</h3>
          <p className="text-slate-400 leading-relaxed">
            Bhai, tumhari **Mathematics** ki accuracy solid hai, lekin **Computer Awareness** mein marks lose ho rahe hain. 
            NIMCET ke pichle patterns ke hisaab se, agar tum Binary Logic aur Floating point representation par focus karo, 
            toh tumhari rank under 200 aa sakti hai.
          </p>
        </div>

      </div>
    </div>
  );
}
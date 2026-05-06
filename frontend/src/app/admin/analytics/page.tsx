"use client";
import React, { useState, useEffect } from 'react';
// import Sidebar from '@/components/ui/Sidebar';
import Sidebar from '../../../components/ui/Sidebar';
import { 
  TrendingUp, Target, Award, PieChart as PieIcon, 
  RefreshCw, Database, Clock, Brain 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const COLORS = ['#3b82f6', '#ef4444']; // Blue for Pass, Red for Fail

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setIsRefreshing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/analytics', {
                headers: { 'x-auth-token': token }
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
                <RefreshCw size={40} className="text-blue-500 animate-spin" />
                <p className="text-slate-500 font-black tracking-widest text-xs uppercase">Syncing Intelligence...</p>
            </div>
        );
    }

    const hasData = data && data.totalAttempts > 0;

    return (
        <div className="flex min-h-screen bg-[#020617] text-white font-sans">
            <Sidebar />
            <div className="ml-64 flex-1 p-8 overflow-y-auto">
                
                {/* HEADER SECTION */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                            Nexus <span className="text-blue-500">Analytics</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">
                            Real-time Academic Performance Monitoring
                        </p>
                    </div>
                    <button 
                        onClick={fetchAnalytics}
                        className={`p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:text-blue-500 transition-all ${isRefreshing ? 'animate-spin text-blue-500' : ''}`}
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                {!hasData ? (
                    /* EMPTY STATE */
                    <div className="bg-slate-900/30 border border-dashed border-slate-800 p-24 rounded-[3rem] text-center">
                        <Database className="mx-auto text-slate-800 mb-6" size={80} />
                        <h2 className="text-2xl font-black text-slate-400 uppercase italic">Waiting for Engine Data</h2>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2">
                            Dashboard will populate automatically once students finish a Mock Test.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                        {/* STAT CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                                <Target className="text-blue-500 mb-3" size={24} />
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Avg Accuracy</p>
                                <p className="text-3xl font-black">{data.avgAccuracy}%</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/50">
                                <TrendingUp className="text-emerald-500 mb-3" size={24} />
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Attempts</p>
                                <p className="text-3xl font-black">{data.totalAttempts}</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/50">
                                <Clock className="text-purple-500 mb-3" size={24} />
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Live Tests</p>
                                <p className="text-3xl font-black">Active</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/50">
                                <Award className="text-amber-500 mb-3" size={24} />
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Top Performers</p>
                                <p className="text-3xl font-black">{data.topStudents.length}</p>
                            </div>
                        </div>

                        {/* CHARTS SECTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* PIE CHART */}
                            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 flex flex-col items-center">
                                <div className="w-full flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                        <PieIcon size={14} className="text-blue-500" /> Success Ratio
                                    </h3>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={data.successRatio} 
                                                innerRadius={70} 
                                                outerRadius={90} 
                                                paddingAngle={8} 
                                                dataKey="value"
                                            >
                                                {data.successRatio.map((e, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} 
                                                itemStyle={{fontSize: '10px', fontWeight: 'bold'}}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex gap-6 mt-4">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-slate-400">PASS</span></div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[10px] font-bold text-slate-400">FAIL</span></div>
                                </div>
                            </div>

                            {/* AREA CHART */}
                            <div className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50">
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
                                    <Brain size={14} className="text-emerald-500" /> Performance Velocity
                                </h3>
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.trends}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} />
                                            <Area 
                                                type="monotone" 
                                                dataKey="score" 
                                                stroke="#3b82f6" 
                                                fillOpacity={1} 
                                                fill="url(#colorScore)" 
                                                strokeWidth={3} 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* LEADERBOARD TABLE */}
                        <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-slate-800/50 bg-slate-900/20">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Award size={18} className="text-amber-500" /> Elite Academic Rank
                                </h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5 text-blue-500 italic">Rank</th>
                                        <th className="px-8 py-5">Student Identity</th>
                                        <th className="px-8 py-5">Accuracy</th>
                                        <th className="px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {data.topStudents.map((student, i) => (
                                        <tr key={i} className="hover:bg-blue-500/5 transition-all group">
                                            <td className="px-8 py-6 font-black text-white italic">{student.rank}</td>
                                            <td className="px-8 py-6 font-bold text-slate-300 uppercase text-xs group-hover:text-blue-400">{student.name}</td>
                                            <td className="px-8 py-6">
                                                <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-500/20">
                                                    {student.score}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-full ${student.status === 'Elite' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400'}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
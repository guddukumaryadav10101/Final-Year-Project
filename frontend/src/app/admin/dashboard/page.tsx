"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import { Users, BookOpen, TrendingUp, Activity, UploadCloud, Shield, Search, LogOut, RefreshCcw, Settings, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BASE_URL = 'http://localhost:5000';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalStudents: 0, activeTests: 0, avgScore: 0, totalQuestions: 0 });
  const [chartData, setChartData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'admin') {
      router.replace('/auth/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, { 
        headers: { 'x-auth-token': token } 
      });
      const data = await statsRes.json();
      
      setStats({
        totalStudents: data.totalStudents || 0,
        activeTests: data.activeTests || 0,
        avgScore: data.avgScore || 0, // 🔥 Dynamic Performance Update
        totalQuestions: data.totalQuestions || 0
      });

      const summaryRes = await fetch(`${BASE_URL}/api/admin/test-summary`, { 
        headers: { 'x-auth-token': token } 
      });
      const summaryData = await summaryRes.json();
      
      if(Array.isArray(summaryData)) {
        setChartData(summaryData);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  const filteredData = chartData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, title, value, colorClass, subtitle }) => (
    <div className="group bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:border-blue-500/50 transition-all duration-500">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 border border-current transition-all`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{value}</p>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <h3 className="text-slate-300 font-bold text-lg uppercase tracking-wider">{title}</h3>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest">Initialising Nexus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      <div className="ml-64 flex-1">
        <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">
                COMMAND CENTER
              </h1>
              {/* 🔥 WELCOME GUDDU ADDED HERE */}
              <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Welcome Back, Guddu Kumar</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter Analytics..."
                  className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 w-64 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={loadData} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-blue-400 border border-slate-700">
                <RefreshCcw size={18} />
              </button>
              <div className="flex items-center gap-3 bg-slate-900 p-1.5 pr-4 rounded-xl border border-slate-800">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-lg">GK</div>
                <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} title="Students" value={stats.totalStudents} colorClass="text-blue-500" subtitle="Registered" />
            <StatCard icon={BookOpen} title="Test Sets" value={stats.activeTests} colorClass="text-indigo-500" subtitle="Active" />
            <StatCard icon={TrendingUp} title="Performance" value={`${stats.avgScore}%`} colorClass="text-emerald-500" subtitle="Global Avg" />
            <StatCard icon={UploadCloud} title="Questions" value={stats.totalQuestions} colorClass="text-purple-500" subtitle="DB Size" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-xl">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-slate-300 uppercase tracking-tighter">
                <Shield className="text-emerald-500" size={20} /> Data Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                  <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tick={{fill: '#64748b'}} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} cursor={{fill: '#1e293b'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-xl">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-slate-300 uppercase tracking-tighter">
                <Activity className="text-blue-500" size={20} /> System Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                  <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Link href="/admin/upload" className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl flex items-center justify-between group hover:bg-blue-600 transition-all">
              <div>
                <p className="font-black text-blue-400 group-hover:text-white text-lg uppercase italic">Upload Mock</p>
                <p className="text-slate-500 group-hover:text-blue-100 text-[10px] uppercase font-bold">Import Source</p>
              </div>
              <UploadCloud className="text-blue-500 group-hover:text-white transition-all" size={28} />
            </Link>
            
            <Link href="/admin/users" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all">
              <div>
                <p className="font-black text-slate-300 group-hover:text-emerald-400 text-lg uppercase italic">Analytics</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Performance Deep-Dive</p>
              </div>
              <BarChart3 className="text-slate-600 group-hover:text-emerald-400 transition-all" size={28} />
            </Link>

            <Link href="/admin/manage-tests" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-indigo-500/50 transition-all">
              <div>
                <p className="font-black text-slate-300 group-hover:text-indigo-400 text-lg uppercase italic">Tests Registry</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Edit Live Content</p>
              </div>
              <BookOpen className="text-slate-600 group-hover:text-indigo-400 transition-all" size={28} />
            </Link>

            <Link href="/admin/settings" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-amber-500/50 transition-all">
              <div>
                <p className="font-black text-slate-300 group-hover:text-amber-400 text-lg uppercase italic">Settings</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Control & Config</p>
              </div>
              <Settings className="text-slate-600 group-hover:text-amber-400 transition-all" size={28} />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
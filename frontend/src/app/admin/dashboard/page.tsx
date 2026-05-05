"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import { Users, BookOpen, TrendingUp, Activity, UploadCloud, Shield, Search, LogOut, RefreshCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BASE_URL = 'http://localhost:5000';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalStudents: 0, activeTests: 0, avgScore: 0, totalQuestions: 0 });
  const [chartData, setChartData] = useState([]); // Original Data from DB
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
      
      // 1. Fetch Stats (Counts)
      const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, { 
        headers: { 'x-auth-token': token } 
      });
      const data = await statsRes.json();
      
      setStats({
        totalStudents: data.totalStudents || 0,
        activeTests: data.activeTests || 0,
        avgScore: data.avgScore || 0,
        totalQuestions: data.totalQuestions || 0
      });

      // 2. Fetch Analytics (Graph Data)
      // Note: Hum 'test-summary' use kar rahe hain Bar chart ke liye
      const summaryRes = await fetch(`${BASE_URL}/api/admin/test-summary`, { 
        headers: { 'x-auth-token': token } 
      });
      const summaryData = await summaryRes.json();
      
      if(Array.isArray(summaryData)) {
        // Backend keys match: 'name' and 'count'
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

  // --- Search Logic ---
  // Ye logic cards aur graphs dono ko filter karega
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400 font-bold animate-pulse">BOOTING COMMAND CENTER...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                COMMAND CENTER
              </h1>
              <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> LIVE
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Mock Sets..."
                  className="bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-12 pr-6 w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={loadData} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-blue-400">
                <RefreshCcw size={20} />
              </button>
              <div className="flex items-center gap-3 bg-slate-800 p-2 pr-4 rounded-2xl border border-slate-700">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">AD</div>
                <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} title="Students" value={stats.totalStudents} colorClass="text-blue-500" subtitle="Total Registered" />
            <StatCard icon={BookOpen} title="Test Sets" value={stats.activeTests} colorClass="text-indigo-500" subtitle="Live on Portal" />
            <StatCard icon={TrendingUp} title="Avg Performance" value={`${stats.avgScore}%`} colorClass="text-emerald-500" subtitle="Across All Users" />
            <StatCard icon={UploadCloud} title="Questions" value={stats.totalQuestions} colorClass="text-purple-500" subtitle="In Database" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart: Questions per Set (Dynamic Search) */}
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                <Shield className="text-emerald-500" /> Questions Per Set {searchTerm && `(Filtered)`}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                  <CartesianGrid stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{fill: '#94a3b8'}} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart: Placeholder for real analytics */}
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                <Activity className="text-blue-500" /> System Traffic (Sets)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                  <CartesianGrid stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/upload" className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl flex items-center justify-between group hover:scale-[1.02] transition-all">
              <div>
                <p className="font-black text-white text-lg italic">NEW MOCK TEST</p>
                <p className="text-blue-100 text-sm">Upload Excel File (120 Qs)</p>
              </div>
              <UploadCloud className="text-white opacity-50 group-hover:opacity-100 transition-opacity" size={32} />
            </Link>
            
            <Link href="/admin/users" className="bg-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:bg-slate-750 transition-all border border-slate-700">
              <div>
                <p className="font-black text-white text-lg italic">MANAGE STUDENTS</p>
                <p className="text-slate-400 text-sm">View or Delete Users</p>
              </div>
              <Users className="text-slate-500 group-hover:text-emerald-400 transition-colors" size={32} />
            </Link>

            <Link href="/admin/manage-tests" className="bg-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:bg-slate-750 transition-all border border-slate-700">
              <div>
                <p className="font-black text-white text-lg italic">MANAGE TESTS</p>
                <p className="text-slate-400 text-sm">Edit or Delete Mock Sets</p>
              </div>
              <BookOpen className="text-slate-500 group-hover:text-indigo-400 transition-colors" size={32} />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
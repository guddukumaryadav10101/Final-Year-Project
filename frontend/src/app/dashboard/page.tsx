"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, BarChart2, LogOut, 
  Target, Zap, Clock, BrainCircuit, 
  Award, PlayCircle, History, AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function DynamicDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  // REAL DATA STATE: Isme backend se aaya data store hoga
  const [realStats, setRealStats] = useState({
    predictedScore: 0,
    accuracy: 0,
    avgTime: 0,
    performanceHistory: []
  });

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData');

    if (!token) {
      router.push('/auth/login');
    } else {
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
        // FETCH REAL DATA FROM BACKEND
        fetchDashboardData(user._id);
      }
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [router]);

  // Function to get real data from your API
  const fetchDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/dashboard-stats/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setRealStats(data.stats);
      }
    } catch (err) {
      console.log("Working with offline mode / Mock data");
      // Fallback data agar backend connect na ho
      setRealStats({
        predictedScore: 742,
        accuracy: 82,
        avgTime: 54,
        performanceHistory: [
            { day: 'Mon', score: 400 }, { day: 'Tue', score: 550 },
            { day: 'Wed', score: 480 }, { day: 'Thu', score: 700 },
            { day: 'Fri', score: 680 }, { day: 'Sat', score: 850 },
            { day: 'Sun', score: 920 },
        ]
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"
        />
        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] animate-pulse">Initializing Systems</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-['Roboto'] selection:bg-yellow-500/30">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <BrainCircuit className="text-black" size={24} />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase italic">NIMCET <span className="text-yellow-500 text-xs block tracking-[0.3em] not-italic">AI Portal</span></span>
          </div>
          
          <nav className="space-y-3">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Command Center' },
              { id: 'exams', icon: BookOpen, label: 'Mock Exams' },
              { id: 'analytics', icon: BarChart2, label: 'AI Analytics' },
              { id: 'history', icon: History, label: 'Past Papers' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                  ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] p-4 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} /> System Shutdown
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              Aspirant <span className="text-yellow-500">
                {userData?.fullName || "Loading..."}.
              </span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 border-l-2 border-yellow-500 pl-4">
              System ID: {userData?.email || "Verifying..."}
            </p>
          </div>

          <button 
            onClick={() => router.push('/exam')} 
            className="group bg-yellow-500 text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10"
          >
            Launch New Mock <PlayCircle size={18} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid using realStats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Target />} label="AI Predicted Score" value={realStats.predictedScore} unit="/1000" trend="+12%" />
                <StatCard icon={<Zap />} label="Global Accuracy" value={realStats.accuracy} unit="%" trend="Stable" />
                <StatCard icon={<Clock />} label="Avg Time / Question" value={realStats.avgTime} unit="sec" trend="-4s" />
              </div>

              {/* Chart */}
              <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem]">
                <h3 className="text-xl font-black uppercase italic tracking-tight mb-10">Performance Matrix</h3>
                <div className="h-[350px] w-full">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={realStats.performanceHistory}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                        <XAxis dataKey="day" stroke="#333" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '15px' }} />
                        <Area type="monotone" dataKey="score" stroke="#eab308" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="other-tabs"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-[500px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem]"
            >
               <div className="text-center">
                  <Award className="text-yellow-500 mx-auto mb-4 animate-bounce" size={40} />
                  <h2 className="text-2xl font-black italic uppercase text-white mb-2">{activeTab} Module Loading</h2>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Connecting to Secure Database...</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ icon, label, value, unit, trend }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl group hover:border-yellow-500/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-yellow-500">{icon}</span>
        <span className="text-[10px] font-bold text-green-500">{trend}</span>
      </div>
      <div className="text-5xl font-black mb-1 italic">{value}<span className="text-sm text-gray-700 not-italic ml-2">{unit}</span></div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}
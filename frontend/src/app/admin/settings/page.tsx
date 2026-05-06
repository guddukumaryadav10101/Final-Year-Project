"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/ui/Sidebar'; 
import { 
    User, Mail, Lock, Save, Loader2, 
    ShieldCheck, RefreshCw, Cpu, Fingerprint 
} from 'lucide-react';

export default function SettingsPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // --- 1. AUTO-FETCH ADMIN DATA ON LOAD ---
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                // Backend route: GET /api/admin/profile
                const res = await fetch('http://localhost:5000/api/admin/profile', {
                    headers: { 'x-auth-token': token }
                });
                const data = await res.json();
                if (res.ok) {
                    setName(data.fullName || '');
                    setEmail(data.email || '');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    // --- 2. UPDATE HANDLER ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/update-settings', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ name, email, newPassword: password })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', msg: 'DATABASE SYNCHRONIZED SUCCESSFULLY' });
                setPassword('');
            } else {
                setStatus({ type: 'error', msg: data.message || 'UPDATE REJECTED' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'CONNECTION TO CORE ENGINE FAILED' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex min-h-screen bg-[#020617] items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-blue-500/20 rounded-full animate-ping" />
                    <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={30} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-600/40">
            <Sidebar />

            <main className="flex-1 ml-0 md:ml-64 p-6 lg:p-12 relative">
                {/* Visual Decorative Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-[1px] w-8 bg-blue-500" />
                                <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase">Security Level: Level 4</p>
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Settings</span>
                            </h1>
                        </div>
                        <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-md">
                            <p className="text-[10px] font-mono text-slate-500">LAST_SYNC: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Side: Profile Identity */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-blue-500/30 transition-all group">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:rotate-12 transition-transform">
                                        <Fingerprint size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Identity Module</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Full Name</label>
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-950/80 border border-slate-800 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-medium"
                                                placeholder="Guddu Kumar"
                                            />
                                            <User className="absolute left-4 top-4 text-slate-600 group-focus-within/input:text-blue-500" size={18} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Network Email</label>
                                        <div className="relative group/input">
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-950/80 border border-slate-800 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-medium"
                                                placeholder="admin@gmail.com"
                                            />
                                            <Mail className="absolute left-4 top-4 text-slate-600 group-focus-within/input:text-blue-500" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Box */}
                            <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2.5rem] backdrop-blur-xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Security Protocol</h2>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Override Password</label>
                                    <div className="relative group/input">
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-950/80 border border-slate-800 p-4 pl-12 rounded-2xl focus:border-red-500 outline-none transition-all text-white"
                                            placeholder="••••••••••••"
                                        />
                                        <Lock className="absolute left-4 top-4 text-slate-600 group-focus-within/input:text-red-500" size={18} />
                                    </div>
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter mt-2 ml-1">Leave empty to maintain existing encryption</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Status & Action */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 transition-transform hover:scale-[1.02]">
                                <div className="bg-slate-950 p-8 rounded-[2.4rem] h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-4">Commit Changes</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                            Updating these settings will synchronize your administrative profile across all network nodes.
                                        </p>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 disabled:opacity-50"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                        {loading ? 'Processing...' : 'Sync Database'}
                                    </button>
                                </div>
                            </div>

                            {/* Status Message Display */}
                            {status.msg && (
                                <div className={`p-6 rounded-[2rem] border animate-in slide-in-from-bottom-4 duration-500 ${
                                    status.type === 'success' 
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5' 
                                    : 'bg-red-500/5 border-red-500/20 text-red-400 shadow-lg shadow-red-500/5'
                                }`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-center">{status.msg}</p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
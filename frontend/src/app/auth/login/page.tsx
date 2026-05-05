"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // --- BACKEND API CALL ---
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Token aur Role save karo authentication ke liye
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        
        // 2. 🔥 DYNAMIC FIX: Pura user object save karo taaki Dashboard naam dikha sake
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        console.log("Access Granted for:", data.user.fullName);

        // 3. Role-Based Redirect
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.msg || "Invalid credentials, Bhai!");
      }
    } catch (err) {
      setError("Backend server down hai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-yellow-500 rounded-xl items-center justify-center mb-4 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <Terminal className="text-black" size={28} />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Systems Access.</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">NIMCET AI Portal v3.0</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-6 flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4 bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 blur-[100px] group-hover:bg-yellow-500/20 transition-all duration-700" />
          
          <div className="relative group/input">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-yellow-500 transition-colors" size={18} />
            <input 
              required
              type="email" 
              placeholder="EMAIL ADDRESS"
              className="w-full bg-black border border-white/10 py-4 pl-12 rounded-xl focus:border-yellow-500 transition-all font-bold text-[10px] tracking-widest outline-none uppercase placeholder:text-gray-700"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group/input">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-yellow-500 transition-colors" size={18} />
            <input 
              required
              type="password" 
              placeholder="PASSWORD"
              className="w-full bg-black border border-white/10 py-4 pl-12 rounded-xl focus:border-yellow-500 transition-all font-bold text-[10px] tracking-widest outline-none uppercase placeholder:text-gray-700"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-yellow-500 text-black py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-yellow-400 active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          >
            {loading ? "Authenticating..." : "Login to Portal"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
          New here? <Link href="/auth/register" className="text-yellow-500 border-b border-yellow-500/30 ml-2 hover:text-yellow-400 transition-colors">Join the Squad</Link>
        </p>
      </motion.div>
    </div>
  );
}
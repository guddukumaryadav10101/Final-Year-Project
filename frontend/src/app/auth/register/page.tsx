"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, User, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    // --- FRONTEND VALIDATION LOGIC ---
    // 1. Password Match Check
    if(formData.password !== formData.confirmPassword) {
      setError("Passwords match nahi ho rahe, Bhai!");
      return;
    }

    // 2. Complexity Check
    if(formData.password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);

    try {
      // --- BACKEND DATABASE VERIFICATION ---
      // Ye call backend ke 'register' controller ko jayegi
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: formData.name, 
          email: formData.email, 
          password: formData.password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Database mein user create ho gaya
        console.log("Registration Successful:", data.msg);
        router.push('/auth/login');
      } else {
        // ERROR HANDLING: Yahan backend batayega agar "User already exists"
        setError(data.msg || "Registration fail ho gaya.");
      }
    } catch (err) {
      setError("Backend server se connection nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-yellow-500 rounded-xl items-center justify-center mb-4">
            <Terminal className="text-black" size={28} />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">Join the Squad.</h2>
        </div>

        {/* Dynamic Error Alert: Yahan "User already exists" dikhega */}
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

        <form onSubmit={handleRegister} className="space-y-4 bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] yellow-glow">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18} />
            <input 
              required
              type="text" 
              placeholder="FULL NAME"
              className="w-full bg-black border border-white/10 py-4 pl-12 rounded-xl focus:border-yellow-500 transition-all font-bold text-[10px] tracking-widest outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18} />
            <input 
              required
              type="email" 
              placeholder="EMAIL ADDRESS"
              className="w-full bg-black border border-white/10 py-4 pl-12 rounded-xl focus:border-yellow-500 transition-all font-bold text-[10px] tracking-widest outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18} />
            <input 
              required
              type="password" 
              placeholder="CREATE PASSWORD"
              className="w-full bg-black border border-white/10 py-4 pl-12 rounded-xl focus:border-yellow-500 transition-all font-bold text-[10px] tracking-widest outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18} />
            <input 
              required
              type="password" 
              placeholder="CONFIRM PASSWORD"
              className="w-full bg-black border border-white/10 py-4 pl-12 rounded-xl focus:border-yellow-500 transition-all font-bold text-[10px] tracking-widest outline-none"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-yellow-500 text-black py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Initialize Account"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
          Systems Ready? <Link href="/auth/login" className="text-yellow-500 border-b border-yellow-500/30 ml-2">Login Here</Link>
        </p>
      </motion.div>
    </div>
  );
}
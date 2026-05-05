"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Zap, BarChart3, Cpu, Layout, Users, 
  Shield, Rocket, Sparkles, Brain, Database, Terminal,
  Github, Twitter
} from 'lucide-react';
import Link from 'next/link';

export default function LuxuryLandingPage() {
  return (
    <>
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      {/* Seedha aur Saaf Roboto Font */}
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        body { font-family: 'Roboto', sans-serif; background-color: #000000; color: #ffffff; margin: 0; }
        .premium-border { border: 1px solid rgba(234, 179, 8, 0.2); }
        .yellow-glow { box-shadow: 0 0 30px rgba(234, 179, 8, 0.15); }
        .nav-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        h1, h2, h3 { letter-spacing: -0.01em; }
      `}} />

      <div className="min-h-screen bg-black text-white">
        
        {/* --- NAVIGATION --- */}
        <nav className="fixed top-0 w-full z-[100] nav-glass px-8 md:px-20 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Terminal className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight">
              NIMCET <span className="text-yellow-500">AI EXAM PORTAL</span>
            </span>
          </div>

          <div className="hidden lg:flex gap-12 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            <a href="#features" className="hover:text-yellow-500 transition-colors">Analytics</a>
            <a href="#founders" className="hover:text-yellow-500 transition-colors">The Team</a>
          </div>

          <Link href="/auth/register" className="bg-yellow-500 text-black px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all">
            Get Started
          </Link>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="pt-60 pb-40 px-8 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-yellow-500"></div>
              <span className="text-yellow-500 font-bold text-xs uppercase tracking-[0.4em]">Final Year Project 2026</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-12">
              MASTER YOUR <br />
              <span className="text-yellow-500">NIMCET RANK.</span>
            </h1>
            
            <p className="text-gray-400 text-xl font-normal max-w-2xl leading-relaxed mb-16">
              A high-precision AI portal engineered by **Guddu Kumar** for data-driven exam preparation. 
              Real-time analytics, secure testing, and elite performance tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/auth/register" className="bg-yellow-500 text-black px-12 py-6 font-black text-xl flex items-center justify-center gap-4 hover:scale-105 transition-all yellow-glow">
                LAUNCH ENGINE <Rocket />
              </Link>
              <Link href="/auth/login" className="border-2 border-white/10 px-12 py-6 font-black text-xl hover:bg-white/5 transition-all text-center">
                STUDENT LOGIN
              </Link>
            </div>
            
          </motion.div>
        </section>

        

        {/* --- STATS BAR --- */}
        <section className="bg-white/[0.03] border-y border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div><h4 className="text-4xl font-black mb-2">120</h4><p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">Questions / Mock</p></div>
            <div><h4 className="text-4xl font-black mb-2">AI</h4><p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">Growth Engine</p></div>
            <div><h4 className="text-4xl font-black mb-2">100%</h4><p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">Code Accuracy</p></div>
            <div><h4 className="text-4xl font-black mb-2">24/7</h4><p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">Cloud Access</p></div>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="py-40 px-8 max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="p-12 border border-white/5 bg-white/[0.02] rounded-3xl hover:border-yellow-500/50 transition-all group">
            <Zap className="text-yellow-500 mb-8" size={40} />
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Bulk Upload</h3>
            <p className="text-gray-400 leading-relaxed font-normal">Push 120+ questions instantly via Excel. Admin controls built for speed and efficiency.</p>
          </div>
          <div className="p-12 border border-white/5 bg-white/[0.02] rounded-3xl hover:border-yellow-500/50 transition-all group">
            <BarChart3 className="text-yellow-500 mb-8" size={40} />
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Smart Analysis</h3>
            <p className="text-gray-400 leading-relaxed font-normal">AI-powered charts visualizing your performance across Math, LR, and CS.</p>
          </div>
          <div className="p-12 border border-white/5 bg-white/[0.02] rounded-3xl hover:border-yellow-500/50 transition-all group">
            <Shield className="text-yellow-500 mb-8" size={40} />
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Secure Vault</h3>
            <p className="text-gray-400 leading-relaxed font-normal">Role-based access ensuring student data privacy and system integrity.</p>
          </div>
        </section>

        {/* --- FOUNDERS SECTION --- */}
        <section id="founders" className="py-40 px-8 bg-[#050505]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-24 text-center">THE <span className="text-yellow-500">FOUNDERS.</span></h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Guddu Card */}
              <div className="p-16 border border-white/5 bg-black rounded-3xl hover:border-yellow-500 transition-all group">
                <Users className="text-yellow-500 mb-8" size={48} />
                <h3 className="text-4xl font-black mb-2 uppercase">Guddu Kumar</h3>
                <p className="text-yellow-500 text-xs font-bold tracking-[0.3em] uppercase mb-10">Lead Software Architect</p>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">Software Developer and Data Scientist managing core backend, database security, and AI logic.</p>
                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">BCA (DS & AI) | ICFAI University Jharkhand</div>
              </div>

              {/* Shiuli Card */}
              <div className="p-16 border border-white/5 bg-black rounded-3xl hover:border-white/20 transition-all group">
                <Layout className="text-white mb-8 opacity-40 group-hover:opacity-100" size={48} />
                <h3 className="text-4xl font-black mb-2 uppercase">Shiuli Riya</h3>
                <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-10 group-hover:text-yellow-500">Project Partner & UI Designer</p>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">Collaborating on project design and creating a seamless frontend experience for aspirants.</p>
                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">BCA (DS & AI) | ICFAI University Jharkhand</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-24 px-8 text-center border-t border-white/5">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em] mb-12">
            © 2026 NIMCET AI EXAM PORTAL • ICFAI UNIVERSITY JHARKHAND
          </p>
          <div className="flex justify-center gap-10 text-gray-500">
            <Github size={24} className="hover:text-yellow-500 cursor-pointer transition-colors" />
            <Twitter size={24} className="hover:text-yellow-500 cursor-pointer transition-colors" />
          </div>
        </footer>

      </div>
    </>
  );
}
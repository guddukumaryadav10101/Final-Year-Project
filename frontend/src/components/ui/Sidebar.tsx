"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', Icon: Users },
    { href: '/admin/manage-tests', label: 'Mock Tests', Icon: BookOpen },
    { href: '/admin/analytics', label: 'Analytics', Icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', Icon: Settings },
  ];

  const logout = () => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 shadow-2xl h-screen fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Mock Test Platform</p>
      </div>

      <nav className="p-6 space-y-2">
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl text-slate-300 hover:bg-slate-800/50 hover:text-white font-bold transition-all group">
            <item.Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button onClick={logout} className="w-full flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-red-600/50 border border-slate-700 rounded-2xl text-slate-300 hover:text-white font-bold transition-all">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

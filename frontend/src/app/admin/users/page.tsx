"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import { Users, Trash2, Edit3, Loader2, ArrowLeft, Search, UserCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BASE_URL = 'http://localhost:5000';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role || role !== 'admin') {
      router.replace('/auth/login');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Kya aap sach mein ${name} ko delete karna chahte hain?`)) return;
    
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(user => user._id !== id));
      }
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // --- Search Logic ---
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex bg-slate-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-400 font-black animate-pulse">FETCHING STUDENT DATABASE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <button 
              onClick={() => router.push('/admin/dashboard')} 
              className="flex items-center gap-2 text-slate-500 hover:text-blue-400 font-bold transition mb-4 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO COMMAND CENTER
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                STUDENT DIRECTORY <span className="text-blue-500 text-2xl">[{filteredUsers.length}]</span>
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Name or Email..."
              className="bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 w-full md:w-96 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Student Info</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Status/Role</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Registration Date</th>
                  <th className="p-6 text-center text-xs font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-500/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center font-black text-blue-400 border border-slate-700 shadow-inner">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{user.fullName}</p>
                          <p className="text-slate-500 font-mono text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                          user.role === 'admin' 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          <UserCheck size={12} />
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-slate-400 font-medium">{new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}</p>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center gap-3 justify-center">
                        <button 
                          onClick={() => handleDelete(user._id, user.fullName)}
                          disabled={deletingId === user._id}
                          className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                        >
                          {deletingId === user._id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="mt-12 text-center py-24 bg-slate-900/30 rounded-[2rem] border-2 border-dashed border-slate-800">
            <div className="bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-400 mb-2 italic underline decoration-blue-500 underline-offset-8">
              NO STUDENTS FOUND
            </h3>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import React, { useState } from 'react';

export default function AddMockPage() {
    const [testName, setTestName] = useState("");
    const [uploadMode, setUploadMode] = useState("bulk");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSaveMock = async () => {
        if (!testName || !selectedFile) {
            alert("Bhai, Name aur File dono zaroori hain!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('testName', testName);
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:5000/api/admin/create-mock', {
                method: 'POST',
                body: formData, // Browser automatically sets Content-Type to multipart/form-data
            });

            const data = await response.json();

            if (response.ok) {
                alert(`🚀 Success: ${data.msg}`);
                setTestName("");
                setSelectedFile(null);
            } else {
                alert(`❌ Error: ${data.msg || data.error}`);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Backend connect nahi ho pa raha!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
            <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Create New Mock Test
            </h1>
            
            <div className="max-w-4xl bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                {/* Test Name Input */}
                <div className="mb-8">
                    <label className="block text-slate-400 mb-2 font-medium">Mock Test Name</label>
                    <input 
                        type="text" 
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        placeholder="e.g. NIMCET 2026 Full Length Mock 01"
                        className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-lg"
                    />
                </div>

                {/* Mode Selector */}
                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => setUploadMode("bulk")}
                        className={`flex-1 py-4 rounded-xl font-bold border transition-all ${uploadMode === 'bulk' ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                    >
                        Bulk Upload (Excel)
                    </button>
                    <button 
                        onClick={() => setUploadMode("manual")}
                        className={`flex-1 py-4 rounded-xl font-bold border transition-all ${uploadMode === 'manual' ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                    >
                        Add Section-wise
                    </button>
                </div>

                {/* Bulk Upload Section */}
                {uploadMode === "bulk" && (
                    <div className="relative border-2 border-dashed border-slate-700 p-12 rounded-2xl text-center hover:border-blue-500 transition-all group">
                        <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="space-y-2">
                            <p className="text-blue-400 font-bold text-xl">
                                {selectedFile ? selectedFile.name : "Click or Drag Excel File"}
                            </p>
                            <p className="text-slate-500 text-sm">Make sure it has Question, OptionA, OptionB... headers</p>
                        </div>
                    </div>
                )}

                {/* Manual Section Placeholder */}
                {uploadMode === "manual" && (
                    <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <p className="text-amber-400 font-medium">⚠️ Section-wise manual entry is currently under development.</p>
                        <p className="text-slate-400 text-sm mt-2">Please use Bulk Upload for now to populate the 120 questions.</p>
                    </div>
                )}

                <button 
                    onClick={handleSaveMock}
                    disabled={loading}
                    className={`w-full mt-10 py-5 rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-green-900/20'}`}
                >
                    {loading ? "UPLOADING DATA..." : "SAVE MOCK TEST 🚀"}
                </button>
            </div>
        </div>
    );
}
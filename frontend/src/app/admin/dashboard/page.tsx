"use client";
import React, { useState } from 'react';

export default function AdminDashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Select a file first");
        setUploading(true);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('testId', 'MOCK_TEST_01'); // Static for now

        const res = await fetch('http://localhost:5000/api/admin/upload-questions', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) alert("Questions Uploaded!");
        setUploading(false);
    };

    return (
        <div className="p-8 bg-slate-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Admin Panel - NIMCET Mock Analyser</h1>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md">
                <h2 className="text-xl mb-4">Bulk Question Upload</h2>
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-6 w-full bg-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-500 disabled:bg-gray-600 transition"
                >
                    {uploading ? "Processing..." : "Upload Excel"}
                </button>
            </div>
        </div>
    );
}
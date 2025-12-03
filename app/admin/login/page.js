"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin'); // Redirect to dashboard on success
    } else {
      setError('Incorrect Password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex justify-center mb-6 text-brand-dark">
            <Lock size={48} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <input 
          type="password" 
          placeholder="Enter Admin Password" 
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 ring-brand-dark"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        
        <button className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-black transition-colors">
          Unlock Panel
        </button>
      </form>
    </div>
  );
}
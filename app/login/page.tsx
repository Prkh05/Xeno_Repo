"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Lock, Mail, Loader2, Terminal, Shield } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('xenoUser', JSON.stringify(res.data.user));
      router.push('/'); 
    } catch (err: any) {
      setError(err.response?.data?.error || "ACCESS_DENIED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-900 selection:text-white">
      
      {/* Background Effects */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-green-900/10 pointer-events-none" />

      {/* Main Terminal Window */}
      <div className="bg-black/80 border border-green-800 p-8 w-full max-w-md relative backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        
        {/* Decorative Corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

        <div className="flex items-center gap-3 mb-8 border-b border-green-900 pb-4">
          <Terminal className="w-6 h-6 animate-pulse text-green-400" />
          <h1 className="text-xl tracking-widest font-bold text-green-400 uppercase">
            System_Login
          </h1>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-500 p-3 mb-6 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4" />
            ERROR: {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-green-700 mb-1 block">Operator ID</label>
            <div className="flex items-center border-b border-green-900 group-focus-within:border-green-500 bg-green-900/5 transition-colors">
              <span className="pl-3 pr-2 text-green-700"><Mail className="w-4 h-4" /></span>
              <input 
                type="email"
                className="w-full bg-transparent p-3 outline-none text-green-400 placeholder-green-900/50 text-sm"
                placeholder="ENTER_EMAIL"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-green-700 mb-1 block">Passcode</label>
            <div className="flex items-center border-b border-green-900 group-focus-within:border-green-500 bg-green-900/5 transition-colors">
              <span className="pl-3 pr-2 text-green-700"><Lock className="w-4 h-4" /></span>
              <input 
                type="password"
                className="w-full bg-transparent p-3 outline-none text-green-400 placeholder-green-900/50 text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-900/20 hover:bg-green-600 hover:text-black border border-green-600 text-green-500 font-bold py-3 uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-6 group relative overflow-hidden"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
               <span className="group-hover:translate-x-1 transition-transform">AUTHENTICATE</span>
               <div className="absolute inset-0 bg-green-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </>}
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-green-800">
          New_User? <a href="/signup" className="text-green-500 hover:text-green-400 hover:underline">Initialize_Sequence</a>
        </div>
      </div>
    </div>
  );
}
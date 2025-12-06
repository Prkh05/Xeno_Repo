"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, Database, Key, Shield } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', shopUrl: '', accessToken: '' });
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/signup', form);
      // Success! Go to login
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || "REGISTRATION_FAILED");
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

      <div className="bg-black/90 border border-green-800 p-8 w-full max-w-lg relative backdrop-blur-xl shadow-2xl">
        
        {/* Decorative Header */}
        <div className="flex justify-between items-start mb-8 border-b border-green-900 pb-4">
            <div>
                <h1 className="text-xl tracking-[0.2em] font-bold text-green-400 uppercase mb-1">
                    New_Operator
                </h1>
                <p className="text-[10px] text-green-700 uppercase tracking-widest">Secure Uplink Configuration</p>
            </div>
            <Shield className="w-8 h-8 text-green-900 animate-pulse" />
        </div>
        
        {error && (
            <div className="bg-red-950/30 border-l-2 border-red-600 text-red-500 p-3 mb-6 text-xs font-bold">
             ! SYSTEM_ERROR: {error}
            </div>
        )}

        <div className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-[9px] uppercase tracking-widest text-green-800 mb-1 block">Operator ID</label>
                <input 
                    placeholder="EMAIL"
                    className="w-full bg-green-900/10 border border-green-900 p-3 text-green-400 placeholder-green-900/30 text-sm focus:border-green-500 focus:bg-black outline-none transition-all"
                    onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
              <div className="group">
                <label className="text-[9px] uppercase tracking-widest text-green-800 mb-1 block">Passcode</label>
                <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-green-900/10 border border-green-900 p-3 text-green-400 placeholder-green-900/30 text-sm focus:border-green-500 focus:bg-black outline-none transition-all"
                    onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
          </div>

          <div className="pt-4 border-t border-green-900/50">
              <div className="flex items-center gap-2 mb-3 text-green-600">
                  <Key className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest">Target Connection Parameters</span>
              </div>
              
              <div className="space-y-4">
                  <input 
                    placeholder="TARGET_DOMAIN (store.myshopify.com)"
                    className="w-full bg-green-900/10 border border-green-900 p-3 text-green-400 placeholder-green-900/30 text-sm focus:border-green-500 focus:bg-black outline-none transition-all font-mono"
                    onChange={e => setForm({...form, shopUrl: e.target.value})}
                  />
                  <input 
                    type="password"
                    placeholder="ACCESS_TOKEN (shpat_...)"
                    className="w-full bg-green-900/10 border border-green-900 p-3 text-green-400 placeholder-green-900/30 text-sm focus:border-green-500 focus:bg-black outline-none transition-all font-mono"
                    onChange={e => setForm({...form, accessToken: e.target.value})}
                  />
              </div>
          </div>

          <button 
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-6 bg-green-600 hover:bg-green-500 text-black font-bold py-3 uppercase tracking-[0.2em] text-xs transition-all flex justify-center items-center shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "INITIATE_PROTOCOL"}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <a href="/login" className="text-[10px] uppercase tracking-widest text-green-800 hover:text-green-500 transition-colors">
            {'<'} Return_To_Login
          </a>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Terminal, Cpu, Wifi, Shield, Activity, Lock, Zap, LogOut } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  
  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(["System initialized...", "Waiting for command..."]);
  const [glitch, setGlitch] = useState(false);

  // 1. Check Auth (If not logged in, go to login page)
  useEffect(() => {
    const storedUser = localStorage.getItem('xenoUser');
    if (!storedUser) {
        router.push('/login');
    } else {
        setUser(JSON.parse(storedUser));
        addLog("USER_IDENTIFIED: ACCESS_GRANTED");
    }
  }, []);

  // 2. Mouse & Glitch Effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 2000);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(interval);
    };
  }, []);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 8));
  };

  const handleSync = async () => {
    if (!user) return;
    setLoading(true);
    addLog("INITIATING HANDSHAKE WITH SHOPIFY...");
    
    try {
        addLog(`TARGET: ${user.shopUrl}`);
        
        // 1. Ingest (Uses stored credentials)
        const ingestRes = await axios.post('/api/ingest', { 
            shopUrl: user.shopUrl, 
            accessToken: user.accessToken, 
            email: user.email 
        });

        if (ingestRes.status !== 200) throw new Error("INGEST_FAILURE");
        
        addLog("DATA PACKET RECEIVED. DECRYPTING...");

        // 2. Stats
        const statsRes = await axios.post('/api/stats', { email: user.email });
        setData(statsRes.data);
        addLog("SYSTEM SYNC COMPLETE. VISUALIZING...");
    
    } catch (err: any) {
        console.error(err);
        addLog(`CRITICAL ERROR: ${err.message || "CONNECTION_RESET"}`);
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = () => {
    addLog("TERMINATING SESSION...");
    setTimeout(() => {
        localStorage.removeItem('xenoUser');
        router.push('/login');
    }, 800);
  };

  if (!user) return null; // Prevent flicker

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono overflow-hidden relative selection:bg-green-900 selection:text-white">
      
      {/* --- CSS FOR CRT EFFECTS --- */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 0, 0.02) 51%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 50;
        }
        .scanline::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: rgba(18, 16, 16, 0.1);
          opacity: 0;
          z-index: 50;
          pointer-events: none;
          animation: scanline 8s linear infinite;
        }
        .glow-text {
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3);
        }
        .grid-bg {
          background-image: linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Background Grid */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 scanline pointer-events-none" />

      {/* Mouse Radar Light */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-75"
        style={{
          background: `radial-gradient(400px at ${mousePos.x}px ${mousePos.y}px, rgba(34, 197, 94, 0.1), transparent 80%)`
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 border-b border-green-900/50 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 animate-pulse" />
          <h1 className="text-xl tracking-widest font-bold glow-text">
            XENO_OS <span className="text-xs opacity-50">v.4.0.2-BETA</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">NET_SECURE</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">FIREWALL_ACTIVE</span>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 border border-red-900/50 bg-red-900/10 hover:bg-red-900/30 text-red-500 px-3 py-1 text-xs uppercase tracking-widest transition-all"
            >
                <LogOut className="w-3 h-3" /> Terminate_Session
            </button>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CONTROL TERMINAL */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Connection Panel */}
          <div className={`border border-green-800 bg-black/50 p-6 relative group transition-all duration-100 ${glitch ? 'translate-x-1' : ''}`}>
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>

            <h2 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-green-400">
              <Lock className="w-4 h-4" /> Operator_Profile
            </h2>

            <div className="space-y-4 mb-6">
                <div className="p-3 bg-green-900/10 border-l-2 border-green-600">
                    <p className="text-[10px] uppercase tracking-widest text-green-800 mb-1">Active User</p>
                    <p className="text-sm text-green-400 truncate">{user.email}</p>
                </div>
                <div className="p-3 bg-green-900/10 border-l-2 border-green-600">
                    <p className="text-[10px] uppercase tracking-widest text-green-800 mb-1">Target Node</p>
                    <p className="text-sm text-green-400 truncate">{user.shopUrl}</p>
                </div>
            </div>

            <button 
              onClick={handleSync}
              disabled={loading}
              className="w-full border border-green-600 bg-green-900/20 text-green-400 hover:bg-green-500 hover:text-black py-3 uppercase text-xs font-bold tracking-[0.2em] transition-all flex justify-center items-center gap-2 group relative overflow-hidden"
            >
              {loading ? <Activity className="w-4 h-4 animate-spin" /> : <>
                 <Zap className="w-4 h-4" /> EXECUTE_SYNC
              </>}
            </button>
          </div>

          {/* System Logs */}
          <div className="border border-green-900 bg-black/80 p-4 h-48 overflow-hidden relative">
            <h3 className="text-[10px] uppercase tracking-widest mb-2 text-green-700 border-b border-green-900 pb-1">System Logs</h3>
            <div className="space-y-1 font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className={`truncate ${i === 0 ? 'text-green-400 glow-text' : 'text-green-800'}`}>
                  <span className="mr-2 opacity-50">{'>'}</span>{log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: VISUALIZATION */}
        <div className="lg:col-span-2 space-y-6">
          
          {!data ? (
            // EMPTY STATE
            <div className="h-full border border-dashed border-green-900/50 rounded flex flex-col items-center justify-center p-12 text-green-900">
               <Cpu className="w-24 h-24 mb-4 animate-pulse opacity-20" />
               <p className="tracking-widest text-sm animate-pulse">NO_SIGNAL_DETECTED</p>
               <p className="text-xs mt-2 opacity-50">INITIATE SYNC TO VISUALIZE DATA...</p>
            </div>
          ) : (
            // DATA DASHBOARD
            <div className="space-y-6 animate-in fade-in duration-500">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-green-600/50 bg-green-900/10 p-6 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-9xl text-green-500 opacity-5 font-black">
                    ₹
                  </div>
                  <p className="text-xs text-green-600 uppercase tracking-widest">Revenue_Stream</p>
                  <p className="text-4xl font-bold mt-2 glow-text text-green-400">
                    ₹{data.totalRevenue?.toLocaleString()}
                  </p>
                </div>

                <div className="border border-green-600/50 bg-green-900/10 p-6 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-9xl text-green-500 opacity-5 font-black">
                    #
                  </div>
                  <p className="text-xs text-green-600 uppercase tracking-widest">Trans_Count</p>
                  <p className="text-4xl font-bold mt-2 glow-text text-green-400">
                    {data.totalOrders}
                  </p>
                </div>
              </div>

              {/* Main Chart */}
              <div className="border border-green-800 bg-black/40 p-6 relative">
                 <div className="absolute top-0 left-0 bg-green-600 text-black text-[10px] px-2 py-1 font-bold uppercase">
                   Spending_Analysis_Matrix
                 </div>
                 
                 <div className="h-[350px] w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.topCustomers}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#14532d" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#22c55e" 
                                tick={{fontSize: 10, fontFamily: 'monospace'}}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#15803d" 
                                tick={{fontSize: 10, fontFamily: 'monospace'}}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(20, 83, 45, 0.3)'}}
                                contentStyle={{ 
                                    backgroundColor: '#000', 
                                    border: '1px solid #22c55e',
                                    color: '#22c55e',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <Bar 
                                dataKey="totalSpent" 
                                fill="#22c55e" 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

            </div>
          )}

        </div>

      </main>
      
      {/* Footer Status Line */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-900/20 border-t border-green-900 p-1 flex justify-between px-4 text-[10px] uppercase text-green-800">
         <span>SYS_STATUS: ONLINE</span>
         <span className="animate-pulse">_CURSOR_ACTIVE</span>
         <span>SECURE_CONNECTION: TRUE</span>
      </div>

    </div>
  );
}
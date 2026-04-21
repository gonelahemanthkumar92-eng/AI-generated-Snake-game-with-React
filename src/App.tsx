/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Power, Settings, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background Atmospheric Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-neon-cyan/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-neon-pink/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      {/* Header / HUD */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
            <Power size={20} className="text-neon-cyan neon-text-cyan" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold tracking-tight text-white leading-none">
              NEON <span className="text-neon-cyan">RHYTHM</span>
            </h1>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mt-1">
              Neural Grid Protocol v1.0.4
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
            <Settings size={20} className="text-zinc-400" />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-4 glass rounded-lg">
            <ShieldCheck size={16} className="text-neon-lime" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Secure Connection</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:mt-12">
        {/* Sidebar Left: Info / Stats (Hidden on mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex lg:col-span-3 flex-col gap-6"
        >
          <div className="glass p-6 rounded-3xl space-y-4">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Telemetry</h2>
            <div className="space-y-3">
              {[
                { label: 'Latency', value: '14ms', color: 'text-neon-cyan' },
                { label: 'Bandwidth', value: '2.4 Gbps', color: 'text-zinc-100' },
                { label: 'Signal', value: '98%', color: 'text-neon-lime' },
                { label: 'Core Temp', value: '42°C', color: 'text-neon-pink' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs text-zinc-500">{item.label}</span>
                  <span className={`text-xs font-mono ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ["10%", "90%", "30%", "60%"] }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="h-full bg-neon-violet neon-shadow-violet"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">World Record</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center p-1">
                <img src="https://picsum.photos/seed/user1/100/100" className="w-full h-full rounded-full grayscale" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Ghost_0x</p>
                <p className="text-[10px] font-mono text-neon-pink">99,420 PTS</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center: Game */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="lg:col-span-6 flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Sidebar Right: Music Player */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 flex justify-center"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer / Meta */}
      <footer className="absolute bottom-0 left-0 w-full p-6 flex justify-center items-center z-50">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
           &copy; 2026 Neural Grid Entertainment // Experimental Neural Interface
        </p>
      </footer>
    </div>
  );
}


import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';

interface LoadingScreenProps {
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 100 }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full text-center space-y-5">
        {/* Animated Cyber Strawberry Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-rose-500 p-0.5 animate-pulse shadow-2xl shadow-cyan-500/30">
            <div className="w-full h-full bg-[#050b14] rounded-3xl flex items-center justify-center text-4xl">
              🍓
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-300 to-white mb-1">
            BERRYVISION 3D
          </h1>
          <p className="text-xs font-mono text-cyan-300 uppercase tracking-widest">
            Khởi tạo Không Gian Triển Lãm Số
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5">
          <div
            className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 h-full rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
            style={{ width: `${Math.min(100, Math.max(10, progress))}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Nạp Shaders & Mô Hình 3D...</span>
          </div>
          <span className="font-bold text-cyan-300">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ExhibitionZoneId } from '../../types';
import { EXHIBITION_ZONES } from '../../hooks/useCameraTrack';
import { Camera, Orbit, Volume2, VolumeX, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface NavbarHUDProps {
  activeZoneId: ExhibitionZoneId;
  onSelectZone: (zoneId: ExhibitionZoneId) => void;
  cameraMode: 'CINEMATIC_SCROLL' | 'FREE_ORBIT';
  onToggleCameraMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  fps: number;
}

export const NavbarHUD: React.FC<NavbarHUDProps> = ({
  activeZoneId,
  onSelectZone,
  cameraMode,
  onToggleCameraMode,
  soundEnabled,
  onToggleSound,
  fps,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & AI Project Identity */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 pointer-events-auto border-cyan-500/30 shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/30">
            🍓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-emerald-300 to-white">
                BerryVisionAI 3D
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                v2.4 SPATIAL
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Hệ Thống AI & Robot Nhà Kính Dâu Tây
            </div>
          </div>
        </div>

        {/* Quick Teleport Zone Navigation Dock (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl pointer-events-auto border-slate-700/50">
          {EXHIBITION_ZONES.map((zone, idx) => {
            const isActive = activeZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">0{idx + 1}</span>
                <span>{zone.badge.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Telemetry Stats */}
        <div className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-2.5 pointer-events-auto border-slate-700/50">
          {/* Camera Mode Switcher */}
          <button
            onClick={onToggleCameraMode}
            title={cameraMode === 'CINEMATIC_SCROLL' ? 'Chuyển sang Xoay Tự Do (Free Orbit)' : 'Chuyển sang Chế Độ Điện Ảnh (Cinematic)'}
            className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              cameraMode === 'FREE_ORBIT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            {cameraMode === 'FREE_ORBIT' ? (
              <>
                <Orbit className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span className="hidden sm:inline text-[11px] font-mono">DRONE 360°</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-mono">CINEMATIC</span>
              </>
            )}
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Real-time FPS & Backend Health Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-700/80 text-[11px] font-mono">
            <div className="flex items-center gap-1 text-emerald-400" title="AI Backend REST API Server">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">ONLINE</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{fps} FPS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

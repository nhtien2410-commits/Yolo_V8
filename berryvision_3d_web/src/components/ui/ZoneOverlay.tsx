import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExhibitionZone, ExhibitionZoneId } from '../../types';
import { EXHIBITION_ZONES } from '../../hooks/useCameraTrack';
import { ChevronRight, ChevronLeft, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

interface ZoneOverlayProps {
  activeZone: ExhibitionZone;
  onSelectZone: (zoneId: ExhibitionZoneId) => void;
  onOpenAction?: () => void;
}

export const ZoneOverlay: React.FC<ZoneOverlayProps> = ({
  activeZone,
  onSelectZone,
  onOpenAction
}) => {
  const currentIndex = EXHIBITION_ZONES.findIndex(z => z.id === activeZone.id);
  const prevZone = EXHIBITION_ZONES[(currentIndex - 1 + EXHIBITION_ZONES.length) % EXHIBITION_ZONES.length];
  const nextZone = EXHIBITION_ZONES[(currentIndex + 1) % EXHIBITION_ZONES.length];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Main Zone Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="lg:col-span-8 glass-panel p-5 sm:p-6 rounded-3xl pointer-events-auto border-cyan-500/25 shadow-2xl relative overflow-hidden"
          >
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge & Title */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-mono font-bold text-xs shadow-md shadow-cyan-500/20">
                  ZONE 0{currentIndex + 1}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider uppercase">
                  {activeZone.badge}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {EXHIBITION_ZONES.length}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
              {activeZone.title}
            </h2>
            <p className="text-xs sm:text-sm text-cyan-300 font-medium mb-3">
              {activeZone.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-2 sm:line-clamp-none">
              {activeZone.description}
            </p>

            {/* Bullet Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {activeZone.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-700/60">
              {activeZone.stats.map((stat, i) => (
                <div key={i} className="bg-slate-900/70 px-3 py-2 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{stat.label}</div>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-white flex items-baseline gap-1">
                    <span className="text-cyan-300">{stat.value}</span>
                    {stat.unit && <span className="text-[10px] text-slate-400">{stat.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Zone Navigation Switcher Buttons (Next / Prev) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 pointer-events-auto">
          {/* Quick Zone Jump Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectZone(prevZone.id)}
              className="flex-1 py-3 px-4 rounded-2xl glass-panel hover:bg-slate-800/80 transition-all text-xs font-bold text-slate-200 flex items-center justify-center gap-2 shadow-lg border border-slate-700/60"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="truncate">{prevZone.badge.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => onSelectZone(nextZone.id)}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold transition-all text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25"
            >
              <span className="truncate">{nextZone.badge.split(' ')[0]}</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Quick Action Interactive Button */}
          {activeZone.id === 'disease_lab' && (
            <div className="glass-panel p-3 rounded-2xl border-red-500/30 text-xs text-slate-300 text-center">
              💡 <span className="font-semibold text-white">Mẹo:</span> Dùng bảng chọn 5 bệnh học bên trái để xem mô hình biến đổi lá 3D!
            </div>
          )}

          {activeZone.id === 'spray_matrix' && (
            <div className="glass-panel p-3 rounded-2xl border-cyan-500/30 text-xs text-slate-300 text-center">
              💡 <span className="font-semibold text-white">Mẹo:</span> Nhấp trực tiếp vào các ô luống 3D để xem thông số vi khí hậu & ra lệnh phun!
            </div>
          )}

          {activeZone.id === 'agribot' && (
            <div className="glass-panel p-3 rounded-2xl border-cyan-500/30 text-xs text-slate-300 text-center">
              💡 <span className="font-semibold text-white">Mẹo:</span> Nhấn nút "TEST PHUN THUỐC 3D" trên robot để xem hiệu ứng phun sương!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

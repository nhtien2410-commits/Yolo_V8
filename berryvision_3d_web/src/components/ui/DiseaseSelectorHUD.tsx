import React from 'react';
import { DiseaseClassId } from '../../types';
import { DISEASE_SPECS } from '../3d/HoloStrawberryLab';
import { Sparkles, Pill, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DiseaseSelectorHUDProps {
  selectedDisease: DiseaseClassId;
  onSelectDisease: (d: DiseaseClassId) => void;
}

export const DiseaseSelectorHUD: React.FC<DiseaseSelectorHUDProps> = ({
  selectedDisease,
  onSelectDisease,
}) => {
  const currentSpec = DISEASE_SPECS[selectedDisease];

  return (
    <div className="fixed top-20 left-4 z-40 max-w-sm w-full pointer-events-none hidden md:block">
      <div className="glass-panel p-4 rounded-3xl pointer-events-auto border-cyan-500/30 shadow-2xl space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Chọn Lớp Bệnh Học 3D
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            YOLOv8-NANO
          </span>
        </div>

        {/* 5 Disease Selector Buttons */}
        <div className="grid grid-cols-1 gap-1.5">
          {(Object.keys(DISEASE_SPECS) as DiseaseClassId[]).map((diseaseKey) => {
            const spec = DISEASE_SPECS[diseaseKey];
            const isSelected = selectedDisease === diseaseKey;

            return (
              <button
                key={diseaseKey}
                onClick={() => onSelectDisease(diseaseKey)}
                className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between border ${
                  isSelected
                    ? 'glass-panel-emerald bg-slate-900/90 shadow-lg scale-[1.02]'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
                style={{
                  borderColor: isSelected ? spec.hex : undefined,
                  boxShadow: isSelected ? `0 0 15px ${spec.hex}30` : undefined,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: spec.hex }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{spec.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
                      {spec.scientificName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-extrabold text-slate-950 shadow-sm"
                    style={{ backgroundColor: spec.hex }}
                  >
                    {spec.confidence}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Prescriptive Agronomy Box for Selected Disease */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Pill className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phác Đồ Điều Trị & Phun Thuốc:</span>
          </div>

          <div className="text-slate-300 text-[11px] leading-relaxed">
            {currentSpec.prescription}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Thuốc đặc trị:</span>
            <span className="font-bold text-cyan-300 truncate max-w-[180px]">
              {currentSpec.sprayAgent}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Liều lượng:</span>
            <span className="font-mono text-emerald-400">{currentSpec.dosages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

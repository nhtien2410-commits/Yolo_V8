import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { BedCell } from '../../types';

interface SprayMatrix3DProps {
  onBedClick?: (bed: BedCell) => void;
}

const INITIAL_BEDS: BedCell[] = [
  // Row 1
  { code: 'X01_Y01', col: 1, row: 1, diseaseId: 'khoe_manh', confidence: 89.2, moisture: 78, temp: 21.4, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X02_Y01', col: 2, row: 1, diseaseId: 'khoe_manh', confidence: 91.5, moisture: 79, temp: 21.6, ec: 1.4, ph: 6.1, sprayStatus: 'idle' },
  { code: 'X03_Y01', col: 3, row: 1, diseaseId: 'chay_la', confidence: 99.3, moisture: 64, temp: 24.2, ec: 1.8, ph: 5.8, sprayStatus: 'pending' },
  { code: 'X04_Y01', col: 4, row: 1, diseaseId: 'khoe_manh', confidence: 87.4, moisture: 81, temp: 21.2, ec: 1.3, ph: 6.3, sprayStatus: 'idle' },
  { code: 'X05_Y01', col: 5, row: 1, diseaseId: 'dom_trang', confidence: 90.1, moisture: 85, temp: 22.0, ec: 1.5, ph: 6.0, sprayStatus: 'pending' },
  { code: 'X06_Y01', col: 6, row: 1, diseaseId: 'khoe_manh', confidence: 93.0, moisture: 80, temp: 21.5, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },

  // Row 2
  { code: 'X01_Y02', col: 1, row: 2, diseaseId: 'khoe_manh', confidence: 88.0, moisture: 77, temp: 21.3, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X02_Y02', col: 2, row: 2, diseaseId: 'vang_ua', confidence: 84.2, moisture: 72, temp: 22.5, ec: 1.1, ph: 6.5, sprayStatus: 'pending' },
  { code: 'X03_Y02', col: 3, row: 2, diseaseId: 'khoe_manh', confidence: 90.4, moisture: 79, temp: 21.4, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X04_Y02', col: 4, row: 2, diseaseId: 'khoe_manh', confidence: 92.1, moisture: 80, temp: 21.3, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X05_Y02', col: 5, row: 2, diseaseId: 'kho_heo', confidence: 51.5, moisture: 58, temp: 25.1, ec: 2.1, ph: 5.5, sprayStatus: 'pending' },
  { code: 'X06_Y02', col: 6, row: 2, diseaseId: 'khoe_manh', confidence: 86.8, moisture: 82, temp: 21.1, ec: 1.3, ph: 6.3, sprayStatus: 'idle' },

  // Row 3
  { code: 'X01_Y03', col: 1, row: 3, diseaseId: 'khoe_manh', confidence: 94.2, moisture: 80, temp: 21.2, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X02_Y03', col: 2, row: 3, diseaseId: 'khoe_manh', confidence: 89.9, moisture: 78, temp: 21.5, ec: 1.4, ph: 6.1, sprayStatus: 'idle' },
  { code: 'X03_Y03', col: 3, row: 3, diseaseId: 'khoe_manh', confidence: 91.2, moisture: 81, temp: 21.4, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X04_Y03', col: 4, row: 3, diseaseId: 'chay_la', confidence: 96.5, moisture: 66, temp: 23.8, ec: 1.7, ph: 5.9, sprayStatus: 'pending' },
  { code: 'X05_Y03', col: 5, row: 3, diseaseId: 'khoe_manh', confidence: 95.0, moisture: 82, temp: 21.0, ec: 1.3, ph: 6.3, sprayStatus: 'idle' },
  { code: 'X06_Y03', col: 6, row: 3, diseaseId: 'khoe_manh', confidence: 88.5, moisture: 79, temp: 21.6, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },

  // Row 4
  { code: 'X01_Y04', col: 1, row: 4, diseaseId: 'khoe_manh', confidence: 92.8, moisture: 81, temp: 21.3, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X02_Y04', col: 2, row: 4, diseaseId: 'khoe_manh', confidence: 90.1, moisture: 79, temp: 21.5, ec: 1.4, ph: 6.1, sprayStatus: 'idle' },
  { code: 'X03_Y04', col: 3, row: 4, diseaseId: 'dom_trang', confidence: 86.9, moisture: 84, temp: 22.2, ec: 1.5, ph: 6.0, sprayStatus: 'pending' },
  { code: 'X04_Y04', col: 4, row: 4, diseaseId: 'khoe_manh', confidence: 93.4, moisture: 80, temp: 21.4, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X05_Y04', col: 5, row: 4, diseaseId: 'khoe_manh', confidence: 91.0, moisture: 78, temp: 21.7, ec: 1.4, ph: 6.2, sprayStatus: 'idle' },
  { code: 'X06_Y04', col: 6, row: 4, diseaseId: 'khoe_manh', confidence: 96.1, moisture: 83, temp: 21.1, ec: 1.3, ph: 6.3, sprayStatus: 'idle' },
];

export const SprayMatrix3D: React.FC<SprayMatrix3DProps> = ({ onBedClick }) => {
  const [beds, setBeds] = useState<BedCell[]>(INITIAL_BEDS);
  const [activeBed, setActiveBed] = useState<BedCell | null>(null);

  const handleSprayBed = (code: string) => {
    setBeds(prev => prev.map(b => b.code === code ? { ...b, sprayStatus: 'sprayed' } : b));
    if (activeBed?.code === code) {
      setActiveBed(prev => prev ? { ...prev, sprayStatus: 'sprayed' } : null);
    }
  };

  const getCellColor = (diseaseId: string, status: string) => {
    if (status === 'sprayed') return '#38bdf8'; // Cyan for sprayed
    switch (diseaseId) {
      case 'chay_la': return '#ef4444'; // Red
      case 'dom_trang': return '#f59e0b'; // Amber
      case 'vang_ua': return '#eab308'; // Yellow
      case 'kho_heo': return '#a855f7'; // Purple
      default: return '#10b981'; // Green
    }
  };

  return (
    <group position={[0, 0.2, -2]}>
      {/* Matrix Floor Pedestal */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[11.5, 0.15, 8.5]} />
        <meshStandardMaterial color="#030712" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Grid of 24 Strawberry Beds */}
      {beds.map((bed) => {
        // Compute 3D coordinate on the grid
        const posX = (bed.col - 3.5) * 1.75;
        const posZ = (bed.row - 2.5) * 1.85;
        const cellColor = getCellColor(bed.diseaseId, bed.sprayStatus);
        const isProblem = bed.diseaseId !== 'khoe_manh';
        const isSelected = activeBed?.code === bed.code;

        return (
          <group
            key={bed.code}
            position={[posX, 0.15, posZ]}
            onClick={(e) => {
              e.stopPropagation();
              setActiveBed(bed);
              onBedClick?.(bed);
            }}
          >
            {/* Raised Hydroponic Bed Box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.28, 1.5]} />
              <meshStandardMaterial
                color={isSelected ? '#1e293b' : '#091322'}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Glowing Bed Status Border */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[1.36, 0.04, 1.46]} />
              <meshStandardMaterial
                color={cellColor}
                emissive={cellColor}
                emissiveIntensity={isProblem ? (bed.sprayStatus === 'sprayed' ? 1.0 : 2.0) : 0.4}
              />
            </mesh>

            {/* Strawberry Crop Foliage on Bed */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <sphereGeometry args={[0.32, 8, 8]} />
              <meshStandardMaterial
                color={cellColor}
                roughness={0.6}
              />
            </mesh>

            {/* Bed Coordinate Text Badge */}
            <Html position={[0, 0.75, 0]} center distanceFactor={18}>
              <div
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight cursor-pointer transition-all ${
                  isProblem && bed.sprayStatus === 'pending'
                    ? 'bg-red-500/90 text-white animate-pulse shadow-md shadow-red-500/50'
                    : bed.sprayStatus === 'sprayed'
                    ? 'bg-cyan-500/90 text-slate-950 font-extrabold'
                    : 'bg-slate-900/80 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {bed.code}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Interactive Selected Bed Detail HUD */}
      {activeBed && (
        <Html position={[0, 3.5, 0]} center distanceFactor={12}>
          <div className="glass-panel p-4 rounded-xl text-slate-100 min-w-[280px] shadow-2xl border border-cyan-500/50 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span className="font-bold font-mono text-sm text-cyan-300">LUỐNG {activeBed.code}</span>
              </div>
              <button
                onClick={() => setActiveBed(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Chuẩn Đoán:</div>
                <div className="font-bold text-white truncate">{activeBed.diseaseId}</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Độ Tin Cậy:</div>
                <div className="font-bold text-cyan-300">{activeBed.confidence}%</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Nhiệt Độ:</div>
                <div className="font-mono text-white">{activeBed.temp}°C</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">Độ Ẩm Đất:</div>
                <div className="font-mono text-white">{activeBed.moisture}%</div>
              </div>
            </div>

            {activeBed.diseaseId !== 'khoe_manh' && activeBed.sprayStatus !== 'sprayed' ? (
              <button
                onClick={() => handleSprayBed(activeBed.code)}
                className="w-full py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-1.5"
              >
                <span>🎯 LỆNH ROBOT PHUN THUỐC ĐIỂM</span>
              </button>
            ) : (
              <div className="text-center text-xs py-1.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/40">
                ✓ Trạng Thái An Toàn / Đã Phun Sương
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

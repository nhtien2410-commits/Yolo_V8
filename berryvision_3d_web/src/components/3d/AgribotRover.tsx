import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface AgribotRoverProps {
  onSprayTrigger?: () => void;
  isSpraying?: boolean;
}

export const AgribotRover: React.FC<AgribotRoverProps> = ({ onSprayTrigger, isSpraying = false }) => {
  const lidarRef = useRef<THREE.Group>(null);
  const cameraTurretRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    // Spin LiDAR continuously at 10Hz
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 6.28;
    }
    // Smooth camera turret searching motion (-30 deg to +30 deg)
    if (cameraTurretRef.current) {
      cameraTurretRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
    }
    // Subtle wheel idle rotation
    wheelsRef.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += delta * 0.8;
    });
  });

  return (
    <group
      position={[10, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Robot Main Chassis (Titanium Gray & Emerald Accents) */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.6, 2.4]} />
        <meshStandardMaterial
          color={hovered ? '#1e293b' : '#0f172a'}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Top Deck Shield */}
      <mesh position={[0, 1.05, -0.1]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1.8]} />
        <meshStandardMaterial color="#00f2fe" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Front Glowing LED Headlights */}
      <mesh position={[0.55, 0.7, 1.21]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh position={[-0.55, 0.7, 1.21]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* 4 Heavy-Duty All-Terrain Wheels */}
      {[
        { pos: [1.05, 0.45, 0.75], key: 0 },
        { pos: [-1.05, 0.45, 0.75], key: 1 },
        { pos: [1.05, 0.45, -0.75], key: 2 },
        { pos: [-1.05, 0.45, -0.75], key: 3 },
      ].map((w) => (
        <group
          key={w.key}
          position={w.pos as [number, number, number]}
          ref={(el) => {
            if (el) wheelsRef.current[w.key] = el;
          }}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 24]} />
            <meshStandardMaterial color="#020617" roughness={0.8} metalness={0.2} />
          </mesh>
          {/* Wheel Rim Cap */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.38, 12]} />
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Stereo RGB Camera Turret (Front Scanning Mast) */}
      <group position={[0, 1.1, 0.7]} ref={cameraTurretRef}>
        {/* Turret Base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.3, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Dual Lens Bar */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.6, 0.18, 0.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Left & Right Optical Lenses */}
        <mesh position={[0.2, 0.35, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.5}
          />
        </mesh>
        <mesh position={[-0.2, 0.35, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 3D LiDAR Sensor Unit with Laser Scanning Cone */}
      <group position={[0, 1.1, -0.4]} ref={lidarRef}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 24]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
          <meshStandardMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={2.5}
          />
        </mesh>
        {/* Holographic LiDAR Raycast Cone */}
        <mesh position={[0, 0.32, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.2, 2.4, 16, 1, true]} />
          <meshBasicMaterial
            color="#00f2fe"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Rear High-Pressure Spray Boom & 4 Nozzles */}
      <group position={[0, 0.8, -1.25]}>
        {/* Boom Bar */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        {/* 4 Precision Spray Nozzles */}
        {[-0.7, -0.25, 0.25, 0.7].map((x, i) => (
          <mesh key={i} position={[x, -0.1, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.15, 8]} />
            <meshStandardMaterial
              color={isSpraying ? '#00f2fe' : '#94a3b8'}
              emissive={isSpraying ? '#00f2fe' : '#000000'}
              emissiveIntensity={isSpraying ? 2.0 : 0}
            />
          </mesh>
        ))}
      </group>

      {/* Interactive 3D Holographic Label & Spray Button */}
      <Html position={[0, 2.2, 0]} center distanceFactor={14}>
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          <div className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase glass-panel border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            AGRIBOT ROVER v2.4
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSprayTrigger?.();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              isSpraying
                ? 'bg-cyan-500 text-slate-950 scale-105 shadow-cyan-500/50'
                : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:scale-105'
            }`}
          >
            <span>{isSpraying ? '💨 ĐANG PHUN SƯƠNG...' : '🎯 TEST PHUN THUỐC 3D'}</span>
          </button>
        </div>
      </Html>
    </group>
  );
};

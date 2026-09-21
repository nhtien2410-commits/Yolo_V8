import React from 'react';
import { ExhibitionZoneId } from '../../types';

interface LightsProps {
  activeZone: ExhibitionZoneId;
}

export const Lights: React.FC<LightsProps> = ({ activeZone }) => {
  return (
    <>
      {/* Global Ambient Lighting */}
      <ambientLight intensity={0.65} color="#e0f2fe" />

      {/* Main Solar Ray (Sunlight through greenhouse roof) */}
      <directionalLight
        position={[15, 25, 15]}
        intensity={1.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Soft Blue Skylight Fill */}
      <directionalLight position={[-15, 18, -15]} intensity={0.5} color="#0284c7" />

      {/* Zone-Specific Mood Spotlights */}
      {activeZone === 'greenhouse' && (
        <pointLight position={[0, 10, 0]} intensity={2.5} distance={25} color="#10b981" />
      )}

      {activeZone === 'agribot' && (
        <>
          <pointLight position={[10, 4, 0]} intensity={3.5} distance={15} color="#00f2fe" />
          <spotLight
            position={[10, 8, 5]}
            target-position={[10, 0, 0]}
            angle={0.6}
            penumbra={0.8}
            intensity={4}
            color="#38bdf8"
          />
        </>
      )}

      {activeZone === 'disease_lab' && (
        <>
          <pointLight position={[-8, 4, 0]} intensity={3.0} distance={15} color="#ef4444" />
          <spotLight
            position={[-8, 7, 4]}
            target-position={[-8, 1, 0]}
            angle={0.5}
            penumbra={0.7}
            intensity={4.5}
            color="#f43f5e"
          />
        </>
      )}

      {activeZone === 'spray_matrix' && (
        <pointLight position={[0, 8, -2]} intensity={2.8} distance={20} color="#06b6d4" />
      )}

      {activeZone === 'neural_brain' && (
        <>
          <pointLight position={[0, 4, -10]} intensity={3.2} distance={18} color="#a855f7" />
          <pointLight position={[3, 2, -12]} intensity={2.0} distance={12} color="#ec4899" />
        </>
      )}

      {/* Ground Cyber Grid Glow */}
      <pointLight position={[0, -0.5, 0]} intensity={1.2} distance={30} color="#00f2fe" />
    </>
  );
};

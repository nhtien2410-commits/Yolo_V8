import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Environment } from '@react-three/drei';
import { Lights } from './Lights';
import { CameraController } from './CameraController';
import { ParticleField } from './ParticleField';
import { GreenhouseDome } from './GreenhouseDome';
import { AgribotRover } from './AgribotRover';
import { HoloStrawberryLab } from './HoloStrawberryLab';
import { SprayMatrix3D } from './SprayMatrix3D';
import { NeuralCore } from './NeuralCore';
import { ExhibitionZone, DiseaseClassId, BedCell } from '../../types';

interface SceneProps {
  activeZone: ExhibitionZone;
  cameraMode: 'CINEMATIC_SCROLL' | 'FREE_ORBIT';
  selectedDisease: DiseaseClassId;
  onSelectDisease: (d: DiseaseClassId) => void;
  isSpraying: boolean;
  onSprayTrigger: () => void;
  onBedClick: (bed: BedCell) => void;
}

export const Scene: React.FC<SceneProps> = ({
  activeZone,
  cameraMode,
  selectedDisease,
  onSelectDisease,
  isSpraying,
  onSprayTrigger,
  onBedClick
}) => {
  return (
    <div className="w-full h-full absolute inset-0 select-none">
      <Canvas
        shadows
        camera={{ position: [0, 8, 18], fov: 48, near: 0.1, far: 120 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <PerformanceMonitor />

        {/* Deep Cyber Space Atmospheric Fog */}
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 20, 70]} />

        {/* Dynamic Studio Lighting */}
        <Lights activeZone={activeZone.id} />

        {/* Camera Control System */}
        <CameraController
          activeZone={activeZone}
          cameraMode={cameraMode}
        />

        {/* Environment Sky Map reflections */}
        <Environment preset="city" />

        {/* 3D World Geometry */}
        <Suspense fallback={null}>
          <GreenhouseDome />
          <AgribotRover onSprayTrigger={onSprayTrigger} isSpraying={isSpraying} />
          <HoloStrawberryLab
            selectedDisease={selectedDisease}
            onSelectDisease={onSelectDisease}
          />
          <SprayMatrix3D onBedClick={onBedClick} />
          <NeuralCore />
          <ParticleField isSpraying={isSpraying} />
        </Suspense>
      </Canvas>
    </div>
  );
};

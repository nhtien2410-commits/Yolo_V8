import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ExhibitionZone, ExhibitionZoneId } from '../../types';

interface CameraControllerProps {
  activeZone: ExhibitionZone;
  cameraMode: 'CINEMATIC_SCROLL' | 'FREE_ORBIT';
  onZoneChange?: (zoneId: ExhibitionZoneId) => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  activeZone,
  cameraMode,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetCamPos = useRef(new THREE.Vector3(...activeZone.cameraPos));
  const targetLookAt = useRef(new THREE.Vector3(...activeZone.targetPos));
  const currentLookAt = useRef(new THREE.Vector3(...activeZone.targetPos));

  useEffect(() => {
    targetCamPos.current.set(...activeZone.cameraPos);
    targetLookAt.current.set(...activeZone.targetPos);
  }, [activeZone]);

  useFrame((_, delta) => {
    if (cameraMode === 'CINEMATIC_SCROLL') {
      // Smooth lerp camera position
      camera.position.lerp(targetCamPos.current, Math.min(delta * 2.8, 1.0));
      // Smooth lerp lookAt target
      currentLookAt.current.lerp(targetLookAt.current, Math.min(delta * 3.2, 1.0));
      camera.lookAt(currentLookAt.current);
    }
  });

  return (
    <>
      {cameraMode === 'FREE_ORBIT' && (
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 + 0.05} // prevent going underneath the floor
        />
      )}
    </>
  );
};

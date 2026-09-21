import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';

interface ParticleFieldProps {
  isSpraying?: boolean;
  sprayOrigin?: [number, number, number];
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ isSpraying = false, sprayOrigin = [10, 1.2, 0] }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const sprayPointsRef = useRef<THREE.Points>(null);

  // Background Bioluminescent Pollen Particles
  const particleCount = 280;
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const scl = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = Math.random() * 14 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45;
      scl[i] = Math.random() * 0.6 + 0.4;
    }
    return [pos, scl];
  }, []);

  // Spray Mist Particles
  const mistCount = 200;
  const mistPositions = useMemo(() => {
    const pos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      pos[i * 3 + 0] = sprayOrigin[0] + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = sprayOrigin[1] + (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 2] = sprayOrigin[2] + (Math.random() - 0.5) * 1.5;
    }
    return pos;
  }, [sprayOrigin]);

  useFrame((state, delta) => {
    // Animate background pollen drifting in wind
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.004;
        positions[i * 3 + 0] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.003;
        
        // Wrap around boundary
        if (positions[i * 3 + 1] > 14) positions[i * 3 + 1] = 0.2;
        if (positions[i * 3 + 1] < 0.2) positions[i * 3 + 1] = 14;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate high-pressure mist spray particles
    if (sprayPointsRef.current && isSpraying) {
      const pos = sprayPointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < mistCount; i++) {
        pos[i * 3 + 1] -= delta * 3.5; // fall downwards onto crops
        pos[i * 3 + 0] += (Math.random() - 0.5) * 0.08;
        pos[i * 3 + 2] += (Math.random() - 0.5) * 0.08;

        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 0] = sprayOrigin[0] + (Math.random() - 0.5) * 1.5;
          pos[i * 3 + 1] = sprayOrigin[1] + (Math.random() - 0.5) * 0.4;
          pos[i * 3 + 2] = sprayOrigin[2] + (Math.random() - 0.5) * 1.5;
        }
      }
      sprayPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Ambient Bio-Spore Glitter */}
      <Sparkles
        count={80}
        scale={[35, 12, 35]}
        size={3}
        speed={0.4}
        color="#34d399"
        opacity={0.6}
      />
      <Sparkles
        count={50}
        scale={[25, 10, 25]}
        size={2.5}
        speed={0.6}
        color="#38bdf8"
        opacity={0.5}
      />

      {/* Floating Golden Pollen Field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scale"
            count={scales.length}
            array={scales}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#fde047"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* High-Pressure Mist Spray Emitter */}
      {isSpraying && (
        <points ref={sprayPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={mistPositions.length / 3}
              array={mistPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            color="#67e8f9"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </>
  );
};

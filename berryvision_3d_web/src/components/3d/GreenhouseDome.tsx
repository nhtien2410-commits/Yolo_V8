import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

export const GreenhouseDome: React.FC = () => {
  const ringsRef = useRef<THREE.Group>(null);
  const domeRibsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* High-Tech Cyber Floor Grid with Neon Line Insets */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#060d1a"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      <gridHelper args={[48, 24, '#00f2fe', '#0f2744']} position={[0, 0.01, 0]} />

      {/* Geodesic Cyber Dome Glass Frame */}
      <group ref={domeRibsRef}>
        {/* Outer Dome Semi-Sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[22, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#0ea5e9"
            wireframe
            transparent
            opacity={0.18}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Structural Arch Rings */}
        {[-8, 0, 8].map((zOffset, idx) => (
          <mesh key={idx} position={[0, 8, zOffset]} rotation={[0, 0, 0]}>
            <torusGeometry args={[14, 0.12, 16, 64, Math.PI]} />
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={0.6}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Hydroponic A-Frame Vertical Farming Beds */}
      {[-5, 5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, -3]}>
          {/* Main A-Frame White Structure */}
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 3.6, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* LED Grow Light Bars (660nm Deep Red + Blue spectrum) */}
          <mesh position={[0, 3.7, 0]}>
            <boxGeometry args={[1.4, 0.1, 8]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#f43f5e"
              emissiveIntensity={1.8}
            />
          </mesh>

          {/* Strawberry Plants along the Tower */}
          {[-3, -1, 1, 3].map((zOff, plantIdx) => (
            <group key={plantIdx} position={[0, 0.8 + (plantIdx % 3) * 0.8, zOff]}>
              {/* Plant Leaves Cluster */}
              <mesh position={[0.7, 0, 0]} rotation={[0, 0, 0.3]} castShadow>
                <sphereGeometry args={[0.35, 8, 8]} />
                <meshStandardMaterial color="#10b981" roughness={0.6} />
              </mesh>
              <mesh position={[-0.7, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
                <sphereGeometry args={[0.35, 8, 8]} />
                <meshStandardMaterial color="#059669" roughness={0.6} />
              </mesh>

              {/* Ripe Strawberries */}
              <mesh position={[0.85, -0.15, 0.1]} castShadow>
                <coneGeometry args={[0.14, 0.28, 8]} />
                <meshStandardMaterial
                  color="#ef4444"
                  emissive="#ef4444"
                  emissiveIntensity={0.4}
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[-0.85, -0.15, -0.1]} castShadow>
                <coneGeometry args={[0.14, 0.28, 8]} />
                <meshStandardMaterial
                  color="#dc2626"
                  emissive="#dc2626"
                  emissiveIntensity={0.4}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Floating Center Bio-Pillar & Holographic Ring */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={ringsRef} position={[0, 4, 0]}>
          <mesh>
            <torusGeometry args={[3.2, 0.04, 16, 64]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[3.6, 0.03, 16, 64]} />
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={0.9}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';

export const NeuralCore: React.FC = () => {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Generate 3D Neural Nodes across 4 architectural layers
  const [nodes, lines] = useMemo(() => {
    const layers = [
      { name: 'Input Tensor (3x640x640)', count: 4, z: -3, radius: 1.5, color: '#38bdf8' },
      { name: 'C2f Backbone & SPPF', count: 6, z: -1, radius: 2.2, color: '#818cf8' },
      { name: 'PAN-FPN Feature Neck', count: 6, z: 1, radius: 2.0, color: '#c084fc' },
      { name: '5-Class Detect Head', count: 5, z: 3, radius: 1.6, color: '#f43f5e' },
    ];

    const allNodes: { pos: [number, number, number]; color: string; layer: string }[] = [];
    const linePairs: number[] = [];

    layers.forEach((layer, layerIdx) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2;
        const x = Math.cos(angle) * layer.radius;
        const y = Math.sin(angle) * layer.radius + 2.5;
        const z = layer.z;
        allNodes.push({ pos: [x, y, z], color: layer.color, layer: layer.name });

        // Connect with next layer
        if (layerIdx < layers.length - 1) {
          const nextLayer = layers[layerIdx + 1];
          for (let j = 0; j < Math.min(nextLayer.count, 3); j++) {
            const nextAngle = (j / nextLayer.count) * Math.PI * 2;
            const nextX = Math.cos(nextAngle) * nextLayer.radius;
            const nextY = Math.sin(nextAngle) * nextLayer.radius + 2.5;
            const nextZ = nextLayer.z;

            linePairs.push(x, y, z);
            linePairs.push(nextX, nextY, nextZ);
          }
        }
      }
    });

    return [allNodes, new Float32Array(linePairs)];
  }, []);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.4;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={[0, 0, -10]}>
      {/* Outer Floating Holographic Gyroscope Ring */}
      <group ref={ringRef} position={[0, 2.5, 0]}>
        <mesh>
          <torusGeometry args={[3.8, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={coreRef}>
          {/* Central YOLOv8 AI Core Sphere */}
          <mesh position={[0, 2.5, 0]}>
            <icosahedronGeometry args={[1.0, 2]} />
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={1.8}
              wireframe
            />
          </mesh>

          {/* Neural Synapse Links (Connecting Lines) */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={lines.length / 3}
                array={lines}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>

          {/* 3D Neural Nodes */}
          {nodes.map((node, idx) => (
            <mesh key={idx} position={node.pos}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={2.2}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Floating Status & Model Spec HUD */}
      <Html position={[0, 5.2, 0]} center distanceFactor={14}>
        <div className="glass-panel px-4 py-2.5 rounded-xl border-purple-500/40 text-center shadow-2xl shadow-purple-500/20 backdrop-blur-md pointer-events-auto">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
              YOLOv8-NANO ONNX RUNTIME v1.29
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono flex items-center justify-center gap-3">
            <span>3.01M Params</span>
            <span>•</span>
            <span>8.1 GFLOPs</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">18.4 ms Latency</span>
          </div>
        </div>
      </Html>
    </group>
  );
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';
import { DiseaseClassId, DiseaseSpec } from '../../types';

export const DISEASE_SPECS: Record<DiseaseClassId, DiseaseSpec> = {
  khoe_manh: {
    id: 'khoe_manh',
    name: 'Dâu Tây Khỏe Mạnh',
    scientificName: 'Fragaria × ananassa (Healthy)',
    confidence: 88.9,
    color: '#10b981',
    hex: '#10b981',
    severity: 'healthy',
    symptoms: 'Phiến lá xanh mướt đồng nhất, quả phát triển cân đối, không có dấu hiệu nấm khuẩn.',
    prescription: 'Duy trì chế độ dinh dưỡng A/B tiêu chuẩn, tưới nhỏ giọt 4 chu kỳ/ngày.',
    sprayAgent: 'Dung dịch vi sinh EM + Chế phẩm Trichoderma phòng ngừa định kỳ',
    dosages: '1:500 (10 ngày/lần)'
  },
  chay_la: {
    id: 'chay_la',
    name: 'Cháy Rìa Lá (Leaf Scorch)',
    scientificName: 'Diplocarpon earlianum',
    confidence: 99.3,
    color: '#ef4444',
    hex: '#ef4444',
    severity: 'critical',
    symptoms: 'Mép lá bị cháy khô viền màu nâu đỏ, mô lá giòn vỡ, ức chế quang hợp mạnh.',
    prescription: 'Lập tức tỉa bỏ toàn bộ phần lá hỏng, giảm độ ẩm nhà kính xuống < 70%.',
    sprayAgent: 'Thuốc diệt nấm phổ rộng Daconil 75WP / Score 250EC',
    dosages: '20ml / 16L nước (Phun điểm 3 lần cách nhau 5 ngày)'
  },
  dom_trang: {
    id: 'dom_trang',
    name: 'Bệnh Đốm Trắng',
    scientificName: 'Mycosphaerella fragariae',
    confidence: 90.1,
    color: '#f59e0b',
    hex: '#f59e0b',
    severity: 'high',
    symptoms: 'Các đốm tròn màu trắng xám ở tâm, viền đỏ tím đường kính 3-6mm trên bề mặt lá.',
    prescription: 'Phun thuốc phòng trừ nấm lá, cách ly khu vực luống bị nhiễm.',
    sprayAgent: 'Anvil 5SC / Ridomil Gold 68WG',
    dosages: '15ml / 10L nước (Phun ướt đều 2 mặt lá)'
  },
  vang_ua: {
    id: 'vang_ua',
    name: 'Lá Vàng Úa (Chlorosis)',
    scientificName: 'Nutrient Deficiency / Virus',
    confidence: 84.2,
    color: '#eab308',
    hex: '#eab308',
    severity: 'medium',
    symptoms: 'Phiến lá chuyển vàng từ gân hoặc từ chóp lá, suy giảm diệp lục và đạm hòa tan.',
    prescription: 'Bổ sung ngay phân bón lá giàu Magie, Kẽm và Sắt Chelate (Fe-EDTA).',
    sprayAgent: 'Phân bón vi lượng Chelate Micro-Mix + Đạm hữu cơ Nano',
    dosages: '10g / 20L nước (Phun sáng sớm)'
  },
  kho_heo: {
    id: 'kho_heo',
    name: 'Héo Rũ / Thối Rễ',
    scientificName: 'Phytophthora cactorum / Fusarium',
    confidence: 51.5,
    color: '#8b5cf6',
    hex: '#8b5cf6',
    severity: 'critical',
    symptoms: 'Toàn bộ cuống lá rũ mềm, rễ thâm đen thối nhũn, cây ngưng hút nước đột ngột.',
    prescription: 'Cách ly túi giá thể, ngừng tưới 24h và xử lý nấm vùng cổ rễ.',
    sprayAgent: 'Aliette 800WG / Ridomil Gold 68WG tưới gốc',
    dosages: '25g / 10L nước (Tưới 100ml/gốc)'
  }
};

interface HoloStrawberryLabProps {
  selectedDisease: DiseaseClassId;
  onSelectDisease: (d: DiseaseClassId) => void;
}

export const HoloStrawberryLab: React.FC<HoloStrawberryLabProps> = ({
  selectedDisease,
  onSelectDisease
}) => {
  const scanRingRef = useRef<THREE.Group>(null);
  const berryRef = useRef<THREE.Group>(null);
  const spec = DISEASE_SPECS[selectedDisease];

  useFrame((state, delta) => {
    if (scanRingRef.current) {
      scanRingRef.current.rotation.z += delta * 1.2;
      scanRingRef.current.position.y = 2.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.8;
    }
    if (berryRef.current) {
      berryRef.current.rotation.y += delta * 0.35;
    }
  });

  // Calculate dynamic colors based on disease state
  const leafColor = spec.id === 'khoe_manh'
    ? '#10b981'
    : spec.id === 'chay_la'
    ? '#b91c1c'
    : spec.id === 'dom_trang'
    ? '#047857'
    : spec.id === 'vang_ua'
    ? '#ca8a04'
    : '#78716c';

  const leafEdgeColor = spec.id === 'chay_la' ? '#f97316' : '#22c55e';

  return (
    <group position={[-8, 0, 0]}>
      {/* High-Tech Hologram Pedestal Base */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.6, 0.4, 32]} />
        <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hologram Base Glowing Ring */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.9, 32]} />
        <meshBasicMaterial color={spec.hex} side={THREE.DoubleSide} />
      </mesh>

      {/* Rotating 3D Holographic Strawberry Specimen */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[0, 2.0, 0]} ref={berryRef}>
          {/* Main Strawberry Body (Inverted Tapered Cone/Sphere) */}
          <mesh position={[0, 0, 0]} castShadow>
            <coneGeometry args={[0.85, 1.6, 24]} />
            <meshStandardMaterial
              color={selectedDisease === 'kho_heo' ? '#78350f' : '#dc2626'}
              emissive={selectedDisease === 'kho_heo' ? '#451a03' : '#ef4444'}
              emissiveIntensity={0.45}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>

          {/* Berry Top Green Calyx / Sepals */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.95, 0.3, 0.12, 8]} />
            <meshStandardMaterial color={leafColor} roughness={0.5} />
          </mesh>

          {/* Stem */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>

          {/* Strawberry Leaves (with Disease Morphology) */}
          {[-0.85, 0.85].map((xOffset, i) => (
            <group key={i} position={[xOffset, 0.4, 0]} rotation={[0, 0, xOffset > 0 ? -0.4 : 0.4]}>
              <mesh castShadow>
                <sphereGeometry args={[0.65, 12, 12]} />
                <meshStandardMaterial
                  color={leafColor}
                  roughness={0.7}
                  metalness={0.1}
                />
              </mesh>
              {/* Burnt / Scorched Leaf Margin Rim */}
              {selectedDisease === 'chay_la' && (
                <mesh position={[xOffset > 0 ? 0.3 : -0.3, 0, 0]}>
                  <torusGeometry args={[0.5, 0.08, 8, 24]} />
                  <meshStandardMaterial
                    color={leafEdgeColor}
                    emissive="#ea580c"
                    emissiveIntensity={1.8}
                  />
                </mesh>
              )}
              {/* White Spot Lesions */}
              {selectedDisease === 'dom_trang' && (
                <mesh position={[0, 0.25, 0.5]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={1.2}
                  />
                </mesh>
              )}
            </group>
          ))}

          {/* 3D YOLOv8 Bounding Box Laser Wireframe */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[2.6, 2.4, 2.2]} />
            <meshBasicMaterial
              color={spec.hex}
              wireframe
              transparent
              opacity={0.75}
            />
          </mesh>
        </group>
      </Float>

      {/* Vertical Holographic Scanning Ring */}
      <group ref={scanRingRef} position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[1.8, 1.88, 32]} />
          <meshBasicMaterial
            color={spec.hex}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Floating 3D Bounding Box Label & Confidence Tag */}
      <Html position={[0, 3.8, 0]} center distanceFactor={14}>
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto select-none">
          <div
            className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold tracking-wider glass-panel border flex items-center gap-2 shadow-2xl backdrop-blur-md"
            style={{
              borderColor: `${spec.hex}80`,
              boxShadow: `0 0 25px ${spec.hex}40`
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: spec.hex }}
            ></span>
            <span className="text-white uppercase">{spec.name}</span>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-950 font-bold"
              style={{ backgroundColor: spec.hex }}
            >
              {spec.confidence}%
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono italic">
            {spec.scientificName}
          </div>
        </div>
      </Html>
    </group>
  );
};

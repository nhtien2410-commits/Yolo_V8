export type ExhibitionZoneId = 'greenhouse' | 'agribot' | 'disease_lab' | 'spray_matrix' | 'neural_brain';

export interface ExhibitionZone {
  id: ExhibitionZoneId;
  title: string;
  subtitle: string;
  badge: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  description: string;
  features: string[];
  stats: { label: string; value: string; unit?: string }[];
}

export type DiseaseClassId = 'khoe_manh' | 'chay_la' | 'dom_trang' | 'vang_ua' | 'kho_heo';

export interface DiseaseSpec {
  id: DiseaseClassId;
  name: string;
  scientificName: string;
  confidence: number;
  color: string;
  hex: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'healthy';
  symptoms: string;
  prescription: string;
  sprayAgent: string;
  dosages: string;
}

export interface BedCell {
  code: string; // e.g. "X01_Y01"
  col: number;
  row: number;
  diseaseId: DiseaseClassId;
  confidence: number;
  moisture: number; // %
  temp: number; // °C
  ec: number; // mS/cm
  ph: number;
  sprayStatus: 'idle' | 'sprayed' | 'pending';
}

export interface TelemetryData {
  robotStatus: 'ACTIVE' | 'PATROL' | 'SPRAYING' | 'CHARGING';
  battery: number;
  cpuTemp: number;
  fps: number;
  activeZone: ExhibitionZoneId;
  cameraMode: 'CINEMATIC_SCROLL' | 'FREE_ORBIT';
  soundEnabled: boolean;
  modelLatency: number;
}

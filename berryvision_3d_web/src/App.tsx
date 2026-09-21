import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Scene } from './components/3d/Scene';
import { NavbarHUD } from './components/ui/NavbarHUD';
import { ZoneOverlay } from './components/ui/ZoneOverlay';
import { DiseaseSelectorHUD } from './components/ui/DiseaseSelectorHUD';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ExhibitionZoneId, DiseaseClassId, BedCell } from './types';
import { EXHIBITION_ZONES } from './hooks/useCameraTrack';
import { useSoundEffects } from './hooks/useSoundEffects';

export const App: React.FC = () => {
  const [activeZoneId, setActiveZoneId] = useState<ExhibitionZoneId>('greenhouse');
  const [cameraMode, setCameraMode] = useState<'CINEMATIC_SCROLL' | 'FREE_ORBIT'>('CINEMATIC_SCROLL');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseClassId>('chay_la'); // Default to newly trained 99.3% Leaf Scorch!
  const [isSpraying, setIsSpraying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);

  const { playClick, playLaserScan, playSpray, playTeleport } = useSoundEffects(soundEnabled);
  const lastScrollTime = useRef<number>(0);

  // Active Zone Object
  const activeZone = EXHIBITION_ZONES.find(z => z.id === activeZoneId) || EXHIBITION_ZONES[0];

  // Simulating asset loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Simple FPS tracker
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Zone Navigation Handler
  const handleSelectZone = useCallback((zoneId: ExhibitionZoneId) => {
    playTeleport();
    setActiveZoneId(zoneId);
  }, [playTeleport]);

  // Disease Selection Handler
  const handleSelectDisease = useCallback((diseaseId: DiseaseClassId) => {
    playLaserScan();
    setSelectedDisease(diseaseId);
  }, [playLaserScan]);

  // Spray Trigger Handler
  const handleSprayTrigger = useCallback(() => {
    playSpray();
    setIsSpraying(true);
    setTimeout(() => setIsSpraying(false), 2400);
  }, [playSpray]);

  // Bed Click in Spray Matrix
  const handleBedClick = useCallback((bed: BedCell) => {
    playClick();
    if (bed.diseaseId !== 'khoe_manh') {
      setSelectedDisease(bed.diseaseId);
    }
  }, [playClick]);

  // Scroll to navigate between zones in Cinematic Mode
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (cameraMode !== 'CINEMATIC_SCROLL') return;

    const now = Date.now();
    if (now - lastScrollTime.current < 600) return; // Debounce wheel gestures

    const delta = e.deltaY;
    if (Math.abs(delta) > 30) {
      lastScrollTime.current = now;
      const currentIndex = EXHIBITION_ZONES.findIndex(z => z.id === activeZoneId);
      if (delta > 0) {
        // Next Zone
        const next = EXHIBITION_ZONES[(currentIndex + 1) % EXHIBITION_ZONES.length];
        handleSelectZone(next.id);
      } else {
        // Prev Zone
        const prev = EXHIBITION_ZONES[(currentIndex - 1 + EXHIBITION_ZONES.length) % EXHIBITION_ZONES.length];
        handleSelectZone(prev.id);
      }
    }
  }, [cameraMode, activeZoneId, handleSelectZone]);

  if (loading) {
    return <LoadingScreen progress={100} />;
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#030712] select-none"
      onWheel={handleWheel}
    >
      {/* 3D Scene Viewport */}
      <Scene
        activeZone={activeZone}
        cameraMode={cameraMode}
        selectedDisease={selectedDisease}
        onSelectDisease={handleSelectDisease}
        isSpraying={isSpraying}
        onSprayTrigger={handleSprayTrigger}
        onBedClick={handleBedClick}
      />

      {/* Top Navbar HUD */}
      <NavbarHUD
        activeZoneId={activeZoneId}
        onSelectZone={handleSelectZone}
        cameraMode={cameraMode}
        onToggleCameraMode={() => {
          playClick();
          setCameraMode(prev => (prev === 'CINEMATIC_SCROLL' ? 'FREE_ORBIT' : 'CINEMATIC_SCROLL'));
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        fps={fps}
      />

      {/* Disease Selector Panel (Active in Zone 3 or general inspection) */}
      <DiseaseSelectorHUD
        selectedDisease={selectedDisease}
        onSelectDisease={handleSelectDisease}
      />

      {/* Bottom Exhibition Zone Overlay Narrative */}
      <ZoneOverlay
        activeZone={activeZone}
        onSelectZone={handleSelectZone}
      />
    </div>
  );
};

export default App;

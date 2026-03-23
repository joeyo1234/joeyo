'use client';

import { Canvas } from '@react-three/fiber';
import BrainScene from './BrainScene';

interface Props {
  activeTask: string | null;
  selectedRegion: string | null;
  cascadeActive: string[];
  hoveredModule: string | null;
  activeModules: string[];
  onModuleHover: (id: string | null) => void;
  onModuleClick: (id: string) => void;
  isDark: boolean;
}

export default function BrainModel3DCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 30, 150], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <BrainScene {...props} />
    </Canvas>
  );
}

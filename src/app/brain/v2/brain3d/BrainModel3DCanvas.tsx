'use client';

import { Canvas } from '@react-three/fiber';
import BrainScene from './BrainScene';

interface Props {
  activeTask: string | null;
  selectedStructure: string | null;
  cascadeActive: string[];
  hoveredStructure: string | null;
  onStructureHover: (meshName: string | null) => void;
  onStructureClick: (meshName: string) => void;
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

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BrainParticles3DProps {
  structurePositions: Map<string, THREE.Vector3>; // structure ID → 3D position
  activeStructures: Set<string>; // currently active structure IDs
  activeTask: string | null;
}

interface Particle3D {
  position: THREE.Vector3;
  from: THREE.Vector3;
  to: THREE.Vector3;
  control: THREE.Vector3; // bezier control point
  progress: number; // 0 to 1
  speed: number;
  color: THREE.Color;
  alive: boolean;
  size: number;
}

interface Emitter3D {
  fromId: string;
  toId: string;
  color: THREE.Color;
  timeSinceLast: number;
  rate: number; // particles per second
}

// Generate connections between active structures
function generateConnections(activeStructures: Set<string>): [string, string][] {
  const active = [...activeStructures].filter(s => !s.startsWith('Mirror_'));
  const pairs: [string, string][] = [];

  // Connect structures that are sequentially close in the activation list
  for (let i = 0; i < active.length - 1; i++) {
    pairs.push([active[i], active[i + 1]]);
    // Also connect non-adjacent structures occasionally for visual richness
    if (i + 2 < active.length && Math.random() > 0.5) {
      pairs.push([active[i], active[i + 2]]);
    }
  }

  return pairs;
}

// Structure colors for particles
const structureColors: Record<string, string> = {
  cortex_prefrontal: '#ff4466',
  cortex_motor_cortex: '#44dd88',
  cortex_somatosensory: '#4a9eff',
  cortex_broca: '#ff5599',
  cortex_parietal: '#ffcc33',
  cortex_wernicke: '#9b6dff',
  cortex_anterior_temporal: '#ff8844',
  cortex_temporal: '#00d4aa',
  cortex_occipital: '#4a9eff',
  cortex_frontal_other: '#ff7788',
  Amygdala1: '#ff5599',
  Left_hippocampus1: '#9b6dff',
  Left_insula: '#ff5599',
  Cingulate_gyrus_right: '#ff4466',
  Right_cerebellar_hemisphere1: '#44dd88',
  Brain_stem55: '#44dd88',
  Hypothalamus_and_pituitary1: '#ff5599',
  Right_thalamus: '#888888',
  Right_thalamus1: '#888888',
  Caudate_nucleus1: '#888888',
  Left_putamen1: '#888888',
  Pons: '#44dd88',
  Superior_colliculus: '#4a9eff',
  Fornix_right: '#888888',
  Mammillary_bodies1: '#9b6dff',
};

const MAX_PARTICLES = 60;

export default function BrainParticles3D({ structurePositions, activeStructures, activeTask }: BrainParticles3DProps) {
  const particlesRef = useRef<Particle3D[]>([]);
  const emittersRef = useRef<Emitter3D[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummyObj = useMemo(() => new THREE.Object3D(), []);
  const glowColor = useMemo(() => new THREE.Color(), []);

  // Rebuild emitters when active structures change
  const prevTaskRef = useRef<string | null>(null);
  if (prevTaskRef.current !== activeTask) {
    prevTaskRef.current = activeTask;
    particlesRef.current = [];
    emittersRef.current = [];

    if (activeTask && activeStructures.size > 0) {
      const connections = generateConnections(activeStructures);
      console.log('[BrainParticles3D] Task:', activeTask, 'Active structures:', [...activeStructures]);
      console.log('[BrainParticles3D] Available positions:', [...structurePositions.keys()]);
      console.log('[BrainParticles3D] Connections to emit:', connections.filter(([from, to]) => structurePositions.has(from) && structurePositions.has(to)));
      emittersRef.current = connections
        .filter(([from, to]) => structurePositions.has(from) && structurePositions.has(to))
        .map(([from, to]) => ({
          fromId: from,
          toId: to,
          color: new THREE.Color(structureColors[from] || '#888'),
          timeSinceLast: Math.random() * 500,
          rate: 1.5,
        }));
    }
  }

  useFrame((_, delta) => {
    if (!meshRef.current || !activeTask) {
      // Clear all instances
      if (meshRef.current) {
        for (let i = 0; i < MAX_PARTICLES; i++) {
          dummyObj.position.set(0, 0, -9999);
          dummyObj.scale.set(0, 0, 0);
          dummyObj.updateMatrix();
          meshRef.current.setMatrixAt(i, dummyObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
      }
      return;
    }

    const dt = delta * 1000; // ms

    // Emit new particles
    for (const em of emittersRef.current) {
      em.timeSinceLast += dt;
      const interval = 1000 / em.rate;
      while (em.timeSinceLast >= interval && particlesRef.current.length < MAX_PARTICLES) {
        const from = structurePositions.get(em.fromId);
        const to = structurePositions.get(em.toId);
        if (from && to) {
          // Create a curved path with a random control point
          const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
          );
          const control = mid.add(offset);

          particlesRef.current.push({
            position: from.clone(),
            from: from.clone(),
            to: to.clone(),
            control,
            progress: 0,
            speed: 0.3 + Math.random() * 0.4,
            color: em.color.clone(),
            alive: true,
            size: 2 + Math.random() * 1.5,
          });
        }
        em.timeSinceLast -= interval;
      }
    }

    // Update particles
    for (const p of particlesRef.current) {
      p.progress += p.speed * delta;
      if (p.progress >= 1) {
        p.alive = false;
        continue;
      }

      // Quadratic bezier interpolation
      const t = p.progress;
      const t1 = 1 - t;
      p.position.set(
        t1 * t1 * p.from.x + 2 * t1 * t * p.control.x + t * t * p.to.x,
        t1 * t1 * p.from.y + 2 * t1 * t * p.control.y + t * t * p.to.y,
        t1 * t1 * p.from.z + 2 * t1 * t * p.control.z + t * t * p.to.z,
      );
    }

    particlesRef.current = particlesRef.current.filter(p => p.alive);

    // Update instanced mesh
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particlesRef.current[i];
      if (p) {
        dummyObj.position.copy(p.position);
        // Fade in/out at start and end
        const fade = Math.min(p.progress * 4, (1 - p.progress) * 4, 1);
        const s = p.size * fade;
        dummyObj.scale.set(s, s, s);
        dummyObj.updateMatrix();
        meshRef.current.setMatrixAt(i, dummyObj.matrix);
        meshRef.current.setColorAt(i, p.color);
      } else {
        dummyObj.position.set(0, 0, -9999);
        dummyObj.scale.set(0, 0, 0);
        dummyObj.updateMatrix();
        meshRef.current.setMatrixAt(i, dummyObj.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]} renderOrder={999}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshBasicMaterial
        transparent
        opacity={0.95}
        toneMapped={false}
        depthTest={false}
      />
    </instancedMesh>
  );
}

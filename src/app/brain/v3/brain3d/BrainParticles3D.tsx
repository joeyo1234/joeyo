'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface BrainParticles3DProps {
  groupRef: React.RefObject<THREE.Group | null>; // ref to the brain group
  activeStructures: Set<string>;
  activeTask: string | null;
}

interface Particle3D {
  position: THREE.Vector3;
  from: THREE.Vector3;
  to: THREE.Vector3;
  control: THREE.Vector3;
  progress: number;
  speed: number;
  color: THREE.Color;
  alive: boolean;
  size: number;
}

interface Emitter3D {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: THREE.Color;
  timeSinceLast: number;
  rate: number;
}

const structureColors: Record<string, string> = {
  cortex_prefrontal: '#ff4466', cortex_motor_cortex: '#44dd88', cortex_somatosensory: '#4a9eff',
  cortex_broca: '#ff5599', cortex_parietal: '#ffcc33', cortex_wernicke: '#9b6dff',
  cortex_anterior_temporal: '#ff8844', cortex_temporal: '#00d4aa', cortex_occipital: '#4a9eff',
  cortex_frontal_other: '#ff7788', Amygdala1: '#ff5599', Left_hippocampus1: '#9b6dff',
  Left_insula: '#ff5599', Cingulate_gyrus_right: '#ff4466', Right_cerebellar_hemisphere1: '#44dd88',
  Brain_stem55: '#44dd88', Hypothalamus_and_pituitary1: '#ff5599', Right_thalamus: '#aaaaaa',
  Right_thalamus1: '#aaaaaa', Caudate_nucleus1: '#aaaaaa', Left_putamen1: '#aaaaaa',
  Pons: '#44dd88', Superior_colliculus: '#4a9eff', Fornix_right: '#aaaaaa', Mammillary_bodies1: '#9b6dff',
};

const MAX_PARTICLES = 80;

export default function BrainParticles3D({ groupRef, activeStructures, activeTask }: BrainParticles3DProps) {
  const particlesRef = useRef<Particle3D[]>([]);
  const emittersRef = useRef<Emitter3D[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummyObj = useMemo(() => new THREE.Object3D(), []);
  const prevTaskRef = useRef<string | null>(null);
  const initDone = useRef(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Rebuild emitters when task changes
    if (prevTaskRef.current !== activeTask) {
      prevTaskRef.current = activeTask;
      particlesRef.current = [];
      emittersRef.current = [];
      initDone.current = false;
    }

    if (!activeTask || activeStructures.size === 0) {
      // Clear all
      for (let i = 0; i < MAX_PARTICLES; i++) {
        dummyObj.position.set(0, -9999, 0);
        dummyObj.scale.set(0, 0, 0);
        dummyObj.updateMatrix();
        meshRef.current.setMatrixAt(i, dummyObj.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      return;
    }

    // Build emitters once after task changes (delayed to let meshes render)
    if (!initDone.current && groupRef.current) {
      initDone.current = true;

      // Find world positions of active structure meshes by traversing the group
      const positions = new Map<string, THREE.Vector3>();
      const worldPos = new THREE.Vector3();

      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // Check if this mesh's name or structureId matches an active structure
          const name = mesh.name || mesh.userData?.structureId;
          if (name && activeStructures.has(name)) {
            mesh.getWorldPosition(worldPos);
            positions.set(name, worldPos.clone());
          }
        }
      });

      // If no positions found from mesh traversal, try computing from the group's children
      if (positions.size === 0) {
        // Fallback: use group children directly
        groupRef.current.children.forEach((child) => {
          child.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh && obj.name) {
              obj.getWorldPosition(worldPos);
              if (activeStructures.has(obj.name)) {
                positions.set(obj.name, worldPos.clone());
              }
            }
          });
        });
      }

      console.log('[BrainParticles3D] Found', positions.size, 'active mesh positions:', [...positions.keys()]);

      // Create emitters between consecutive active structures
      const activeList = [...activeStructures].filter(s => !s.startsWith('Mirror_') && positions.has(s));
      for (let i = 0; i < activeList.length - 1; i++) {
        const from = positions.get(activeList[i])!;
        const to = positions.get(activeList[i + 1])!;
        emittersRef.current.push({
          from: from.clone(),
          to: to.clone(),
          color: new THREE.Color(structureColors[activeList[i]] || '#888'),
          timeSinceLast: Math.random() * 400,
          rate: 2,
        });
        // Also connect back for some paths (creates more visual activity)
        if (i + 2 < activeList.length) {
          const to2 = positions.get(activeList[i + 2])!;
          emittersRef.current.push({
            from: from.clone(),
            to: to2.clone(),
            color: new THREE.Color(structureColors[activeList[i]] || '#888'),
            timeSinceLast: Math.random() * 600,
            rate: 1,
          });
        }
      }

      console.log('[BrainParticles3D] Created', emittersRef.current.length, 'emitters');
    }

    const dt = delta * 1000;

    // Emit particles
    for (const em of emittersRef.current) {
      em.timeSinceLast += dt;
      const interval = 1000 / em.rate;
      while (em.timeSinceLast >= interval && particlesRef.current.length < MAX_PARTICLES) {
        const mid = new THREE.Vector3().lerpVectors(em.from, em.to, 0.5);
        mid.x += (Math.random() - 0.5) * 20;
        mid.y += (Math.random() - 0.5) * 20;
        mid.z += (Math.random() - 0.5) * 20;

        particlesRef.current.push({
          position: em.from.clone(),
          from: em.from.clone(),
          to: em.to.clone(),
          control: mid,
          progress: 0,
          speed: 0.25 + Math.random() * 0.35,
          color: em.color.clone(),
          alive: true,
          size: 1.5 + Math.random() * 1,
        });
        em.timeSinceLast -= interval;
      }
    }

    // Update particles
    for (const p of particlesRef.current) {
      p.progress += p.speed * delta;
      if (p.progress >= 1) { p.alive = false; continue; }

      const t = p.progress;
      const t1 = 1 - t;
      p.position.set(
        t1 * t1 * p.from.x + 2 * t1 * t * p.control.x + t * t * p.to.x,
        t1 * t1 * p.from.y + 2 * t1 * t * p.control.y + t * t * p.to.y,
        t1 * t1 * p.from.z + 2 * t1 * t * p.control.z + t * t * p.to.z,
      );
    }

    particlesRef.current = particlesRef.current.filter(p => p.alive);

    // Render to instanced mesh
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particlesRef.current[i];
      if (p) {
        dummyObj.position.copy(p.position);
        const fade = Math.min(p.progress * 4, (1 - p.progress) * 4, 1);
        const s = p.size * fade;
        dummyObj.scale.set(s, s, s);
        dummyObj.updateMatrix();
        meshRef.current.setMatrixAt(i, dummyObj.matrix);
        meshRef.current.setColorAt(i, p.color);
      } else {
        dummyObj.position.set(0, -9999, 0);
        dummyObj.scale.set(0, 0, 0);
        dummyObj.updateMatrix();
        meshRef.current.setMatrixAt(i, dummyObj.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]} renderOrder={999} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshBasicMaterial transparent opacity={0.9} toneMapped={false} depthTest={false} />
    </instancedMesh>
  );
}

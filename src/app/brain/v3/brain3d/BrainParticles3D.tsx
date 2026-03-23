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

      // Find world-space geometric centers of active structures
      const positions = new Map<string, THREE.Vector3>();

      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const name = mesh.name;
          if (!name || !activeStructures.has(name)) return;
          if (positions.has(name)) return; // already computed

          // Compute the actual geometric centroid in world space
          const geo = mesh.geometry;
          const posAttr = geo.getAttribute('position');
          if (!posAttr) return;

          const indexAttr = geo.getIndex();
          let sumX = 0, sumY = 0, sumZ = 0, count = 0;
          const localPos = new THREE.Vector3();

          if (indexAttr) {
            const seen = new Set<number>();
            for (let i = 0; i < Math.min(indexAttr.count, 3000); i++) {
              const idx = indexAttr.getX(i);
              if (seen.has(idx)) continue;
              seen.add(idx);
              localPos.set(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
              mesh.localToWorld(localPos);
              sumX += localPos.x; sumY += localPos.y; sumZ += localPos.z;
              count++;
            }
          } else {
            const step = Math.max(1, Math.floor(posAttr.count / 500));
            for (let i = 0; i < posAttr.count; i += step) {
              localPos.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
              mesh.localToWorld(localPos);
              sumX += localPos.x; sumY += localPos.y; sumZ += localPos.z;
              count++;
            }
          }

          if (count > 0) {
            positions.set(name, new THREE.Vector3(sumX / count, sumY / count, sumZ / count));
          }
        }
      });

      console.log('[BrainParticles3D] Found', positions.size, 'geometric centers');

      // Create emitters for BOTH hemispheres
      // Right side (non-mirror) and left side (mirror) separately
      const rightList = [...activeStructures].filter(s => !s.startsWith('Mirror_') && positions.has(s));
      const leftList = [...activeStructures].filter(s => s.startsWith('Mirror_') && positions.has(s));

      function createEmitters(list: string[]) {
        for (let i = 0; i < list.length - 1; i++) {
          const from = positions.get(list[i])!;
          const to = positions.get(list[i + 1])!;
          const baseId = list[i].replace('Mirror_', '');
          emittersRef.current.push({
            from: from.clone(),
            to: to.clone(),
            color: new THREE.Color(structureColors[baseId] || '#888'),
            timeSinceLast: Math.random() * 400,
            rate: 2,
          });
          if (i + 2 < list.length) {
            const to2 = positions.get(list[i + 2])!;
            emittersRef.current.push({
              from: from.clone(),
              to: to2.clone(),
              color: new THREE.Color(structureColors[baseId] || '#888'),
              timeSinceLast: Math.random() * 600,
              rate: 1,
            });
          }
        }
      }

      createEmitters(rightList);
      createEmitters(leftList);

      console.log('[BrainParticles3D] Created', emittersRef.current.length, 'emitters (both hemispheres)');
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

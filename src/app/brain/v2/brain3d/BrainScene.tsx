'use client';

import { Suspense, useMemo, useEffect } from 'react';
import { useGLTF, OrbitControls, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import BrainMesh from './BrainMesh';
import { buildMeshLookup } from './brainMeshMapping';
import { modules } from '../data';

interface BrainSceneProps {
  activeTask: string | null;
  selectedRegion: string | null;
  cascadeActive: string[];
  hoveredModule: string | null;
  activeModules: string[];
  onModuleHover: (id: string | null) => void;
  onModuleClick: (id: string) => void;
  isDark: boolean;
}

function BrainModel(props: BrainSceneProps) {
  const { scene, nodes } = useGLTF('/brain-model.glb');
  const meshLookup = useMemo(() => buildMeshLookup(), []);

  // Log mesh names for debugging
  useEffect(() => {
    console.log('[BrainModel3D] GLB nodes:', Object.keys(nodes));
  }, [nodes]);

  type MeshEntry = {
    name: string;
    geometry: THREE.BufferGeometry;
    moduleId: string | null;
    moduleColor: string;
    isHemisphere: boolean;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };

  const { rightSide, leftSide } = useMemo(() => {
    const right: MeshEntry[] = [];
    const left: MeshEntry[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mapping = meshLookup.get(mesh.name);
        const moduleId = mapping?.moduleId ?? null;
        const moduleColor = moduleId ? (modules[moduleId]?.color ?? '#888') : '#888';
        const isHemisphere = mesh.name.includes('Hemisphere');

        // Original (right side)
        right.push({
          name: mesh.name,
          geometry: mesh.geometry,
          moduleId,
          moduleColor,
          isHemisphere,
          position: [mesh.position.x, mesh.position.y, mesh.position.z],
          rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
          scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        });

        // Mirrored (left side)
        const mirrorName = `Mirror_${mesh.name}`;
        const mirrorMapping = meshLookup.get(mirrorName);
        const mirrorModuleId = mirrorMapping?.moduleId ?? moduleId;
        const mirrorModuleColor = mirrorModuleId ? (modules[mirrorModuleId]?.color ?? '#888') : '#888';

        left.push({
          name: mirrorName,
          geometry: mesh.geometry,
          moduleId: mirrorModuleId,
          moduleColor: mirrorModuleColor,
          isHemisphere,
          position: [mesh.position.x, mesh.position.y, mesh.position.z],
          rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
          scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        });
      }
    });

    return { rightSide: right, leftSide: left };
  }, [scene, meshLookup]);

  const neutralColor = props.isDark ? '#444' : '#bbb';

  // Separation offset — pushes each hemisphere outward from center
  const SEPARATION = -15;

  const renderMesh = (entry: MeshEntry) => (
    <BrainMesh
      key={entry.name}
      geometry={entry.geometry}
      moduleId={entry.moduleId}
      moduleColor={entry.moduleColor}
      isActive={entry.moduleId ? props.cascadeActive.includes(entry.moduleId) : false}
      isDimmed={entry.moduleId ? (props.activeTask ? !props.activeModules.includes(entry.moduleId) : props.selectedRegion ? entry.moduleId !== props.selectedRegion : false) : false}
      isSelected={entry.moduleId === props.selectedRegion}
      isHemisphere={entry.isHemisphere}
      onHover={props.onModuleHover}
      onClick={(id) => { if (id) props.onModuleClick(id); }}
      neutralColor={neutralColor}
      position={entry.position}
      rotation={entry.rotation}
      scale={entry.scale}
    />
  );

  return (
    <Center>
      <group>
        {/* Right hemisphere — offset right */}
        <group position={[SEPARATION, 0, 0]}>
          {rightSide.map(renderMesh)}
        </group>
        {/* Left hemisphere — mirrored and offset left */}
        <group position={[-SEPARATION, 0, 0]} scale={[-1, 1, 1]}>
          {leftSide.map(renderMesh)}
        </group>
      </group>
    </Center>
  );
}

export default function BrainScene(props: BrainSceneProps) {
  return (
    <>
      <ambientLight intensity={props.isDark ? 0.4 : 0.6} />
      <directionalLight position={[5, 5, 5]} intensity={props.isDark ? 0.8 : 1.0} />
      <directionalLight position={[-3, -2, -5]} intensity={0.3} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={50}
        maxDistance={250}
        autoRotate={!props.activeTask && !props.selectedRegion}
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
      />

      <Suspense fallback={
        <Html center>
          <div style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12 }}>
            Loading brain model...
          </div>
        </Html>
      }>
        <BrainModel {...props} />
      </Suspense>
    </>
  );
}

useGLTF.preload('/brain-model.glb');

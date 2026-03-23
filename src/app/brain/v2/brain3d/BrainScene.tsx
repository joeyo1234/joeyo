'use client';

import { Suspense, useMemo, useEffect } from 'react';
import { useGLTF, OrbitControls, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import BrainMesh from './BrainMesh';
import { brainStructures, taskStructureActivations } from './brainStructures';
import { splitHemisphere } from './splitHemisphere';

interface BrainSceneProps {
  activeTask: string | null;
  selectedStructure: string | null;
  cascadeActive: string[];
  hoveredStructure: string | null;
  onStructureHover: (meshName: string | null) => void;
  onStructureClick: (meshName: string) => void;
  isDark: boolean;
}

type MeshEntry = {
  name: string;
  geometry: THREE.BufferGeometry;
  structureId: string | null;
  color: string;
  isHemisphere: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

function BrainModel(props: BrainSceneProps) {
  const { scene, nodes } = useGLTF('/brain-model.glb');

  useEffect(() => {
    console.log('[BrainModel3D] GLB nodes:', Object.keys(nodes));
  }, [nodes]);

  const activeStructures = useMemo(() => {
    if (!props.activeTask) return new Set<string>();
    const taskStructures = taskStructureActivations[props.activeTask] || [];
    const all = new Set<string>();
    taskStructures.forEach(s => {
      all.add(s);
      all.add(`Mirror_${s}`);
    });
    return all;
  }, [props.activeTask]);

  const { rightSide, leftSide } = useMemo(() => {
    const right: MeshEntry[] = [];
    const left: MeshEntry[] = [];

    let hemisphereGeometry: THREE.BufferGeometry | null = null;
    let hemispherePosition: [number, number, number] = [0, 0, 0];
    let hemisphereRotation: [number, number, number] = [0, 0, 0];
    let hemisphereScale: [number, number, number] = [1, 1, 1];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const isHemisphere = mesh.name.includes('Hemisphere');

        if (isHemisphere) {
          // Don't add hemisphere directly — we'll split it
          hemisphereGeometry = mesh.geometry;
          hemispherePosition = [mesh.position.x, mesh.position.y, mesh.position.z];
          hemisphereRotation = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z];
          hemisphereScale = [mesh.scale.x, mesh.scale.y, mesh.scale.z];
          console.log('[BrainModel3D] Hemisphere scale:', hemisphereScale, 'position:', hemispherePosition);
          return;
        }

        const structure = brainStructures[mesh.name];
        if (!structure) {
          console.warn('[BrainModel3D] No structure data for mesh:', JSON.stringify(mesh.name), '- available keys:', Object.keys(brainStructures).slice(0, 5).join(', '), '...');
        }
        const color = structure?.color || '#888';

        // Always use mesh.name as structureId so every mesh is clickable
        right.push({
          name: mesh.name,
          geometry: mesh.geometry,
          structureId: mesh.name,
          color,
          isHemisphere: false,
          position: [mesh.position.x, mesh.position.y, mesh.position.z],
          rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
          scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        });

        const mirrorName = `Mirror_${mesh.name}`;
        left.push({
          name: mirrorName,
          geometry: mesh.geometry,
          structureId: mesh.name,
          color,
          isHemisphere: false,
          position: [mesh.position.x, mesh.position.y, mesh.position.z],
          rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
          scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        });
      }
    });

    // Split the hemisphere into cortical regions
    if (hemisphereGeometry) {
      const corticalRegions = splitHemisphere(hemisphereGeometry, hemispherePosition);
      for (const region of corticalRegions) {
        // Right side — cortical regions are clickable colored pieces, NOT transparent shells
        right.push({
          name: region.meshName,
          geometry: region.geometry,
          structureId: region.meshName,
          color: region.color,
          isHemisphere: false,
          position: hemispherePosition,
          rotation: hemisphereRotation,
          scale: hemisphereScale,
        });

        // Left side (mirror)
        const mirrorName = `Mirror_${region.meshName}`;
        left.push({
          name: mirrorName,
          geometry: region.geometry,
          structureId: region.meshName,
          color: region.color,
          isHemisphere: false,
          position: hemispherePosition,
          rotation: hemisphereRotation,
          scale: hemisphereScale,
        });
      }
    }

    return { rightSide: right, leftSide: left };
  }, [scene]);

  const neutralColor = props.isDark ? '#444' : '#bbb';
  const SEPARATION = -14;

  const renderMesh = (entry: MeshEntry) => {
    const isActive = activeStructures.has(entry.name) || activeStructures.has(entry.structureId || '');
    const isSelected = entry.structureId === props.selectedStructure || entry.name === props.selectedStructure;
    const isHovered = entry.structureId === props.hoveredStructure || entry.name === props.hoveredStructure;
    const isDimmed = props.activeTask
      ? !isActive
      : props.selectedStructure ? !isSelected : false;

    return (
      <BrainMesh
        key={entry.name}
        geometry={entry.geometry}
        moduleId={entry.structureId}
        moduleColor={entry.color}
        isActive={isActive}
        isDimmed={isDimmed}
        isSelected={isSelected}
        isHemisphere={entry.isHemisphere}
        onHover={(id) => props.onStructureHover(id ? entry.structureId : null)}
        onClick={(id) => { if (entry.structureId) props.onStructureClick(entry.structureId); }}
        neutralColor={neutralColor}
        position={entry.position}
        rotation={entry.rotation}
        scale={entry.scale}
      />
    );
  };

  return (
    <Center>
      <group>
        <group position={[SEPARATION, 0, 0]}>
          {rightSide.map(renderMesh)}
        </group>
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
        autoRotate={!props.activeTask && !props.selectedStructure}
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

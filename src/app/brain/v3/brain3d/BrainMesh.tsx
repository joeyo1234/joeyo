'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BrainMeshProps {
  geometry: THREE.BufferGeometry;
  moduleId: string | null;
  moduleColor: string;
  isActive: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  isHemisphere: boolean;
  onHover: (moduleId: string | null) => void;
  onClick: (moduleId: string | null) => void;
  neutralColor: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export default function BrainMesh({
  geometry,
  moduleId,
  moduleColor,
  isActive,
  isDimmed,
  isSelected,
  isHemisphere,
  onHover,
  onClick,
  neutralColor,
  position,
  rotation,
  scale,
}: BrainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // All structures render in neutral grey/white — color comes from particles
  const targetColor = useMemo(() => {
    return new THREE.Color(neutralColor);
  }, [neutralColor]);

  const targetOpacity = useMemo(() => {
    if (isHemisphere) return 0.03;
    if (isSelected) return 0.4;
    if (isActive) return 0.3;
    if (hovered) return 0.25;
    if (isDimmed) return 0.05;
    if (!moduleId) return 0.1;
    return 0.12; // default resting — subtle, lets particles pop
  }, [moduleId, isActive, isDimmed, isSelected, hovered, isHemisphere]);

  const targetEmissive = useMemo(() => {
    if (isHemisphere) return 0;
    if (isSelected) return 0.2;
    if (isActive) return 0.1;
    if (hovered) return 0.08;
    return 0;
  }, [isActive, isSelected, hovered, isHemisphere]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const speed = delta * 5;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, speed);
    mat.color.lerp(targetColor, speed);
    mat.emissive.lerp(targetColor, speed);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, speed);
  });

  return (
    <mesh
      ref={meshRef}
      name={moduleId || ''}
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(moduleId);
        if (moduleId) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (moduleId) onClick(moduleId);
      }}
    >
      <meshStandardMaterial
        transparent
        opacity={0.12}
        color={neutralColor}
        emissive={neutralColor}
        emissiveIntensity={0}
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

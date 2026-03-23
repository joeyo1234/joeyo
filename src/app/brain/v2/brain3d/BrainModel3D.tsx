'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load to avoid SSR issues with Three.js
const BrainModel3DCanvas = dynamic(() => import('./BrainModel3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center" style={{ height: 450, background: 'var(--card)' }}>
      <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Loading 3D...</p>
    </div>
  ),
});

interface BrainModel3DProps {
  activeTask: string | null;
  selectedRegion: string | null;
  cascadeActive: string[];
  hoveredModule: string | null;
  activeModules: string[];
  onModuleHover: (id: string | null) => void;
  onModuleClick: (id: string) => void;
}

export default function BrainModel3D(props: BrainModel3DProps) {
  const [glbExists, setGlbExists] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Check if GLB exists
  useEffect(() => {
    fetch('/brain-model.glb', { method: 'HEAD' })
      .then(res => setGlbExists(res.ok))
      .catch(() => setGlbExists(false));
  }, []);

  // Track theme
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') !== 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (glbExists === false) {
    return (
      <div
        className="w-full rounded-xl border border-dashed flex items-center justify-center"
        style={{ height: 300, borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="text-center px-6">
          <p className="text-sm font-mono mb-2" style={{ color: 'var(--muted)' }}>3D Brain Model</p>
          <p className="text-xs" style={{ color: 'var(--muted)', opacity: 0.6 }}>
            Place <code className="px-1 py-0.5 rounded" style={{ background: 'var(--hover)' }}>brain-model.glb</code> in <code className="px-1 py-0.5 rounded" style={{ background: 'var(--hover)' }}>public/</code>
          </p>
        </div>
      </div>
    );
  }

  if (glbExists === null) {
    return (
      <div className="w-full rounded-xl border flex items-center justify-center" style={{ height: 450, borderColor: 'var(--border)', background: 'var(--card)' }}>
        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl border overflow-hidden"
      style={{ height: 450, borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      <BrainModel3DCanvas {...props} isDark={isDark} />
    </div>
  );
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules, connections, feedbackPaths, tasks, tierBands, brainRegionDetails } from './data';
import type { Task } from './data';
import BrainModel3D from './brain3d/BrainModel3D';
import { brainStructures, taskStructureActivations } from './brain3d/brainStructures';

// ══════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════

export default function BrainV3() {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [cascadeActive, setCascadeActive] = useState<string[]>([]);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cascadeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const particleState = useRef<ParticleState>({ particles: [], emitters: [], running: false, lastFrame: 0 });
  const pathDataRef = useRef<Map<string, { points: { x: number; y: number }[]; length: number }>>(new Map());

  const task = activeTask ? tasks[activeTask] : null;

  // ── Cascade ──
  const runCascade = useCallback((t: Task) => {
    cascadeTimers.current.forEach(clearTimeout);
    cascadeTimers.current = [];
    setCascadeActive([]);
    const sequenced = Object.entries(t.sequence).sort(([, a], [, b]) => a - b);
    sequenced.forEach(([modKey], index) => {
      const timer = setTimeout(() => {
        setCascadeActive(prev => [...prev, modKey]);
      }, index * 350);
      cascadeTimers.current.push(timer);
    });
  }, []);

  const handleTaskSelect = useCallback((taskId: string) => {
    if (activeTask === taskId) {
      setActiveTask(null);
      setCascadeActive([]);
      setSelectedRegion(null);
      setExpandedModule(null);
      cascadeTimers.current.forEach(clearTimeout);
      return;
    }
    setSelectedRegion(null);
    setExpandedModule(null);
    setActiveTask(taskId);
    runCascade(tasks[taskId]);
  }, [activeTask, runCascade]);

  const handleModuleClick = useCallback((modId: string) => {
    setSelectedStructure(null); // clear any brain structure selection
    if (activeTask) {
      setExpandedModule(expandedModule === modId ? null : modId);
    } else {
      if (selectedRegion === modId) {
        setSelectedRegion(null);
        setExpandedModule(null);
      } else {
        setSelectedRegion(modId);
        setExpandedModule(modId);
      }
    }
  }, [activeTask, expandedModule, selectedRegion]);

  const handleStructureClick = useCallback((structureId: string) => {
    // Clear task and module selections when clicking a 3D brain structure
    if (activeTask) {
      setActiveTask(null);
      setCascadeActive([]);
      cascadeTimers.current.forEach(clearTimeout);
    }
    setSelectedRegion(null);
    setExpandedModule(null);

    if (selectedStructure === structureId) {
      setSelectedStructure(null);
    } else {
      setSelectedStructure(structureId);
    }
  }, [activeTask, selectedStructure]);

  useEffect(() => () => cascadeTimers.current.forEach(clearTimeout), []);

  const isActive = (id: string) => activeTask ? cascadeActive.includes(id) : selectedRegion === id;
  const isDimmed = (id: string) => {
    if (activeTask) return task ? !task.activeModules.includes(id) : false;
    if (selectedRegion) return id !== selectedRegion;
    return false;
  };
  const isPathActive = (from: string, to: string) => {
    if (!activeTask || !task) return false;
    return task.activePaths.some(([a, b]) => (a === from && b === to) || (a === to && b === from));
  };
  const isPathHovered = (from: string, to: string) => {
    if (!hoveredModule || activeTask) return false;
    return from === hoveredModule || to === hoveredModule;
  };

  // ── Particle system ──
  useEffect(() => {
    if (!activeTask || !task || !canvasRef.current || !diagramRef.current) {
      // Stop particles
      particleState.current.running = false;
      particleState.current.particles = [];
      particleState.current.emitters = [];
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvasRef.current.width / dpr, canvasRef.current.height / dpr);
      }
      return;
    }

    // Resize canvas
    const rect = diagramRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Pre-sample active paths
    const svgEl = diagramRef.current.querySelector('svg');
    if (!svgEl) return;
    const svgPaths = svgEl.querySelectorAll('path');
    pathDataRef.current.clear();

    task.activePaths.forEach(([from, to]) => {
      const key = `${from}->${to}`;
      // Find matching SVG path
      for (const p of svgPaths) {
        if (p.dataset.from === from && p.dataset.to === to) {
          const len = p.getTotalLength();
          const points: { x: number; y: number }[] = [];
          for (let i = 0; i <= 60; i++) {
            const pt = p.getPointAtLength((i / 60) * len);
            points.push({ x: pt.x, y: pt.y });
          }
          pathDataRef.current.set(key, { points, length: len });
          break;
        }
      }
    });

    // Create emitters
    particleState.current.emitters = [];
    task.activePaths.forEach(([from, to], idx) => {
      const key = `${from}->${to}`;
      if (!pathDataRef.current.has(key)) return;
      const isFb = feedbackPaths.has(key);
      particleState.current.emitters.push({
        pathKey: key,
        color: modules[from]?.color || '#888',
        rate: isFb ? 1 : 1.8,
        reverse: isFb,
        delay: idx * 200,
        elapsed: 0,
        timeSinceLast: 800,
      });
    });

    // Start loop
    particleState.current.running = true;
    particleState.current.lastFrame = performance.now();
    particleState.current.particles = [];

    const MAX = 40;

    function getPoint(key: string, progress: number) {
      const data = pathDataRef.current.get(key);
      if (!data) return null;
      const t = Math.max(0, Math.min(1, progress / data.length));
      const idx = t * (data.points.length - 1);
      const i = Math.floor(idx);
      const frac = idx - i;
      const p0 = data.points[Math.min(i, data.points.length - 1)];
      const p1 = data.points[Math.min(i + 1, data.points.length - 1)];
      return { x: p0.x + (p1.x - p0.x) * frac, y: p0.y + (p1.y - p0.y) * frac };
    }

    function hexToRgba(hex: string, a: number) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function loop(ts: number) {
      if (!particleState.current.running) return;
      const dt = Math.min(ts - particleState.current.lastFrame, 33);
      particleState.current.lastFrame = ts;
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Update emitters
      for (const em of particleState.current.emitters) {
        em.elapsed += dt;
        if (em.elapsed < em.delay) continue;
        em.timeSinceLast += dt;
        const interval = 1000 / em.rate;
        while (em.timeSinceLast >= interval && particleState.current.particles.length < MAX) {
          const data = pathDataRef.current.get(em.pathKey);
          if (data) {
            particleState.current.particles.push({
              pathKey: em.pathKey,
              color: em.color,
              progress: em.reverse ? data.length : 0,
              speed: (1 + Math.random() * 0.6) * (em.reverse ? -1 : 1),
              radius: 2.5 + Math.random() * 1.5,
              alive: true,
              trail: [],
              length: data.length,
            });
          }
          em.timeSinceLast -= interval;
        }
      }

      // Update + render
      for (const p of particleState.current.particles) {
        p.progress += p.speed * (dt / 16.67);
        const pt = getPoint(p.pathKey, p.progress);
        if (!pt) { p.alive = false; continue; }
        p.trail.push(pt);
        if (p.trail.length > 6) p.trail.shift();
        if ((p.speed > 0 && p.progress >= p.length) || (p.speed < 0 && p.progress <= 0)) p.alive = false;

        // Trail
        for (let i = 0; i < p.trail.length - 1; i++) {
          ctx.beginPath();
          ctx.arc(p.trail[i].x, p.trail[i].y, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(p.color, (i / p.trail.length) * 0.2);
          ctx.fill();
        }
        // Glow
        const head = p.trail[p.trail.length - 1];
        if (head) {
          ctx.beginPath();
          ctx.arc(head.x, head.y, p.radius + 3, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(p.color, 0.1);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(head.x, head.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(p.color, 0.8);
          ctx.fill();
        }
      }
      particleState.current.particles = particleState.current.particles.filter(p => p.alive);
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => {
      particleState.current.running = false;
    };
  }, [activeTask, task, cascadeActive]);

  const regionDetail = selectedRegion ? brainRegionDetails[selectedRegion] : null;
  const tasksUsingRegion = selectedRegion ? Object.values(tasks).filter(t => t.activeModules.includes(selectedRegion)) : [];

  // Brain structure detail (from 3D model clicks)
  const structureDetail = selectedStructure ? brainStructures[selectedStructure] : null;
  const structureTasksUsing = selectedStructure
    ? Object.entries(taskStructureActivations)
        .filter(([, structures]) => structures.includes(selectedStructure!))
        .map(([taskId]) => tasks[taskId])
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-[900px] mx-auto px-4 pb-16">
      {/* Task bar */}
      <div className="flex flex-wrap gap-1 py-5">
        {Object.values(tasks).map(t => (
          <button
            key={t.id}
            onClick={() => handleTaskSelect(t.id)}
            className={`text-xs font-mono px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTask === t.id
                ? 'bg-[var(--foreground)] text-[var(--background)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Flow diagram */}
      <div
        ref={diagramRef}
        className="relative w-full overflow-visible"
        style={{
          aspectRatio: '5 / 7',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '46% 46% 34% 34% / 5% 5% 3% 3%',
        }}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            backgroundImage: 'radial-gradient(var(--border) 0.8px, transparent 0.8px)',
            backgroundSize: '24px 24px',
            opacity: 0.3,
          }}
        />

        {/* Tier bands */}
        {tierBands.map((tier, i) => (
          <div
            key={tier.label}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${tier.yStart}%`,
              height: `${tier.yEnd - tier.yStart}%`,
              borderBottom: i < tierBands.length - 1 ? '1px dashed var(--border)' : 'none',
              opacity: 0.2,
            }}
          >
            <span className="absolute left-[3%] top-2 text-[8px] font-sans italic tracking-wider uppercase" style={{ color: 'var(--muted)', opacity: 0.5 }}>
              {tier.label}
            </span>
          </div>
        ))}

        {/* Side rail label */}
        <div className="absolute pointer-events-none" style={{ right: '30%', top: '16%', bottom: '36%', width: 1, background: 'linear-gradient(to bottom, transparent, var(--border) 20%, var(--border) 80%, transparent)', opacity: 0.25 }} />
        <div className="absolute pointer-events-none text-[7px] font-sans italic tracking-wider uppercase" style={{ right: '31%', top: '15%', color: 'var(--muted)', opacity: 0.3, writingMode: 'vertical-rl' }}>
          Modulation
        </div>

        {/* Flow chevrons */}
        {[16, 33, 51, 69].map(y => (
          <div
            key={y}
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{ left: '37%', top: `${y}%`, opacity: activeTask ? 0 : 0.08, color: 'var(--muted)', fontSize: 18 }}
          >
            &#x25BE;
          </div>
        ))}

        {/* SVG connections */}
        <ConnectionsSVG diagramRef={diagramRef} isPathActive={isPathActive} isPathHovered={isPathHovered} activeTask={activeTask} hoveredModule={hoveredModule} />

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} />

        {/* Module nodes */}
        {Object.values(modules).map(mod => {
          const active = isActive(mod.id);
          const dimmed = isDimmed(mod.id);
          const expanded = expandedModule === mod.id;
          const seq = task?.sequence[mod.id] ?? null;
          const hovered = hoveredModule === mod.id;

          return (
            <motion.div
              key={mod.id}
              onClick={() => handleModuleClick(mod.id)}
              onMouseEnter={() => !activeTask && setHoveredModule(mod.id)}
              onMouseLeave={() => setHoveredModule(null)}
              className="absolute cursor-pointer"
              style={{
                left: `${mod.x}%`,
                top: `${mod.y}%`,
                zIndex: expanded ? 10 : active ? 5 : hovered ? 5 : 2,
              }}
              animate={{
                opacity: dimmed ? 0.8 : 1,
                x: '-50%',
                y: '-50%',
                scale: expanded ? 1.08 : active ? 1.04 : dimmed ? 0.95 : hovered ? 1.05 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div
                className="relative rounded-[14px] backdrop-blur-lg"
                style={{
                  width: expanded ? 'clamp(155px, 17vw, 210px)' : 'clamp(100px, 11vw, 140px)',
                  padding: expanded ? '10px 14px 12px 18px' : '8px 12px 8px 16px',
                  background: active
                    ? `color-mix(in srgb, ${mod.color} 8%, var(--card))`
                    : `color-mix(in srgb, var(--card) 92%, ${mod.color})`,
                  border: `1px solid ${active ? `color-mix(in srgb, ${mod.color} 50%, transparent)` : `color-mix(in srgb, var(--border) 80%, ${mod.color} 20%)`}`,
                  boxShadow: active
                    ? `0 0 0 1px color-mix(in srgb, ${mod.color} 15%, transparent), 0 4px 20px color-mix(in srgb, ${mod.color} 12%, transparent)`
                    : hovered ? '0 4px 12px var(--border)' : 'none',
                  transition: 'box-shadow 0.3s, background 0.3s, border-color 0.3s, width 0.3s, padding 0.3s',
                  filter: dimmed ? 'grayscale(0.4)' : 'none',
                }}
              >
                {/* Left indicator */}
                <div className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-sm" style={{ background: mod.color, opacity: active ? 1 : 0.25, transition: 'opacity 0.2s' }} />

                {/* Sequence badge */}
                <AnimatePresence>
                  {active && seq !== null && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold text-white"
                      style={{ background: mod.color }}
                    >
                      {seq}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-[8px] font-mono tracking-wider uppercase mb-px" style={{ color: active ? mod.color : 'var(--muted)', opacity: active ? 1 : 0.5 }}>
                  {mod.tag}
                </p>
                <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--foreground)' }}>
                  {mod.name}
                </p>

                <AnimatePresence>
                  {(active || expanded || hovered) && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[7px] font-mono mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>
                      {mod.region}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {expanded && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {mod.desc}
                    </motion.p>
                  )}
                </AnimatePresence>

                {active && (
                  <>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-t-sm" style={{ background: mod.color, opacity: 0.5 }} />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-b-sm" style={{ background: mod.color, opacity: 0.5 }} />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3D Brain Model */}
      <div className="mt-4">
        <BrainModel3D
          activeTask={activeTask}
          selectedStructure={selectedStructure}
          cascadeActive={cascadeActive}
          hoveredStructure={hoveredModule}
          onStructureHover={setHoveredModule}
          onStructureClick={handleStructureClick}
        />
      </div>

      {/* Info panel */}
      <AnimatePresence mode="wait">
        {(task || regionDetail || structureDetail) && (
          <motion.div
            key={activeTask || selectedRegion || selectedStructure || 'none'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 border border-[var(--border)] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ background: 'var(--card)' }}
          >
            {task ? (
              <>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: 'var(--accent)' }}>Information Flow</p>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{task.title}</h3>
                  <div className="text-[13px] leading-relaxed [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold" style={{ color: 'var(--muted)' }} dangerouslySetInnerHTML={{ __html: task.desc }} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-3" style={{ color: '#ff8844' }}>Critical Bridges</p>
                  {task.bridges.map((b, i) => (
                    <div key={i} className="mb-2 rounded-md p-3" style={{ background: 'var(--hover)' }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4aa' }} />
                        <span className="text-[12px] font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{b.label}</span>
                      </div>
                      <p className="text-[12px] leading-relaxed pl-3.5" style={{ color: 'var(--muted)' }}>{b.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : structureDetail ? (
              <>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: structureDetail.color }}>Brain Structure</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: structureDetail.color, boxShadow: `0 0 8px ${structureDetail.color}` }} />
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{structureDetail.name}</h3>
                  </div>
                  <p className="text-[10px] font-mono mb-3 px-2 py-1 rounded inline-block" style={{ background: 'var(--hover)', color: 'var(--muted)' }}>
                    {structureDetail.category}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>{structureDetail.description}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-3" style={{ color: '#ff4466' }}>Clinical Significance</p>
                  <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>{structureDetail.clinical}</p>
                  {structureDetail.relatedModules.length > 0 && (
                    <>
                      <p className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: '#00d4aa' }}>Related Cognitive Modules</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {structureDetail.relatedModules.map(modId => (
                          <span key={modId} className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: 'var(--hover)', color: modules[modId]?.color || 'var(--muted)' }}>
                            {modules[modId]?.name || modId}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: '#ff8844' }}>Active In Tasks</p>
                  <div className="flex flex-wrap gap-1">
                    {structureTasksUsing.map(t => (
                      <button key={t.id} onClick={() => handleTaskSelect(t.id)} className="text-[10px] font-mono px-2 py-1 rounded hover:bg-[var(--border)] transition-colors" style={{ background: 'var(--hover)', color: 'var(--muted)' }}>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : regionDetail ? (
              <>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: regionDetail.color }}>Brain Region</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: regionDetail.color, boxShadow: `0 0 8px ${regionDetail.color}` }} />
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{regionDetail.title}</h3>
                  </div>
                  <p className="text-[11px] font-mono mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>{regionDetail.anatomy}</p>
                  <div className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }} dangerouslySetInnerHTML={{ __html: regionDetail.desc }} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-3" style={{ color: '#ff4466' }}>Clinical Significance</p>
                  <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>{regionDetail.clinical}</p>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: '#00d4aa' }}>Active In Tasks</p>
                  <div className="flex flex-wrap gap-1">
                    {tasksUsingRegion.map(t => (
                      <button key={t.id} onClick={() => handleTaskSelect(t.id)} className="text-[10px] font-mono px-2 py-1 rounded hover:bg-[var(--border)] transition-colors" style={{ background: 'var(--hover)', color: 'var(--muted)' }}>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════

interface ParticleState {
  particles: Particle[];
  emitters: Emitter[];
  running: boolean;
  lastFrame: number;
}

interface Particle {
  pathKey: string;
  color: string;
  progress: number;
  speed: number;
  radius: number;
  alive: boolean;
  trail: { x: number; y: number }[];
  length: number;
}

interface Emitter {
  pathKey: string;
  color: string;
  rate: number;
  reverse: boolean;
  delay: number;
  elapsed: number;
  timeSinceLast: number;
}

// ══════════════════════════════════════════════════
// SVG CONNECTIONS
// ══════════════════════════════════════════════════

function ConnectionsSVG({
  diagramRef,
  isPathActive,
  isPathHovered,
  activeTask,
  hoveredModule,
}: {
  diagramRef: React.RefObject<HTMLDivElement | null>;
  isPathActive: (from: string, to: string) => boolean;
  isPathHovered: (from: string, to: string) => boolean;
  activeTask: string | null;
  hoveredModule: string | null;
}) {
  const [viewBox, setViewBox] = useState('0 0 100 100');
  const [pathsData, setPathsData] = useState<{ d: string; from: string; to: string }[]>([]);

  const buildPaths = useCallback(() => {
    const el = diagramRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setViewBox(`0 0 ${rect.width} ${rect.height}`);

    const getCenter = (id: string) => {
      const mod = modules[id];
      return { x: (mod.x / 100) * rect.width, y: (mod.y / 100) * rect.height };
    };

    const isSideRail = (id: string) => id === 'emotional' || id === 'memory';

    setPathsData(connections.map(([from, to]) => {
      const a = getCenter(from);
      const b = getCenter(to);
      const dx = b.x - a.x;
      const dy = b.y - a.y;

      let d: string;
      if (isSideRail(from) || isSideRail(to)) {
        d = `M${a.x},${a.y} C${a.x + dx * 0.3},${a.y + dy * 0.1} ${a.x + dx * 0.7},${b.y - dy * 0.1} ${b.x},${b.y}`;
      } else if (Math.abs(dy) > Math.abs(dx) * 0.4) {
        d = `M${a.x},${a.y} C${a.x + dx * 0.15},${a.y + dy * 0.45} ${b.x - dx * 0.15},${b.y - dy * 0.45} ${b.x},${b.y}`;
      } else {
        const mx = (a.x + b.x) / 2;
        const offset = Math.abs(dy) * 0.3 + 15;
        d = `M${a.x},${a.y} Q${mx},${(a.y + b.y) / 2 - offset} ${b.x},${b.y}`;
      }
      return { d, from, to };
    }));
  }, [diagramRef]);

  useEffect(() => {
    const timer = setTimeout(buildPaths, 80);
    window.addEventListener('resize', buildPaths);
    return () => { clearTimeout(timer); window.removeEventListener('resize', buildPaths); };
  }, [buildPaths]);

  useEffect(() => { setTimeout(buildPaths, 50); }, [activeTask, hoveredModule, buildPaths]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={viewBox} style={{ zIndex: 1 }}>
      {pathsData.map((p, i) => {
        const active = isPathActive(p.from, p.to);
        const hovered = isPathHovered(p.from, p.to);
        const isFeedback = feedbackPaths.has(`${p.from}->${p.to}`);
        const sourceColor = modules[p.from]?.color || '#888';
        const highlighted = active || hovered;

        return (
          <path
            key={i}
            d={p.d}
            data-from={p.from}
            data-to={p.to}
            fill="none"
            stroke={highlighted ? sourceColor : 'var(--border)'}
            strokeWidth={active ? 2.5 : hovered ? 1.5 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isFeedback ? '5 4' : active ? '6 4' : 'none'}
            opacity={active ? 0.85 : hovered ? 0.6 : 0.25}
            style={{
              transition: 'all 0.4s ease',
              filter: active ? `drop-shadow(0 0 4px ${sourceColor}44)` : 'none',
            }}
          >
            {active && (
              <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="0.8s" repeatCount="indefinite" />
            )}
          </path>
        );
      })}
    </svg>
  );
}

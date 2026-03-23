'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules, connections, feedbackPaths, tasks, tierBands, brainRegionDetails } from './data';
import type { Task } from './data';

// ══════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════

export default function BrainV2() {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [cascadeActive, setCascadeActive] = useState<string[]>([]);
  const diagramRef = useRef<HTMLDivElement>(null);
  const cascadeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const task = activeTask ? tasks[activeTask] : null;

  // Cascade activation
  const runCascade = useCallback((t: Task) => {
    cascadeTimers.current.forEach(clearTimeout);
    cascadeTimers.current = [];
    setCascadeActive([]);

    const sequenced = Object.entries(t.sequence).sort(([, a], [, b]) => a - b);
    const delay = 300;

    sequenced.forEach(([modKey], index) => {
      const timer = setTimeout(() => {
        setCascadeActive(prev => [...prev, modKey]);
      }, index * delay);
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
    if (activeTask) {
      setExpandedModule(expandedModule === modId ? null : modId);
    } else {
      if (selectedRegion === modId) {
        setSelectedRegion(null);
        setExpandedModule(null);
      } else {
        setSelectedRegion(modId);
        setExpandedModule(null);
      }
    }
  }, [activeTask, expandedModule, selectedRegion]);

  const handleRegionSelect = useCallback((modId: string) => {
    if (activeTask) {
      setActiveTask(null);
      setCascadeActive([]);
      cascadeTimers.current.forEach(clearTimeout);
    }
    if (selectedRegion === modId) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(modId);
      setExpandedModule(null);
    }
  }, [activeTask, selectedRegion]);

  // Cleanup
  useEffect(() => {
    return () => cascadeTimers.current.forEach(clearTimeout);
  }, []);

  const isModuleActive = (id: string) => {
    if (activeTask) return cascadeActive.includes(id);
    if (selectedRegion) return id === selectedRegion;
    return false;
  };

  const isModuleDimmed = (id: string) => {
    if (activeTask) return task ? !task.activeModules.includes(id) : false;
    if (selectedRegion) return id !== selectedRegion;
    return false;
  };

  const isPathActive = (from: string, to: string) => {
    if (!activeTask || !task) return false;
    return task.activePaths.some(([a, b]) => (a === from && b === to) || (a === to && b === from));
  };

  const getSequenceNum = (id: string) => {
    if (!task) return null;
    return task.sequence[id] ?? null;
  };

  // Info panel content
  const regionDetail = selectedRegion ? brainRegionDetails[selectedRegion] : null;
  const tasksUsingRegion = selectedRegion
    ? Object.values(tasks).filter(t => t.activeModules.includes(selectedRegion))
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
        className="relative w-full border border-[var(--border)] rounded-2xl overflow-visible"
        style={{
          aspectRatio: '5 / 7',
          background: 'var(--card)',
          borderRadius: '46% 46% 34% 34% / 5% 5% 3% 3%',
        }}
      >
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
            <span
              className="absolute left-[3%] top-2 text-[8px] font-sans italic tracking-wider uppercase"
              style={{ color: 'var(--muted)', opacity: 0.5 }}
            >
              {tier.label}
            </span>
          </div>
        ))}

        {/* SVG connections */}
        <ConnectionsSVG
          diagramRef={diagramRef}
          isPathActive={isPathActive}
          activeTask={activeTask}
        />

        {/* Module nodes */}
        {Object.values(modules).map(mod => {
          const active = isModuleActive(mod.id);
          const dimmed = isModuleDimmed(mod.id);
          const expanded = expandedModule === mod.id;
          const seq = getSequenceNum(mod.id);

          return (
            <motion.div
              key={mod.id}
              onClick={() => handleModuleClick(mod.id)}
              className="absolute cursor-pointer"
              style={{
                left: `${mod.x}%`,
                top: `${mod.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: expanded ? 10 : active ? 5 : 2,
                ['--module-color' as string]: mod.color,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: dimmed ? 0.12 : 1,
                y: 0,
                scale: expanded ? 1.08 : active ? 1.03 : dimmed ? 0.94 : 1,
                filter: dimmed ? 'grayscale(0.5)' : 'none',
              }}
              whileHover={!dimmed ? { scale: expanded ? 1.08 : 1.06 } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div
                className="relative rounded-[14px] backdrop-blur-lg transition-shadow duration-300"
                style={{
                  width: expanded ? 'clamp(155px, 17vw, 210px)' : 'clamp(100px, 11vw, 140px)',
                  padding: expanded ? '10px 14px 12px 18px' : '8px 12px 8px 16px',
                  background: active
                    ? `color-mix(in srgb, ${mod.color} 8%, var(--card))`
                    : `color-mix(in srgb, var(--card) 92%, ${mod.color})`,
                  border: `1px solid ${active ? `color-mix(in srgb, ${mod.color} 50%, transparent)` : `color-mix(in srgb, var(--border) 80%, ${mod.color} 20%)`}`,
                  boxShadow: active
                    ? `0 0 0 1px color-mix(in srgb, ${mod.color} 15%, transparent), 0 4px 20px color-mix(in srgb, ${mod.color} 12%, transparent)`
                    : 'none',
                }}
              >
                {/* Left indicator bar */}
                <div
                  className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-sm transition-opacity duration-200"
                  style={{ background: mod.color, opacity: active ? 1 : 0.25 }}
                />

                {/* Sequence badge */}
                <AnimatePresence>
                  {active && seq !== null && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold text-white"
                      style={{ background: mod.color }}
                    >
                      {seq}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content */}
                <p className="text-[8px] font-mono tracking-wider uppercase mb-px"
                  style={{ color: active ? mod.color : 'var(--muted)', opacity: active ? 1 : 0.5 }}>
                  {mod.tag}
                </p>
                <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--foreground)' }}>
                  {mod.name}
                </p>

                {/* Region - show on hover/active */}
                <AnimatePresence>
                  {(active || expanded) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[7px] font-mono mt-0.5 leading-snug"
                      style={{ color: 'var(--muted)' }}
                    >
                      {mod.region}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Description - show only when expanded */}
                <AnimatePresence>
                  {expanded && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] mt-1.5 leading-relaxed"
                      style={{ color: 'var(--muted)' }}
                    >
                      {mod.desc}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Ports */}
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

      {/* Info panel */}
      <AnimatePresence mode="wait">
        {(task || regionDetail) && (
          <motion.div
            key={activeTask || selectedRegion || 'none'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 border border-[var(--border)] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ background: 'var(--card)' }}
          >
            {task ? (
              <>
                {/* Task info */}
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: 'var(--accent)' }}>
                    Information Flow
                  </p>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    {task.title}
                  </h3>
                  <div
                    className="text-[13px] leading-relaxed"
                    style={{ color: 'var(--muted)' }}
                    dangerouslySetInnerHTML={{ __html: task.desc }}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-3" style={{ color: '#ff8844' }}>
                    Critical Bridges
                  </p>
                  {task.bridges.map((b, i) => (
                    <div key={i} className="mb-2 rounded-md p-3" style={{ background: 'var(--hover)' }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4aa' }} />
                        <span className="text-[12px] font-mono font-semibold" style={{ color: 'var(--foreground)' }}>
                          {b.label}
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed pl-3.5" style={{ color: 'var(--muted)' }}>
                        {b.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : regionDetail ? (
              <>
                {/* Region info */}
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: regionDetail.color }}>
                    Brain Region
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: regionDetail.color, boxShadow: `0 0 8px ${regionDetail.color}` }} />
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{regionDetail.title}</h3>
                  </div>
                  <p className="text-[11px] font-mono mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {regionDetail.anatomy}
                  </p>
                  <div
                    className="text-[13px] leading-relaxed"
                    style={{ color: 'var(--muted)' }}
                    dangerouslySetInnerHTML={{ __html: regionDetail.desc }}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-3" style={{ color: '#ff4466' }}>
                    Clinical Significance
                  </p>
                  <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                    {regionDetail.clinical}
                  </p>
                  <p className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: '#00d4aa' }}>
                    Active In Tasks
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tasksUsingRegion.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleTaskSelect(t.id)}
                        className="text-[10px] font-mono px-2 py-1 rounded transition-colors"
                        style={{ background: 'var(--hover)', color: 'var(--muted)' }}
                      >
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
// SVG CONNECTIONS (separate component for perf)
// ══════════════════════════════════════════════════

function ConnectionsSVG({
  diagramRef,
  isPathActive,
  activeTask,
}: {
  diagramRef: React.RefObject<HTMLDivElement | null>;
  isPathActive: (from: string, to: string) => boolean;
  activeTask: string | null;
}) {
  const [paths, setPaths] = useState<{ d: string; from: string; to: string }[]>([]);

  const buildPaths = useCallback(() => {
    const el = diagramRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const getCenter = (id: string) => {
      const mod = modules[id];
      return { x: (mod.x / 100) * rect.width, y: (mod.y / 100) * rect.height };
    };

    const isSideRail = (id: string) => id === 'emotional' || id === 'memory';

    const newPaths = connections.map(([from, to]) => {
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
    });

    setPaths(newPaths);
  }, [diagramRef]);

  useEffect(() => {
    const timer = setTimeout(buildPaths, 100);
    window.addEventListener('resize', buildPaths);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', buildPaths);
    };
  }, [buildPaths]);

  // Rebuild when task changes (module sizes might change)
  useEffect(() => {
    setTimeout(buildPaths, 50);
  }, [activeTask, buildPaths]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {paths.map((p, i) => {
        const active = isPathActive(p.from, p.to);
        const isFeedback = feedbackPaths.has(`${p.from}->${p.to}`);
        const sourceColor = modules[p.from]?.color || '#888';

        return (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={active ? sourceColor : 'var(--border)'}
            strokeWidth={active ? 2.5 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isFeedback ? '5 4' : 'none'}
            opacity={active ? 0.85 : 0.2}
            style={{
              transition: 'all 0.5s ease',
              filter: active ? `drop-shadow(0 0 3px ${sourceColor}44)` : 'none',
            }}
          />
        );
      })}
    </svg>
  );
}

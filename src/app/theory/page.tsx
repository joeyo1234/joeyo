'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MapNode {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  keyIdeas: string[];
  status: 'written' | 'in-progress' | 'planned';
  essaySlug?: string;
}

const journeyMap: MapNode[] = [
  {
    id: 'origins',
    icon: '🔬',
    title: 'Origins of Life',
    subtitle: 'The miracle of biology',
    description: 'How did non-living matter become living? The inception of self-replicating systems and the beginning of evolution\'s grand experiment.',
    keyIdeas: ['Abiogenesis', 'Self-replication', 'Early cellular life'],
    status: 'planned',
  },
  {
    id: 'evolution',
    icon: '🧬',
    title: 'Evolution as Engineer',
    subtitle: 'Nature\'s problem solver',
    description: 'Evolution isn\'t random — it\'s a creative force. Understanding how natural selection designed increasingly sophisticated solutions.',
    keyIdeas: ['Natural selection', 'Emergence', 'Optimization without intention'],
    status: 'planned',
  },
  {
    id: 'neurons',
    icon: '⚡',
    title: 'Neurons & Networks',
    subtitle: 'The building blocks',
    description: 'The neuron: evolution\'s answer to rapid information processing. How biological circuits differ from silicon ones.',
    keyIdeas: ['Biological vs digital computing', 'Parallel processing', 'Why messiness matters'],
    status: 'planned',
  },
  {
    id: 'brain',
    icon: '🧠',
    title: 'The Centralized Brain',
    subtitle: 'Evolution\'s masterpiece',
    description: 'Why did brains evolve? The advantages of centralized processing and the emergence of the self.',
    keyIdeas: ['Centralized processing', 'Networks of knowledge', 'The emergence of self'],
    status: 'planned',
  },
  {
    id: 'layers',
    icon: '📊',
    title: 'Processing Layers',
    subtitle: 'Layered Cognition Theory',
    description: 'The architecture of mind: how information flows through layers of processing, each adding meaning and context.',
    keyIdeas: ['Input processing', 'Integration layer', 'The meaning layer', 'The replay system'],
    status: 'in-progress',
  },
  {
    id: 'consciousness',
    icon: '✨',
    title: 'Consciousness Emerges',
    subtitle: 'The hard problem dissolved',
    description: 'Why does it feel like something to be you? Consciousness as evolution\'s solution for extended cognition.',
    keyIdeas: ['The hard problem', 'Qualia as meaning', 'Why evolution chose consciousness'],
    status: 'written',
    essaySlug: 'consciousness',
  },
  {
    id: 'meaning',
    icon: '💭',
    title: 'Meaning & Experience',
    subtitle: 'The architecture of feeling',
    description: 'How meaning arises in conscious experience. Emotions, dreams, and the texture of being human.',
    keyIdeas: ['Emotion as signal', 'Dreams as maintenance', 'The present moment'],
    status: 'planned',
  },
  {
    id: 'future',
    icon: '🤖',
    title: 'The Future of Mind',
    subtitle: 'AI and beyond',
    description: 'Can machines be conscious? What silicon can learn from carbon, and what makes biological consciousness unique.',
    keyIdeas: ['Requirements for machine consciousness', 'What\'s missing in current AI', 'The evolution continues'],
    status: 'planned',
  },
];

const tocSections = [
  {
    part: 'Introduction',
    title: 'Nature\'s Source Code',
    chapters: [
      'The AI That Made Me Think Differently',
      'The Mystery of Experience',
      'When Processing Becomes Awareness',
      'Nature as the Original Engineer',
    ],
  },
  {
    part: 'Part 1',
    title: 'Reverse Engineering Consciousness',
    chapters: [
      'The Problem with Current AI',
      'The Hard Problem of Experience',
      'What Silicon Valley Doesn\'t Understand',
      'Nature\'s Early Prototypes: From Cells to Circuits',
    ],
  },
  {
    part: 'Part 2',
    title: 'Building Blocks of Experience',
    chapters: [
      'The Biological Computer',
      'Messy But Perfect: Why Nature Chose Chaos',
      'Beyond Binary: Neural Information',
      'Parallel Processing in Living Systems',
      'When Errors Are Features',
      'The Processing Layers',
    ],
  },
  {
    part: 'Part 3',
    title: 'Nature\'s Solutions',
    chapters: [
      'The Split Brain: Lessons in Unified Experience',
      'The McGurk Effect: How Integration Creates Reality',
      'Time Binding: Synchronizing Experience',
      'The Invisible Gorilla: Managing Attention',
      'Mirror Neurons: Understanding Others',
    ],
  },
  {
    part: 'Part 4',
    title: 'The Blueprint',
    chapters: [
      'Layered Cognition Theory',
      'Why Evolution Chose Consciousness',
      'The Requirements for Experience',
      'Testing for Consciousness',
      'Natural vs Artificial Integration',
    ],
    hasContent: true,
  },
  {
    part: 'Part 5',
    title: 'When Systems Fail',
    chapters: [
      'Mental Health Through the Lens of Processing',
      'Dreams as System Maintenance',
      'What Psychedelics Reveal About Consciousness',
      'Learning from Edge Cases',
    ],
  },
  {
    part: 'Part 6',
    title: 'Building Conscious Machines',
    chapters: [
      'Current AI: What\'s Missing',
      'Requirements for Machine Consciousness',
      'Potential Paths Forward',
      'Ethical Considerations',
      'The Future of Experience',
    ],
  },
];

export default function TheoryPage() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
            >
              ← Back to all writing
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[var(--muted)] text-sm font-mono mb-4">THEORY OF EVERYTHING</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[var(--foreground)] mb-6">
              The Conscious Machine
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl">
              Nature&apos;s blueprint for intelligence. A journey from the origins of life to the emergence of consciousness — understanding the brain as evolution&apos;s most sophisticated machine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visual Journey Map */}
      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-sm font-mono text-[var(--muted)] mb-8">THE JOURNEY</h2>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border)] -translate-x-1/2" />
            
            {/* Nodes */}
            <div className="space-y-4">
              {journeyMap.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <button
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                    className={`relative z-10 w-full md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-8' : 'md:ml-auto md:pl-8'
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg border transition-all ${
                        selectedNode?.id === node.id
                          ? 'border-[var(--foreground)] bg-[var(--hover)]'
                          : 'border-[var(--border)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{node.icon}</span>
                        <div className="text-left">
                          <h3 className="font-medium text-[var(--foreground)]">{node.title}</h3>
                          <p className="text-sm text-[var(--muted)]">{node.subtitle}</p>
                        </div>
                        <div className="ml-auto">
                          {node.status === 'written' && (
                            <span className="text-xs font-mono px-2 py-1 bg-green-500/20 text-green-400 rounded">
                              written
                            </span>
                          )}
                          {node.status === 'in-progress' && (
                            <span className="text-xs font-mono px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                              in progress
                            </span>
                          )}
                          {node.status === 'planned' && (
                            <span className="text-xs font-mono px-2 py-1 bg-[var(--border)] text-[var(--muted)] rounded">
                              planned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Node connector dot */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[var(--foreground)] bg-[var(--background)] z-20 ${
                      index % 2 === 0 
                        ? 'left-6 md:left-1/2 -translate-x-1/2' 
                        : 'left-6 md:left-1/2 -translate-x-1/2'
                    }`}
                  />

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {selectedNode?.id === node.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`overflow-hidden md:w-1/2 ${
                          index % 2 === 0 ? 'md:pr-8' : 'md:ml-auto md:pl-8'
                        }`}
                      >
                        <div className="pt-4 pl-12 md:pl-0">
                          <p className="text-[var(--muted)] mb-4">{node.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {node.keyIdeas.map((idea) => (
                              <span
                                key={idea}
                                className="text-xs font-mono px-2 py-1 bg-[var(--border)] text-[var(--accent)] rounded"
                              >
                                {idea}
                              </span>
                            ))}
                          </div>
                          {node.essaySlug && (
                            <Link
                              href={`/?essay=${node.essaySlug}`}
                              className="text-sm text-[var(--foreground)] hover:underline"
                            >
                              Read the essay →
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Table of Contents */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-sm font-mono text-[var(--muted)] mb-8">FULL TABLE OF CONTENTS</h2>
          
          <div className="space-y-4">
            {tocSections.map((section) => (
              <div key={section.part} className="border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedPart(expandedPart === section.part ? null : section.part)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[var(--muted)]">{section.part}</span>
                    <h3 className="font-medium text-[var(--foreground)]">{section.title}</h3>
                    {section.hasContent && (
                      <span className="text-xs font-mono px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                        has content
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-[var(--muted)] transition-transform ${
                      expandedPart === section.part ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {expandedPart === section.part && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-[var(--border)]">
                        <ul className="space-y-2">
                          {section.chapters.map((chapter, i) => (
                            <li key={i} className="flex items-center gap-3 text-[var(--muted)]">
                              <span className="text-xs font-mono text-[var(--border)]">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              {chapter}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-[var(--muted)] text-center">
            This is a living document. The theory evolves as understanding deepens.
          </p>
        </div>
      </footer>
    </main>
  );
}

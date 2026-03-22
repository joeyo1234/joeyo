'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EssayModal } from '@/components/EssayModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Essay } from '@/lib/essays';

export default function Home() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  useEffect(() => {
    fetch('/api/essays')
      .then((res) => res.json())
      .then((data) => setEssays(data));
  }, []);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-medium text-[var(--foreground)] mb-4">
                Joseph Orsborn
              </h1>
              <p className="text-[var(--muted)] text-base max-w-xl mb-2">
                Exploring the architecture of mind and meaning.
              </p>
              <p className="text-[var(--muted)] text-base">
                Building{' '}
                <a
                  href="https://lilypadlearning.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:text-[var(--foreground)] transition-colors underline underline-offset-4"
                >
                  Lilypad Learning
                </a>
                .
              </p>
            </motion.div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 min-h-[35vh]">

        {/* Interactive */}
        <div className="py-8 border-b border-[var(--border)]">
          <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-4">Interactive</p>
          <div className="space-y-1">
            <a
              href="/brain"
              className="block py-3 -mx-3 px-3 rounded-lg group hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[var(--foreground)] font-medium group-hover:opacity-80 transition-opacity">
                  Cognitive Systems Architecture
                </h3>
                <span className="text-xs font-mono text-[var(--muted)] whitespace-nowrap">neuroscience</span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-1">
                The brain as a distributed computing system — modules, pathways, and information flow.
              </p>
            </a>
            <a
              href="/theory"
              className="block py-3 -mx-3 px-3 rounded-lg group hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[var(--foreground)] font-medium group-hover:opacity-80 transition-opacity">
                  The Conscious Machine
                  <span className="ml-2 text-xs font-mono text-[var(--muted)] opacity-60">· in progress</span>
                </h3>
                <span className="text-xs font-mono text-[var(--muted)] whitespace-nowrap">theory</span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-1">
                From the origins of life to the emergence of consciousness.
              </p>
            </a>
          </div>
        </div>

        {/* Writing */}
        <div className="py-8">
          <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-4">Writing</p>
          <div className="space-y-1">
            {essays.map((essay, index) => (
              <motion.button
                key={essay.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => {
                  if (essay.externalUrl) {
                    window.open(essay.externalUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    setSelectedEssay(essay);
                  }
                }}
                className="block w-full text-left py-3 -mx-3 px-3 rounded-lg group hover:bg-[var(--hover)] transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[var(--foreground)] font-medium group-hover:opacity-80 transition-opacity">
                    {essay.title}
                  </h3>
                  <span className="text-xs font-mono text-[var(--muted)] whitespace-nowrap flex items-center gap-1.5">
                    {new Date(essay.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                    {essay.externalUrl && (
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3.5 3.5h5v5M8.5 3.5L3.5 8.5" />
                      </svg>
                    )}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1">
                  {essay.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-4">
              <a
                href="https://joeyo4.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Substack
              </a>
              <a
                href="https://linkedin.com/in/joseph-orsborn-5363b46b"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="mailto:joseph.orsborn@gmail.com"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Email
              </a>
            </div>
            <div className="font-mono">© {new Date().getFullYear()}</div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <EssayModal essay={selectedEssay} onClose={() => setSelectedEssay(null)} />
    </main>
  );
}

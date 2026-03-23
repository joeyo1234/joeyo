'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState } from 'react';
import BrainV2 from './v2/BrainV2';

export default function BrainPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [version, setVersion] = useState<'v1' | 'v2'>('v1');

  // Sync theme changes into the v1 iframe
  useEffect(() => {
    if (version !== 'v1') return;
    const syncTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      try {
        iframeRef.current?.contentDocument?.documentElement.setAttribute('data-theme', theme);
      } catch { /* cross-origin safety */ }
    };

    const iframe = iframeRef.current;
    iframe?.addEventListener('load', syncTheme);

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      iframe?.removeEventListener('load', syncTheme);
      observer.disconnect();
    };
  }, [version]);

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
              ← Home
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-mono">
                <button
                  onClick={() => setVersion('v1')}
                  className={`px-2 py-1 rounded transition-colors ${
                    version === 'v1'
                      ? 'text-[var(--foreground)] opacity-100'
                      : 'text-[var(--muted)] opacity-40 hover:opacity-70'
                  }`}
                >
                  v1
                </button>
                <button
                  onClick={() => setVersion('v2')}
                  className={`px-2 py-1 rounded transition-colors ${
                    version === 'v2'
                      ? 'text-[var(--foreground)] opacity-100'
                      : 'text-[var(--muted)] opacity-40 hover:opacity-70'
                  }`}
                >
                  v2
                </button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Title */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-medium text-[var(--foreground)] mb-2">
            Cognitive Systems Architecture
          </h1>
          <p className="text-[var(--muted)] text-base max-w-xl">
            An interactive map of the brain as a distributed computing system. Select a cognitive task to trace information flow through the architecture.
          </p>
        </div>
      </section>

      {/* Content */}
      {version === 'v1' ? (
        <iframe
          ref={iframeRef}
          src="/brain-architecture-v1.html"
          className="w-full border-0"
          style={{ height: '2600px' }}
          title="Cognitive Systems Architecture v1"
        />
      ) : (
        <BrainV2 />
      )}
    </main>
  );
}

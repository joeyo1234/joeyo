'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState } from 'react';

export default function BrainPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Sync theme changes into the iframe
  useEffect(() => {
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
  }, []);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header — fades out on scroll down, reappears on scroll up */}
      <div
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: headerVisible ? 'auto' : 'none',
        }}
      >
        <header className="border-b border-[var(--border)] bg-[var(--background)]">
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

        <section className="border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl md:text-4xl font-medium text-[var(--foreground)] mb-2">
              Cognitive Systems Architecture
            </h1>
            <p className="text-[var(--muted)] text-base max-w-xl">
              An interactive map of the brain as a distributed computing system. Select a cognitive task to trace information flow through the architecture.
            </p>
          </div>
        </section>
      </div>

      {/* Iframe — fills remaining space */}
      <iframe
        ref={iframeRef}
        src="/brain-architecture.html"
        className="flex-1 w-full border-0"
        style={{ minHeight: 'calc(100vh - 60px)' }}
        title="Cognitive Systems Architecture"
      />
    </main>
  );
}

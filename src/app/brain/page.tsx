'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function BrainPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Auto-hide header after 3 seconds of inactivity at top,
  // or immediately when user scrolls the parent page down
  const showHeader = useCallback(() => {
    setHeaderVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      // Only auto-hide if page is scrolled past header
      if (window.scrollY > 40) {
        setHeaderVisible(false);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHeaderVisible(false);
      } else {
        showHeader();
      }
    };

    // Show header when mouse moves to top 60px of screen
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 60) {
        showHeader();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showHeader]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header — fades out when scrolled, reappears on hover near top */}
      <div
        className="sticky top-0 z-50 transition-all duration-500 ease-in-out"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: headerVisible ? 'auto' : 'none',
        }}
        onMouseEnter={() => setHeaderVisible(true)}
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
        style={{ minHeight: '100vh' }}
        title="Cognitive Systems Architecture"
      />
    </main>
  );
}

'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState } from 'react';

export default function BrainPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(2200);

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

  // Auto-resize iframe to match content height
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resizeIframe = () => {
      try {
        const body = iframe.contentDocument?.body;
        const html = iframe.contentDocument?.documentElement;
        if (body && html) {
          const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight
          );
          if (height > 100) setIframeHeight(height - 200);
        }
      } catch { /* cross-origin safety */ }
    };

    iframe.addEventListener('load', () => {
      resizeIframe();
      // Re-check periodically as content may change (expanding modules etc)
      const interval = setInterval(resizeIframe, 1000);
      setTimeout(() => clearInterval(interval), 30000);
    });
  }, []);

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

      {/* Diagram */}
      <iframe
        ref={iframeRef}
        src="/brain-architecture.html"
        className="w-full border-0"
        style={{ height: `${iframeHeight}px` }}
        title="Cognitive Systems Architecture"
        scrolling="no"
      />
    </main>
  );
}

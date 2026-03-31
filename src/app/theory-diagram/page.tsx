'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function TheoryDiagramPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
            >
              ← Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <iframe
        src="/lct-brain-architecture.html"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 73px)' }}
        title="Layered Cognition Theory — Brain Architecture"
      />
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EssayModal } from '@/components/EssayModal';
import type { Essay } from '@/lib/essays';

export default function Home() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/essays')
      .then((res) => res.json())
      .then((data) => setEssays(data));
  }, []);

  const allTags = [...new Set(essays.flatMap((e) => e.tags))];
  const filteredEssays = filter
    ? essays.filter((e) => e.tags.includes(filter))
    : essays;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#262626]">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-medium text-[#e5e5e5] mb-3">
              Joseph Orsborn
            </h1>
            <p className="text-[#737373] text-lg max-w-xl">
              Founder of{' '}
              <a
                href="https://lilypadlearning.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors underline underline-offset-4"
              >
                Lilypad Learning
              </a>
              . Writing about consciousness, technology, and building things that matter.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-[#262626]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter(null)}
              className={`text-sm font-mono px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                filter === null
                  ? 'bg-[#262626] text-[#e5e5e5]'
                  : 'text-[#737373] hover:text-[#a3a3a3]'
              }`}
            >
              all
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`text-sm font-mono px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                  filter === tag
                    ? 'bg-[#262626] text-[#e5e5e5]'
                    : 'text-[#737373] hover:text-[#a3a3a3]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Essays Index */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-3 text-xs font-mono text-[#525252] uppercase tracking-wider border-b border-[#262626]">
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Tags</div>
          <div className="col-span-3 text-right">Date</div>
        </div>

        {/* Essay Rows */}
        <div className="divide-y divide-[#1a1a1a]">
          {filteredEssays.map((essay, index) => (
            <motion.button
              key={essay.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedEssay(essay)}
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-5 md:py-4 text-left group hover:bg-[#111] transition-colors -mx-4 px-4 rounded"
            >
              {/* Title & Description */}
              <div className="md:col-span-6">
                <h3 className="text-[#e5e5e5] font-medium group-hover:text-white transition-colors">
                  {essay.title}
                </h3>
                <p className="text-sm text-[#525252] mt-1 line-clamp-1 md:hidden">
                  {essay.description}
                </p>
              </div>

              {/* Tags */}
              <div className="md:col-span-3 flex items-center gap-2">
                {essay.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-[#525252]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Date */}
              <div className="md:col-span-3 text-sm font-mono text-[#525252] md:text-right">
                {new Date(essay.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              </div>
            </motion.button>
          ))}
        </div>

        {filteredEssays.length === 0 && (
          <div className="py-20 text-center text-[#525252]">
            No essays found.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#262626]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#525252]">
            <div className="flex items-center gap-4">
              <a
                href="https://joeyo4.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#a3a3a3] transition-colors"
              >
                Substack
              </a>
              <a
                href="https://linkedin.com/in/joseph-orsborn-5363b46b"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#a3a3a3] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="mailto:joseph.orsborn@gmail.com"
                className="hover:text-[#a3a3a3] transition-colors"
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

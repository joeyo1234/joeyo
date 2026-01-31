'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Essay } from '@/lib/essays';

interface EssayModalProps {
  essay: Essay | null;
  onClose: () => void;
}

export function EssayModal({ essay, onClose }: EssayModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (essay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [essay]);

  return (
    <AnimatePresence>
      {essay && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-[#111] border border-[#262626] rounded-lg z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 md:p-8 border-b border-[#262626]">
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-[#737373]">
                    {new Date(essay.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {essay.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 bg-[#1a1a1a] text-[#737373] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-medium text-[#e5e5e5]">
                  {essay.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#737373] hover:text-[#e5e5e5] transition-colors p-2 -m-2"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <article className="prose prose-invert prose-lg max-w-3xl mx-auto">
                <div 
                  className="text-[#a3a3a3] leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ 
                    __html: essay.content
                      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-[#e5e5e5] mt-8 mb-4">$1</h3>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-medium text-[#e5e5e5] mt-10 mb-4">$1</h2>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#e5e5e5] font-medium">$1</strong>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                  }}
                />
              </article>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

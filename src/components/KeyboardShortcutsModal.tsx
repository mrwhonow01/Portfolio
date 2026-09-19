import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  context: string;
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['←', '→'],
    description: 'Switch previous / next photograph or slide',
    context: 'Home & Lightbox',
  },
  {
    keys: ['Esc'],
    description: 'Close active modal, lightbox, or menu',
    context: 'Everywhere',
  },
  {
    keys: ['I'],
    description: 'Toggle shot details & EXIF camera information',
    context: 'Lightbox',
  },
  {
    keys: ['F'],
    description: 'Toggle fullscreen photography viewing',
    context: 'Lightbox',
  },
  {
    keys: ['?'],
    description: 'Toggle this keyboard shortcuts guide',
    context: 'Everywhere',
  },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl z-10 p-6 text-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-zinc-600" />
                <h3 className="text-xs uppercase tracking-wider font-bold text-black font-sans">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-black transition-colors cursor-pointer p-1"
                aria-label="Close shortcuts dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="space-y-3">
              {SHORTCUTS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-xs text-zinc-900 font-medium">{item.description}</p>
                    <span className="text-[10px] text-zinc-400 font-mono">{item.context}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    {item.keys.map((k, ki) => (
                      <kbd
                        key={ki}
                        className="px-2 py-0.5 text-[11px] font-mono font-semibold text-zinc-700 bg-zinc-100 border border-zinc-300 rounded shadow-2xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>Press ? anytime to toggle</span>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useEffect } from 'react';
import { X, ShieldCheck, Mail, Instagram, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContact?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToContact,
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
            className="fixed inset-0 bg-black backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white text-zinc-800 shadow-2xl border border-gray-200 z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-black" />
                <div>
                  <h2 className="text-[16px] font-bold text-black uppercase tracking-tight">
                    Terms of Service, Usage & Copyright
                  </h2>
                  <p className="text-[11px] text-[#888888] uppercase tracking-wider font-mono">
                    Media License & Attribution Guidelines
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[13px] leading-relaxed text-zinc-600">
              {/* Highlight Callout Box */}
              <div className="bg-zinc-50 border border-zinc-200/80 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-black font-bold text-[14px]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Usage with Prior Permission & Credit</span>
                </div>
                <p className="text-zinc-600 text-[12.5px]">
                  You are welcome to use any photographs, videos, or publicity materials created by <strong>Juztin Yuen</strong> completely free of charge. All I ask is that you get in touch first to confirm permission, and properly tag/credit <strong>@quietframes.sg</strong> when sharing.
                </p>
              </div>

              {/* Terms Points */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-black">
                    1. Prior Contact & Written Permission
                  </h3>
                  <p>
                    Before reposting, publishing, or using any photograph or video clip in print, on social media, or across digital channels, please drop me a quick message first to confirm.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-black">
                    2. Tagging & Giving Credit
                  </h3>
                  <p>
                    Any permitted use must include clear and visible credit:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[12.5px] text-zinc-700">
                    <li>
                      <strong>On Instagram & Social Media:</strong> Tag <span className="font-semibold text-black">@quietframes.sg</span> directly in the photo and mention <span className="font-semibold text-black">@quietframes.sg</span> in your caption.
                    </li>
                    <li>
                      <strong>On Websites & Articles:</strong> Accompany the asset with the credit line: <span className="italic">“Photo by Juztin Yuen / @quietframes.sg”</span> with a link back to this portfolio.
                    </li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-black">
                    3. Commercial Use & Licensing
                  </h3>
                  <p>
                    For brand campaigns, paid advertising, commercial resale, or uncredited third-party distribution, please get in touch so we can discuss appropriate licensing terms.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-black">
                    4. Copyright Ownership
                  </h3>
                  <p>
                    All photographs, footage, and creative media remain the intellectual property of <strong>Juztin Yuen</strong> under Singapore and international copyright law.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-gray-100 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-[#888888] font-mono">
                <span>Inquiries:</span>
                <a
                  href="mailto:mrwhonow01@gmail.com?subject=Photo%20Usage%20Permission%20Request"
                  className="text-black font-semibold underline"
                >
                  mrwhonow01@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                {onNavigateToContact && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToContact();
                    }}
                    className="px-4 py-2 bg-black text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Request Permission
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-zinc-700 text-[11px] uppercase tracking-wider font-semibold hover:border-black hover:text-black transition-colors cursor-pointer bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

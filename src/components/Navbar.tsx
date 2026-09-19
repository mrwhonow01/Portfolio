import React, { useState, useEffect } from 'react';
import { Camera, Sliders, Mail, Menu, X, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioProfile } from '../types';

interface NavbarProps {
  profile: PortfolioProfile;
  onOpenStudio: () => void;
  onOpenInbox: () => void;
  inquiryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenStudio,
  onOpenInbox,
  inquiryCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Videography', href: '#videography' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      id="main-navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#070708]/80 backdrop-blur-2xl border-b border-white/[0.06] py-3.5 shadow-2xl shadow-black/80'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo & Signature */}
          <a
            href="#"
            id="nav-logo-link"
            className="group flex items-center gap-3.5 text-left focus:outline-none"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden transition-colors group-hover:border-red-500/40"
            >
              <Camera className="w-4 h-4 text-[#f5f5f7] transition-colors group-hover:text-red-400" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-[#f5f5f7] group-hover:text-white transition-colors">
                {profile.name}
              </span>
              <span className="text-[10px] text-[#86868b] tracking-widest uppercase">
                Visual Portfolio
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[13px] font-medium tracking-wide text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-red-500 rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Tools: Studio Edit, Inbox & Contact */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Studio Editor Mode Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              id="nav-studio-mode-btn"
              onClick={onOpenStudio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-[#d1d1d6] border border-white/[0.08] transition-all hover:border-white/20"
              title="Add photos, edit info, and curate timeline"
            >
              <Sliders className="w-3.5 h-3.5 text-red-400" />
              <span>Edit Portfolio</span>
            </motion.button>

            {/* Inquiries Inbox */}
            {inquiryCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id="nav-inbox-btn"
                onClick={onOpenInbox}
                className="relative p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1a6] hover:text-white border border-white/[0.08] transition-all"
                title={`${inquiryCount} inquiries received`}
              >
                <Inbox className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-red-500/50">
                  {inquiryCount}
                </span>
              </motion.button>
            )}

            {/* Contact CTA */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="nav-contact-cta"
              href="#contact"
              className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#e5e5ea] transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Book Shoot</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenStudio}
              className="p-2 rounded-full bg-white/[0.06] text-[#e5e5ea] border border-white/10 active:scale-95 transition-transform"
              title="Edit Portfolio"
            >
              <Sliders className="w-4 h-4 text-red-400" />
            </button>
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/[0.06] text-[#e5e5ea] border border-white/10 active:scale-95 transition-transform"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden bg-[#0a0a0c]/98 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#d1d1d6] hover:text-white py-1.5 border-b border-white/[0.04] transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="pt-3 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStudio();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] text-sm font-medium text-white flex items-center justify-center gap-2 border border-white/10 active:scale-98 transition-transform"
                >
                  <Sliders className="w-4 h-4 text-red-400" />
                  <span>Edit Portfolio & Add Photos</span>
                </button>
                {inquiryCount > 0 && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenInbox();
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/[0.08] text-sm font-medium text-white flex items-center justify-center gap-2 border border-white/10 active:scale-98 transition-transform"
                  >
                    <Inbox className="w-4 h-4 text-red-400" />
                    <span>View Inquiries ({inquiryCount})</span>
                  </button>
                )}
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Mail className="w-4 h-4" />
                  <span>Book Shoot</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavView, AlbumCategory } from './EdzSidebar';

interface TopNavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView, album?: AlbumCategory, subAlbum?: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentView,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'photography', label: 'photography', href: '#photography' },
    { id: 'videography', label: 'videography', href: '#videography' },
    { id: 'instagram', label: 'instagram', href: '#instagram' },
    { id: 'about', label: 'meet me', href: '#about' },
    { id: 'contact', label: 'contact', href: '#contact' },
  ];

  const handleLink = (id: string) => {
    onNavigate(id as NavView);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-[#ffffff]/90 backdrop-blur-md transition-colors border-b border-black/[0.04]">
      <div className="max-w-[1180px] mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
        {/* Site Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="text-lg sm:text-xl font-black text-black hover:text-[#663300] transition-colors tracking-tight font-sans lowercase"
        >
          juztin yuen
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = currentView === link.id || (link.id === 'photography' && currentView === 'album');
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(link.id);
                }}
                className={`text-[15px] lg:text-[16px] lowercase font-semibold tracking-tight transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#663300] font-bold border-b-2 border-[#89c1e9] pb-0.5'
                    : 'text-black hover:text-[#663300]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black hover:text-[#663300] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-b border-black/10 px-6 py-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(link.id);
                }}
                className="text-base font-bold lowercase text-black hover:text-[#663300] py-1 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

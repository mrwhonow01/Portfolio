import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioProfile } from '../types';
import { TermsModal } from './TermsModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

export type NavView = 'home' | 'photography' | 'album' | 'videography' | 'instagram' | 'about' | 'contact';
export type AlbumCategory = 'stage' | 'sports' | 'events';

interface EdzSidebarProps {
  profile: PortfolioProfile;
  currentView: NavView;
  selectedAlbum: AlbumCategory | null;
  selectedSubAlbum?: string | null;
  isPastHeroCards?: boolean;
  onNavigate: (view: NavView, album?: AlbumCategory, subAlbum?: string) => void;
  onScrollPrevious?: () => void;
  onScrollNext?: () => void;
}

export const ALBUMS: { id: AlbumCategory; label: string; countDesc: string }[] = [
  { id: 'sports', label: 'Sports & Action', countDesc: 'Muay Thai fight nights & Formula 1 demo runs' },
  { id: 'stage', label: 'Stage & Performance', countDesc: 'Wushu stage showcase & solo performance' },
  { id: 'events', label: 'Events & Publicity', countDesc: 'Temple anniversary celebration & community events' },
];

export const EdzSidebar: React.FC<EdzSidebarProps> = ({
  profile,
  currentView,
  selectedAlbum,
  selectedSubAlbum,
  isPastHeroCards = false,
  onNavigate,
  onScrollPrevious,
  onScrollNext,
}) => {
  const [photoSubmenuOpen, setPhotoSubmenuOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [sportsHovered, setSportsHovered] = useState(false);

  // Global '?' keyboard shortcut to toggle helper guide
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Reset sports hovered state if leaving sports album
  useEffect(() => {
    if (currentView !== 'album' || selectedAlbum !== 'sports') {
      setSportsHovered(false);
    }
  }, [currentView, selectedAlbum]);

  // Lock background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = (view: NavView, album?: AlbumCategory, subAlbum?: string) => {
    onNavigate(view, album, subAlbum);
    setMobileMenuOpen(false);
  };

  const isHomeActive = currentView === 'home';
  const isPhotoSetActive = currentView === 'photography' && !selectedAlbum;
  const isVideoActive = currentView === 'videography';
  const isInstagramActive = currentView === 'instagram';
  const isAboutActive = currentView === 'about';
  const isContactActive = currentView === 'contact';

  const renderNavContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Site Logo - Blue Card Nametag acts as brand logo, text logo completely removed */}
        <div id="site_logo" className="relative h-[95px] mb-6 flex items-start">
          {/* DOCKED BLUE CARD ON DESKTOP OVER LOGO */}
          <AnimatePresence>
            {(isMobile || (isPastHeroCards && currentView === 'home') || currentView !== 'home') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.82, rotate: -4, y: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -1.5, y: 0 }}
                exit={{ opacity: 0, scale: 0.82, rotate: -4, y: -4 }}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentView === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleLinkClick('home');
                  }
                }}
                className="w-[180px] aspect-[1.6/1] cursor-pointer drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] select-none group"
                title="Click to scroll to top"
              >
                <img
                  src="/card-nametag-blue.png?v=4"
                  alt="hello my name is JUZTIN!"
                  className="w-full h-full object-contain pointer-events-none group-hover:scale-104 transition-transform duration-200"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation list matching edz.us */}
        <nav className="edz-nav select-none">
          <ul className="space-y-1.5">
            {/* Home */}
            <li>
              <a
                href="#home"
                aria-current={isHomeActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('home');
                }}
                className={`block py-0.5 transition-colors cursor-pointer ${
                  isHomeActive
                    ? 'font-bold text-black'
                    : 'font-normal text-[#444444] hover:text-black'
                }`}
              >
                Home
              </a>
            </li>

            {/* Photography Set & Nested Albums */}
            <li className="pt-1">
              <div className="flex items-center justify-between">
                <a
                  href="#photography"
                  aria-current={isPhotoSetActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('photography');
                  }}
                  className={`block py-0.5 transition-colors cursor-pointer ${
                    isPhotoSetActive || currentView === 'album'
                      ? 'font-bold text-black'
                      : 'font-normal text-[#444444] hover:text-black'
                  }`}
                >
                  Photography
                </a>
                <button
                  type="button"
                  onClick={() => setPhotoSubmenuOpen(!photoSubmenuOpen)}
                  className="p-1 text-[#888888] hover:text-black focus:outline-none"
                  aria-label="Toggle photography albums"
                >
                  {photoSubmenuOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Nested albums */}
              <AnimatePresence>
                {photoSubmenuOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1.5 ml-2.5 pl-2 border-l border-gray-200 space-y-1 overflow-hidden"
                  >
                    {ALBUMS.map((album) => {
                      const isAlbumActive =
                        currentView === 'album' && selectedAlbum === album.id;
                      const isSportsActive =
                        currentView === 'album' && selectedAlbum === 'sports';
                      const isSportsMainActive =
                        isAlbumActive && !selectedSubAlbum;

                      return (
                        <li
                          key={album.id}
                          className={album.id === 'sports' ? 'relative group/sports' : undefined}
                          onMouseEnter={() => {
                            if (album.id === 'sports' && isSportsActive) {
                              setSportsHovered(true);
                            }
                          }}
                          onMouseLeave={() => {
                            if (album.id === 'sports') {
                              setSportsHovered(false);
                            }
                          }}
                          onFocus={() => {
                            if (album.id === 'sports' && isSportsActive) {
                              setSportsHovered(true);
                            }
                          }}
                          onBlur={(e) => {
                            if (
                              album.id === 'sports' &&
                              !e.currentTarget.contains(e.relatedTarget as Node)
                            ) {
                              setSportsHovered(false);
                            }
                          }}
                        >
                          <a
                            href={`#album-${album.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (album.id === 'sports' && isSportsActive) {
                                setSportsHovered((prev) => !prev);
                              } else {
                                handleLinkClick('album', album.id, undefined);
                                if (album.id === 'sports') {
                                  setSportsHovered(true);
                                }
                              }
                            }}
                            className={`block py-0.5 text-[10px] tracking-wider transition-colors cursor-pointer ${
                              album.id === 'sports'
                                ? isSportsMainActive
                                  ? 'font-bold text-black'
                                  : 'font-normal text-[#666666] hover:text-black'
                                : isAlbumActive
                                ? 'font-bold text-black'
                                : 'font-normal text-[#666666] hover:text-black'
                            }`}
                          >
                            {album.label}
                          </a>

                          {/* Sub-tabs for Sports & Action:
                              - Mobile: stay visible so touchscreen users can browse Muay Thai & Formula 1 directly
                              - Desktop: only appear if hovered over SPORTS AND ACTION and if in SPORTS AND ACTION tab */}
                          {album.id === 'sports' && (isMobile || isSportsActive) && (
                            <ul
                              className={`mt-1 ml-2 pl-2 border-l border-gray-200 space-y-0.5 overflow-hidden transition-all duration-200 ease-out ${
                                isMobile
                                  ? 'opacity-100 max-h-28 pointer-events-auto block'
                                  : sportsHovered
                                  ? 'opacity-100 max-h-28 pointer-events-auto'
                                  : 'opacity-0 max-h-0 pointer-events-none group-hover/sports:opacity-100 group-hover/sports:max-h-28 group-hover/sports:pointer-events-auto group-focus-within/sports:opacity-100 group-focus-within/sports:max-h-28 group-focus-within/sports:pointer-events-auto'
                              }`}
                            >
                              <li>
                                <a
                                  href="#subalbum-muay-thai"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick('album', 'sports', 'muay-thai');
                                  }}
                                  className={`block py-0.5 text-[9.5px] tracking-wider transition-colors cursor-pointer ${
                                    isAlbumActive && selectedSubAlbum === 'muay-thai'
                                      ? 'font-bold text-black'
                                      : 'font-normal text-[#888888] hover:text-black'
                                  }`}
                                >
                                  Muay Thai
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#subalbum-formula-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick('album', 'sports', 'formula-1');
                                  }}
                                  className={`block py-0.5 text-[9.5px] tracking-wider transition-colors cursor-pointer ${
                                    isAlbumActive && selectedSubAlbum === 'formula-1'
                                      ? 'font-bold text-black'
                                      : 'font-normal text-[#888888] hover:text-black'
                                  }`}
                                >
                                  Formula 1
                                </a>
                              </li>
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Videography */}
            <li className="pt-1">
              <a
                href="#videography"
                aria-current={isVideoActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('videography');
                }}
                className={`block py-0.5 transition-colors cursor-pointer ${
                  isVideoActive
                    ? 'font-bold text-black'
                    : 'font-normal text-[#444444] hover:text-black'
                }`}
              >
                Videography
              </a>
            </li>

            {/* Instagram Posts */}
            <li className="pt-1">
              <a
                href="#instagram"
                aria-current={isInstagramActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('instagram');
                }}
                className={`block py-0.5 transition-colors cursor-pointer ${
                  isInstagramActive
                    ? 'font-bold text-black'
                    : 'font-normal text-[#444444] hover:text-black'
                }`}
              >
                Instagram Posts
              </a>
            </li>

            {/* About */}
            <li className="pt-1">
              <a
                href="#about"
                aria-current={isAboutActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('about');
                }}
                className={`block py-0.5 transition-colors cursor-pointer ${
                  isAboutActive
                    ? 'font-bold text-black'
                    : 'font-normal text-[#444444] hover:text-black'
                }`}
              >
                About
              </a>
            </li>

            {/* Contact */}
            <li className="pt-1">
              <a
                href="#contact"
                aria-current={isContactActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('contact');
                }}
                className={`block py-0.5 transition-colors cursor-pointer ${
                  isContactActive
                    ? 'font-bold text-black'
                    : 'font-normal text-[#444444] hover:text-black'
                }`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div id="col-xtra" className="pt-8 pb-4 border-t border-gray-100 text-[11px] text-[#aaaaaa]">
        {/* Location note, instagram & copyright */}
        <div className="space-y-1 font-sans">
          <p className="text-[11px] text-[#888888]">{profile.location || 'Singapore'}</p>
          <p>
            <a
              href="https://www.instagram.com/quietframes.sg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#666666] hover:text-black transition-colors underline"
            >
              @quietframes.sg
            </a>
          </p>
          <p className="text-[11px] text-[#aaaaaa]">© {profile.name || 'Juztin Yuen'}</p>

          {/* Terms & Copyright Button */}
          <div className="pt-2 flex items-center">
            <button
              type="button"
              id="sidebar-terms-btn"
              onClick={() => {
                setTermsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-[#555555] hover:text-black transition-colors border border-gray-200 hover:border-black px-2.5 py-1 bg-white cursor-pointer"
              title="Terms of Service, Usage & Copyright"
            >
              <ShieldCheck className="w-3 h-3 text-zinc-600" />
              <span>Terms & Copyright</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Column (#col) */}
      <aside
        id="col"
        className="hidden md:block fixed top-0 bottom-0 left-0 w-[250px] bg-white z-40 border-r border-gray-100/80 overflow-y-auto"
      >
        <div className="in p-[50px_30px_30px_30px] h-full">
          {renderNavContent(false)}
        </div>
      </aside>

      {/* Mobile Top Row Bar (#mob-bttn-row) */}
      <div
        id="mob-bttn-row"
        className="md:hidden fixed top-0 left-0 right-0 h-[50px] bg-white/95 backdrop-blur-md border-b border-gray-200 z-40 flex items-center justify-between px-4"
      >
        {/* Left Side: Hamburger Menu Button & Docked Blue Card on Mobile */}
        <div className="flex items-center gap-2">
          <button
            id="mob-menu"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-black hover:text-gray-600 focus:outline-none cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 shrink-0" />
          </button>

          {/* DOCKED BLUE CARD ON MOBILE */}
          <AnimatePresence>
            {((isPastHeroCards && currentView === 'home') || currentView !== 'home') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -6 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentView === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleLinkClick('home');
                  }
                }}
                className="h-[36px] aspect-[1.6/1] z-50 drop-shadow-sm cursor-pointer flex items-center"
                title="Click to scroll to top"
              >
                <img
                  src="/card-nametag-blue.png?v=4"
                  alt="hello my name is JUZTIN!"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </div>

      {/* Mobile Slide-Out Drawer (#sidr-left) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-[275px] max-w-[85vw] h-[100dvh] max-h-[100dvh] bg-white z-50 shadow-2xl px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom,20px))] overflow-hidden flex flex-col select-none touch-none overscroll-none"
            >
              <div className="flex flex-col h-full justify-between overflow-hidden">
                {/* Top Section: Header with Blue Card & Close Button, and Navigation */}
                <div className="flex flex-col">
                  {/* Top Header Row with Blue Card & Close 'X' */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (currentView === 'home') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          handleLinkClick('home');
                        }
                      }}
                      className="w-[105px] aspect-[1.6/1] cursor-pointer"
                      title="Juztin Yuen — Home"
                    >
                      <img
                        src="/card-nametag-blue.png?v=4"
                        alt="hello my name is JUZTIN!"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer rounded-full"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation list */}
                  <nav className="edz-nav select-none pt-3">
                    <ul className="space-y-1">
                      {/* Home */}
                      <li>
                        <a
                          href="#home"
                          aria-current={isHomeActive ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('home');
                          }}
                          className={`block py-0.5 transition-colors cursor-pointer ${
                            isHomeActive
                              ? 'font-bold text-black'
                              : 'font-normal text-[#444444] hover:text-black'
                          }`}
                        >
                          Home
                        </a>
                      </li>

                      {/* Photography Set & Nested Albums */}
                      <li className="pt-0.5">
                        <div className="flex items-center justify-between">
                          <a
                            href="#photography"
                            aria-current={isPhotoSetActive ? 'page' : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick('photography');
                            }}
                            className={`block py-0.5 transition-colors cursor-pointer ${
                              isPhotoSetActive || currentView === 'album'
                                ? 'font-bold text-black'
                                : 'font-normal text-[#444444] hover:text-black'
                            }`}
                          >
                            Photography
                          </a>
                          <button
                            type="button"
                            onClick={() => setPhotoSubmenuOpen(!photoSubmenuOpen)}
                            className="p-1 text-[#888888] hover:text-black focus:outline-none"
                            aria-label="Toggle photography albums"
                          >
                            {photoSubmenuOpen ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Nested albums */}
                        <AnimatePresence>
                          {photoSubmenuOpen && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.15 }}
                              className="mt-1 ml-2 pl-2 border-l border-gray-200 space-y-0.5 overflow-hidden"
                            >
                              {ALBUMS.map((album) => {
                                const isAlbumActive =
                                  currentView === 'album' && selectedAlbum === album.id;

                                return (
                                  <li key={album.id}>
                                    <a
                                      href={`#album/${album.id}`}
                                      aria-current={isAlbumActive ? 'page' : undefined}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleLinkClick('album', album.id);
                                      }}
                                      className={`block py-0.5 text-[10px] transition-colors cursor-pointer ${
                                        isAlbumActive
                                          ? 'font-bold text-black'
                                          : 'font-normal text-[#666666] hover:text-black'
                                      }`}
                                    >
                                      {album.label}
                                    </a>
                                  </li>
                                );
                              })}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>

                      {/* Videography */}
                      <li>
                        <a
                          href="#videography"
                          aria-current={isVideoActive ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('videography');
                          }}
                          className={`block py-0.5 transition-colors cursor-pointer ${
                            isVideoActive
                              ? 'font-bold text-black'
                              : 'font-normal text-[#444444] hover:text-black'
                          }`}
                        >
                          Videography
                        </a>
                      </li>

                      {/* Instagram Posts */}
                      <li>
                        <a
                          href="#instagram"
                          aria-current={isInstagramActive ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('instagram');
                          }}
                          className={`block py-0.5 transition-colors cursor-pointer ${
                            isInstagramActive
                              ? 'font-bold text-black'
                              : 'font-normal text-[#444444] hover:text-black'
                          }`}
                        >
                          Instagram Posts
                        </a>
                      </li>

                      {/* About */}
                      <li>
                        <a
                          href="#about"
                          aria-current={isAboutActive ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('about');
                          }}
                          className={`block py-0.5 transition-colors cursor-pointer ${
                            isAboutActive
                              ? 'font-bold text-black'
                              : 'font-normal text-[#444444] hover:text-black'
                          }`}
                        >
                          About
                        </a>
                      </li>

                      {/* Contact */}
                      <li>
                        <a
                          href="#contact"
                          aria-current={isContactActive ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick('contact');
                          }}
                          className={`block py-0.5 transition-colors cursor-pointer ${
                            isContactActive
                              ? 'font-bold text-black'
                              : 'font-normal text-[#444444] hover:text-black'
                          }`}
                        >
                          Contact
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Mobile Drawer Footer (Compact, fully visible, safe above phone bottom bar) */}
                <div className="pt-2.5 border-t border-gray-100 text-[11px] text-[#aaaaaa] font-sans space-y-1">
                  <p className="text-[11px] text-[#888888]">{profile.location || 'Singapore'}</p>
                  <p>
                    <a
                      href="https://www.instagram.com/quietframes.sg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#666666] hover:text-black transition-colors underline"
                    >
                      @quietframes.sg
                    </a>
                  </p>
                  <p className="text-[11px] text-[#aaaaaa]">© {profile.name || 'Juztin Yuen'}</p>

                  {/* Terms & Copyright Button */}
                  <div className="pt-1.5 flex items-center">
                    <button
                      type="button"
                      id="mobile-sidebar-terms-btn"
                      onClick={() => {
                        setTermsModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-[#555555] hover:text-black transition-colors border border-gray-200 hover:border-black px-2.5 py-1 bg-white cursor-pointer"
                      title="Terms of Service, Usage & Copyright"
                    >
                      <ShieldCheck className="w-3 h-3 text-zinc-600" />
                      <span>Terms & Copyright</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Terms of Service & Copyright Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onNavigateToContact={() => handleLinkClick('contact')}
      />

      {/* Keyboard Shortcuts Helper Guide Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </>
  );
};

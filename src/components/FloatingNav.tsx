import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const panelRef = useRef<HTMLDivElement>(null);

  /* Track active section on scroll */
  useEffect(() => {
    const sectionIds = ['work', 'services', 'about', 'contact'];
    const handleScroll = () => {
      if (window.scrollY < 300) {
        setActiveSection('Home');
        return;
      }
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            const label = navItems.find(n => n.href === `#${id}`)?.label || 'Home';
            setActiveSection(label);
            return;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll when menu is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300); // Wait for panel to close
  };

  /* Menu Icon Animation Variants */
  const topLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 5 },
  };
  const bottomLineVariants = {
    closed: { rotate: 0, y: 0, width: '12px' },
    open: { rotate: -45, y: -5, width: '18px' },
  };

  /* Panel Animation Variants */
  const panelVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  /* Link Stagger Variants */
  const linkContainerVariants = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.2, staggerChildren: 0.08 } },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 40, filter: 'blur(8px)' },
    open: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      {/* ── Fixed Menu Button (Top Right) ── */}
      <motion.button
        className="fixed top-24 right-6 z-[100] w-11 h-11 rounded-full flex flex-col items-center justify-center gap-[4px] cursor-pointer"
        style={{
          background: isOpen ? 'transparent' : 'rgba(20,20,25,0.6)',
          backdropFilter: isOpen ? 'none' : 'blur(20px) saturate(180%)',
          border: isOpen ? 'none' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isOpen ? 'none' : '0 10px 30px rgba(0,0,0,0.3)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="h-[2px] bg-white rounded-full origin-center"
          style={{ width: '18px' }}
          variants={topLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.div
          className="h-[2px] bg-white rounded-full origin-center self-end mr-[19px]"
          variants={bottomLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        
        {/* Subtle hover glow on button */}
        {!isOpen && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300" 
          />
        )}
      </motion.button>

      {/* ── Overlay & Side Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              className="fixed inset-0 z-[80] bg-black/40"
              style={{ backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Slide-in Panel */}
            <motion.div
              ref={panelRef}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] z-[90] flex flex-col justify-center px-12 sm:px-16"
              style={{
                background: 'rgba(10,10,12,0.85)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '-20px 0 80px rgba(0,0,0,0.6)',
              }}
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top accent gradient */}
              <div 
                className="absolute top-0 left-0 right-0 h-32 opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top right, rgba(139,92,246,0.4) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <motion.div 
                  className="text-[11px] font-mono tracking-[0.3em] uppercase mb-10 text-gray-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Navigate
                </motion.div>

                <motion.nav
                  className="flex flex-col gap-6"
                  variants={linkContainerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navItems.map((item) => {
                    const isActive = activeSection === item.label;
                    return (
                      <motion.div key={item.label} variants={linkVariants}>
                        <motion.a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          className="group relative inline-flex items-center text-2xl sm:text-3xl font-medium tracking-tight"
                          style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
                          whileHover="hover"
                        >
                          {/* Hover text slide & color */}
                          <motion.span
                            className="relative z-10 block transition-colors duration-300"
                            variants={{
                              hover: { x: 12, color: '#ffffff' }
                            }}
                          >
                            {item.label}
                          </motion.span>

                          {/* Active indicator dot */}
                          {isActive && (
                            <motion.span
                              className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500"
                              layoutId="activePanelDot"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                            />
                          )}

                          {/* Hover animated underline */}
                          <motion.span
                            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                            variants={{
                              hover: { width: '100%', left: 12, opacity: 1 }
                            }}
                            initial={{ width: '0%', left: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          />
                        </motion.a>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              {/* Bottom accent gradient */}
              <div 
                className="absolute bottom-0 right-0 left-0 h-48 opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at bottom left, rgba(41,151,255,0.4) 0%, transparent 70%)',
                }}
              />
              
              {/* Bottom info section */}
              <motion.div
                className="absolute bottom-12 left-12 sm:left-16 right-12 text-sm text-gray-500 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div>Upananda Debnath</div>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition-colors">Tw</a>
                  <a href="#" className="hover:text-white transition-colors">In</a>
                  <a href="#" className="hover:text-white transition-colors">Be</a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

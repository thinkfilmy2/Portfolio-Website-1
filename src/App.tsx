import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Services from './components/Services';
import About from './components/About';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import ProjectBriefForm from './components/ProjectBriefForm';
import Footer from './components/Footer';
import FloatingNav from './components/FloatingNav';

/* ── Scroll Progress Indicator ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, width: '100%' }}
    />
  );
}

/* ── Aurora Mesh Background — interactive cursor-tracking ── */
function AuroraMesh() {
  /* Raw cursor position in px (relative to viewport) */
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  /* Normalized offset for parallax orbs (-0.5 → +0.5) */
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  /* Cursor spotlight — fast spring, follows closely */
  const spotX = useSpring(cursorX, { stiffness: 60, damping: 25 });
  const spotY = useSpring(cursorY, { stiffness: 60, damping: 25 });

  /* Orb parallax — different spring rates per layer for depth */
  const orbSlowX = useSpring(normX, { stiffness: 20, damping: 25 });
  const orbSlowY = useSpring(normY, { stiffness: 20, damping: 25 });
  const orbMedX = useSpring(normX, { stiffness: 30, damping: 22 });
  const orbMedY = useSpring(normY, { stiffness: 30, damping: 22 });
  const orbFastX = useSpring(normX, { stiffness: 45, damping: 20 });
  const orbFastY = useSpring(normY, { stiffness: 45, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      normX.set(e.clientX / window.innerWidth - 0.5);
      normY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, normX, normY]);

  /* Parallax transforms — large range so orbs clearly track the cursor */
  const purpleX = useTransform(orbSlowX, v => v * 350);
  const purpleY = useTransform(orbSlowY, v => v * 300);
  const blueX = useTransform(orbMedX, v => -v * 280);
  const blueY = useTransform(orbMedY, v => -v * 240);
  const pinkX = useTransform(orbFastX, v => v * 220);
  const pinkY = useTransform(orbFastY, v => v * 180);
  const cyanX = useTransform(orbMedX, v => -v * 250);
  const cyanY = useTransform(orbMedY, v => -v * 200);
  const deepX = useTransform(orbSlowX, v => v * 180);
  const deepY = useTransform(orbSlowY, v => v * 150);

  /* Spotlight offset (center it) */
  const spotLeft = useTransform(spotX, v => v - 400);
  const spotTop = useTransform(spotY, v => v - 400);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* ── Cursor-following spotlight — moves directly with mouse ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 25%, rgba(41,151,255,0.04) 45%, transparent 65%)',
          filter: 'blur(50px)',
          left: spotLeft,
          top: spotTop,
        }}
      />

      {/* Purple orb — top left, slow trail */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(139,92,246,0.10) 35%, transparent 70%)',
          filter: 'blur(70px)',
          top: '-5%',
          left: '5%',
          x: purpleX,
          y: purpleY,
          animation: 'aurora-1 22s ease-in-out infinite',
        }}
      />
      {/* Blue orb — top right, medium trail */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(41,151,255,0.24) 0%, rgba(41,151,255,0.08) 35%, transparent 70%)',
          filter: 'blur(80px)',
          top: '10%',
          right: '-8%',
          x: blueX,
          y: blueY,
          animation: 'aurora-2 28s ease-in-out infinite',
        }}
      />
      {/* Pink orb — center, fast trail */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.16) 0%, rgba(236,72,153,0.05) 35%, transparent 70%)',
          filter: 'blur(100px)',
          top: '40%',
          left: '25%',
          x: pinkX,
          y: pinkY,
          animation: 'aurora-3 20s ease-in-out infinite',
        }}
      />
      {/* Cyan orb — bottom right, medium trail */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0.04) 35%, transparent 70%)',
          filter: 'blur(90px)',
          bottom: '5%',
          right: '10%',
          x: cyanX,
          y: cyanY,
          animation: 'aurora-4 25s ease-in-out infinite',
        }}
      />
      {/* Deep purple — bottom left, slowest trail */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '1000px',
          height: '1000px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.04) 35%, transparent 70%)',
          filter: 'blur(120px)',
          bottom: '-10%',
          left: '-10%',
          x: deepX,
          y: deepY,
          animation: 'aurora-1 30s ease-in-out infinite reverse',
        }}
      />
    </div>
  );
}

/* ── Frosted Top Nav (with magnetic logo & glow icons) ── */
function ScrollAwareNav() {
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  /* Magnetic hover for the logo */
  const logoX = useMotionValue(0);
  const logoY = useMotionValue(0);
  const logoSpringX = useSpring(logoX, { stiffness: 150, damping: 15 });
  const logoSpringY = useSpring(logoY, { stiffness: 150, damping: 15 });

  const handleLogoMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      logoX.set((e.clientX - rect.left - rect.width / 2) * 0.25);
      logoY.set((e.clientY - rect.top - rect.height / 2) * 0.25);
    },
    [logoX, logoY]
  );
  const handleLogoMouseLeave = useCallback(() => {
    logoX.set(0);
    logoY.set(0);
  }, [logoX, logoY]);

  const socials = [
    { icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ), href: 'https://wa.me/919100266022', label: 'WhatsApp' },
    { icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ), href: 'https://www.linkedin.com/in/upananda-debnath-a25363366', label: 'LinkedIn' },
    { icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ), href: 'https://x.com/think_filmy', label: 'X' },
    { icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ), href: 'https://www.instagram.com/think_filmy/', label: 'Instagram' },
    { icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ), href: 'https://youtube.com/@think_filmy?si=khOHTNYzYvPnwe4R', label: 'YouTube' },
    { icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ), href: 'https://www.facebook.com', label: 'Facebook' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 px-6 py-5"
      style={{
        backgroundColor: useTransform(navOpacity, v => `rgba(0, 0, 0, ${v * 0.72})`),
        backdropFilter: useTransform(navOpacity, v => `blur(${v * 40}px) saturate(${100 + v * 80}%)`),
        borderBottom: useTransform(navOpacity, v => `1px solid rgba(255,255,255,${v * 0.06})`),
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Magnetic Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="font-semibold text-lg tracking-tight cursor-default"
          style={{ color: '#f5f5f7', x: logoSpringX, y: logoSpringY }}
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={handleLogoMouseLeave}
          whileHover={{
            textShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}
        >
          UPANANDA DEBNATH
        </motion.div>
        <div className="flex items-center gap-5">
          {/* Email with animated underline */}
          <motion.a
            href="mailto:upananadadebnath@gmail.com?subject=Project%20Inquiry"
            className="text-xs font-medium uppercase tracking-widest hidden lg:block hover-underline"
            style={{ color: '#86868b' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            whileHover={{ color: '#f5f5f7' }}
          >
            upananadadebnath@gmail.com
          </motion.a>

          {/* Divider */}
          <motion.div
            className="w-[1px] h-4 hidden md:block"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 3.2 }}
          />

          {/* Social Icons with glow hover */}
          <div className="flex items-center gap-0.5">
            {socials.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-8 h-8 rounded-full flex items-center justify-center relative"
                style={{ color: 'rgba(134,134,139,0.7)' }}
                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 3 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
                whileHover={{
                  color: '#f5f5f7',
                  scale: 1.15,
                  y: -4,
                  textShadow: '0 0 12px rgba(139,92,246,0.5)',
                  transition: { type: 'spring', stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.85 }}
              >
                {/* Glow backdrop */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  whileHover={{
                    opacity: 1,
                    background: 'rgba(139,92,246,0.12)',
                    boxShadow: '0 0 16px rgba(139,92,246,0.2)',
                  }}
                  transition={{ duration: 0.25 }}
                />
                <span className="relative z-10">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Film grain — very subtle */}
          <div className="noise-overlay" />
          
          {/* Scroll progress */}
          <ScrollProgress />
          
          {/* Aurora mesh background */}
          <AuroraMesh />

          <motion.main
            ref={mainRef}
            className="min-h-screen overflow-hidden relative z-10"
            style={{ color: '#f5f5f7' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ScrollAwareNav />
            <FloatingNav />
            <Hero />
            <Showcase />
            <Services />
            <About />
            <Process />
            <Testimonials />
            <CTA />
            <ProjectBriefForm />
            <Footer />
          </motion.main>
        </>
      )}
    </>
  );
}

export default App;

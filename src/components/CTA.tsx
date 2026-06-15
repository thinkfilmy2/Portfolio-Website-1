import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

export default function CTA() {
  const content = useSiteContent();
  const cta = content.cta || {
    headline: "Let's create something bold.",
    buttonText: "Create With Me",
    buttonLink: "https://wa.me/919100266022",
    email: "upananadadebnath@gmail.com"
  };

  const headlineWords = (cta.headline || "").split(' ');

  /* Magnetic hover for Start Project button */
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 150, damping: 15 });
  const btnSpringY = useSpring(btnY, { stiffness: 150, damping: 15 });

  const handleBtnMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      btnX.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      btnY.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    },
    [btnX, btnY]
  );
  const handleBtnMouseLeave = useCallback(() => {
    btnX.set(0);
    btnY.set(0);
  }, [btnX, btnY]);

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 overflow-hidden relative" id="contact">
      {/* Background glow — breathing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[80vw] h-[80vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10 overflow-visible">
        {/*
          Per-word 3D rotation — same premium feel as per-char but ~6x fewer motion nodes.
          Each word slides up with rotateX (3D flip) from below.
        */}
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight text-balance mb-8 md:mb-12 flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 md:gap-y-3">
          {headlineWords.map((word, wIdx) => (
            <motion.span
              key={wIdx}
              className="inline-block"
              style={{ color: '#f5f5f7', perspective: 800 }}
              initial={{ opacity: 0, y: 50, rotateX: 80, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.65,
                delay: wIdx * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                color: '#8b5cf6',
                scale: 1.06,
                transition: { duration: 0.15 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Magnetic glass CTA button with glow ring */}
          <motion.a
            href={cta.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(139,92,246,0.3)',
              boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(139,92,246,0.05)',
            }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-2 md:gap-2.5 px-7 py-4 md:px-10 md:py-5 rounded-full font-semibold text-base md:text-lg relative overflow-hidden glow-ring cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#f5f5f7',
              backdropFilter: 'blur(20px) saturate(150%)',
              transition: 'box-shadow 0.35s ease, background-color 0.35s ease, border-color 0.35s ease',
              x: btnSpringX,
              y: btnSpringY,
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            />

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '1px solid transparent',
                background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(90deg, rgba(139,92,246,0.3), rgba(41,151,255,0.3), rgba(139,92,246,0.3)) border-box',
                opacity: 0,
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />

            <span className="relative z-10">{cta.buttonText}</span>
            <motion.span
              className="relative z-10 inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5" style={{ opacity: 0.7 }} />
            </motion.span>
          </motion.a>

          {/* Email with animated underline */}
          <motion.a
            href={`mailto:${cta.email}?subject=Project%20Inquiry`}
            className="text-base font-medium hover-underline"
            style={{ color: '#86868b' }}
            whileHover={{
              color: '#f5f5f7',
              transition: { duration: 0.2 },
            }}
          >
            {cta.email}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

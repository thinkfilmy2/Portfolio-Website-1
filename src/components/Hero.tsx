import { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const wordAnimation: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)', scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.9,
      delay: 0.3 + i * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);


  /* Parallax for badge & subtext */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const subtextY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const headlineWords = 'I craft compelling motion stories for modern brands'.split(' ');

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Hero-specific radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

          {/* Badge — frosted glass pill with parallax */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass inline-block px-5 py-2 rounded-full mb-12 border-shimmer"
            style={{ y: badgeY }}
          >
            <span className="text-sm font-medium tracking-wide relative z-10" style={{ color: '#86868b' }}>
              Motion Designer &amp; Video Editor
            </span>
          </motion.div>

          {/* Headline with parallax */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight mb-8 flex flex-wrap justify-center"
            style={{ color: '#f5f5f7', gap: '0 0.25em', lineHeight: 1.1, y: headlineY }}
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={wordAnimation}
                initial="hidden"
                animate="visible"
                className="inline-block"
                whileHover={{
                  color: '#8b5cf6',
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtext with parallax */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl max-w-2xl text-balance mb-14"
            style={{ color: '#86868b', lineHeight: 1.7, y: subtextY }}
          >
            Skilled in video editing, motion graphics, and color grading. Specializing in SaaS
            motion design, advanced motion graphics, and AI-powered video editing &amp; generation.
          </motion.p>

        </div>
      </div>

      {/* Scroll indicator with breathing glow */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{ opacity: scrollOpacity }}
      >
        <motion.span
          className="text-[10px] uppercase tracking-[0.3em] font-medium"
          style={{ color: 'rgba(134,134,139,0.5)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 rgba(139,92,246,0)',
                '0 0 12px rgba(139,92,246,0.3)',
                '0 0 0 rgba(139,92,246,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-full"
          >
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(134,134,139,0.45)' } as React.CSSProperties} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

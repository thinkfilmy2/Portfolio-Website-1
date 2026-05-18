import { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

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

  const headlineWords = 'I craft compelling motion stories for modern brands'.split(' ');

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-24 md:pt-32 pb-6 md:pb-10"
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

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

          {/* Badge — frosted glass pill with parallax */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full mb-8 md:mb-12 border-shimmer"
            style={{ y: badgeY }}
          >
            <span className="text-xs md:text-sm font-medium tracking-wide relative z-10" style={{ color: '#86868b' }}>
              Motion Designer &amp; Video Editor
            </span>
          </motion.div>

          {/* Headline with parallax */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold tracking-tight mb-6 md:mb-8 flex flex-wrap justify-center"
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
            className="text-base md:text-lg lg:text-xl max-w-2xl text-balance mb-10 md:mb-14 px-2"
            style={{ color: '#86868b', lineHeight: 1.7, y: subtextY }}
          >
            Creating bold motion visuals that combine creativity with modern technology.
            Focused on SaaS motion design, advanced animation systems, and AI workflows.
          </motion.p>

        </div>
      </div>


    </section>
  );
}

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCallback } from 'react';

const headlineWords = "Let's create something bold.".split(' ');

export default function CTA() {
  /* Magnetic hover for Start Project button */
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 150, damping: 15 });
  const btnSpringY = useSpring(btnY, { stiffness: 150, damping: 15 });

  const handleBtnMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <section className="py-32 px-6 overflow-hidden relative" id="contact">
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

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        {/* Character stagger with enhanced 3D rotation, grouping by word to prevent mid-word wrapping */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance mb-12 flex flex-wrap justify-center gap-x-[0.3em] gap-y-4">
          {headlineWords.map((word, wIdx) => {
            const startIdx = headlineWords.slice(0, wIdx).join(' ').length + (wIdx > 0 ? 1 : 0);
            return (
              <span key={wIdx} className="inline-flex whitespace-nowrap">
                {word.split('').map((char, cIdx) => {
                  const globalIdx = startIdx + cIdx;
                  return (
                    <motion.span
                      key={cIdx}
                      className="inline-block"
                      style={{ color: '#f5f5f7' }}
                      initial={{ opacity: 0, y: 60, rotateX: 90, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{
                        duration: 0.5,
                        delay: globalIdx * 0.025,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{
                        color: '#8b5cf6',
                        scale: 1.15,
                        transition: { duration: 0.15 },
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Magnetic glass CTA button with glow ring */}
          <motion.button
            onClick={() => document.getElementById('project-brief')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(139,92,246,0.3)',
              boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(139,92,246,0.05)',
            }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-2.5 px-10 py-5 rounded-full font-semibold text-lg relative overflow-hidden glow-ring cursor-pointer"
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

            <span className="relative z-10">Start Project</span>
            <motion.span
              className="relative z-10 inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5" style={{ opacity: 0.7 }} />
            </motion.span>
          </motion.button>

          {/* Email with animated underline */}
          <motion.a
            href="mailto:upananadadebnath@gmail.com?subject=Project%20Inquiry"
            className="text-base font-medium hover-underline"
            style={{ color: '#86868b' }}
            whileHover={{
              color: '#f5f5f7',
              transition: { duration: 0.2 },
            }}
          >
            upananadadebnath@gmail.com
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

import { motion, useInView, animate, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, target, { duration: 2, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => setDisplayValue(Math.floor(v)));
    return unsubscribe;
  }, [springValue]);

  return (
    <motion.div
      ref={ref}
      className="text-4xl font-semibold mb-1"
      style={{ color: '#f5f5f7' }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
    >
      {displayValue}{suffix}
    </motion.div>
  );
}

function SvgPathAnimation() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center min-h-[300px]">
      <svg width="220" height="320" viewBox="0 0 220 320" className="overflow-visible w-full max-w-[220px]">
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Path line */}
        <motion.path
          d="M 180 30 C 0 80, 0 130, 90 160 C 200 190, 180 270, 70 290"
          fill="transparent"
          stroke="rgba(139, 92, 246, 0.4)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Node 1 (Top Right) */}
        <motion.circle
          cx="180" cy="30" r="4"
          fill="#c084fc"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, type: 'spring' }}
        />
        
        {/* Node 2 (Middle) */}
        <motion.circle
          cx="90" cy="160" r="4"
          fill="#e879f9"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.5, type: 'spring' }}
        />

        {/* Node 3 (Bottom Left) */}
        <motion.circle
          cx="70" cy="290" r="4"
          fill="#818cf8"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.5, type: 'spring' }}
        />
      </svg>
    </div>
  );
}

export default function About() {
  return (
    <section className="py-32 px-6 overflow-hidden" id="about">
      <div className="container mx-auto max-w-5xl">
        
        {/* Main About Me Glass Card */}
        <motion.div
          className="glass-card rounded-[40px] p-8 md:p-14 relative overflow-hidden border-shimmer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(20, 20, 25, 0.6)',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            {/* Pulsing indicator */}
            <div className="w-[14px] h-[14px] flex items-center justify-center relative">
              <div className="absolute w-[30px] h-[30px] rounded-full border border-[rgba(254,240,138,0.2)] flex items-center justify-center">
                 <motion.div 
                    className="w-full h-full rounded-full bg-[#fef08a]"
                    initial={{ opacity: 0.6, scale: 0.4 }}
                    animate={{ opacity: [0.6, 0], scale: [0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                 />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#fef08a] relative z-10" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#a1a1aa]">
              About Me
            </span>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="w-full lg:w-[60%] text-base md:text-lg leading-relaxed space-y-6">
              <p style={{ color: '#f5f5f7' }}>
                I’m a Motion Designer and Video Editor specializing in high-end visual storytelling, advanced motion graphics, and cinematic editing. I create visually engaging content that blends creativity with strategy to help brands stand out.
              </p>
              <p style={{ color: '#a1a1aa' }}>
                My expertise includes SaaS motion design, AI filmmaking, AI-powered video editing and generation, UI motion design, and <span style={{ color: '#c084fc' }}>interactive motion experiences</span>. I also have strong knowledge of sound design, branding, color grading, typography, and visual design principles.
              </p>
              <p style={{ color: '#a1a1aa' }}>
                With a deep understanding of consistent brand identity and brand color systems, I focus on creating polished, modern, and impactful visuals that not only look professional but also communicate clearly and effectively.
              </p>
            </div>

            {/* Right: SVG Path Animation */}
            <div className="w-full lg:w-[40%] flex justify-center items-center">
              <SvgPathAnimation />
            </div>
          </div>
        </motion.div>

        {/* Bottom Section: Languages & Stats */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          
          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#86868b' }}>Languages</h3>
            <div className="flex gap-2.5">
              {['Hindi', 'Basic English', 'Bengali'].map((lang, i) => (
                <motion.span
                  key={lang}
                  className="glass px-4 py-2 rounded-full text-xs font-medium cursor-default"
                  style={{ color: '#a1a1aa' }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
                  whileHover={{
                    borderColor: 'rgba(139,92,246,0.4)',
                    color: '#f5f5f7',
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    scale: 1.05,
                  }}
                >
                  {lang}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex gap-4">
            {[
              { target: 5, suffix: '+', label: 'Years Experience' },
              { target: 1000, suffix: '+', label: 'Videos Delivered' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass rounded-[24px] px-6 py-4 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(139,92,246,0.3)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#86868b' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

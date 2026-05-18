import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  { num: '01', title: 'Briefing', desc: 'Defining objectives and creative vision.' },
  { num: '02', title: 'Storyboarding', desc: 'Sketching scenes and planning transitions.' },
  { num: '03', title: 'Art Direction', desc: 'Designing the visual identity and compositions.' },
  { num: '04', title: 'Motion Design', desc: 'Creating polished animations and interactions.' },
  { num: '05', title: 'Delivery', desc: 'Final rendering, revisions, and asset organization.' },
];

function DrawingLine() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-200px' });

  return (
    <div ref={ref} className="absolute top-1/2 left-0 w-full h-[1px] hidden md:block -translate-y-1/2 overflow-hidden">
      <div className="w-full h-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.4), rgba(41,151,255,0.4), rgba(139,92,246,0.4))' }}
        initial={{ width: '0%' }}
        animate={isInView ? { width: '100%' } : { width: '0%' }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
      {/* Glowing tip */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ background: 'rgba(255,255,255,0.6)', filter: 'blur(3px)' }}
        initial={{ left: '0%', opacity: 0 }}
        animate={isInView ? { left: '100%', opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
      {/* Secondary trailing particle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: 'rgba(139,92,246,0.3)', filter: 'blur(6px)' }}
        initial={{ left: '0%', opacity: 0 }}
        animate={isInView ? { left: '100%', opacity: [0, 0.8, 0.8, 0] } : {}}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />
    </div>
  );
}

export default function Process() {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden" id="process">
      {/* Top separator */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-3 md:mb-4">
            Production <span className="shimmer-text">Process</span>
          </h2>
          <motion.p
            style={{ color: '#86868b' }}
            className="text-base md:text-lg max-w-2xl"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A structured workflow designed for clarity and quality.
          </motion.p>
        </motion.div>

        <div className="relative">
          <DrawingLine />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step circle — frosted glass with pulse on view */}
                <motion.div
                  className="w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center text-base md:text-lg font-semibold mb-4 md:mb-6 z-10 relative"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f5f5f7',
                  }}
                  whileHover={{
                    borderColor: 'rgba(139,92,246,0.4)',
                    boxShadow: '0 0 30px rgba(139,92,246,0.2), 0 0 60px rgba(139,92,246,0.05)',
                    scale: 1.12,
                    backgroundColor: 'rgba(139,92,246,0.08)',
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.7 + index * 0.15,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  {step.num}
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(139,92,246,0.2)' }}
                    animate={{
                      scale: [1, 1.4, 1.4],
                      opacity: [0.4, 0, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1.5 + index * 0.3,
                      ease: 'easeOut',
                    }}
                  />
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="text-base md:text-xl font-semibold mb-1.5 md:mb-2"
                  style={{ color: '#f5f5f7' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + index * 0.15 }}
                  whileHover={{ color: '#8b5cf6', transition: { duration: 0.2 } }}
                >
                  {step.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-xs md:text-sm"
                  style={{ color: '#86868b' }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                >
                  {step.desc}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

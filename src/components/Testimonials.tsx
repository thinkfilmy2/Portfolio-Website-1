import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useRef, useState, useCallback, MouseEvent } from 'react';

const testimonials = [
  {
    quote: "Upananda took our vague ideas and transformed them into a breathtaking brand film. His attention to detail and motion design skills are unmatched.",
    author: "Sarah Jenkins",
    role: "Marketing Director, TechFlow"
  },
  {
    quote: "Working with Upananda was seamless. He understands rhythm and pacing better than anyone we've collaborated with. Highly recommended.",
    author: "David Chen",
    role: "Founder, NeoFin"
  }
];

/* Testimonial TiltCard */
function TestimonialCard({
  item,
  index,
}: {
  item: (typeof testimonials)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      glowX.set(e.clientX - rect.left);
      glowY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, glowX, glowY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card p-10 rounded-3xl relative overflow-hidden group border-shimmer"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: -6,
        boxShadow: '0 16px 50px rgba(0,0,0,0.45), 0 0 25px rgba(139,92,246,0.06)',
        transition: { duration: 0.35 },
      }}
    >
      {/* Cursor-tracking glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${glowX.get()}px ${glowY.get()}px, rgba(139,92,246,0.1), transparent 60%)`
            : 'transparent',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Quote icon with float */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.4 + index * 0.15,
          type: 'spring',
          stiffness: 200,
          damping: 12,
        }}
      >
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Quote
            className="absolute top-6 right-6 w-10 h-10"
            style={{ color: 'rgba(139,92,246,0.08)' }}
          />
        </motion.div>
      </motion.div>

      {/* Quote text */}
      <motion.p
        className="text-lg md:text-xl font-medium leading-relaxed mb-8 relative z-10 text-balance"
        style={{ color: '#f5f5f7' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
      >
        "{item.quote}"
      </motion.p>

      {/* Author info with slide-up */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 + index * 0.15, duration: 0.5 }}
      >
        <div className="font-semibold" style={{ color: '#f5f5f7' }}>
          {item.author}
        </div>
        <div className="text-sm" style={{ color: '#86868b' }}>{item.role}</div>
      </motion.div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="testimonials">
      {/* Top separator */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            Client <span className="shimmer-text">Feedback</span>
          </h2>
          <motion.p
            style={{ color: '#86868b' }}
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Don't just take my word for it.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <TestimonialCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

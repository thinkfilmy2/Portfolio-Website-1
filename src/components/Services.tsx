import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Film, 
  Sparkles, 
  Headphones, 
  Clapperboard, 
  MousePointer2, 
  Compass, 
  Palette, 
  Pointer, 
  Cuboid, 
  Fingerprint,
  ArrowRight,
  X
} from 'lucide-react';
import { useRef, useCallback, useState, useEffect } from 'react';

const services = [
  {
    icon: <Box className="w-6 h-6" />,
    title: 'Motion Graphics',
    description: 'Creating dynamic visual animations that combine movement, typography, graphics, and storytelling to communicate ideas in a visually engaging way. This includes SaaS animations, explainer visuals, promotional content, kinetic typography, UI animations, and branded motion systems designed for modern digital experiences.',
    accent: '#8b5cf6',
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: 'Video Editing',
    description: 'Crafting cinematic and engaging video content through professional editing techniques such as pacing, storytelling, seamless transitions, speed remapping, multi-layer compositions, and visual synchronization. Focused on delivering polished edits that enhance emotion, retention, and visual impact.',
    accent: '#6366f1',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI Filmmaking',
    description: 'Using AI-powered tools and workflows to enhance video production, automate creative processes, generate visuals, improve editing efficiency, and create next-generation cinematic experiences. Combining human creativity with AI technology for faster and more innovative content creation.',
    accent: '#a78bfa',
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: 'Sound Design',
    description: 'Designing immersive audio experiences through cinematic sound effects, ambient layers, transitions, dialogue enhancement, audio mixing, and emotional sound storytelling. Focused on creating sound environments that elevate the overall visual experience.',
    accent: '#818cf8',
  },
  {
    icon: <Clapperboard className="w-6 h-6" />,
    title: 'Brand Films',
    description: 'Producing visually compelling brand stories that combine cinematic visuals, motion graphics, sound design, and storytelling to communicate a brand\u2019s identity, values, and message in a powerful and engaging way.',
    accent: '#c084fc',
  },
  {
    icon: <MousePointer2 className="w-6 h-6" />,
    title: 'UI Motion Design',
    description: 'Designing smooth and interactive interface animations that improve user experience, enhance usability, and create visually appealing digital interactions. Includes micro-interactions, transitions, loading animations, onboarding sequences, and product interface motion systems.',
    accent: '#7c3aed',
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: 'Creative Direction',
    description: 'Developing the overall visual and storytelling direction for projects by combining strategy, aesthetics, motion, branding, and communication design. Focused on creating cohesive creative concepts that align with brand identity and audience engagement.',
    accent: '#8b5cf6',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Color Grading',
    description: 'Enhancing the visual mood and cinematic quality of footage through professional color correction and grading techniques. Includes tone balancing, contrast control, cinematic looks, film emulation, and creating consistent visual aesthetics across projects.',
    accent: '#a78bfa',
  },
  {
    icon: <Pointer className="w-6 h-6" />,
    title: 'Interactive Experiences',
    description: 'Creating immersive and motion-driven digital experiences that encourage engagement and interaction through dynamic animations, responsive visuals, transitions, and interactive storytelling elements for modern web and digital platforms.',
    accent: '#6366f1',
  },
  {
    icon: <Cuboid className="w-6 h-6" />,
    title: '3D Motion Design',
    description: 'Designing cinematic 3D visuals, animated environments, product animations, simulations, and motion sequences that add depth, realism, and high-end visual quality to digital content and brand experiences.',
    accent: '#818cf8',
  },
  {
    icon: <Fingerprint className="w-6 h-6" />,
    title: 'Visual Identity',
    description: 'Building cohesive visual systems that define a brand\u2019s appearance through typography, color palettes, logo presentation, layout systems, design consistency, and modern visual communication principles to create a strong and recognizable brand presence.',
    accent: '#c084fc',
  },
];

/* ─── Premium 3D Tilt Card with cursor-tracking glow ─── */
function GlowCard({ children, index, accent }: { children: React.ReactNode; index: number; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse position inside the card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed 3D rotation values
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });

  // Spring-smoothed glow position
  const glowX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const glowY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const [isHovered, setIsHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Stagger delay based on column index for the grid layout
    const timer = setTimeout(() => setVisible(true), 100 + (index % 3) * 60);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      mouseX.set(px);
      mouseY.set(py);

      // Normalise to -1…1 from center
      const nx = (px / rect.width - 0.5) * 2;
      const ny = (py / rect.height - 0.5) * 2;

      // Tilt: max ±6 degrees
      rotateY.set(nx * 6);
      rotateX.set(-ny * 6);
    },
    [mouseX, mouseY, rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d' as const,
        background: 'rgba(16, 16, 20, 0.75)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        opacity: 0,
      }}
      whileHover={{
        boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 40px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
        borderColor: `${accent}50`,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      className="p-6 md:p-8 lg:p-10 rounded-[20px] md:rounded-[28px] group relative overflow-hidden w-full h-full flex flex-col border border-white/[0.06] will-change-transform"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Ambient gradient base ── */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse 140% 80% at 50% 110%, ${accent}12 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 80% 0%, rgba(99,102,241,0.04) 0%, transparent 60%)
          `,
          opacity: isHovered ? 0.9 : 0.4,
        }}
      />

      {/* ── Cursor-tracking glow orb ── */}
      <motion.div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${glowX.get()}px ${glowY.get()}px, ${accent}20, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* ── Top shimmer line ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${accent}40 50%, transparent 90%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* ── Inner glow on hover ── */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 80px ${accent}08`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {children}
    </motion.div>
  );
}

/* ─── Card Content (reusable between main section and panel) ─── */
function CardContent({ service }: { service: typeof services[number] }) {
  return (
    <>
      {/* Icon — frosted circle with spring hover */}
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 relative z-10 border border-white/[0.08]"
        style={{
          background: `linear-gradient(135deg, ${service.accent}15, rgba(255,255,255,0.03))`,
        }}
        whileHover={{
          scale: 1.12,
          rotate: 8,
          borderColor: `${service.accent}40`,
          boxShadow: `0 0 28px ${service.accent}30`,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <motion.span
          style={{ color: '#e2e8f0' }}
          className="group-hover:text-white transition-colors duration-300"
        >
          {service.icon}
        </motion.span>
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-xl font-semibold mb-3 relative z-10 text-[#f5f5f7] group-hover:text-white transition-colors duration-300"
      >
        {service.title}
      </motion.h3>

      {/* Accent underline that expands on hover */}
      <motion.div
        className="h-[2px] rounded-full mb-5 origin-left"
        style={{ background: `linear-gradient(90deg, ${service.accent}, transparent)` }}
        initial={{ scaleX: 0.3, opacity: 0.4 }}
        whileInView={{ scaleX: 0.3, opacity: 0.4 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Description */}
      <p
        className="text-sm leading-relaxed relative z-10 flex-grow text-[#8b8b94] group-hover:text-[#b4b4be] transition-colors duration-500"
      >
        {service.description}
      </p>

      {/* Bottom glow accent line */}
      <motion.div
        className="absolute bottom-0 left-[15%] right-[15%] h-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${service.accent}30, transparent)`,
          opacity: 0.3,
        }}
      />
    </>
  );
}

/* ─── Full-screen Skills Panel ─── */
function SkillsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Backdrop blur */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(40px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel content */}
          <motion.div
            className="relative z-10 flex flex-col h-full overflow-y-auto no-scrollbar"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-50 px-4 md:px-6 lg:px-12 xl:px-24 py-4 md:py-6 flex items-center justify-between"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-[#f5f5f7] tracking-tight">
                  All <span className="shimmer-text">Skills</span>
                </h2>
                <p className="text-sm text-[#86868b] mt-1">
                  {services.length} creative capabilities
                </p>
              </motion.div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/[0.08] cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                }}
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                transition={{ delay: 0.3, duration: 0.4, type: 'spring', stiffness: 300 }}
                whileHover={{
                  scale: 1.1,
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-[#86868b]" />
              </motion.button>
            </div>

            {/* Cards Grid */}
            <div className="px-4 md:px-6 lg:px-12 xl:px-24 py-6 md:py-10 lg:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <GlowCard index={index} accent={service.accent}>
                      <CardContent service={service} />
                    </GlowCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── "More Skills" Button ─── */
function MoreSkillsButton({ onClick, remainingCount }: { onClick: () => void; remainingCount: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center mt-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-4 px-8 py-4 rounded-full border border-white/[0.08] cursor-pointer overflow-hidden"
        style={{
          background: 'rgba(16, 16, 20, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        whileHover={{
          borderColor: 'rgba(139,92,246,0.3)',
          boxShadow: '0 0 40px rgba(139,92,246,0.1), 0 20px 50px rgba(0,0,0,0.3)',
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)',
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          }}
          animate={{
            x: isHovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{
            duration: 1.2,
            ease: 'easeInOut',
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        />

        {/* Skill preview icons */}
        <div className="flex -space-x-2 relative z-10">
          {services.slice(2, 6).map((s, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.1]"
              style={{
                background: `linear-gradient(135deg, ${s.accent}20, rgba(16,16,20,0.9))`,
              }}
              animate={{
                y: isHovered ? [0, -3, 0] : 0,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 1,
              }}
            >
              <span className="scale-[0.55] text-[#a0a0b0]">{s.icon}</span>
            </motion.div>
          ))}
          {/* Count badge */}
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.1]"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(16,16,20,0.9))',
            }}
          >
            <span className="text-[10px] font-semibold text-[#a78bfa]">+{remainingCount - 4}</span>
          </motion.div>
        </div>

        {/* Label */}
        <span className="text-sm font-medium text-[#a0a0b0] group-hover:text-[#f5f5f7] transition-colors duration-300 relative z-10">
          Explore All Skills
        </span>

        {/* Arrow */}
        <motion.div
          className="relative z-10"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#8b5cf6] transition-colors duration-300" />
        </motion.div>
      </motion.button>


    </motion.div>
  );
}

/* ─── Main Services Section ─── */
export default function Services() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const visibleCards = services.slice(0, 2);
  const remainingCount = services.length - 2;

  return (
    <>
      <section className="pt-10 md:pt-16 pb-16 md:pb-32 relative overflow-hidden" id="services">
        {/* Top separator */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-24">

          {/* Heading */}
          <div className="mb-12 md:mb-20 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center lg:items-start"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-3 md:mb-4 text-[#f5f5f7]">
                Creative <span className="shimmer-text">Skills</span>
              </h2>
              <motion.p
                style={{ color: '#86868b' }}
                className="text-base md:text-lg lg:text-xl max-w-2xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Transforming concepts into high-end visual content.
              </motion.p>
            </motion.div>
          </div>

          {/* Show only first 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto lg:mx-0">
            {visibleCards.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <GlowCard index={index} accent={service.accent}>
                  <CardContent service={service} />
                </GlowCard>
              </motion.div>
            ))}
          </div>

          {/* More Skills Button */}
          <MoreSkillsButton
            onClick={() => setIsPanelOpen(true)}
            remainingCount={remainingCount}
          />
          
        </div>
      </section>

      {/* Full-screen Skills Panel */}
      <SkillsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}

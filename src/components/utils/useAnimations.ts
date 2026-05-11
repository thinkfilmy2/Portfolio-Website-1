import { useRef, useEffect, useState, useCallback } from 'react';
import {
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,

  MotionValue,
} from 'framer-motion';

/* ═══════════════════════════════════════════
   MAGNETIC HOVER
   Makes elements subtly follow the cursor
   ═══════════════════════════════════════════ */
export function useMagneticHover(strength: number = 0.35) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, x: springX, y: springY };
}

/* ═══════════════════════════════════════════
   GLOW TRACKER
   Tracks mouse for radial glow on cards
   ═══════════════════════════════════════════ */
export function useGlowTracker() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [handleMouseMove]);

  return { ref, mouseX, mouseY, isHovered };
}

/* ═══════════════════════════════════════════
   PARALLAX
   Scroll-linked transform
   ═══════════════════════════════════════════ */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  return { ref, y: smoothY };
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL VARIANTS
   Reusable animation presets
   ═══════════════════════════════════════════ */
export const revealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(20px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

/* ═══════════════════════════════════════════
   STAGGER CONTAINER
   Parent variant for stagger children
   ═══════════════════════════════════════════ */
export const staggerContainer = (staggerDelay: number = 0.08, delayChildren: number = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

/* ═══════════════════════════════════════════
   STAGGER CHILD VARIANTS
   ═══════════════════════════════════════════ */
export const staggerChild = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ═══════════════════════════════════════════
   CHARACTER REVEAL VARIANT FACTORY
   For premium text animations
   ═══════════════════════════════════════════ */
export const charReveal = (baseDelay: number = 0.3, perChar: number = 0.025) => ({
  hidden: { opacity: 0, y: 50, rotateX: 80, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      delay: baseDelay + i * perChar,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
});

/* ═══════════════════════════════════════════
   WORD REVEAL VARIANT FACTORY
   ═══════════════════════════════════════════ */
export const wordReveal = (baseDelay: number = 0.3, perWord: number = 0.06) => ({
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)', scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.7,
      delay: baseDelay + i * perWord,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
});

/* ═══════════════════════════════════════════
   HOVER GLOW STYLE GENERATOR
   Returns inline style for cursor-tracked glow
   ═══════════════════════════════════════════ */
export function glowStyle(
  mouseX: MotionValue<number>,
  mouseY: MotionValue<number>,
  isHovered: boolean,
  color: string = 'rgba(139,92,246,0.15)',
  size: number = 250
) {
  return {
    background: isHovered
      ? `radial-gradient(${size}px circle at ${mouseX.get()}px ${mouseY.get()}px, ${color}, transparent 70%)`
      : 'transparent',
    transition: 'background 0.3s ease',
  };
}

/* ═══════════════════════════════════════════
   SPRING PRESETS
   ═══════════════════════════════════════════ */
export const springPresets = {
  gentle: { stiffness: 120, damping: 20 },
  snappy: { stiffness: 300, damping: 22 },
  bouncy: { stiffness: 400, damping: 15, mass: 0.8 },
  smooth: { stiffness: 80, damping: 25 },
};

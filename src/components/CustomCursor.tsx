import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const trailX = useSpring(0, { stiffness: 80, damping: 20 });
  const trailY = useSpring(0, { stiffness: 80, damping: 20 });

  /* Glow trail opacity */
  const glowOpacity = useSpring(0, { stiffness: 100, damping: 25 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      trailX.set(e.clientX - 20);
      trailY.set(e.clientY - 20);
      glowOpacity.set(0.4);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    /* MutationObserver for dynamically added interactive elements */
    const attachHoverListeners = () => {
      const els = document.querySelectorAll('a, button, input, textarea, [data-interactive]');
      els.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    attachHoverListeners();

    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, [trailX, trailY, glowOpacity]);

  return (
    <>
      {/* Main dot cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ backgroundColor: isHovering ? '#8b5cf6' : '#ffffff' }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isClicking ? 0.6 : isHovering ? 0.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.1,
        }}
      />
      
      {/* Trailing glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: trailX,
          y: trailY,
          border: isHovering
            ? '1.5px solid rgba(139, 92, 246, 0.6)'
            : '1.5px solid rgba(255, 255, 255, 0.4)',
        }}
        animate={{
          scale: isClicking ? 1.8 : isHovering ? 2.5 : 1,
          borderColor: isHovering
            ? 'rgba(139, 92, 246, 0.6)'
            : 'rgba(255, 255, 255, 0.4)',
        }}
        transition={{
          scale: { type: 'spring', stiffness: 200, damping: 15 },
          borderColor: { duration: 0.3 },
        }}
      />

      {/* Subtle glow trail */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[9997]"
        style={{
          x: trailX,
          y: trailY,
          marginLeft: -12,
          marginTop: -12,
          background: isHovering
            ? 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)',
          filter: 'blur(8px)',
          opacity: glowOpacity,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 150, damping: 20 },
        }}
      />
    </>
  );
}

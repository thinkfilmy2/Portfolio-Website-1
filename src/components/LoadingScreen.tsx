import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const nameLetters = 'UPANANDA DEBNATH'.split('');

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 20;
    let current = 0;

    const timer = setInterval(() => {
      current += (interval / duration) * 100;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(onComplete, 800);
      } else {
        setProgress(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ background: '#000000' }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Name reveal */}
      <div className="mb-14 flex overflow-hidden relative z-10">
        {nameLetters.map((letter, i) => (
          <motion.span
            key={i}
            className={`text-3xl md:text-5xl font-semibold tracking-tight ${letter === ' ' ? 'w-3.5' : ''}`}
            style={{ color: '#f5f5f7' }}
            initial={{ y: 60, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 0.5,
              delay: 0.3 + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        className="text-xs uppercase tracking-[0.3em] mb-12 relative z-10"
        style={{ color: '#86868b' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        Motion Designer & Video Editor
      </motion.p>

      {/* Progress bar — frosted */}
      <div className="relative w-full max-w-xs px-6 z-10">
        <div className="flex justify-between text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: '#86868b' }}>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            Loading
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            {progress}%
          </motion.span>
        </div>
        <div className="h-[1.5px] w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #8b5cf6, #2997ff)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Glow */}
        <motion.div
          className="h-[1px] w-full absolute bottom-0 left-6 right-6 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
            filter: 'blur(6px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

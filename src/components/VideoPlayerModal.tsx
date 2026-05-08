import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: string;
  title: string;
  category: string;
  accent: string;
  onShowGallery: () => void;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  video,
  title,
  category,
  accent,
  onShowGallery,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  /* Auto-play on open */
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isOpen]);

  /* Track progress */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const update = () => {
      setProgress(v.currentTime);
      setDuration(v.duration || 0);
    };
    v.addEventListener('timeupdate', update);
    v.addEventListener('loadedmetadata', update);
    return () => {
      v.removeEventListener('timeupdate', update);
      v.removeEventListener('loadedmetadata', update);
    };
  }, [isOpen]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!videoRef.current.muted ? false : true);
    }
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close button (Fixed Top Right) */}
          <motion.button
            onClick={onClose}
            className="fixed top-4 right-4 md:top-8 md:right-8 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-[10020]"
            style={{
              background: 'rgba(20,20,25,0.6)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f5f7',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.1, rotate: 90, background: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Modal content */}
          <motion.div
            className="relative w-full max-w-5xl z-10"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >

            {/* Video player — glass card */}
            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: 'rgba(20,20,25,0.8)',
                backdropFilter: 'blur(60px) saturate(200%)',
                WebkitBackdropFilter: 'blur(60px) saturate(200%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* 16:9 Video */}
              <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                <video
                  ref={videoRef}
                  src={video}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted={isMuted}
                  onClick={togglePlay}
                />

                {/* Play/Pause overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={togglePlay}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-5 h-5 ml-1 border-y-[10px] border-y-transparent border-l-[14px] border-l-white/80" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title overlay */}
                <motion.div
                  className="absolute top-5 left-6 z-10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: accent }}>
                    {category}
                  </div>
                  <div className="text-lg font-semibold" style={{ color: '#f5f5f7' }}>
                    {title}
                  </div>
                </motion.div>
              </div>

              {/* Controls bar — glass */}
              <div className="px-6 py-4 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Play/Pause */}
                <motion.button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5f5f7">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5f5f7">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  )}
                </motion.button>

                {/* Progress bar */}
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[10px] font-mono" style={{ color: '#86868b' }}>{formatTime(progress)}</span>
                  <div
                    className="flex-1 h-1 rounded-full cursor-pointer relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    onClick={seek}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: duration ? `${(progress / duration) * 100}%` : '0%',
                        background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: '#86868b' }}>{formatTime(duration)}</span>
                </div>

                {/* Mute/Unmute */}
                <motion.button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Enter More Projects button */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.button
                onClick={() => { onClose(); onShowGallery(); }}
                className="group flex items-center gap-3 px-8 py-4 rounded-full font-medium text-base cursor-pointer relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f7',
                }}
                whileHover={{
                  scale: 1.04,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(139,92,246,0.3)',
                  boxShadow: '0 0 30px rgba(139,92,246,0.12)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                />
                <span className="relative z-10">Enter More Projects</span>
                <motion.span className="relative z-10" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

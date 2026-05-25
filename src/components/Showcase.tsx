import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,

} from 'framer-motion';
import { useState, useRef, useCallback, useEffect, MouseEvent } from 'react';
import { getDriveThumbnailUrl } from './utils/videoUtils';
import VideoPlayerModal from './VideoPlayerModal';
import ProjectGallery from './ProjectGallery';
/* Helper: extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/shorts\/|youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/* Check if a URL is a YouTube link */
function isYouTubeUrl(url: string): boolean {
  return getYouTubeId(url) !== null;
}

/* Check if a URL is a Google Drive link */
function isDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}

import { motionProjectsData, Project } from '../data/projects';

/* ── Project data with demo videos ── */
const projects = motionProjectsData.slice(0, 5);

/* ── Fan card layout config ── */
/* Cards spread in a fan: center card is upright, others rotate outward */
const getFanTransform = (index: number, total: number, isScrolled: boolean, isMobile: boolean) => {
  const center = (total - 1) / 2;
  const offset = index - center;

  if (!isScrolled) {
    /* Before scroll: all cards stacked to the right, hidden */
    return {
      x: (isMobile ? 200 : 400) + index * (isMobile ? 20 : 40),
      rotate: 15 + index * 3,
      scale: 0.85,
      opacity: 0,
      zIndex: total - index,
    };
  }

  /* After scroll: fan spread — tighter on mobile */
  const rotation = offset * (isMobile ? 6 : 8);
  const xOffset = offset * (isMobile ? 80 : 160);
  const yOffset = Math.abs(offset) * (isMobile ? 14 : 20);
  const scaleVal = 1 - Math.abs(offset) * 0.06;
  const zIndex = total - Math.abs(offset);

  return {
    x: xOffset,
    rotate: rotation,
    scale: scaleVal,
    opacity: 1,
    zIndex,
    y: yOffset,
  };
};

/* ── Individual Video Card ── */
function VideoCard({
  project,
  index,
  total,
  isRevealed,
  onSelect,
}: {
  project: Project;
  index: number;
  total: number;
  isRevealed: boolean;
  onSelect: (p: Project) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* 3D tilt on hover */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 25,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  /* Play/pause video on hover */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered && isRevealed) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isHovered, isRevealed]);

  /* Mute toggle */
  const toggleMute = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsMuted((prev) => {
        if (videoRef.current) videoRef.current.muted = !prev;
        return !prev;
      });
    },
    []
  );

  const fan = getFanTransform(index, total, isRevealed, isMobileView);

  return (
    <motion.div
      ref={cardRef}
      className="absolute cursor-pointer"
      onClick={() => onSelect(project)}
      style={{
        width: isMobileView ? 'clamp(140px, 36vw, 200px)' : 'clamp(220px, 22vw, 320px)',
        zIndex: fan.zIndex,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      initial={{
        x: (isMobileView ? 250 : 500) + index * (isMobileView ? 20 : 40),
        rotate: 18 + index * 3,
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        x: fan.x,
        y: fan.y || 0,
        rotate: fan.rotate,
        scale: isHovered ? (fan.scale || 1) * 1.08 : fan.scale,
        opacity: fan.opacity,
      }}
      transition={{
        duration: 1,
        delay: isRevealed ? index * 0.1 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: (fan.scale || 1) * 0.97 }}
    >
      <div
        className="relative rounded-[20px] overflow-hidden group"
        style={{
          aspectRatio: '3 / 4',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: isHovered
            ? `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${project.accent}20`
            : '0 20px 50px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Gradient fallback */}
        <div
          className="absolute inset-0"
          style={{ background: (project as any).gradient || `linear-gradient(135deg, ${project.accent}80 0%, ${project.accent}20 100%)`, opacity: videoLoaded ? 0.3 : 0.7, transition: 'opacity 0.6s ease' }}
        />

        {/* Video */}
        {isYouTubeUrl(project.video) ? (
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
            style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(project.video)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(project.video)}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
              style={{ width: '300%', height: '300%', pointerEvents: 'none' }}
              allow="autoplay; encrypted-media"
              onLoad={() => setVideoLoaded(true)}
              title={project.title}
            />
          </div>
        ) : isDriveUrl(project.video) ? (
          <img
            src={getDriveThumbnailUrl(project.video)}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
            onLoad={() => setVideoLoaded(true)}
          />
        ) : (
          <video
            ref={videoRef}
            src={project.video}
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
          />
        )}

        {/* Custom play button overlay for Drive videos */}
        {isDriveUrl(project.video) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              animate={{
                scale: isHovered ? 1.1 : 1,
                backgroundColor: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                borderColor: isHovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
              }}
            >
              <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-0.5" />
            </motion.div>
          </div>
        )}

        {/* Glass overlay gradient (bottom) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Shine sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out pointer-events-none z-10" />

        {/* Project info overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-5 z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 4 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-1.5" style={{ color: project.accent }}>
            {project.category}
          </div>
          <div className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>
            {project.title}
          </div>
        </motion.div>

        {/* Project number */}
        <motion.div
          className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-wider z-20"
          style={{ color: 'rgba(245,245,247,0.35)' }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* Mute/Unmute button */}
        <motion.button
          onClick={toggleMute}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-30 cursor-pointer"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.25 }}
          whileHover={{
            scale: 1.15,
            background: 'rgba(0,0,0,0.6)',
            borderColor: 'rgba(255,255,255,0.2)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? (
            /* Muted icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f5f5f7' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            /* Unmuted icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f5f5f7' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </motion.button>

        {/* Hover glow border */}
        <motion.div
          className="absolute inset-0 rounded-[20px] pointer-events-none z-10"
          style={{
            border: `1px solid ${project.accent}`,
            opacity: 0,
          }}
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Main Showcase Section ── */
export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  /* Scroll-triggered reveal */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'start 0.3'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > 0.15 && !isRevealed) {
        setIsRevealed(true);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, isRevealed]);

  /* Parallax glow behind cards */
  const glowY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.2]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      id="work"
      style={{ paddingTop: '2rem', paddingBottom: '4rem' }}
    >
      {/* Background ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80vw',
          height: '60vh',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, rgba(41,151,255,0.03) 40%, transparent 70%)',
          filter: 'blur(80px)',
          y: glowY,
          scale: glowScale,
        }}
      />

      <div className="container mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight mb-4 md:mb-5 shimmer-text inline-block"
          >
            Motion Archive
          </motion.h2>
          <motion.p
            style={{ color: '#86868b' }}
            className="text-base md:text-lg max-w-lg mx-auto px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A curated gallery of animation, branding, and cinematic visuals.
          </motion.p>
        </motion.div>

        {/* Fan card layout */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: 'clamp(280px, 42vh, 520px)' }}
        >
          {projects.map((project, index) => (
            <VideoCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              isRevealed={isRevealed}
              onSelect={setSelectedProject}
            />
          ))}

          {/* Floor reflection / shadow */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '70%',
              height: '60px',
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{ opacity: isRevealed ? [0.3, 0.6, 0.3] : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* View All / Archive Button */}
        <motion.div
          className="flex justify-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={() => setShowGallery(true)}
            className="px-6 py-3 rounded-full text-sm font-semibold cursor-pointer relative group flex items-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f5f5f7',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
            whileHover={{
              scale: 1.05,
              background: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.15)',
              boxShadow: '0 8px 30px rgba(139,92,246,0.15)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Explore Full Archive</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        video={selectedProject?.video || ''}
        title={selectedProject?.title || ''}
        category={selectedProject?.category || ''}
        accent={selectedProject?.accent || '#8b5cf6'}
        summary={selectedProject?.summary || ''}
        team={selectedProject?.team || ''}
        client={selectedProject?.client || ''}
        industry={selectedProject?.industry || ''}
        type={selectedProject?.type || ''}
        onShowGallery={() => setShowGallery(true)}
      />

      {/* Full Project Gallery */}
      <ProjectGallery isOpen={showGallery} onClose={() => setShowGallery(false)} />
    </section>
  );
}

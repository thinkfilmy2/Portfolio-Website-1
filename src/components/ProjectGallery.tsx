import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';

/* ── Extended gallery of 12 projects ── */
const galleryProjects = [
  { id: 'g1', title: 'Neon Odyssey', category: 'Brand Film', video: 'https://cdn.pixabay.com/video/2024/07/28/223394_large.mp4', accent: '#8b5cf6' },
  { id: 'g2', title: 'Fintech App UI', category: 'UI Motion', video: 'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4', accent: '#2997ff' },
  { id: 'g3', title: 'Cinematic Reel', category: 'Showreel', video: 'https://cdn.pixabay.com/video/2021/02/11/64608-511682498_large.mp4', accent: '#ec4899' },
  { id: 'g4', title: 'Eco Sneakers', category: 'Product Animation', video: 'https://cdn.pixabay.com/video/2023/10/06/183868-872276498_large.mp4', accent: '#34d399' },
  { id: 'g5', title: 'Abstract Concept', category: '3D Exploration', video: 'https://cdn.pixabay.com/video/2020/02/18/32492-393009498_large.mp4', accent: '#fb923c' },
  { id: 'g6', title: 'Urban Flow', category: 'Music Video', video: 'https://cdn.pixabay.com/video/2020/10/29/54020-475717399_large.mp4', accent: '#f43f5e' },
  { id: 'g7', title: 'Aurora Nights', category: 'Visual Effects', video: 'https://cdn.pixabay.com/video/2022/07/20/124902-732236498_large.mp4', accent: '#06b6d4' },
  { id: 'g8', title: 'Digital Dreams', category: 'Motion Graphics', video: 'https://cdn.pixabay.com/video/2024/01/25/198078-906029691_large.mp4', accent: '#a855f7' },
  { id: 'g9', title: 'Nature Reborn', category: 'Documentary', video: 'https://cdn.pixabay.com/video/2021/10/12/91416-633860638_large.mp4', accent: '#22c55e' },
  { id: 'g10', title: 'Tech Launch', category: 'Commercial', video: 'https://cdn.pixabay.com/video/2023/04/11/158635-816700980_large.mp4', accent: '#3b82f6' },
  { id: 'g11', title: 'Golden Hour', category: 'Cinematic', video: 'https://cdn.pixabay.com/video/2020/07/30/45643-446457947_large.mp4', accent: '#eab308' },
  { id: 'g12', title: 'Motion Study', category: 'Experimental', video: 'https://cdn.pixabay.com/video/2021/04/10/71080-536982808_large.mp4', accent: '#e879f9' },
];

/* ── Gallery video card ── */
function GalleryCard({
  project,
  index,
  onSelect,
}: {
  project: (typeof galleryProjects)[number];
  index: number;
  onSelect: (p: typeof galleryProjects[number]) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) { v.play().catch(() => {}); }
    else { v.pause(); v.currentTime = 0; }
  }, [hovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(project)}
    >
      <div
        className="relative rounded-2xl overflow-hidden border-shimmer"
        style={{
          aspectRatio: '16 / 9',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${project.accent}15`
            : '0 10px 30px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Gradient fallback */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${project.accent}40, ${project.accent}10)`,
          opacity: loaded ? 0.3 : 0.7,
          transition: 'opacity 0.5s ease',
        }} />

        {/* Video */}
        <video
          ref={videoRef}
          src={project.video}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Shine sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1000ms] pointer-events-none" />

        {/* Number */}
        <div className="absolute top-3 left-3 text-[10px] font-mono tracking-wider z-10" style={{ color: 'rgba(245,245,247,0.3)' }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Mute button on hover */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
            if (videoRef.current) videoRef.current.muted = !isMuted;
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center z-20 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {isMuted ? (
              <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
            ) : (
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            )}
          </svg>
        </motion.button>

        {/* Play icon center */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)' }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-3 h-3 ml-0.5 border-y-[6px] border-y-transparent border-l-[9px] border-l-white/80" />
          </motion.div>
        </motion.div>

        {/* Info */}
        <motion.div className="absolute bottom-0 left-0 right-0 p-4 z-10"
          animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-[9px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: project.accent }}>{project.category}</div>
          <div className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>{project.title}</div>
        </motion.div>

        {/* Hover border glow */}
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${project.accent}`, opacity: 0 }}
          animate={{ opacity: hovered ? 0.35 : 0 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Inline gallery player ── */
function InlinePlayer({
  project,
  onClose,
}: {
  project: typeof galleryProjects[number];
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [project]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const u = () => { setProgress(v.currentTime); setDur(v.duration || 0); };
    v.addEventListener('timeupdate', u);
    v.addEventListener('loadedmetadata', u);
    return () => { v.removeEventListener('timeupdate', u); v.removeEventListener('loadedmetadata', u); };
  }, [project]);

  const fmt = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="mb-10 rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(20,20,25,0.8)',
        backdropFilter: 'blur(60px) saturate(200%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
      }}
    >
      <div className="relative" style={{ aspectRatio: '16 / 9' }}>
        <video ref={videoRef} src={project.video} className="w-full h-full object-cover" loop playsInline muted={muted}
          onClick={() => { const v = videoRef.current; if (v?.paused) { v.play(); setPlaying(true); } else { v?.pause(); setPlaying(false); } }} />
        <div className="absolute top-4 left-5 z-10">
          <div className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: project.accent }}>{project.category}</div>
          <div className="text-lg font-semibold" style={{ color: '#f5f5f7' }}>{project.title}</div>
        </div>
        <motion.button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#86868b' }}
          whileHover={{ scale: 1.1, color: '#f5f5f7' }} whileTap={{ scale: 0.9 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>
      </div>
      <div className="px-5 py-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.button onClick={() => {
          const v = videoRef.current; if (v?.paused) { v.play(); setPlaying(true); } else { v?.pause(); setPlaying(false); }
        }} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5f5f7"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5f5f7"><polygon points="6 3 20 12 6 21" /></svg>
          )}
        </motion.button>
        <span className="text-[10px] font-mono" style={{ color: '#86868b' }}>{fmt(progress)}</span>
        <div className="flex-1 h-1 rounded-full cursor-pointer overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}
          onClick={(e) => { const v = videoRef.current; if (!v?.duration) return; const r = e.currentTarget.getBoundingClientRect(); v.currentTime = ((e.clientX - r.left) / r.width) * v.duration; }}>
          <div className="h-full rounded-full" style={{ width: dur ? `${(progress / dur) * 100}%` : '0%', background: `linear-gradient(90deg, ${project.accent}, ${project.accent}88)` }} />
        </div>
        <span className="text-[10px] font-mono" style={{ color: '#86868b' }}>{fmt(dur)}</span>
        <motion.button onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {muted ? (<><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>) : (<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />)}
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Main Gallery Panel ── */
interface ProjectGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectGallery({ isOpen, onClose }: ProjectGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<typeof galleryProjects[number] | null>(null);

  /* Reset on close */
  useEffect(() => {
    if (!isOpen) setSelectedProject(null);
  }, [isOpen]);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0" onClick={onClose}
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(40px) saturate(120%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-6xl mx-auto flex-1 overflow-y-auto no-scrollbar px-6 py-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-1" style={{ color: '#f5f5f7' }}>
                  All <span className="shimmer-text">Projects</span>
                </h2>
                <p className="text-sm" style={{ color: '#86868b' }}>{galleryProjects.length} motion design projects</p>
              </motion.div>
              <motion.button onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#86868b' }}
                whileHover={{ scale: 1.1, rotate: 90, color: '#f5f5f7' }} whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Inline player */}
            <AnimatePresence>
              {selectedProject && (
                <InlinePlayer project={selectedProject} onClose={() => setSelectedProject(null)} />
              )}
            </AnimatePresence>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleryProjects.map((p, i) => (
                <GalleryCard key={p.id} project={p} index={i} onSelect={setSelectedProject} />
              ))}
            </div>

            {/* Bottom spacer */}
            <div className="h-10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

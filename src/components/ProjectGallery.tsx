import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useBlobUrl, getDriveThumbnailUrl } from './utils/videoUtils';

/* ─── YouTube helpers ─── */
function getYTId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/* ─── Google Drive helpers ─── */
function isDriveUrl(url: string) {
  return url.includes('drive.google.com');
}




declare global { interface Window { YT: any; onYouTubeIframeAPIReady: () => void; } }
let _ytLoaded = false, _ytReady = false;
const _ytCbs: (() => void)[] = [];
function loadYT(cb: () => void) {
  if (_ytReady) { cb(); return; }
  _ytCbs.push(cb);
  if (_ytLoaded) return;
  _ytLoaded = true;
  window.onYouTubeIframeAPIReady = () => { _ytReady = true; _ytCbs.forEach(f => f()); _ytCbs.length = 0; };
  const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s);
}

/* ─── Data ─── */
import { motionProjectsData as motionProjects, editingProjectsData as editingProjects, Project } from '../data/projects';
import VideoPlayerModal from './VideoPlayerModal';

/* ─── Inline YT player card ─── */
function YTCard({ project, accent, index, onSelect }: { project: Project; accent: string; index: number; onSelect: (p: Project) => void }) {
  const ytId = getYTId(project.video)!;
  const divRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadYT(() => {
      if (!divRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(divRef.current, {
        videoId: ytId,
        playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1, mute: 1 },
        events: {
          onReady: () => setReady(true),
        },
      });
    });
    return () => { playerRef.current?.destroy(); playerRef.current = null; };
  }, [ytId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
      style={{ background: 'rgba(18,18,22,0.9)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      onClick={() => onSelect(project)}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <span className="text-[9px] uppercase tracking-widest font-semibold block mb-0.5" style={{ color: accent }}>{project.category}</span>
          <h4 className="text-sm font-semibold text-white/90">{project.title}</h4>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 group-hover:text-white/80 transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
      </div>

      {/* Video area */}
      <div className="relative" style={{ aspectRatio: '16/9', background: '#000' }}>
        <div ref={divRef} className="w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg,${accent}30,${accent}10)` }}>
            <motion.div className="w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: `${accent}44`, borderTopColor: accent }} animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
          </div>
        )}
        {/* Transparent overlay to block YouTube player pointer events so clicks bubble to card */}
        <div className="absolute inset-0 z-10 bg-transparent" />
      </div>

      {/* Project Details */}
      <div className="p-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <p className="text-[13px] leading-relaxed mb-1" style={{ color: '#86868b' }}>{project.summary}</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
          <div className="text-[11px]"><span style={{ color: '#666' }}>Client:</span> <span style={{ color: '#e5e5ea' }}>{project.client}</span></div>
          <div className="text-[11px]"><span style={{ color: '#666' }}>Industry:</span> <span style={{ color: '#e5e5ea' }}>{project.industry}</span></div>
          <div className="text-[11px] col-span-2"><span style={{ color: '#666' }}>Type:</span> <span style={{ color: '#e5e5ea' }}>{project.type}</span></div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MP4 card ─── */
function MP4Card({ project, accent, index, onSelect }: { project: Project; accent: string; index: number; onSelect: (p: Project) => void }) {
  const { blobUrl, isLoading } = useBlobUrl(project.video);
  const vRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const v = vRef.current;
    if (!v || !blobUrl) return;
    if (isHovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isHovered, blobUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
      style={{ background: 'rgba(18,18,22,0.9)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      onClick={() => onSelect(project)}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <span className="text-[9px] uppercase tracking-widest font-semibold block mb-0.5" style={{ color: accent }}>{project.category}</span>
          <h4 className="text-sm font-semibold text-white/90">{project.title}</h4>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 group-hover:text-white/80 transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
      </div>

      {/* Video area */}
      <div className="relative" style={{ aspectRatio: '16/9', background: `linear-gradient(135deg,${accent}25,${accent}08)` }}>
        <video ref={vRef} src={blobUrl || undefined} loop playsInline muted preload="metadata" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}
          onLoadedData={() => setLoaded(true)}
        />
        {(isLoading || !loaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <motion.div className="w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: `${accent}44`, borderTopColor: accent }} animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="p-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <p className="text-[13px] leading-relaxed mb-1" style={{ color: '#86868b' }}>{project.summary}</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
          <div className="text-[11px]"><span style={{ color: '#666' }}>Client:</span> <span style={{ color: '#e5e5ea' }}>{project.client}</span></div>
          <div className="text-[11px]"><span style={{ color: '#666' }}>Industry:</span> <span style={{ color: '#e5e5ea' }}>{project.industry}</span></div>
          <div className="text-[11px] col-span-2"><span style={{ color: '#666' }}>Type:</span> <span style={{ color: '#e5e5ea' }}>{project.type}</span></div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── DriveCard — renders a Google Drive iframe embed ─── */
function DriveCard({ project, accent, index, onSelect }: { project: Project; accent: string; index: number; onSelect: (p: Project) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
      style={{ background: 'rgba(18,18,22,0.9)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      onClick={() => onSelect(project)}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <span className="text-[9px] uppercase tracking-widest font-semibold block mb-0.5" style={{ color: accent }}>{project.category}</span>
          <h4 className="text-sm font-semibold text-white/90">{project.title}</h4>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 group-hover:text-white/80 transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
      </div>

      {/* Video area — direct thumbnail with custom play icon */}
      <div className="relative" style={{ aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
        <img
          src={getDriveThumbnailUrl(project.video)}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Custom play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15 group-hover:border-white/35"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <p className="text-[13px] leading-relaxed mb-1" style={{ color: '#86868b' }}>{project.summary}</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
          <div className="text-[11px]"><span style={{ color: '#666' }}>Client:</span> <span style={{ color: '#e5e5ea' }}>{project.client}</span></div>
          <div className="text-[11px]"><span style={{ color: '#666' }}>Industry:</span> <span style={{ color: '#e5e5ea' }}>{project.industry}</span></div>
          <div className="text-[11px] col-span-2"><span style={{ color: '#666' }}>Type:</span> <span style={{ color: '#e5e5ea' }}>{project.type}</span></div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── VideoCard router ─── */
function VideoCard({ project, index, onSelect }: { project: Project; index: number; onSelect: (p: Project) => void }) {
  if (isDriveUrl(project.video)) {
    return <DriveCard project={project} accent={project.accent} index={index} onSelect={onSelect} />;
  }
  return getYTId(project.video)
    ? <YTCard project={project} accent={project.accent} index={index} onSelect={onSelect} />
    : <MP4Card project={project} accent={project.accent} index={index} onSelect={onSelect} />;
}

/* ─── Section with 12 cards ─── */
function Section({ title, subtitle, projects, accentColor, onSelect }: { title: string; subtitle: string; projects: Project[]; accentColor: string; onSelect: (p: Project) => void }) {
  return (
    <div className="mb-14">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full" style={{ background: accentColor }} />
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight" style={{ color: '#f5f5f7' }}>{title}</h3>
        </div>
        <p className="text-sm ml-4" style={{ color: '#86868b' }}>{subtitle}</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p, i) => <VideoCard key={p.id} project={p} index={i} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

/* ─── Main Gallery ─── */
export default function ProjectGallery({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'motion' | 'editing'>('motion');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) {
      setTab('motion');
      setSelectedProject(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const tabs = [
    { id: 'motion' as const, label: 'Motion Graphics', accent: '#8b5cf6' },
    { id: 'editing' as const, label: 'Video Editing', accent: '#2997ff' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[10000] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(40px)' }} onClick={onClose} />

          <motion.div
            className="relative z-10 w-full max-w-7xl mx-auto flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:py-10"
            style={{ scrollbarWidth: 'none' }}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-1" style={{ color: '#f5f5f7' }}>
                  All <span className="shimmer-text">Projects</span>
                </h2>
                <p className="text-sm" style={{ color: '#86868b' }}>24 projects across 2 disciplines</p>
              </div>
              <motion.button onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#86868b' }}
                whileHover={{ scale: 1.1, rotate: 90, color: '#f5f5f7' }} whileTap={{ scale: 0.9 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Tab pills */}
            <div className="flex gap-2 mb-10 p-1 rounded-2xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {tabs.map(t => (
                <motion.button key={t.id} onClick={() => setTab(t.id)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer relative"
                  style={{ color: tab === t.id ? '#f5f5f7' : '#86868b' }}
                  whileHover={{ color: '#f5f5f7' }} whileTap={{ scale: 0.97 }}
                >
                  {tab === t.id && (
                    <motion.div layoutId="tabBg" className="absolute inset-0 rounded-xl" style={{ background: `linear-gradient(135deg,${t.accent}44,${t.accent}22)`, border: `1px solid ${t.accent}44` }} transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Sections */}
            <AnimatePresence mode="wait">
              {tab === 'motion' && (
                <motion.div key="motion" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <Section title="Motion Graphics Videos" subtitle="12 motion design & animation projects" projects={motionProjects} accentColor="#8b5cf6" onSelect={setSelectedProject} />
                </motion.div>
              )}
              {tab === 'editing' && (
                <motion.div key="editing" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <Section title="Video Editing" subtitle="12 cinematic & editorial projects" projects={editingProjects} accentColor="#2997ff" onSelect={setSelectedProject} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-12" />
          </motion.div>

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
            onShowGallery={() => {}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

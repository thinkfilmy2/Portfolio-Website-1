import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { getDriveThumbnailUrl, isDriveUrl } from './utils/videoUtils';
import VideoPlayerModal from './VideoPlayerModal';
import type { Project } from '../types/siteContent';
import { useSiteContent } from '../context/SiteContentContext';

/* Helper: extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/shorts\/|youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/* Thumbnail priority: custom -> Drive -> YouTube -> none (gradient placeholder) */
function getThumbnail(p: Project): string | null {
  if (p.thumbnail) return p.thumbnail;
  if (isDriveUrl(p.video)) return getDriveThumbnailUrl(p.video);
  const yt = getYouTubeId(p.video);
  return yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : null;
}

const SECTIONS = [
  { key: 'motion', label: 'Motion Design', accent: '#8b5cf6' },
  { key: 'editing', label: 'Video Editing', accent: '#2997ff' },
  { key: 'ai', label: 'AI', accent: '#22c55e' },
] as const;

/* ── Grid card: image on top, text below, no autoplay ── */
function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = getThumbnail(project);

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      aria-label={`Play ${project.title}`}
      className="group block w-full h-full text-left rounded-2xl overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div
        className="relative aspect-video overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.accent}80 0%, ${project.accent}20 100%)` }}
      >
        {src && !imgFailed && (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 border border-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <span className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-white ml-1" />
          </span>
        </span>
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-1.5 break-words" style={{ color: project.accent }}>
          {project.category}
        </div>
        <div className="text-sm font-semibold break-words" style={{ color: '#f5f5f7' }}>
          {project.title}
        </div>
      </div>
    </button>
  );
}

/* ── Main Showcase Section ── */
export default function Showcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const content = useSiteContent();

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const sections = SECTIONS.map((s) => ({ ...s, items: content.projects?.[s.key] || [] })).filter(
    (s) => s.items.length > 0
  );

  return (
    <section className="relative overflow-hidden" id="work" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Background ambient glow */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80vw',
          height: '60vh',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, rgba(41,151,255,0.03) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative container mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div {...reveal()} className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight mb-4 md:mb-5 shimmer-text inline-block">
            Motion Archive
          </h2>
          <p style={{ color: '#86868b' }} className="text-base md:text-lg max-w-lg mx-auto px-2">
            A curated gallery of animation, branding, and cinematic visuals.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-20">
          {sections.map((s) => (
            <div key={s.key}>
              <motion.div {...reveal()} className="flex items-center gap-3 mb-6">
                <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: s.accent }} aria-hidden="true" />
                <h3 className="text-xl md:text-2xl font-semibold" style={{ color: '#f5f5f7' }}>
                  {s.label}
                </h3>
                <span className="text-sm" style={{ color: '#86868b' }}>
                  {s.items.length} {s.items.length === 1 ? 'project' : 'projects'}
                </span>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {s.items.map((project, i) => (
                  <motion.div key={project.id} {...reveal((i % 3) * 0.06)}>
                    <ProjectCard project={project} onSelect={setSelectedProject} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
      />
    </section>
  );
}

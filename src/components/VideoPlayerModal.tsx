import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import CustomVideoPlayer from './CustomVideoPlayer';

/* ── Types ── */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/shorts\/|youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const QUALITY_LABELS: Record<string, string> = {
  highres: '4K',
  hd2160: '2160p',
  hd1440: '1440p',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
  auto: 'Auto',
};

const isDriveUrl = (url: string) => {
  return url.includes('drive.google.com');
};

const getDriveEmbedUrl = (url: string) => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
};


interface Props {
  isOpen: boolean;
  onClose: () => void;
  video: string;
  title: string;
  category: string;
  accent: string;
  summary: string;
  team: string;
  client: string;
  industry: string;
  type: string;
  onShowGallery: () => void;
}

/* ── Load YouTube API once ── */
let ytApiLoaded = false;
let ytApiReady = false;
const ytReadyCallbacks: (() => void)[] = [];

function loadYTApi(cb: () => void) {
  if (ytApiReady) { cb(); return; }
  ytReadyCallbacks.push(cb);
  if (ytApiLoaded) return;
  ytApiLoaded = true;
  window.onYouTubeIframeAPIReady = () => {
    ytApiReady = true;
    ytReadyCallbacks.forEach(fn => fn());
    ytReadyCallbacks.length = 0;
  };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
}

export default function VideoPlayerModal(props: Props) {
  const {
    isOpen, onClose, video, title, category, accent,
    summary, client, industry, type, onShowGallery,
  } = props;
  const ytId = getYouTubeId(video);

  /* ── YouTube player state ── */
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ytReady, setYtReady] = useState(false);
  const [ytPlaying, setYtPlaying] = useState(false);
  const [ytMuted, setYtMuted] = useState(false);
  const [ytProgress, setYtProgress] = useState(0);
  const [ytDuration, setYtDuration] = useState(0);
  const [qualities, setQualities] = useState<string[]>([]);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Non-YouTube state ── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  /* ── Init YouTube player when modal opens ── */
  useEffect(() => {
    if (!isOpen || !ytId) return;
    loadYTApi(() => {
      if (!containerRef.current) return;
      if (playerRef.current) {
        playerRef.current.loadVideoById(ytId);
        return;
      }
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: ytId,
        playerVars: {
          autoplay: 1, controls: 0, modestbranding: 1, rel: 0,
          disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: any) => {
            setYtReady(true);
            setYtDuration(e.target.getDuration());
            const q = e.target.getAvailableQualityLevels?.() ?? [];
            if (q.length) setQualities(q);
            setCurrentQuality(e.target.getPlaybackQuality());
          },
          onStateChange: (e: any) => {
            const playing = e.data === window.YT.PlayerState.PLAYING;
            setYtPlaying(playing);
            if (playing) {
              setYtDuration(playerRef.current?.getDuration() ?? 0);
              const q = playerRef.current?.getAvailableQualityLevels?.() ?? [];
              if (q.length) setQualities(q);
              setCurrentQuality(playerRef.current?.getPlaybackQuality() ?? 'auto');
            }
          },
          onPlaybackQualityChange: (e: any) => setCurrentQuality(e.data),
        },
      });
    });
  }, [isOpen, ytId]);

  /* ── YouTube progress ticker ── */
  useEffect(() => {
    if (!ytPlaying) { if (progressInterval.current) clearInterval(progressInterval.current); return; }
    progressInterval.current = setInterval(() => {
      setYtProgress(playerRef.current?.getCurrentTime() ?? 0);
    }, 500);
    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [ytPlaying]);

  /* ── Destroy player on close ── */
  useEffect(() => {
    if (!isOpen && playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
      setYtReady(false); setYtPlaying(false); setYtProgress(0);
      setQualities([]); setCurrentQuality('auto');
    }
  }, [isOpen]);

  /* ── Non-YT auto-play ── */
  useEffect(() => {
    if (isOpen && !ytId && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isOpen, ytId]);

  /* ── Non-YT progress ── */
  useEffect(() => {
    if (ytId) return;
    const v = videoRef.current; if (!v) return;
    const up = () => { setProgress(v.currentTime); setDuration(v.duration || 0); };
    v.addEventListener('timeupdate', up); v.addEventListener('loadedmetadata', up);
    return () => { v.removeEventListener('timeupdate', up); v.removeEventListener('loadedmetadata', up); };
  }, [isOpen, ytId]);

  /* ── YT controls ── */
  const ytTogglePlay = useCallback(() => {
    if (!playerRef.current) return;
    ytPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  }, [ytPlaying]);

  const ytToggleMute = useCallback(() => {
    if (!playerRef.current) return;
    const muted = playerRef.current.isMuted();
    muted ? playerRef.current.unMute() : playerRef.current.mute();
    setYtMuted(!muted);
  }, []);

  const ytSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !ytDuration) return;
    const r = e.currentTarget.getBoundingClientRect();
    playerRef.current.seekTo(((e.clientX - r.left) / r.width) * ytDuration, true);
  }, [ytDuration]);

  const ytSetQuality = useCallback((q: string) => {
    playerRef.current?.setPlaybackQuality(q as any);
    setCurrentQuality(q);
    setShowQualityMenu(false);
  }, []);

  /* ── Non-YT controls ── */
  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setIsMuted(videoRef.current.muted); }
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  }, []);

  /* ── Shared controls bar ── */
  const ControlsBar = ({ isYT }: { isYT: boolean }) => {
    const playing = isYT ? ytPlaying : isPlaying;
    const muted = isYT ? ytMuted : isMuted;
    const prog = isYT ? ytProgress : progress;
    const dur = isYT ? ytDuration : duration;

    return (
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(8,8,10,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Play/Pause */}
        <motion.button
          onClick={isYT ? ytTogglePlay : togglePlay}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        >
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5f5f7">
              <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5f5f7"><polygon points="6 3 20 12 6 21 6 3" /></svg>
          )}
        </motion.button>

        {/* Time */}
        <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#86868b' }}>{fmt(prog)}</span>

        {/* Seekbar */}
        <div
          className="flex-1 h-[3px] rounded-full cursor-pointer relative"
          style={{ background: 'rgba(255,255,255,0.1)' }}
          onClick={isYT ? ytSeek : seek}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: dur ? `${(prog / dur) * 100}%` : '0%', background: `linear-gradient(90deg, ${accent}, ${accent}99)` }}
          />
        </div>

        {/* Duration */}
        <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#86868b' }}>{fmt(dur)}</span>

        {/* Mute */}
        <motion.button
          onClick={isYT ? ytToggleMute : toggleMute}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        >
          {muted ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </motion.button>

        {/* Resolution picker — only for YouTube */}
        {isYT && (
          <div className="relative flex-shrink-0">
            <motion.button
              onClick={() => setShowQualityMenu(p => !p)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              {QUALITY_LABELS[currentQuality] ?? currentQuality}
            </motion.button>

            <AnimatePresence>
              {showQualityMenu && (
                <motion.div
                  className="absolute bottom-10 right-0 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(18,18,22,0.98)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                    minWidth: '110px',
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 6 }}
                  transition={{ duration: 0.15 }}
                >
                  {(qualities.length ? qualities : Object.keys(QUALITY_LABELS)).map((q) => (
                    <motion.button
                      key={q}
                      onClick={() => ytSetQuality(q)}
                      className="w-full flex items-center justify-between px-3 py-2 text-[12px] cursor-pointer"
                      style={{
                        color: currentQuality === q ? accent : '#aeaeb2',
                        background: currentQuality === q ? `${accent}15` : 'transparent',
                      }}
                      whileHover={{ background: `${accent}22`, color: '#f5f5f7' }}
                    >
                      <span>{QUALITY_LABELS[q] ?? q}</span>
                      {currentQuality === q && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowQualityMenu(false)}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />

          {/* Close */}
          <motion.button
            onClick={onClose}
            className="fixed top-4 right-4 md:top-6 md:right-6 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer z-[10020]"
            style={{ background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', color: '#f5f5f7' }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card */}
          <motion.div
            className="relative w-full z-10 overflow-y-auto"
            style={{
              maxWidth: '780px', maxHeight: '92vh', borderRadius: '24px',
              background: 'rgba(12,12,15,0.97)', backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)',
              border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 48px 100px rgba(0,0,0,0.7)',
            }}
            initial={{ opacity: 0, scale: 0.88, y: 48 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {/* Header Section */}
            <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1" style={{ color: accent }}>
                  {category}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {title}
                </h3>
              </div>
              {video && (
                <a
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f5f7' }}
                  title="Open video link"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </div>

            {/* Video section */}
            <div style={{ overflow: 'hidden' }}>
              <div className="relative" style={{ aspectRatio: '16/9', background: '#000' }}>
                {ytId ? (
                  /* YouTube — no-controls iframe */
                  <>
                    <div ref={containerRef} className="w-full h-full" />
                    
                    {/* YT loading spinner */}
                    {!ytReady && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#000' }}>
                        <motion.div
                          className="w-10 h-10 rounded-full border-2 border-t-transparent"
                          style={{ borderColor: `${accent}55`, borderTopColor: accent }}
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    )}
                  </>
                ) : isDriveUrl(video) ? (
                  /* Google Drive — full iframe embed */
                  <iframe
                    src={getDriveEmbedUrl(video)}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={title}
                  />
                ) : (
                  <CustomVideoPlayer
                    src={video}
                    autoPlay={true}
                    loop={true}
                    muted={false}
                    accent={accent}
                    title=""
                    category=""
                  />
                )}
              </div>

              {ytId && <ControlsBar isYT={true} />}
            </div>

            {/* Details panel */}
            <motion.div
              className="p-6 md:p-8 flex flex-col gap-6"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}
              style={{ background: 'rgba(0,0,0,0.1)' }}
            >
              <p className="text-sm md:text-[14.5px] leading-relaxed text-[#86868b]">{summary}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[12px]"><span style={{ color: 'rgba(255,255,255,0.3)' }}>Client:</span> <span className="font-semibold text-[#f5f5f7] ml-1">{client}</span></div>
                <div className="text-[12px]"><span style={{ color: 'rgba(255,255,255,0.3)' }}>Industry:</span> <span className="font-semibold text-[#f5f5f7] ml-1">{industry}</span></div>
                <div className="text-[12px] sm:col-span-2"><span style={{ color: 'rgba(255,255,255,0.3)' }}>Type:</span> <span className="font-semibold text-[#f5f5f7] ml-1">{type}</span></div>
              </div>

              {onShowGallery && (
                <div className="flex justify-end pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <motion.button
                    onClick={() => {
                      onClose();
                      onShowGallery();
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer relative group flex items-center gap-2"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#f5f5f7',
                    }}
                    whileHover={{
                      scale: 1.03,
                      background: 'rgba(255,255,255,0.09)',
                      borderColor: 'rgba(255,255,255,0.18)',
                      boxShadow: `0 4px 15px ${accent}15`,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Browse All Videos</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

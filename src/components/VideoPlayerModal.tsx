import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';

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

const isDriveUrl = (url: string) => url.includes('drive.google.com');

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
  onShowGallery?: () => void;
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

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function VideoPlayerModal(props: Props) {
  const { isOpen, onClose, video, title, category, accent, summary, client, industry, type, onShowGallery } = props;
  const ytId = getYouTubeId(video);
  const isLocal = !ytId && !isDriveUrl(video);

  /* ── YT state ── */
  const playerRef = useRef<any>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const [ytReady, setYtReady] = useState(false);
  const [ytPlaying, setYtPlaying] = useState(false);
  const [ytMuted, setYtMuted] = useState(false);
  const [ytProgress, setYtProgress] = useState(0);
  const [ytDuration, setYtDuration] = useState(0);
  const ytProgressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Local MP4 state ── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [centerFeedback, setCenterFeedback] = useState<'play' | 'pause' | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Controls auto-hide ── */
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, [resetControlsTimer]);

  /* ── Detect video orientation ── */
  const handleMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setIsPortrait(v.videoHeight > v.videoWidth);
    setDuration(v.duration || 0);
    setVideoLoaded(true);
  }, []);

  /* ── Video event listeners ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isLocal || !isOpen) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0 && v.duration) {
        setBuffered(v.buffered.end(v.buffered.length - 1));
      }
    };
    const onLoaded = () => { setDuration(v.duration || 0); setVideoLoaded(true); };

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoaded);

    // Auto-play when modal opens
    v.volume = volume;
    v.muted = isMuted;
    v.play().then(() => setIsPlaying(true)).catch(() => {
      v.muted = true;
      setIsMuted(true);
      setVolume(0);
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    });

    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [isOpen, isLocal, video]);

  /* ── Fullscreen sync ── */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  /* ── Reset on close ── */
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);
      setVideoLoaded(false);
      setIsPortrait(false);
      setShowControls(true);
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    }
  }, [isOpen]);

  /* ── YT player init ── */
  useEffect(() => {
    if (!isOpen || !ytId) return;
    loadYTApi(() => {
      if (!ytContainerRef.current) return;
      if (playerRef.current) { playerRef.current.loadVideoById(ytId); return; }
      playerRef.current = new window.YT.Player(ytContainerRef.current, {
        videoId: ytId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1 },
        events: {
          onReady: (e: any) => { setYtReady(true); setYtDuration(e.target.getDuration()); },
          onStateChange: (e: any) => {
            const playing = e.data === window.YT.PlayerState.PLAYING;
            setYtPlaying(playing);
            if (playing) setYtDuration(playerRef.current?.getDuration() ?? 0);
          },
        },
      });
    });
  }, [isOpen, ytId]);

  useEffect(() => {
    if (!ytPlaying) { if (ytProgressInterval.current) clearInterval(ytProgressInterval.current); return; }
    ytProgressInterval.current = setInterval(() => setYtProgress(playerRef.current?.getCurrentTime() ?? 0), 500);
    return () => { if (ytProgressInterval.current) clearInterval(ytProgressInterval.current); };
  }, [ytPlaying]);

  useEffect(() => {
    if (!isOpen && playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
      setYtReady(false); setYtPlaying(false); setYtProgress(0); setYtDuration(0);
    }
  }, [isOpen]);

  /* ── Local controls ── */
  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setCenterFeedback('play');
    } else {
      v.pause();
      setCenterFeedback('pause');
    }
    setTimeout(() => setCenterFeedback(null), 600);
    resetControlsTimer();
  }, [resetControlsTimer]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current; if (!v) return;
    if (isMuted) {
      const vol = prevVolume > 0 ? prevVolume : 0.8;
      v.muted = false; v.volume = vol;
      setIsMuted(false); setVolume(vol);
    } else {
      setPrevVolume(volume);
      v.muted = true;
      setIsMuted(true); setVolume(0);
    }
    resetControlsTimer();
  }, [isMuted, volume, prevVolume, resetControlsTimer]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const v = videoRef.current; if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val; setVolume(val);
    if (val > 0) { v.muted = false; setIsMuted(false); setPrevVolume(val); }
    else { v.muted = true; setIsMuted(true); }
    resetControlsTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * duration;
    resetControlsTimer();
  };

  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const el = playerContainerRef.current; if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
    resetControlsTimer();
  }, [resetControlsTimer]);

  /* ── YT controls ── */
  const ytTogglePlay = () => {
    if (!playerRef.current) return;
    ytPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };
  const ytToggleMute = () => {
    if (!playerRef.current) return;
    const m = playerRef.current.isMuted();
    m ? playerRef.current.unMute() : playerRef.current.mute();
    setYtMuted(!m);
  };
  const ytSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !ytDuration) return;
    const r = e.currentTarget.getBoundingClientRect();
    playerRef.current.seekTo(((e.clientX - r.left) / r.width) * ytDuration, true);
  };

  /* ── Controls bar (shared for YT) ── */
  const YTControlsBar = () => (
    <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(8,8,10,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.button onClick={ytTogglePlay} aria-label={ytPlaying ? 'Pause' : 'Play'}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        {ytPlaying
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5f5f7"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          : <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5f5f7"><polygon points="6 3 20 12 6 21 6 3" /></svg>}
      </motion.button>
      <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#86868b' }}>{fmt(ytProgress)}</span>
      <div className="flex-1 h-[3px] rounded-full cursor-pointer relative" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={ytSeek}>
        <div className="h-full rounded-full" style={{ width: ytDuration ? `${(ytProgress / ytDuration) * 100}%` : '0%', background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />
      </div>
      <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#86868b' }}>{fmt(ytDuration)}</span>
      <motion.button onClick={ytToggleMute} aria-label={ytMuted ? 'Unmute' : 'Mute'}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        {ytMuted
          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>}
      </motion.button>
    </div>
  );

  /* ── Close on Escape ── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* ── Modal width: narrow for portrait, normal for landscape ── */
  const modalMaxWidth = isPortrait ? '420px' : '820px';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6"
          role="dialog" aria-modal="true" aria-label={title || 'Video player'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />

          {/* Close button */}
          <motion.button onClick={onClose} aria-label="Close video"
            className="fixed top-4 right-4 md:top-6 md:right-6 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer z-[10020]"
            style={{ background: 'rgba(30,30,36,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', color: '#f5f5f7' }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card — width adapts to portrait/landscape */}
          <motion.div
            className="relative w-full z-10 overflow-y-auto"
            style={{
              maxWidth: modalMaxWidth,
              maxHeight: '92vh',
              borderRadius: '20px',
              background: 'rgba(12,12,15,0.97)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.75)',
              transition: 'max-width 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
            initial={{ opacity: 0, scale: 0.88, y: 48 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-0.5" style={{ color: accent }}>{category}</span>
              <h3 className="text-base md:text-lg font-bold text-white tracking-tight">{title}</h3>
            </div>

            {/* ── Video section ── */}
            <div style={{ overflow: 'hidden', background: '#000' }}>

              {/* ── YouTube ── */}
              {ytId && (
                <>
                  <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                    <div ref={ytContainerRef} className="w-full h-full" />
                    {!ytReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <motion.div className="w-10 h-10 rounded-full border-2 border-t-transparent"
                          style={{ borderColor: `${accent}55`, borderTopColor: accent }}
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      </div>
                    )}
                  </div>
                  <YTControlsBar />
                </>
              )}

              {/* ── Google Drive ── */}
              {!ytId && isDriveUrl(video) && (
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe src={getDriveEmbedUrl(video)} className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }} allow="autoplay; encrypted-media" allowFullScreen title={title} />
                </div>
              )}

              {/* ── Local MP4 with full custom controls ── */}
              {isLocal && (
                <div
                  ref={playerContainerRef}
                  className="relative w-full select-none"
                  style={{
                    background: '#000',
                    cursor: showControls ? 'default' : 'none',
                  }}
                  onMouseMove={resetControlsTimer}
                  onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
                >
                  {/* Video element — object-contain respects portrait ratios */}
                  <video
                    ref={videoRef}
                    src={video}
                    loop
                    playsInline
                    muted={isMuted}
                    onClick={togglePlay}
                    onLoadedMetadata={handleMetadata}
                    className="w-full"
                    style={{
                      display: 'block',
                      maxHeight: isFullscreen ? '100vh' : '72vh',
                      objectFit: 'contain',
                      background: '#000',
                    }}
                  />

                  {/* Loading spinner */}
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <motion.div className="w-10 h-10 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: `${accent}55`, borderTopColor: accent }}
                        animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    </div>
                  )}

                  {/* Center play/pause feedback */}
                  <AnimatePresence>
                    {centerFeedback && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0, scale: 1.4 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.25)' }}>
                          {centerFeedback === 'play'
                            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" className="ml-1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            : <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Controls overlay */}
                  <AnimatePresence>
                    {showControls && videoLoaded && (
                      <motion.div
                        className="absolute inset-x-0 bottom-0 flex flex-col justify-end"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 pt-8 flex flex-col gap-3">

                          {/* Seek bar */}
                          <div className="group/seek relative w-full h-[5px] rounded-full cursor-pointer flex items-center"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                            onClick={handleSeek}
                            onMouseMove={(e) => { if (e.buttons === 1) handleSeek(e); }}
                          >
                            {/* Buffered */}
                            <div className="absolute h-full rounded-full bg-white/25 transition-all duration-300"
                              style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }} />
                            {/* Played */}
                            <div className="absolute h-full rounded-full transition-all duration-75"
                              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }} />
                            {/* Knob */}
                            <div className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                              style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%`, transform: 'translateX(-50%)', boxShadow: `0 0 8px ${accent}80` }} />
                          </div>

                          {/* Bottom row */}
                          <div className="flex items-center justify-between gap-3">

                            {/* Left: play, time, volume */}
                            <div className="flex items-center gap-3">
                              {/* Play/Pause */}
                              <motion.button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
                                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.9 }}>
                                {isPlaying
                                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><polygon points="6 3 20 12 6 21 6 3" /></svg>}
                              </motion.button>

                              {/* Time */}
                              <span className="text-[10px] font-mono text-white/60 tracking-wider whitespace-nowrap">
                                {fmt(currentTime)} / {fmt(duration)}
                              </span>

                              {/* Volume */}
                              <div className="flex items-center gap-2 group/vol">
                                <motion.button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
                                  style={{ background: 'rgba(255,255,255,0.08)' }}
                                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  {isMuted
                                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                                    : volume > 0.5
                                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                                  }
                                </motion.button>
                                {/* Volume slider — expands on hover */}
                                <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 ease-out">
                                  <input type="range" min="0" max="1" step="0.02" value={volume}
                                    onChange={handleVolumeChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full h-[3px] rounded-lg cursor-pointer"
                                    style={{ accentColor: accent, outline: 'none' }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right: fullscreen */}
                            <motion.button onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.16)' }} whileTap={{ scale: 0.9 }}>
                              {isFullscreen
                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" /></svg>
                                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Details */}
            <motion.div className="p-5 md:p-6 flex flex-col gap-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
              style={{ background: 'rgba(0,0,0,0.1)' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#86868b' }}>{summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[12px]"><span style={{ color: 'rgba(255,255,255,0.3)' }}>Client:</span> <span className="font-semibold text-[#f5f5f7] ml-1">{client}</span></div>
                <div className="text-[12px]"><span style={{ color: 'rgba(255,255,255,0.3)' }}>Industry:</span> <span className="font-semibold text-[#f5f5f7] ml-1">{industry}</span></div>
                <div className="text-[12px] sm:col-span-2"><span style={{ color: 'rgba(255,255,255,0.3)' }}>Type:</span> <span className="font-semibold text-[#f5f5f7] ml-1">{type}</span></div>
              </div>
              {onShowGallery && (
                <div className="flex justify-end pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <motion.button onClick={() => { onClose(); onShowGallery(); }}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 group/btn"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f5f7' }}
                    whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.18)', boxShadow: `0 4px 15px ${accent}15` }}
                    whileTap={{ scale: 0.98 }}>
                    <span>Browse All Videos</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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

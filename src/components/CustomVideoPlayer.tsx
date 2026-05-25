import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlobUrl } from './utils/videoUtils';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  accent?: string;
  title?: string;
  category?: string;
}

export default function CustomVideoPlayer({
  src,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  accent = '#8b5cf6',
  title = '',
  category = '',
}: CustomVideoPlayerProps) {
  const { blobUrl, isLoading: isBlobLoading } = useBlobUrl(src);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Player States */
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isSimulatingQuality, setIsSimulatingQuality] = useState(false);
  const [showCenterFeedback, setShowCenterFeedback] = useState<'play' | 'pause' | null>(null);

  /* Controls hide timer */
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Helper to format time */
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  /* Show controls and start hide timer */
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Only hide controls if the video is playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowQualityMenu(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  /* Track Mouse Movement to show/hide controls */
  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  /* Play / Pause */
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setShowCenterFeedback('play');
        setTimeout(() => setShowCenterFeedback(null), 500);
      }).catch((e) => {
        console.error("Autoplay/play failed: ", e);
      });
    } else {
      video.pause();
      setIsPlaying(false);
      setShowCenterFeedback('pause');
      setTimeout(() => setShowCenterFeedback(null), 500);
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  /* Mute / Unmute */
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      // Restore previous volume if it was positive, else default to 0.8
      const targetVol = prevVolume > 0 ? prevVolume : 0.8;
      video.volume = targetVol;
      setVolume(targetVol);
    } else {
      setPrevVolume(volume);
      video.muted = true;
      setIsMuted(true);
      setVolume(0);
    }
    resetControlsTimeout();
  }, [isMuted, volume, prevVolume, resetControlsTimeout]);

  /* Volume Change */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const val = parseFloat(e.target.value);
    setVolume(val);
    video.volume = val;
    if (val > 0) {
      video.muted = false;
      setIsMuted(false);
      setPrevVolume(val);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  /* Seek Bar Interaction */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  /* Drag seek support */
  const handleSeekDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only trigger if primary mouse button is held down
    handleSeek(e);
  };

  /* Fullscreen Toggle */
  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error attempting to enable fullscreen: ", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  /* Fullscreen change listener to sync browser-triggered fullscreen (e.g. Esc key) */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /* Quality Selector interaction - with premium simulation */
  const handleQualityChange = (quality: string) => {
    if (quality === currentQuality) {
      setShowQualityMenu(false);
      return;
    }

    setShowQualityMenu(false);
    setIsSimulatingQuality(true);
    const video = videoRef.current;
    const wasPlaying = isPlaying;

    if (video) {
      video.pause();
    }

    // Simulate switching buffer/resolution (adds extreme high fidelity to the portfolio)
    setTimeout(() => {
      setIsSimulatingQuality(false);
      setCurrentQuality(quality);
      if (video && wasPlaying) {
        video.play().catch(() => {});
      }
    }, 600);
  };

  /* Video Events Listeners */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !blobUrl) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Calculate buffered progress
      if (video.buffered.length > 0 && video.duration) {
        const lastBuffered = video.buffered.end(video.buffered.length - 1);
        setBuffered(lastBuffered);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    // Automatically trigger initial metadata state
    if (video.readyState >= 1) {
      setDuration(video.duration);
    }

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    /* Attempt autoplay if configured */
    if (autoPlay) {
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay blocked by browser. Muting to autoplay.", err);
          video.muted = true;
          setIsMuted(true);
          setVolume(0);
          video.play().then(() => {
            setIsPlaying(true);
          }).catch((e) => console.log("Muted autoplay also blocked.", e));
        });
    }

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [blobUrl, autoPlay]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
          setShowQualityMenu(false);
        }
      }}
      className={`relative w-full h-full bg-black overflow-hidden select-none group ${
        isFullscreen ? 'rounded-0' : 'rounded-2xl'
      } ${isPlaying && !showControls ? 'cursor-none' : 'cursor-default'}`}
      style={{
        border: isFullscreen ? 'none' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isFullscreen ? 'none' : '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      {/* The HTML5 Video Element */}
      <video
        ref={videoRef}
        src={blobUrl || undefined}
        poster={poster}
        loop={loop}
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        className="w-full h-full object-cover"
        style={{ cursor: 'pointer' }}
      />

      {/* Screen Title Overlay (Top Left) */}
      <AnimatePresence>
        {showControls && (title || category) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-5 left-5 pointer-events-none z-20"
          >
            {category && (
              <span 
                className="text-[9px] font-bold tracking-[0.2em] uppercase block mb-0.5" 
                style={{ color: accent }}
              >
                {category}
              </span>
            )}
            {title && (
              <h4 className="text-sm font-semibold text-white/90 drop-shadow-md">
                {title}
              </h4>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play/Pause Click Feedback Icon */}
      <AnimatePresence>
        {showCenterFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20">
              {showCenterFeedback === 'play' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" className="ml-1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Switch Spinner overlay */}
      <AnimatePresence>
        {isSimulatingQuality && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-30 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-t-transparent"
                style={{ borderColor: `${accent}40`, borderTopColor: accent }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              <span className="text-xs font-medium text-white/70 tracking-wider">
                Loading {currentQuality}...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blob fetching loader */}
      <AnimatePresence>
        {isBlobLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[4px] z-30 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-t-transparent"
                style={{ borderColor: `${accent}40`, borderTopColor: accent }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              <span className="text-xs font-medium text-white/80 tracking-widest uppercase text-center max-w-[200px] leading-relaxed">
                Streaming from cloud...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay container */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-black/30 z-20"
          >
            {/* Seekbar and Controls Bar */}
            <div className="p-4 flex flex-col gap-3">
              
              {/* Progress Bar / Seekbar */}
              <div className="group/seekbar relative w-full h-[5px] rounded-full bg-white/10 cursor-pointer flex items-center"
                   onClick={handleSeek}
                   onMouseMove={handleSeekDrag}
              >
                {/* Buffered range */}
                <div 
                  className="absolute h-full rounded-full bg-white/20 transition-all duration-300"
                  style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }}
                />
                
                {/* Active played progress */}
                <div 
                  className="absolute h-full rounded-full transition-all duration-75"
                  style={{ 
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    background: `linear-gradient(90deg, ${accent}, ${accent}dd)` 
                  }}
                />
                
                {/* Glowing seek knob (only visible on seekbar hover) */}
                <div 
                  className="absolute w-3.5 h-3.5 rounded-full border border-white bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 group-hover/seekbar:opacity-100 transition-opacity duration-150 pointer-events-none"
                  style={{ 
                    left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>

              {/* Bottom controls buttons */}
              <div className="flex items-center justify-between">
                
                {/* Left Controls (Play, Time, Volume) */}
                <div className="flex items-center gap-4">
                  {/* Play / Pause Toggle */}
                  <motion.button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    )}
                  </motion.button>

                  {/* Time indicator */}
                  <div className="text-[11px] font-mono text-white/60 tracking-wider">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* Mute and Volume slider */}
                  <div className="flex items-center group/volume gap-2">
                    <motion.button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isMuted ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : volume > 0.5 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </motion.button>
                    
                    {/* Expandable Volume Slider */}
                    <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 ease-out flex items-center h-full">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full accent-white h-[3px] bg-white/20 rounded-lg cursor-pointer"
                        style={{ outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Controls (Quality, Fullscreen) */}
                <div className="flex items-center gap-3">
                  
                  {/* Quality Selector */}
                  <div className="relative">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQualityMenu(!showQualityMenu);
                      }}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider hover:bg-white/10 text-white/80 border border-white/10 flex items-center gap-1 cursor-pointer"
                      whileHover={{ scale: 1.05, color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                      {currentQuality}
                    </motion.button>

                    <AnimatePresence>
                      {showQualityMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute bottom-10 right-0 py-1.5 w-24 rounded-lg overflow-hidden border border-white/10 z-40 bg-black/95 backdrop-blur-md shadow-2xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {['Auto', '1080p', '720p', '480p'].map((q) => (
                            <button
                              key={q}
                              onClick={() => handleQualityChange(q)}
                              className="w-full text-left px-3 py-1.5 text-[10px] font-bold tracking-wider transition-colors duration-150 hover:bg-white/10 cursor-pointer"
                              style={{ color: currentQuality === q ? accent : '#a1a1aa' }}
                            >
                              {q}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fullscreen Toggle */}
                  <motion.button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFullscreen ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    )}
                  </motion.button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

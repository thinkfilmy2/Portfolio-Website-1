import { useState, useRef, useCallback } from 'react';
import { adminApi } from '../api';

interface ThumbnailPickerProps {
  value: string;           // current thumbnail URL/path
  videoUrl: string;        // project video URL for frame capture
  accent: string;          // accent color for styling
  onChange: (url: string) => void;
}

/* ── Google Drive helpers ── */
function isDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}

function getDriveThumbnailUrl(url: string): string {
  const match = url.match(/(?:\/file\/d\/|\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  }
  return url;
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)/.test(url);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

type TabMode = 'frame' | 'upload' | 'drive';

export default function ThumbnailPicker({ value, videoUrl, accent, onChange }: ThumbnailPickerProps) {
  const [activeTab, setActiveTab] = useState<TabMode>(value ? 'upload' : 'frame');
  const [driveInput, setDriveInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Frame capture state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [, setFramePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isYT = isYouTubeUrl(videoUrl);
  // Drive files have downloads disabled, so they can't be loaded into a <video> for capture.
  const isDrive = isDriveUrl(videoUrl);

  /* ── Frame capture logic ── */
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoReady(true);
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setCapturing(true);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setFramePreview(dataUrl);
      onChange(dataUrl);
    }
    setCapturing(false);
  }, [onChange]);

  const skipFrames = useCallback((delta: number) => {
    if (videoRef.current) {
      // ~30fps = 0.033s per frame
      const newTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + delta * 0.033));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  /* ── File upload ── */
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const result = await adminApi.upload(file);
      onChange(result.path);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  /* ── Google Drive link ── */
  const handleDriveLinkApply = useCallback(() => {
    if (!driveInput.trim()) {
      setError('Please enter a Google Drive link');
      return;
    }
    setError('');
    // Extract thumbnail from Drive link
    if (isDriveUrl(driveInput)) {
      onChange(getDriveThumbnailUrl(driveInput));
    } else {
      // Treat as direct image URL
      onChange(driveInput.trim());
    }
    setDriveInput('');
  }, [driveInput, onChange]);

  /* ── Remove thumbnail ── */
  const handleRemove = useCallback(() => {
    onChange('');
    setFramePreview(null);
    setDriveInput('');
  }, [onChange]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const tabs: { key: TabMode; label: string; icon: JSX.Element }[] = [
    {
      key: 'frame', label: 'Capture Frame',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M2 12h3M19 12h3M12 2v3M12 19v3"/>
        </svg>
      ),
    },
    {
      key: 'upload', label: 'Upload Image',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      ),
    },
    {
      key: 'drive', label: 'Drive Link',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12.5V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h8"/>
          <path d="M18 14l3 3-3 3"/>
          <path d="M14 20h4"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-form-group">
      <label className="admin-label">Thumbnail</label>

      {/* Current thumbnail preview */}
      {value && (
        <div className="thumb-picker-preview">
          <img
            src={value}
            alt="Thumbnail preview"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="thumb-picker-preview-actions">
            <button
              className="admin-btn admin-btn-sm admin-btn-danger"
              onClick={handleRemove}
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="thumb-picker-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            className={`thumb-picker-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => { setActiveTab(t.key); setError(''); }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="thumb-picker-content">
        {/* ── Frame Capture ── */}
        {activeTab === 'frame' && (
          <div className="thumb-picker-frame">
            {isYT ? (
              <div className="thumb-picker-yt-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <strong>YouTube videos</strong> don't support frame capture due to cross-origin restrictions.
                  Use the YouTube thumbnail instead:
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    style={{ marginTop: 8, display: 'block' }}
                    onClick={() => {
                      const ytId = getYouTubeId(videoUrl);
                      if (ytId) onChange(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
                    }}
                  >
                    Use YouTube Thumbnail
                  </button>
                </div>
              </div>
            ) : isDrive ? (
              <div className="thumb-picker-yt-notice">
                <div>
                  <strong>Google Drive videos</strong> can't be frame-captured (downloads are disabled).
                  Upload an image, or try Drive's own thumbnail:
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    style={{ marginTop: 8, display: 'block' }}
                    onClick={() => onChange(getDriveThumbnailUrl(videoUrl))}
                  >
                    Use Drive Thumbnail
                  </button>
                </div>
              </div>
            ) : !videoUrl ? (
              <div className="thumb-picker-empty">
                Enter a video URL first, then you can capture a frame.
              </div>
            ) : (
              <>
                <div className="thumb-picker-video-container">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    crossOrigin="anonymous"
                    preload="auto"
                    muted
                    playsInline
                    onLoadedMetadata={handleVideoLoaded}
                    onTimeUpdate={handleTimeUpdate}
                    onError={() => setError('Could not load video. Try uploading a thumbnail instead.')}
                  />
                  {!videoReady && (
                    <div className="thumb-picker-video-loading">
                      <div className="thumb-picker-spinner" />
                      <span>Loading video...</span>
                    </div>
                  )}
                </div>

                {videoReady && (
                  <>
                    {/* Timeline scrubber */}
                    <div className="thumb-picker-scrubber">
                      <span className="thumb-picker-time">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.033}
                        value={currentTime}
                        onChange={handleSeek}
                        className="thumb-picker-range"
                        style={{ '--accent': accent } as React.CSSProperties}
                      />
                      <span className="thumb-picker-time">{formatTime(duration)}</span>
                    </div>

                    {/* Frame navigation */}
                    <div className="thumb-picker-frame-controls">
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => skipFrames(-10)} title="Back 10 frames">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
                      </button>
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => skipFrames(-1)} title="Back 1 frame">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-primary"
                        onClick={captureFrame}
                        disabled={capturing}
                        style={{ padding: '6px 16px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        {capturing ? 'Capturing...' : 'Capture Frame'}
                      </button>
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => skipFrames(1)} title="Forward 1 frame">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => skipFrames(10)} title="Forward 10 frames">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                      </button>
                    </div>
                  </>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            )}
          </div>
        )}

        {/* ── Upload ── */}
        {activeTab === 'upload' && (
          <div>
            <div
              className={`thumb-picker-dropzone${uploading ? ' uploading' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {uploading ? (
                <>
                  <div className="thumb-picker-spinner" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span><strong>Click to browse</strong> or drag & drop</span>
                  <span className="thumb-picker-dropzone-hint">JPG, PNG, WebP up to 10MB</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = '';
              }}
            />
          </div>
        )}

        {/* ── Drive Link ── */}
        {activeTab === 'drive' && (
          <div>
            <div className="thumb-picker-drive">
              <div className="thumb-picker-drive-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.71 3.5L1.15 15l4.58 7.5h13.09l4.58-7.5L17.14 3.5H7.71zm.52 1h8.09l5.73 10h-8.88L7.44 4.5h.79zm-.51.87L13.38 14.5H4.5l5.72-9.63v.5zm6.92 10.13h8.36l-3.86 6.5H10.31l3.33-5.5h1z"/>
                </svg>
              </div>
              <input
                className="admin-input"
                value={driveInput}
                onChange={e => setDriveInput(e.target.value)}
                placeholder="Paste Google Drive image link or any image URL"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleDriveLinkApply(); } }}
              />
              <button
                type="button"
                className="admin-btn admin-btn-sm admin-btn-primary"
                onClick={handleDriveLinkApply}
                style={{ flexShrink: 0 }}
              >
                Apply
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '8px 0 0', lineHeight: 1.5 }}>
              Supports Google Drive share links, direct image URLs, or any publicly accessible image.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="thumb-picker-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

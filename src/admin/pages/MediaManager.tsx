import { useState, useRef, useEffect } from 'react';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface UploadedFile {
  filename: string;
  path: string;
  size: number;
  modified: string;
}

export default function MediaManager() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const data = await adminApi.getUploads();
      setFiles(data);
    } catch {
      // Backend may not be running
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await adminApi.upload(file);
      }
      setToast({ msg: `${fileList.length} file(s) uploaded!`, type: 'success' });
      fetchFiles();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    try {
      await adminApi.deleteUpload(filename);
      setToast({ msg: 'File deleted', type: 'success' });
      fetchFiles();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    }
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setToast({ msg: 'Path copied!', type: 'success' });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Media Manager</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            {files.length} uploaded files
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading...' : '+ Upload Files'}
        </button>
        <input ref={inputRef} type="file" multiple hidden
          accept="image/*,video/*"
          onChange={e => handleUpload(e.target.files)} />
      </div>

      {/* Drop Zone */}
      <div
        className={`admin-upload-zone ${dragging ? 'dragging' : ''}`}
        style={{ marginBottom: 24 }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 16V4m0 0L8 8m4-4l4 4M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Drag &amp; drop files here, or <span>click to browse</span></p>
        <p style={{ fontSize: 11, marginTop: 6, color: 'rgba(255,255,255,0.25)' }}>
          Supports: JPG, PNG, WebP, SVG, GIF, MP4, WebM, MOV (max 50MB)
        </p>
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <div className="admin-empty">
          <p>No uploaded files yet. Upload some images or videos to get started.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {files.map(file => (
            <div key={file.filename} className="admin-media-item">
              {file.filename.match(/\.(mp4|webm|mov)$/i) ? (
                <div style={{
                  width: '100%', height: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: 32,
                }}>
                  🎬
                </div>
              ) : (
                <img src={`http://localhost:3001${file.path}`} alt={file.filename} loading="lazy" />
              )}
              <div className="admin-media-item-overlay">
                <div style={{ width: '100%' }}>
                  <div className="admin-media-item-name">{file.filename}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    {formatSize(file.size)}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button className="admin-btn admin-btn-sm admin-btn-secondary"
                      style={{ padding: '3px 8px', fontSize: 10 }}
                      onClick={(e) => { e.stopPropagation(); copyPath(file.path); }}>
                      Copy Path
                    </button>
                    <button className="admin-btn admin-btn-sm admin-btn-danger"
                      style={{ padding: '3px 8px', fontSize: 10 }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(file.filename); }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

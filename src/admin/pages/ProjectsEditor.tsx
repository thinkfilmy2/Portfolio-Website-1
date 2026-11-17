import { useState, useRef, useCallback } from 'react';
import type { Project } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';
import ThumbnailPicker from '../components/ThumbnailPicker';

interface ProjectsEditorProps {
  motion: Project[];
  editing: Project[];
  ai: Project[];
  onSave: () => void;
}

function genId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

const emptyProject: Project = {
  id: '', title: '', category: '', video: '', accent: '#8b5cf6',
  summary: '', team: 'Upananda', client: '', industry: '', type: '',
  thumbnail: '',
};

export default function ProjectsEditor({ motion: motionProp, editing: editingProp, ai: aiProp, onSave }: ProjectsEditorProps) {
  const [tab, setTab] = useState<'motion' | 'editing' | 'ai'>('motion');
  const [motionList, setMotionList] = useState<Project[]>([...motionProp]);
  const [editingList, setEditingList] = useState<Project[]>([...editingProp]);
  const [aiList, setAiList] = useState<Project[]>([...aiProp]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Drag-and-drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const lists = { motion: motionList, editing: editingList, ai: aiList };
  const setters = { motion: setMotionList, editing: setEditingList, ai: setAiList };
  const currentList = lists[tab];
  const setCurrentList = setters[tab];

  const handleAdd = () => {
    setEditingProject({ ...emptyProject, id: genId() });
    setIsNew(true);
  };

  const handleEdit = (p: Project) => {
    setEditingProject({ ...p });
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this project?')) return;
    setCurrentList(currentList.filter(p => p.id !== id));
  };

  const handleModalSave = () => {
    if (!editingProject) return;
    if (isNew) {
      setCurrentList([...currentList, editingProject]);
    } else {
      setCurrentList(currentList.map(p => p.id === editingProject.id ? editingProject : p));
    }
    setEditingProject(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('projects', { motion: motionList, editing: editingList, ai: aiList });
      setToast({ msg: 'Projects saved! Order updated.', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  /* ── Reorder helpers ── */
  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newList = [...currentList];
    const [moved] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, moved);
    setCurrentList(newList);
  }, [currentList, setCurrentList]);

  const moveUp = (index: number) => {
    if (index > 0) moveItem(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index < currentList.length - 1) moveItem(index, index + 1);
  };

  const moveToTop = (index: number) => {
    if (index > 0) moveItem(index, 0);
  };

  const moveToBottom = (index: number) => {
    if (index < currentList.length - 1) moveItem(index, currentList.length - 1);
  };

  /* ── Drag handlers ── */
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag ghost slightly transparent
    requestAnimationFrame(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = '0.4';
      }
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '1';
    }
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      moveItem(dragIndex, dragOverIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if we've left the item entirely
    const relatedTarget = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(relatedTarget)) {
      // Don't clear dragOverIndex here to avoid flickering
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Projects</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            {motionList.length} motion · {editingList.length} editing · {aiList.length} AI projects
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={handleAdd}>+ Add Project</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Reorder hint */}
      <div className="admin-reorder-hint">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l4 4H8l4-4z"/>
          <path d="M12 22l-4-4h8l-4 4z"/>
          <line x1="12" y1="6" x2="12" y2="18"/>
        </svg>
        <span>Drag & drop or use arrow buttons to reorder projects. Click <strong>Save All</strong> to persist changes.</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {(['motion', 'editing', 'ai'] as const).map(t => (
          <button
            key={t}
            className={`admin-btn admin-btn-sm ${tab === t ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t === 'ai' ? 'AI' : t} ({lists[t].length})
          </button>
        ))}
      </div>

      {/* Project List */}
      <div className="admin-item-list">
        {currentList.length === 0 && (
          <div className="admin-empty">
            <p>No {tab === 'ai' ? 'AI' : tab} projects yet. Click "Add Project" to create one.</p>
          </div>
        )}
        {currentList.map((p, index) => (
          <div
            key={p.id}
            className={`admin-item admin-item-draggable${dragIndex === index ? ' admin-item-dragging' : ''}${dragOverIndex === index ? ' admin-item-dragover' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
          >
            {/* Drag handle */}
            <div className="admin-drag-handle" title="Drag to reorder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="5" r="1.5"/>
                <circle cx="15" cy="5" r="1.5"/>
                <circle cx="9" cy="12" r="1.5"/>
                <circle cx="15" cy="12" r="1.5"/>
                <circle cx="9" cy="19" r="1.5"/>
                <circle cx="15" cy="19" r="1.5"/>
              </svg>
            </div>

            {/* Position badge */}
            <div className="admin-position-badge" title={`Position ${index + 1}`}>
              {index + 1}
            </div>

            <div
              className="admin-color-swatch"
              style={{ background: p.accent }}
            />
            <div className="admin-item-content">
              <div className="admin-item-title">{p.title || 'Untitled'}</div>
              <div className="admin-item-subtitle">{p.category} · {p.client}</div>
            </div>

            {/* Reorder buttons */}
            <div className="admin-reorder-controls">
              <button
                className="admin-reorder-btn"
                onClick={() => moveToTop(index)}
                disabled={index === 0}
                title="Move to top"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="4" x2="19" y2="4"/>
                  <polyline points="8 13 12 9 16 13"/>
                  <line x1="12" y1="9" x2="12" y2="20"/>
                </svg>
              </button>
              <button
                className="admin-reorder-btn"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                title="Move up"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </button>
              <button
                className="admin-reorder-btn"
                onClick={() => moveDown(index)}
                disabled={index === currentList.length - 1}
                title="Move down"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <button
                className="admin-reorder-btn"
                onClick={() => moveToBottom(index)}
                disabled={index === currentList.length - 1}
                title="Move to bottom"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8 11 12 15 16 11"/>
                  <line x1="12" y1="15" x2="12" y2="4"/>
                  <line x1="5" y1="20" x2="19" y2="20"/>
                </svg>
              </button>
            </div>

            <div className="admin-item-actions">
              <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProject(null)}>
          <div className="admin-modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
            <h2>{isNew ? 'Add Project' : 'Edit Project'}</h2>
            <p>Fill in the project details below.</p>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Title</label>
                <input className="admin-input" value={editingProject.title}
                  onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <input className="admin-input" value={editingProject.category}
                  onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Video URL</label>
              <input className="admin-input" value={editingProject.video}
                onChange={e => setEditingProject({ ...editingProject, video: e.target.value })}
                placeholder="Google Drive embed URL or direct video URL" />
            </div>

            <ThumbnailPicker
              value={editingProject.thumbnail || ''}
              videoUrl={editingProject.video}
              accent={editingProject.accent}
              onChange={(url) => setEditingProject({ ...editingProject, thumbnail: url })}
            />

            <div className="admin-form-group">
              <label className="admin-label">Summary</label>
              <textarea className="admin-textarea" value={editingProject.summary}
                onChange={e => setEditingProject({ ...editingProject, summary: e.target.value })} rows={3} />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Client</label>
                <input className="admin-input" value={editingProject.client}
                  onChange={e => setEditingProject({ ...editingProject, client: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Industry</label>
                <input className="admin-input" value={editingProject.industry}
                  onChange={e => setEditingProject({ ...editingProject, industry: e.target.value })} />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Team</label>
                <input className="admin-input" value={editingProject.team}
                  onChange={e => setEditingProject({ ...editingProject, team: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Type</label>
                <input className="admin-input" value={editingProject.type}
                  onChange={e => setEditingProject({ ...editingProject, type: e.target.value })} />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Accent Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="admin-color-swatch" style={{ background: editingProject.accent }}>
                  <input type="color" className="admin-color-input"
                    value={editingProject.accent}
                    onChange={e => setEditingProject({ ...editingProject, accent: e.target.value })} />
                </div>
                <input className="admin-input" style={{ width: 120 }}
                  value={editingProject.accent}
                  onChange={e => setEditingProject({ ...editingProject, accent: e.target.value })} />
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingProject(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleModalSave}>
                {isNew ? 'Add Project' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

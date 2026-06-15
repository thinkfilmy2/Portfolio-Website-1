import { useState } from 'react';
import type { Project } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface ProjectsEditorProps {
  motion: Project[];
  editing: Project[];
  onSave: () => void;
}

function genId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

const emptyProject: Project = {
  id: '', title: '', category: '', video: '', accent: '#8b5cf6',
  summary: '', team: 'Upananda', client: '', industry: '', type: '',
};

export default function ProjectsEditor({ motion, editing, onSave }: ProjectsEditorProps) {
  const [tab, setTab] = useState<'motion' | 'editing'>('motion');
  const [motionList, setMotionList] = useState<Project[]>([...motion]);
  const [editingList, setEditingList] = useState<Project[]>([...editing]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const currentList = tab === 'motion' ? motionList : editingList;
  const setCurrentList = tab === 'motion' ? setMotionList : setEditingList;

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
      await adminApi.updateSection('projects', { motion: motionList, editing: editingList });
      setToast({ msg: 'Projects saved!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Projects</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            {motionList.length} motion · {editingList.length} editing projects
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={handleAdd}>+ Add Project</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {(['motion', 'editing'] as const).map(t => (
          <button
            key={t}
            className={`admin-btn admin-btn-sm ${tab === t ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t} ({t === 'motion' ? motionList.length : editingList.length})
          </button>
        ))}
      </div>

      {/* Project List */}
      <div className="admin-item-list">
        {currentList.length === 0 && (
          <div className="admin-empty">
            <p>No {tab} projects yet. Click "Add Project" to create one.</p>
          </div>
        )}
        {currentList.map(p => (
          <div key={p.id} className="admin-item">
            <div
              className="admin-color-swatch"
              style={{ background: p.accent }}
            />
            <div className="admin-item-content">
              <div className="admin-item-title">{p.title || 'Untitled'}</div>
              <div className="admin-item-subtitle">{p.category} · {p.client}</div>
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

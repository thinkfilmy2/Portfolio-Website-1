import { useState } from 'react';
import type { Service } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

const ICON_OPTIONS = [
  'Box', 'Film', 'Sparkles', 'Headphones', 'Clapperboard',
  'MousePointer2', 'Compass', 'Palette', 'Pointer', 'Cuboid',
  'Fingerprint', 'Zap', 'Camera', 'Music', 'Pen', 'Globe',
  'Layers', 'Monitor', 'Smartphone', 'Star',
];

interface ServicesEditorProps {
  data: Service[];
  onSave: () => void;
}

function genId() {
  return 's_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

const emptyService: Service = {
  id: '', icon: 'Box', title: '', description: '', accent: '#8b5cf6',
};

export default function ServicesEditor({ data, onSave }: ServicesEditorProps) {
  const [services, setServices] = useState<Service[]>([...data]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = () => {
    setEditingService({ ...emptyService, id: genId() });
    setIsNew(true);
  };

  const handleEdit = (s: Service) => {
    setEditingService({ ...s });
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this service?')) return;
    setServices(services.filter(s => s.id !== id));
  };

  const handleModalSave = () => {
    if (!editingService) return;
    if (isNew) {
      setServices([...services, editingService]);
    } else {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
    }
    setEditingService(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('services', services);
      setToast({ msg: 'Services saved!', type: 'success' });
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
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Services & Skills</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>{services.length} services</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={handleAdd}>+ Add Service</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="admin-item-list">
        {services.map(s => (
          <div key={s.id} className="admin-item">
            <div className="admin-color-swatch" style={{ background: s.accent }} />
            <div className="admin-item-content">
              <div className="admin-item-title">{s.title}</div>
              <div className="admin-item-subtitle">Icon: {s.icon}</div>
            </div>
            <div className="admin-item-actions">
              <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => handleEdit(s)}>Edit</button>
              <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="admin-modal-backdrop" onClick={() => setEditingService(null)}>
          <div className="admin-modal" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <h2>{isNew ? 'Add Service' : 'Edit Service'}</h2>
            <div className="admin-form-group">
              <label className="admin-label">Title</label>
              <input className="admin-input" value={editingService.title}
                onChange={e => setEditingService({ ...editingService, title: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Icon (Lucide name)</label>
              <select className="admin-select" value={editingService.icon}
                onChange={e => setEditingService({ ...editingService, icon: e.target.value })}>
                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" value={editingService.description} rows={4}
                onChange={e => setEditingService({ ...editingService, description: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Accent Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="admin-color-swatch" style={{ background: editingService.accent }}>
                  <input type="color" className="admin-color-input" value={editingService.accent}
                    onChange={e => setEditingService({ ...editingService, accent: e.target.value })} />
                </div>
                <input className="admin-input" style={{ width: 120 }} value={editingService.accent}
                  onChange={e => setEditingService({ ...editingService, accent: e.target.value })} />
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingService(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleModalSave}>
                {isNew ? 'Add' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

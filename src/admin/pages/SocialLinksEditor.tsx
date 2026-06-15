import { useState } from 'react';
import type { SocialLinks } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface SocialLinksEditorProps {
  data: SocialLinks;
  onSave: () => void;
}

export default function SocialLinksEditor({ data, onSave }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<Record<string, string>>({ ...data });
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('social', links);
      setToast({ msg: 'Social links saved!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    if (!newKey.trim()) return;
    setLinks({ ...links, [newKey.toLowerCase().trim()]: newVal });
    setNewKey('');
    setNewVal('');
  };

  const handleRemove = (key: string) => {
    const updated = { ...links };
    delete updated[key];
    setLinks(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Social Links</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            Manage all your social media and contact links.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-item-list">
          {Object.entries(links).map(([key, val]) => (
            <div key={key} className="admin-item">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600, color: '#8b5cf6', textTransform: 'capitalize',
                flexShrink: 0,
              }}>
                {key.charAt(0).toUpperCase()}
              </div>
              <div className="admin-item-content" style={{ flex: 1 }}>
                <div className="admin-item-title" style={{ textTransform: 'capitalize', marginBottom: 6 }}>{key}</div>
                <input className="admin-input" value={val}
                  onChange={e => setLinks({ ...links, [key]: e.target.value })}
                  style={{ padding: '6px 10px', fontSize: 12 }} />
              </div>
              <button className="admin-btn admin-btn-sm admin-btn-danger admin-btn-icon"
                onClick={() => handleRemove(key)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add new */}
      <div className="admin-card">
        <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Add New Link</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div className="admin-form-group" style={{ flex: 1, margin: 0 }}>
            <label className="admin-label">Platform Name</label>
            <input className="admin-input" value={newKey} onChange={e => setNewKey(e.target.value)}
              placeholder="e.g. twitter, youtube, linkedin" />
          </div>
          <div className="admin-form-group" style={{ flex: 2, margin: 0 }}>
            <label className="admin-label">URL</label>
            <input className="admin-input" value={newVal} onChange={e => setNewVal(e.target.value)}
              placeholder="https://..." />
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={handleAdd}
            style={{ marginBottom: 0 }}>Add</button>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

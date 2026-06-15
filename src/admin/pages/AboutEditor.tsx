import { useState } from 'react';
import type { AboutContent } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface AboutEditorProps {
  data: AboutContent;
  onSave: () => void;
}

export default function AboutEditor({ data, onSave }: AboutEditorProps) {
  const [form, setForm] = useState<AboutContent>(JSON.parse(JSON.stringify(data)));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('about', form);
      setToast({ msg: 'About section saved!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateBio = (index: number, value: string) => {
    const bio = [...form.bio];
    bio[index] = value;
    setForm({ ...form, bio });
  };

  const addBio = () => setForm({ ...form, bio: [...form.bio, ''] });
  const removeBio = (index: number) => setForm({ ...form, bio: form.bio.filter((_, i) => i !== index) });

  const updateStat = (index: number, field: string, value: string) => {
    const stats = [...form.stats];
    stats[index] = { ...stats[index], [field]: value };
    setForm({ ...form, stats });
  };

  const updateAiTool = (index: number, value: string) => {
    const aiTools = [...form.aiTools];
    aiTools[index] = value;
    setForm({ ...form, aiTools });
  };

  const addAiTool = () => setForm({ ...form, aiTools: [...form.aiTools, ''] });
  const removeAiTool = (index: number) => setForm({ ...form, aiTools: form.aiTools.filter((_, i) => i !== index) });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>About Section</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            Your personal bio, stats, and tools.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Personal Info */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Personal Info</h3>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Name</label>
            <input className="admin-input" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Title</label>
            <input className="admin-input" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Greeting Text</label>
            <input className="admin-input" value={form.greeting}
              onChange={e => setForm({ ...form, greeting: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Profile Image Path</label>
            <input className="admin-input" value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              placeholder="/images/your-photo.webp" />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Bio Paragraphs</h3>
          <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={addBio}>+ Add</button>
        </div>
        {form.bio.map((para, i) => (
          <div key={i} className="admin-form-group" style={{ display: 'flex', gap: 10 }}>
            <textarea className="admin-textarea" value={para} onChange={e => updateBio(i, e.target.value)}
              rows={3} style={{ flex: 1 }} />
            <button className="admin-btn admin-btn-sm admin-btn-danger admin-btn-icon"
              onClick={() => removeBio(i)} style={{ alignSelf: 'flex-start', marginTop: 0 }}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Stats</h3>
        {form.stats.map((stat, i) => (
          <div key={i} className="admin-grid-2" style={{ marginBottom: 12 }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Value</label>
              <input className="admin-input" value={stat.value}
                onChange={e => updateStat(i, 'value', e.target.value)} placeholder="e.g. 2000+" />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Label</label>
              <input className="admin-input" value={stat.label}
                onChange={e => updateStat(i, 'label', e.target.value)} placeholder="e.g. VIDEOS CREATED" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Tools */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">AI Tools</h3>
          <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={addAiTool}>+ Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {form.aiTools.map((tool, i) => (
            <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <input className="admin-input" style={{ width: 140, padding: '6px 10px', fontSize: 12 }}
                value={tool} onChange={e => updateAiTool(i, e.target.value)} />
              <button className="admin-btn admin-btn-sm admin-btn-danger admin-btn-icon"
                onClick={() => removeAiTool(i)} style={{ padding: 4 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

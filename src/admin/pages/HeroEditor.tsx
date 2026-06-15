import { useState } from 'react';
import type { HeroContent } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface HeroEditorProps {
  data: HeroContent;
  onSave: () => void;
}

export default function HeroEditor({ data, onSave }: HeroEditorProps) {
  const [form, setForm] = useState<HeroContent>({ ...data });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('hero', form);
      setToast({ msg: 'Hero section saved!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Hero Section</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            The first thing visitors see on your portfolio.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-form-group">
          <label className="admin-label">Badge Text</label>
          <input
            className="admin-input"
            value={form.badge}
            onChange={e => setForm({ ...form, badge: e.target.value })}
            placeholder="e.g., Motion Designer & Video Editor"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Headline</label>
          <input
            className="admin-input"
            value={form.headline}
            onChange={e => setForm({ ...form, headline: e.target.value })}
            placeholder="e.g., I craft compelling motion stories..."
          />
          <p style={{ fontSize: 11, color: '#86868b', marginTop: 6 }}>
            This is the large title text. Each word animates separately.
          </p>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Subtext</label>
          <textarea
            className="admin-textarea"
            value={form.subtext}
            onChange={e => setForm({ ...form, subtext: e.target.value })}
            placeholder="Supporting paragraph text below the headline..."
            rows={3}
          />
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

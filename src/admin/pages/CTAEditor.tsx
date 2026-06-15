import { useState } from 'react';
import type { CTAContent } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface CTAEditorProps {
  data: CTAContent;
  onSave: () => void;
}

export default function CTAEditor({ data, onSave }: CTAEditorProps) {
  const [form, setForm] = useState<CTAContent>({ ...data });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('cta', form);
      setToast({ msg: 'CTA section saved!', type: 'success' });
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
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Call to Action</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            The big CTA section near the bottom of your site.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-form-group">
          <label className="admin-label">Headline</label>
          <input className="admin-input" value={form.headline}
            onChange={e => setForm({ ...form, headline: e.target.value })}
            placeholder="Let's create something bold." />
          <p style={{ fontSize: 11, color: '#86868b', marginTop: 6 }}>
            Each character animates separately with 3D rotation.
          </p>
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Button Text</label>
            <input className="admin-input" value={form.buttonText}
              onChange={e => setForm({ ...form, buttonText: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Button Link</label>
            <input className="admin-input" value={form.buttonLink}
              onChange={e => setForm({ ...form, buttonLink: e.target.value })}
              placeholder="https://wa.me/..." />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Email</label>
          <input className="admin-input" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            type="email" />
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

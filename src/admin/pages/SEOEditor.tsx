import { useState } from 'react';
import type { SEOContent } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface SEOEditorProps {
  data: SEOContent;
  onSave: () => void;
}

export default function SEOEditor({ data, onSave }: SEOEditorProps) {
  const [form, setForm] = useState<SEOContent>({ ...data });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('seo', form);
      setToast({ msg: 'SEO settings saved!', type: 'success' });
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
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>SEO Settings</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            Optimize how your portfolio appears in search engines.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-form-group">
          <label className="admin-label">Page Title</label>
          <input className="admin-input" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Upananda Debnath — Motion Designer" />
          <p style={{ fontSize: 11, color: '#86868b', marginTop: 6 }}>
            {form.title.length}/60 characters (recommended max)
          </p>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Meta Description</label>
          <textarea className="admin-textarea" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3} />
          <p style={{ fontSize: 11, color: '#86868b', marginTop: 6 }}>
            {form.description.length}/160 characters (recommended max)
          </p>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Keywords</label>
          <input className="admin-input" value={form.keywords}
            onChange={e => setForm({ ...form, keywords: e.target.value })}
            placeholder="motion design, video editing, ..." />
          <p style={{ fontSize: 11, color: '#86868b', marginTop: 6 }}>
            Comma-separated list of keywords
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="admin-card" style={{ marginTop: 20 }}>
        <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Search Preview</h3>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: 12,
          padding: 20,
        }}>
          <p style={{ fontSize: 16, color: '#8ab4f8', margin: '0 0 4px', fontWeight: 500 }}>
            {form.title || 'Page Title'}
          </p>
          <p style={{ fontSize: 12, color: '#22c55e', margin: '0 0 6px' }}>
            upanandadebnath.com
          </p>
          <p style={{ fontSize: 13, color: '#9aa0a6', margin: 0, lineHeight: 1.5 }}>
            {form.description || 'Meta description will appear here...'}
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

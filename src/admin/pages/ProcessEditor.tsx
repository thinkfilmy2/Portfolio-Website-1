import { useState } from 'react';
import type { ProcessContent, ProcessStep } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface ProcessEditorProps {
  data: ProcessContent;
  onSave: () => void;
}

export default function ProcessEditor({ data, onSave }: ProcessEditorProps) {
  const [form, setForm] = useState<ProcessContent>(JSON.parse(JSON.stringify(data)));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('process', form);
      setToast({ msg: 'Process section saved!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateStep = (index: number, field: keyof ProcessStep, value: string) => {
    const steps = [...form.steps];
    steps[index] = { ...steps[index], [field]: value };
    setForm({ ...form, steps });
  };

  const addStep = () => {
    const num = String(form.steps.length + 1).padStart(2, '0');
    setForm({ ...form, steps: [...form.steps, { num, title: '', desc: '' }] });
  };

  const removeStep = (index: number) => {
    setForm({ ...form, steps: form.steps.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Production Process</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            {form.steps.length} workflow steps
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={addStep}>+ Add Step</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Section Title</label>
            <input className="admin-input" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Highlighted Word</label>
            <input className="admin-input" value={form.titleHighlight}
              onChange={e => setForm({ ...form, titleHighlight: e.target.value })} />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Subtitle</label>
          <input className="admin-input" value={form.subtitle}
            onChange={e => setForm({ ...form, subtitle: e.target.value })} />
        </div>
      </div>

      <div className="admin-item-list">
        {form.steps.map((step, i) => (
          <div key={i} className="admin-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#8b5cf6', flexShrink: 0,
              }}>
                {step.num}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="admin-grid-2" style={{ gap: 10 }}>
                  <input className="admin-input" value={step.num} placeholder="01"
                    onChange={e => updateStep(i, 'num', e.target.value)}
                    style={{ padding: '6px 10px', fontSize: 12 }} />
                  <input className="admin-input" value={step.title} placeholder="Step title"
                    onChange={e => updateStep(i, 'title', e.target.value)}
                    style={{ padding: '6px 10px', fontSize: 12 }} />
                </div>
                <input className="admin-input" value={step.desc} placeholder="Step description"
                  onChange={e => updateStep(i, 'desc', e.target.value)}
                  style={{ padding: '6px 10px', fontSize: 12 }} />
              </div>
              <button className="admin-btn admin-btn-sm admin-btn-danger admin-btn-icon"
                onClick={() => removeStep(i)} style={{ marginTop: 4 }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

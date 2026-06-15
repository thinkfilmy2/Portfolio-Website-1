import { useState } from 'react';
import type { NavContent, NavItem } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface NavigationEditorProps {
  data: NavContent;
  onSave: () => void;
}

export default function NavigationEditor({ data, onSave }: NavigationEditorProps) {
  const [form, setForm] = useState<NavContent>(JSON.parse(JSON.stringify(data)));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection('nav', form);
      setToast({ msg: 'Navigation saved!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (index: number, field: keyof NavItem, value: string) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { label: '', href: '#' }] });
  const removeItem = (index: number) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) });

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= form.items.length) return;
    const items = [...form.items];
    const [item] = items.splice(from, 1);
    items.splice(to, 0, item);
    setForm({ ...form, items });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Navigation</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            Manage menu items and logo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={addItem}>+ Add Item</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-form-group">
          <label className="admin-label">Logo Image Path</label>
          <input className="admin-input" value={form.logo}
            onChange={e => setForm({ ...form, logo: e.target.value })}
            placeholder="/images/logo.png" />
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Menu Items</h3>
        <div className="admin-item-list">
          {form.items.map((item, i) => (
            <div key={i} className="admin-item">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginRight: 4 }}>
                <button className="admin-btn admin-btn-sm admin-btn-icon admin-btn-secondary"
                  onClick={() => moveItem(i, i - 1)} disabled={i === 0}
                  style={{ padding: 2, fontSize: 10 }}>▲</button>
                <button className="admin-btn admin-btn-sm admin-btn-icon admin-btn-secondary"
                  onClick={() => moveItem(i, i + 1)} disabled={i === form.items.length - 1}
                  style={{ padding: 2, fontSize: 10 }}>▼</button>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                <input className="admin-input" value={item.label} placeholder="Label"
                  onChange={e => updateItem(i, 'label', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', fontSize: 12 }} />
                <input className="admin-input" value={item.href} placeholder="#section"
                  onChange={e => updateItem(i, 'href', e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', fontSize: 12 }} />
              </div>
              <button className="admin-btn admin-btn-sm admin-btn-danger admin-btn-icon"
                onClick={() => removeItem(i)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

import { useState } from 'react';
import type { SettingsContent, LoadingContent, FooterContent, NavContent } from '../../types/siteContent';
import { adminApi } from '../api';
import Toast from '../components/Toast';

interface SettingsPageProps {
  settings: SettingsContent;
  loading: LoadingContent;
  footer: FooterContent;
  nav: NavContent;
  onSave: () => void;
}

export default function SettingsPage({ settings, loading, footer, nav, onSave }: SettingsPageProps) {
  const [sections, setSections] = useState({ ...settings.sectionsEnabled });
  const [loadingData, setLoadingData] = useState({ ...loading });
  const [footerData, setFooterData] = useState({ ...footer });
  const [navLogo, setNavLogo] = useState(nav.logo || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleToggleSection = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Update Settings
      await adminApi.updateSection('settings', { sectionsEnabled: sections });
      
      // Update Loading Screen
      await adminApi.updateSection('loading', loadingData);

      // Update Footer Settings
      await adminApi.updateSection('footer', footerData);

      // Update Navigation logo
      await adminApi.updateSection('nav', { ...nav, logo: navLogo });

      setToast({ msg: 'All settings saved successfully!', type: 'success' });
      onSave();
    } catch (err: any) {
      setToast({ msg: err.message || 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const sectionKeys = [
    { key: 'hero', name: 'Hero Section' },
    { key: 'showcase', name: 'Showcase (Work) Section' },
    { key: 'services', name: 'Services & Skills Section' },
    { key: 'about', name: 'About Section' },
    { key: 'process', name: 'Process Steps Section' },
    { key: 'cta', name: 'CTA (Call To Action) Section' },
    { key: 'footer', name: 'Footer Section' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Site Settings</h2>
          <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
            Control branding, loading screen, footers, and toggle sections.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSaveAll} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="admin-grid-2">
        {/* Toggle Sections Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Enable/Disable Sections</h3>
          </div>
          <p style={{ fontSize: 12, color: '#86868b', marginBottom: 20 }}>
            Toggle which components are visible on the public website.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sectionKeys.map(s => (
              <div
                key={s.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                <label className="admin-switch" style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={sections[s.key] !== false}
                    onChange={() => handleToggleSection(s.key)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    className="admin-switch-slider"
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: sections[s.key] !== false ? '#8b5cf6' : '#2c2c2e',
                      transition: '0.3s',
                      borderRadius: 24,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: 18, width: 18,
                        left: sections[s.key] !== false ? 22 : 3,
                        bottom: 3,
                        backgroundColor: 'white',
                        transition: '0.3s',
                        borderRadius: '50%',
                      }}
                    />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Screen Customization Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Loading Screen Settings</h3>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Loading Title</label>
            <input
              className="admin-input"
              value={loadingData.name}
              onChange={e => setLoadingData({ ...loadingData, name: e.target.value })}
              placeholder="e.g. UPANANDA DEBNATH"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Loading Subtitle</label>
            <input
              className="admin-input"
              value={loadingData.subtitle}
              onChange={e => setLoadingData({ ...loadingData, subtitle: e.target.value })}
              placeholder="e.g. Motion Designer & Video Editor"
            />
          </div>

          <div className="admin-card-header" style={{ marginTop: 32, paddingLeft: 0 }}>
            <h3 className="admin-card-title">Navigation Logo</h3>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Logo Path / URL</label>
            <input
              className="admin-input"
              value={navLogo}
              onChange={e => setNavLogo(e.target.value)}
              placeholder="e.g. /images/unnamed.png or uploads link"
            />
            <p style={{ fontSize: 11, color: '#86868b', marginTop: 6 }}>
              Path to your custom logo image. You can upload logos via Media Manager and copy path here.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding settings */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Footer Branding Settings</h3>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Footer Name / Branding</label>
            <input
              className="admin-input"
              value={footerData.name}
              onChange={e => setFooterData({ ...footerData, name: e.target.value })}
              placeholder="e.g. UPANANDA DEBNATH"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Footer Title / Tagline</label>
            <input
              className="admin-input"
              value={footerData.title}
              onChange={e => setFooterData({ ...footerData, title: e.target.value })}
              placeholder="e.g. Motion Designer & Video Editor"
            />
          </div>
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Footer Tagline Text</label>
            <input
              className="admin-input"
              value={footerData.tagline}
              onChange={e => setFooterData({ ...footerData, tagline: e.target.value })}
              placeholder="e.g. Crafted with motion & passion."
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Footer Copyright Owner</label>
            <input
              className="admin-input"
              value={footerData.copyright}
              onChange={e => setFooterData({ ...footerData, copyright: e.target.value })}
              placeholder="e.g. Upananda Debnath"
            />
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

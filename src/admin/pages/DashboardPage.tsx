import type { SiteContent } from '../../types/siteContent';

interface DashboardPageProps {
  content: SiteContent;
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ content, onNavigate }: DashboardPageProps) {
  const stats = [
    {
      label: 'Motion Projects',
      value: content.projects?.motion?.length || 0,
      color: '#8b5cf6',
      page: 'projects',
    },
    {
      label: 'Editing Projects',
      value: content.projects?.editing?.length || 0,
      color: '#6366f1',
      page: 'projects',
    },
    {
      label: 'Services',
      value: content.services?.length || 0,
      color: '#a78bfa',
      page: 'services',
    },
    {
      label: 'Process Steps',
      value: content.process?.steps?.length || 0,
      color: '#818cf8',
      page: 'process',
    },
  ];

  const quickActions = [
    { label: 'Edit Hero Section', page: 'hero', icon: '🏠' },
    { label: 'Manage Projects', page: 'projects', icon: '🎬' },
    { label: 'Edit About', page: 'about', icon: '👤' },
    { label: 'Social Links', page: 'social', icon: '🔗' },
    { label: 'SEO Settings', page: 'seo', icon: '🔍' },
    { label: 'Upload Media', page: 'media', icon: '📷' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
          Welcome back, {content.about?.name || 'Admin'} 👋
        </h2>
        <p style={{ fontSize: 14, color: '#86868b', margin: 0 }}>
          Here's an overview of your portfolio content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="admin-grid-4" style={{ marginBottom: 32 }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onNavigate(stat.page)}
          >
            <div
              className="admin-stat-icon"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</span>
            </div>
            <div>
              <div className="admin-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quick Actions</h3>
        </div>
        <div className="admin-grid-3">
          {quickActions.map(action => (
            <button
              key={action.page}
              className="admin-btn admin-btn-secondary"
              style={{
                padding: '16px 20px',
                justifyContent: 'flex-start',
                borderRadius: 12,
              }}
              onClick={() => onNavigate(action.page)}
            >
              <span style={{ fontSize: 20 }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Content Preview */}
      <div className="admin-grid-2" style={{ marginTop: 24 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Hero Section</h3>
            <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => onNavigate('hero')}>
              Edit
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#86868b', margin: 0 }}>
            <strong style={{ color: '#f5f5f7' }}>Headline:</strong> {content.hero?.headline || '—'}
          </p>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Social Links</h3>
            <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => onNavigate('social')}>
              Edit
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {content.social && Object.entries(content.social).map(([key, val]) => (
              <p key={key} style={{ fontSize: 12, color: '#86868b', margin: 0 }}>
                <strong style={{ color: '#a0a0b0', textTransform: 'capitalize' }}>{key}:</strong>{' '}
                <span style={{ color: '#8b5cf6' }}>{String(val).substring(0, 40)}...</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

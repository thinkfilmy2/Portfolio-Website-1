import { ExternalLink, User } from 'lucide-react';

interface HeaderProps {
  activePage: string;
  adminName: string;
}

export default function AdminHeader({ activePage, adminName }: HeaderProps) {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Dashboard';
      case 'hero': return 'Hero Section Editor';
      case 'projects': return 'Projects Editor';
      case 'services': return 'Services & Skills Editor';
      case 'about': return 'About Section Editor';
      case 'process': return 'Process Steps Editor';
      case 'cta': return 'CTA Section Editor';
      case 'social': return 'Social Links Editor';
      case 'navigation': return 'Navigation Editor';
      case 'seo': return 'SEO Settings';
      case 'media': return 'Media Manager';
      case 'settings': return 'Site Settings';
      default: return 'Editor';
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <h1>{getPageTitle(activePage)}</h1>
      </div>
      <div className="admin-header-actions">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ExternalLink size={14} />
          <span>View Site</span>
        </a>
        <div className="admin-header-user">
          <div className="admin-avatar">
            <User size={14} />
          </div>
          <span>{adminName}</span>
        </div>
      </div>
    </header>
  );
}

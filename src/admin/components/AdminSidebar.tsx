import {
  LayoutDashboard,
  Home,
  Film,
  Sparkles,
  User,
  GitPullRequest,
  Mail,
  Share2,
  Navigation,
  Search,
  Image,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'projects', label: 'Projects', icon: Film },
    { id: 'services', label: 'Services & Skills', icon: Sparkles },
    { id: 'about', label: 'About', icon: User },
    { id: 'process', label: 'Process Steps', icon: GitPullRequest },
    { id: 'cta', label: 'Call To Action', icon: Mail },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'seo', label: 'SEO Settings', icon: Search },
    { id: 'media', label: 'Media Manager', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">U</div>
        <div className="admin-sidebar-title">Portfolio CMS</div>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`admin-nav-item ${activePage === item.id ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={onLogout} className="admin-nav-item logout-btn" style={{ width: '100%' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

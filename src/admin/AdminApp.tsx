import { useState, useEffect } from 'react';
import { adminApi } from './api';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeroEditor from './pages/HeroEditor';
import ProjectsEditor from './pages/ProjectsEditor';
import ServicesEditor from './pages/ServicesEditor';
import AboutEditor from './pages/AboutEditor';
import ProcessEditor from './pages/ProcessEditor';
import CTAEditor from './pages/CTAEditor';
import SocialLinksEditor from './pages/SocialLinksEditor';
import NavigationEditor from './pages/NavigationEditor';
import SEOEditor from './pages/SEOEditor';
import MediaManager from './pages/MediaManager';
import SettingsPage from './pages/SettingsPage';
import { useSiteContentContext } from '../context/SiteContentContext';
import './admin.css';

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const { content, refetch } = useSiteContentContext();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await adminApi.checkAuth();
        setAuthenticated(res.authenticated);
      } catch {
        setAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setActivePage('dashboard');
    refetch();
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      setAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authenticated === null) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#08080c',
        color: '#f5f5f7',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>Checking auth status...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage content={content} onNavigate={setActivePage} />;
      case 'hero':
        return <HeroEditor data={content.hero} onSave={refetch} />;
      case 'projects':
        return (
          <ProjectsEditor
            motion={content.projects?.motion || []}
            editing={content.projects?.editing || []}
            onSave={refetch}
          />
        );
      case 'services':
        return <ServicesEditor data={content.services || []} onSave={refetch} />;
      case 'about':
        return <AboutEditor data={content.about} onSave={refetch} />;
      case 'process':
        return <ProcessEditor data={content.process} onSave={refetch} />;
      case 'cta':
        return <CTAEditor data={content.cta} onSave={refetch} />;
      case 'social':
        return <SocialLinksEditor data={content.social} onSave={refetch} />;
      case 'navigation':
        return <NavigationEditor data={content.nav} onSave={refetch} />;
      case 'seo':
        return <SEOEditor data={content.seo} onSave={refetch} />;
      case 'media':
        return <MediaManager />;
      case 'settings':
        return (
          <SettingsPage
            settings={content.settings}
            loading={content.loading}
            footer={content.footer}
            nav={content.nav}
            onSave={refetch}
          />
        );
      default:
        return <DashboardPage content={content} onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />
      <div className="admin-main">
        <AdminHeader activePage={activePage} adminName={content.about?.name || 'Admin'} />
        <main className="admin-body">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

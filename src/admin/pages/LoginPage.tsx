import { useState, FormEvent } from 'react';
import { adminApi } from '../api';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminApi.login(password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-glow" />
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 22, fontWeight: 700, color: 'white',
          }}>
            U
          </div>
        </div>
        <h1>Admin Panel</h1>
        <p>Enter your password to manage your portfolio</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="admin-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
            disabled={loading || !password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <div className="admin-login-error">{error}</div>}
        </form>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
          Default password: admin123
        </p>
      </div>
    </div>
  );
}

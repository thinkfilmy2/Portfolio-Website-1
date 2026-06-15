/* ─── Admin API helper ─── */
const API_BASE = 'http://localhost:3001';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const adminApi = {
  // Auth
  login: (password: string) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  checkAuth: () => request('/api/auth/check'),

  // Content
  getContent: () => request('/api/content'),
  updateSection: (section: string, data: unknown) => request(`/api/content/${section}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Uploads
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
  getUploads: () => request('/api/uploads'),
  deleteUpload: (filename: string) => request(`/api/upload/${filename}`, { method: 'DELETE' }),
};

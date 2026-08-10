const BASE = import.meta.env.DEV ? '' : ((import.meta as any).env.VITE_API_URL ?? 'http://localhost:3001');

function getToken(): string | null {
  return localStorage.getItem('zenflow-token');
}

function setToken(token: string | null) {
  if (token) localStorage.setItem('zenflow-token', token);
  else localStorage.removeItem('zenflow-token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    setToken(null);
    window.dispatchEvent(new CustomEvent('zenflow:logout'));
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error de conexión');
  return data as T;
}

export const api = {
  getToken,
  setToken,
  get token() { return getToken(); },

  auth: {
    register: (email: string, username: string, password: string) =>
      request<{ token: string; user: { id: string; email: string; username: string } }>(
        '/api/auth/register',
        { method: 'POST', body: JSON.stringify({ email, username, password }) }
      ),
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string; username: string } }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      ),
    google: (credential: string) =>
      request<{ token: string; user: { id: string; email: string; username: string; avatarUrl?: string } }>(
        '/api/auth/google',
        { method: 'POST', body: JSON.stringify({ credential }) }
      ),
  },

  sessions: {
    list: () =>
      request<{ id: string; meditation_id: string; meditation_title: string; duration: number; completed: number; created_at: string }[]>(
        '/api/sessions'
      ),
    create: (meditationId: string, meditationTitle: string, duration: number, completed: boolean) =>
      request<{ id: string }>('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ meditationId, meditationTitle, duration, completed }),
      }),
    stats: () =>
      request<{ totalSessions: number; totalMinutes: number; byMeditation: { meditation_id: string; meditation_title: string; count: number }[] }>(
        '/api/sessions/stats'
      ),
  },

  comments: {
    list: (meditationId: string) =>
      request<{ id: string; content: string; userId: string; username: string; createdAt: string; likes: number; liked: boolean }[]>(
        `/api/comments/${meditationId}`
      ),
    create: (meditationId: string, content: string) =>
      request<{ id: string; content: string; userId: string; username: string; createdAt: string; likes: number; liked: boolean }>(
        `/api/comments/${meditationId}`,
        { method: 'POST', body: JSON.stringify({ content }) }
      ),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/comments/${id}`, { method: 'DELETE' }),
    like: (id: string) =>
      request<{ liked: boolean }>(`/api/comments/${id}/like`, { method: 'POST' }),
  },
};

import { useState, type FormEvent } from 'react';
import { api } from '@/api/client';
import { CloseIcon, GoogleIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

function getGoogleCredential(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts) {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => resolve(response.credential),
        cancel_on_tap_outside: false,
      });
      (window as any).google.accounts.id.prompt();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => resolve(response.credential),
        cancel_on_tap_outside: false,
      });
      (window as any).google.accounts.id.prompt();
    };
    script.onerror = () => reject(new Error('Error cargando Google Sign-In'));
    document.body.appendChild(script);
  });
}

interface AuthModalProps {
  onClose: () => void;
  onAuth: (user: { id: string; email: string; username: string }) => void;
}

type Mode = 'login' | 'register';

export function AuthModal({ onClose, onAuth }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await api.auth.login(email, password)
        : await api.auth.register(email, username, password);
      api.setToken(result.token);
      onAuth(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        padding: 20,
        paddingBottom: 60,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 380,
          padding: 32,
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
        }}
      >

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ color: 'white' }}>
            {mode === 'login' ? t('auth.signIn') : t('auth.register')}
          </h2>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 6, letterSpacing: '0.02em' }}>{t('auth.email')}</p>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                fontSize: '1rem',
                outline: 'none',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: 'var(--text)',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
            />
          </div>

          {mode === 'register' && (
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 6, letterSpacing: '0.02em' }}>{t('auth.username')}</p>
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '1rem',
                  outline: 'none',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: 'var(--text)',
                  transition: 'var(--transition)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
              />
            </div>
          )}

          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 6, letterSpacing: '0.02em' }}>{t('auth.password')}</p>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                fontSize: '1rem',
                outline: 'none',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: 'var(--text)',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
            />
          </div>

          {error && (
            <div style={{ color: 'white', fontSize: '0.82rem', padding: '10px 14px', background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid var(--red-400)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? t('auth.processing') : mode === 'login' ? t('auth.login') : t('auth.register')}
          </button>
        </form>

        <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('auth.or')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
        </div>

        <button
          onClick={async () => {
            const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string | undefined;
            if (!clientId) {
              setError(t('auth.googleConfigError'));
              return;
            }
            setError('');
            setLoading(true);
            try {
              const token = await getGoogleCredential(clientId);
              const result = await api.auth.google(token);
              api.setToken(result.token);
              onAuth(result.user);
            } catch (err) {
              setError(err instanceof Error ? err.message : t('auth.googleErrorMsg'));
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', borderRadius: 50,
            border: '1px solid var(--glass-border)', background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'var(--text)', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: '0.2s', opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--red-400)'; e.currentTarget.style.background = 'var(--red-50)'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--glass-bg)'; }}
        >
          <GoogleIcon style={{ width: 20, height: 20 }} />
          {loading ? t('auth.processing') : t('auth.continueWithGoogle')}
        </button>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: '0.82rem' }}>
            {mode === 'login' ? (
              <>{t('auth.noAccount')}{' '}
                <button onClick={() => { setMode('register'); setError(''); }} style={{ color: 'white', background: 'none', textDecoration: 'underline', fontSize: '0.82rem', fontWeight: 600, textUnderlineOffset: 2 }}>
                  {t('auth.signUp')}
                </button>
              </>
            ) : (
              <>{t('auth.hasAccount')}{' '}
                <button onClick={() => { setMode('login'); setError(''); }} style={{ color: 'white', background: 'none', textDecoration: 'underline', fontSize: '0.82rem', fontWeight: 600, textUnderlineOffset: 2 }}>
                  {t('auth.signInLink')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

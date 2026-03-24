import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/discoverrecommend');
        }
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <header className="flex justify-between items-center w-full px-6 py-8 md:px-12 absolute top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl" data-weight="fill">shield_person</span>
          <span className="font-headline font-extrabold text-2xl tracking-tighter text-primary">The Edible Editorial</span>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden min-h-screen">

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"></div>

        <div className="w-full max-w-[480px] z-10">
          <div className="bg-surface-container rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">

            <div className="absolute top-0 right-0 w-auto h-auto opacity-10 pointer-events-none">
              <img alt="Fresh harvest background" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0Wl9Pl51AoGkoncnzqlaxwQ2JValAHQekrkkJVGKxNumIUGqPRQ-w0VVGjbmnqenfjp-fx_qaxYli6dlPDk3QESWEPXLHi-Ef0L3ujzHGlKVFnpackbfLsuaULFwOJSsb-MXU4cIxtAX-EGBVD9x6B6gMqrM_T5DDk9-ujJiyJl3DL2dzF35p9jhhMmH6dTo0nN3DuPLumvRtXAeUvbSxvrgiAttDGkc6WK5NgBrmmSXn9uxZ5Y1agxEcwwGKt6xO_n3cm1KQYQ20" />
            </div>
            <div className="mb-10 relative">
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Admin Access</h1>
              <p className="text-on-surface-variant font-body">Verdant Harvest secure portal for curators.</p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-0 rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-surface-tint focus:bg-surface-bright transition-all"
                    id="email"
                    placeholder="curator@verdantharvest.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-medium text-on-surface-variant" htmlFor="password">Security Key</label>
                  <a className="text-sm font-semibold text-primary hover:text-primary-dim transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">lock</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-12 py-4 bg-surface-container-low border-0 rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-surface-tint focus:bg-surface-bright transition-all"
                    id="password"
                    placeholder="••••••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center px-1">
                <input className="h-5 w-5 rounded-lg border-outline-variant bg-surface-container-high text-primary focus:ring-offset-background focus:ring-primary" id="remember-me" name="remember-me" type="checkbox" />
                <label className="ml-3 block text-sm text-on-surface-variant" htmlFor="remember-me">
                  Maintain session for 30 days
                </label>
              </div>

              <div className="pt-4">
                <button
                  className="w-full primary-gradient text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 bg-gradient-to-br from-primary to-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  <span className="material-symbols-outlined text-xl">{loading ? 'hourglass_empty' : 'login'}</span>
                </button>
              </div>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high rounded-lg">
              <span className="material-symbols-outlined text-primary text-lg" data-weight="fill">verified_user</span>
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Encrypted 256-bit Connection</span>
            </div>
          </div>

          <p className="text-center mt-8 text-on-surface-variant text-sm font-body">
            New to the Editorial?
            <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1" to="/register">Create Account</Link>
          </p>
        </div>
      </main>

      <footer className="bg-[#0e0e0e] border-t border-[#91f78e]/10 flex flex-col md:flex-row justify-between items-center w-full px-8 py-6 gap-4">
        <span className="font-['Inter'] text-xs text-[#adaaaa]">© 2026 The Edible Editorial. Secure Admin Portal.</span>
        <div className="flex gap-6">
          <a className="font-['Inter'] text-xs text-[#adaaaa] hover:text-[#91f78e] transition-colors" href="#">Privacy Policy</a>
          <a className="font-['Inter'] text-xs text-[#adaaaa] hover:text-[#91f78e] transition-colors" href="#">Security Protocol</a>
          <a className="font-['Inter'] text-xs text-[#adaaaa] hover:text-[#91f78e] transition-colors" href="#">Support</a>
        </div>
      </footer>

    </>
  );
}

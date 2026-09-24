import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { useSeo } from '../hooks/useSeo';

export const LoginPage: React.FC = () => {
  useSeo({ title: 'Sign In', description: 'Sign in to your Subhadarshini account.', path: '/login', noIndex: true });

  const [email, setEmail] = useState('admin@subhadarshini.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(getApiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        login(data.data.accessToken, data.data.user);
        if (data.data.user.role === 'ADMIN' || data.data.user.role === 'MANAGER') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full border border-spice-brown/10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-spice-red text-white font-serif font-bold text-2xl flex items-center justify-center mx-auto">
            S
          </div>
          <h1 className="font-serif text-2xl font-bold text-spice-brown">Account Login</h1>
          <p className="text-xs text-ink-500">Enter your credentials to access your Subhadarshini account.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-brand-50 text-spice-red text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
              />
              <Mail className="w-4 h-4 text-ink-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
              />
              <Lock className="w-4 h-4 text-ink-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            {submitting ? 'Logging in...' : 'Sign In To Account'}
          </button>
        </form>

        <div className="text-center text-xs text-ink-500 pt-4 border-t border-spice-brown/10 space-y-2">
          <p>
            Demo Admin Login: <strong className="text-spice-brown">admin@subhadarshini.com</strong> / <strong className="text-spice-brown">admin123</strong>
          </p>
          <p>
            Don't have an account? <Link to="/register" className="text-spice-red font-bold hover:underline">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

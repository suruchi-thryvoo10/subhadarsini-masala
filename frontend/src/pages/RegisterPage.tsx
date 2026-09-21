import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/api';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(getApiUrl('/api/v1/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (data.success) {
        login(data.data.accessToken, data.data.user);
        navigate('/profile');
      } else {
        setErrorMsg(data.message || 'Registration failed');
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
          <h1 className="font-serif text-2xl font-bold text-spice-brown">Create Account</h1>
          <p className="text-xs text-spice-brown/60">Join Subhadarshini Spices for fast order tracking and wishlist.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-spice-brown/60 pt-4 border-t border-spice-brown/10">
          Already have an account? <Link to="/login" className="text-spice-red font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

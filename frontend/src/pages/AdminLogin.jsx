import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiLoader,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📤 Admin login request');

      // ✅ FIX: Direct fetch call instead of undefined loginAdmin()
      const res = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log('📥 Admin login response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // ✅ Store token
      localStorage.setItem('token', data.token);

      // ✅ Create user object matching backend response
      const user = {
        _id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      login(user, data.role, data.token);
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('❌ Admin login error:', err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        fontFamily: "'Crimson Pro', serif",
        background: "linear-gradient(135deg,var(--cream-warm) 0%,var(--cream) 100%)"
      }}
    >
      {/* Floating blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[var(--cream-deep)] opacity-40 blur-3xl blob-morph"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--burgundy-light)] opacity-20 blur-3xl blob-morph"></div>

      {/* Floating particles */}
      <div className="particle w-3 h-3 bg-[var(--gold)] left-[25%] top-[80%]" style={{ animationDuration: "9s" }}></div>
      <div className="particle w-2 h-2 bg-[var(--burgundy-light)] left-[65%] top-[85%]" style={{ animationDuration: "11s" }}></div>

      <div className="relative z-10 w-full max-w-md anim-fade-up">
        <div className="glass-card rounded-3xl p-8 card-lift">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 grad-burgundy rounded-2xl flex items-center justify-center mx-auto mb-4 glow-burgundy">
              <FiShield size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-dark)] font-display">
              Admin Control Panel
            </h2>
            <p className="text-[var(--text-soft)] text-sm mt-1">
              Restricted Access — Authorized Personnel Only
            </p>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-[var(--cream)] border border-[var(--cream-dark)] flex items-start gap-2.5">
            <FiShield size={14} className="text-[var(--burgundy)] flex-shrink-0 mt-0.5" />
            <p className="text-[var(--text-soft)] text-xs leading-relaxed">
              This portal is for authorized hostel administrators only. All access attempts are logged.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-mid)] mb-1.5">
                Admin Email
              </label>
              <div className="input-icon-wrap">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@institution.edu"
                  className="input-premium"
                />
                <FiMail size={16} className="icon-left" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-mid)] mb-1.5">
                Password
              </label>
              <div className="relative input-icon-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter admin password"
                  className="input-premium"
                />
                <FiLock size={16} className="icon-left" />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--burgundy)] transition-colors"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 grad-burgundy text-white rounded-xl font-bold text-sm btn-magnetic"
            >
              {loading ? (
                <>
                  <FiLoader size={15} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Login
                  <FiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-[var(--text-soft)] text-sm">
              New admin?{" "}
              <Link to="/admin/signup" className="text-[var(--burgundy)] font-semibold hover:text-[var(--burgundy-light)] transition-colors">
                Register here
              </Link>
            </p>
            <Link to="/student/login" className="text-[var(--text-soft)] text-xs hover:text-[var(--burgundy)] transition-colors block">
              Student portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
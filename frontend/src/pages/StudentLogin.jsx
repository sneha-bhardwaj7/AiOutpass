import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLoader
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

/* ─── Color Tokens — Midnight Teal × Amber × Slate ─── */
const C = {
  inkBlack:    '#080C14',
  navyDeep:    '#0A1628',
  navyMid:     '#0F2347',
  navyLight:   '#1A3A6B',
  tealDeep:    '#0D4F4F',
  tealMid:     '#0A7C7C',
  tealBright:  '#0FB5B5',
  tealGlow:    '#1DE8E8',
  amber:       '#E8A020',
  amberLight:  '#F5BE58',
  slateGlass:  'rgba(255,255,255,0.04)',
  slateBorder: 'rgba(255,255,255,0.08)',
  slateText:   'rgba(220,230,255,0.55)',
  slateLight:  'rgba(220,230,255,0.75)',
  white:       '#F0F6FF',
  offWhite:    '#D4E4FF',
};

const StudentLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials');
      localStorage.setItem('token', data.token);
      login({ _id: data.id, name: data.name, email: data.email, role: data.role }, data.role, data.token);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: field === 'password' ? '13px 48px 13px 46px' : '13px 16px 13px 46px',
    borderRadius: 12,
    border: `1.5px solid ${focusedField === field ? C.tealBright : 'rgba(255,255,255,0.1)'}`,
    background: focusedField === field ? 'rgba(11,181,181,0.06)' : 'rgba(255,255,255,0.04)',
    color: C.white,
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxShadow: focusedField === field ? `0 0 0 3px rgba(11,181,181,0.12)` : 'none',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(170deg, ${C.inkBlack} 0%, ${C.navyDeep} 50%, #050E1F 100%)`,
      fontFamily: 'DM Sans, sans-serif', padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(220,230,255,0.28) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,18px) scale(1.1)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,-14px) scale(1.08)} }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(11,181,181,0.08) 0%, transparent 60%)`, animation: 'floatOrb1 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 420, height: 420, borderRadius: '50%', background: `radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 65%)`, animation: 'floatOrb2 11s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(11,181,181,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(11,181,181,0.03) 1px,transparent 1px)`, backgroundSize: '64px 64px', pointerEvents: 'none', opacity: 0.5 }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 11,
            background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 24px rgba(11,181,181,0.4)`,
          }}>
            <MdOutlineSchool size={21} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 24, color: C.white, letterSpacing: -0.5 }}>
            Pass<span style={{ color: C.tealBright }}>Gate</span>
            <span style={{ color: C.slateText, fontWeight: 300 }}> AI</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,22,48,0.7)',
          backdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: `1px solid rgba(11,181,181,0.15)`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(11,181,181,0.1)`,
          padding: '40px 36px',
        }}>
          {/* Top teal line */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${C.tealBright}80, transparent)`, borderRadius: 2 }} />

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 30, fontWeight: 800, color: C.white, marginBottom: 8, letterSpacing: -1 }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: 14, color: C.slateText, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
              Sign in to your student portal
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: 24, padding: '12px 16px', borderRadius: 12,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#f87171', fontFamily: 'DM Sans, sans-serif' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: focusedField === 'email' ? C.tealBright : C.slateText, marginBottom: 8, fontFamily: 'DM Mono, monospace', transition: 'color 0.2s' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focusedField === 'email' ? C.tealBright : 'rgba(220,230,255,0.3)', transition: 'color 0.25s', pointerEvents: 'none' }} />
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="student@college.edu"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  style={inputStyle('email')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: focusedField === 'password' ? C.tealBright : C.slateText, marginBottom: 8, fontFamily: 'DM Mono, monospace', transition: 'color 0.2s' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: focusedField === 'password' ? C.tealBright : 'rgba(220,230,255,0.3)', transition: 'color 0.25s', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter your password"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  style={inputStyle('password')}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,230,255,0.35)', padding: 0, display: 'flex' }}>
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 4, padding: '14px 20px', borderRadius: 12, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`,
              color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: `0 8px 28px rgba(11,181,181,0.32)`, transition: 'all 0.28s',
              opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 36px rgba(11,181,181,0.48)`; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 28px rgba(11,181,181,0.32)`; }}>
              {loading
                ? <><FiLoader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</>
                : <>Sign In <FiArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid rgba(255,255,255,0.07)`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: C.slateText, fontFamily: 'DM Sans, sans-serif' }}>
              Don't have an account?{' '}
              <Link to="/student/signup" style={{ color: C.tealBright, fontWeight: 700, textDecoration: 'none' }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Admin link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.slateText, fontFamily: 'DM Sans, sans-serif' }}>
          <Link to="/admin/login" style={{ color: C.slateText, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = C.white}
            onMouseLeave={e => e.target.style.color = C.slateText}>
            Admin portal →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
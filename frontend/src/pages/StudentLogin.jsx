// src/pages/StudentLogin.jsx — FIX: use BASE_URL + path, not hardcoded full URL
// This prevents the doubled path bug: /api/auth/api/auth/student/login → 404

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLoader, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import PageBackground, { T, GCSS } from '../components/Pagebackground';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, rightEl }) {
  const [f, sF] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: f ? T.mid : T.inkDim, transition: 'color 0.2s' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: f ? T.mid : T.inkDim, transition: 'color 0.22s', pointerEvents: 'none' }}><Icon size={14} /></div>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => sF(true)} onBlur={() => sF(false)}
          style={{ width: '100%', padding: rightEl ? '12px 42px 12px 40px' : '12px 14px 12px 40px', borderRadius: 12, border: `1.5px solid ${f ? T.focusBd : T.inputBd}`, background: f ? T.focusBg : T.inputBg, color: T.ink, fontSize: 14, transition: 'all 0.22s', boxShadow: f ? T.focusSh : 'none', outline: 'none' }} />
        {rightEl && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
      </div>
    </div>
  );
}

export default function StudentLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      // ✅ FIXED: BASE_URL="http://localhost:5000" + "/api/auth/student/login"
      const res = await fetch(`${BASE_URL}/api/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials');
      login({ _id: data.id, name: data.name, email: data.email, role: data.role, phone: data.phone, avatar: data.avatar, bio: data.bio, studentId: data.studentId, collegeId: data.collegeId, hostelRoom: data.hostelRoom, department: data.department, year: data.year }, data.role, data.token);
      navigate('/student/dashboard');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <style>{GCSS}</style>
      <PageBackground />
      <div style={{ width: '100%', maxWidth: 448, position: 'relative', zIndex: 1, animation: 'fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
        <div style={{ background: T.glass, backdropFilter: 'blur(36px)', border: `1px solid ${T.glassBd}`, borderRadius: 26, boxShadow: T.glassSh, padding: '42px 38px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${T.deep},${T.mid},${T.bright})` }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, borderRadius: '0 26px 0 100%', background: 'rgba(139,123,200,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 150, height: 150, borderRadius: '0 100% 0 0', background: 'rgba(91,74,155,0.05)', pointerEvents: 'none' }} />

          <div style={{ textAlign: 'center', marginBottom: 30, paddingTop: 6 }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, margin: '0 auto 18px', background: `linear-gradient(135deg,${T.deep},${T.mid})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 32px rgba(91,74,155,0.38)`, animation: 'bob 3.5s ease-in-out infinite' }}>
              <FiUser size={30} color="rgba(255,255,255,0.94)" />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 28, color: T.ink, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 7 }}>Student Portal</h2>
            <p style={{ fontSize: 13, color: T.inkSoft, fontWeight: 300 }}>Sign in to manage your outpass requests</p>
          </div>

          {error && (
            <div style={{ marginBottom: 20, padding: '13px 16px', borderRadius: 13, background: T.errBg, border: `1px solid ${T.errBd}`, display: 'flex', gap: 10, animation: 'fadeIn 0.3s both' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.err, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 13, color: T.err }}>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>
            <Field label="Email Address" icon={FiMail} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
            <Field label="Password" icon={FiLock} type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter your password"
              rightEl={<button type="button" onClick={() => setShow(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.inkDim, padding: 0, display: 'flex' }}>{show ? <FiEyeOff size={14} /> : <FiEye size={14} />}</button>} />
            <button type="submit" disabled={loading}
              style={{ marginTop: 8, padding: '14px 20px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${T.deep} 0%,${T.mid} 55%,${T.bright} 100%)`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.76 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: `0 8px 26px rgba(91,74,155,0.40)`, transition: 'all 0.25s' }}>
              {loading ? <><FiLoader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</> : <>Sign In <FiArrowRight size={14} /></>}
            </button>
          </form>

          <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <p style={{ fontSize: 13, color: T.inkSoft }}>New student? <Link to="/student/signup" style={{ color: T.mid, fontWeight: 600, textDecoration: 'none' }}>Register here</Link></p>
            <Link to="/admin/login" style={{ fontSize: 10, color: T.inkDim, textDecoration: 'none', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Admin portal →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
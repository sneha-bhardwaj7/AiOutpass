import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiLoader, FiCheckCircle, FiAlertCircle, FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

/* ─── Color Tokens ─── */
const C = {
  inkBlack:    '#080C14',
  navyDeep:    '#0A1628',
  navyMid:     '#0F2347',
  tealDeep:    '#0D4F4F',
  tealMid:     '#0A7C7C',
  tealBright:  '#0FB5B5',
  amber:       '#E8A020',
  amberLight:  '#F5BE58',
  slateGlass:  'rgba(255,255,255,0.04)',
  slateBorder: 'rgba(255,255,255,0.08)',
  slateText:   'rgba(220,230,255,0.55)',
  slateLight:  'rgba(220,230,255,0.75)',
  white:       '#F0F6FF',
};

/* ─── Field Component ─── */
function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, error, success, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 3,
        textTransform: 'uppercase', color: focused ? C.tealBright : C.slateText,
        marginBottom: 8, fontFamily: 'DM Mono, monospace', transition: 'color 0.2s',
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
          color: focused ? C.tealBright : 'rgba(220,230,255,0.28)',
          transition: 'color 0.25s', pointerEvents: 'none',
        }}>
          <Icon size={15} />
        </div>
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: rightEl ? '13px 46px 13px 44px' : '13px 16px 13px 44px',
            borderRadius: 12,
            border: `1.5px solid ${error ? '#ef4444' : success ? '#10b981' : focused ? C.tealBright : 'rgba(255,255,255,0.1)'}`,
            background: focused ? 'rgba(11,181,181,0.06)' : 'rgba(255,255,255,0.04)',
            color: C.white, fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none',
            transition: 'all 0.25s',
            boxShadow: focused ? `0 0 0 3px rgba(11,181,181,0.12)` : error ? `0 0 0 3px rgba(239,68,68,0.1)` : 'none',
          }}
        />
        {rightEl && (
          <div style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)' }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 11, color: '#f87171', marginTop: 5, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─── Password Strength ─── */
function StrengthBar({ password }) {
  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const s = getStrength();
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#60a5fa', '#10b981'];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= s ? colors[s] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s', boxShadow: i <= s ? `0 0 8px ${colors[s]}80` : 'none' }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[s], fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
        {labels[s]} password
      </span>
    </div>
  );
}

/* ─── Main ─── */
const AdminSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const canSubmit = form.name && form.email && form.password.length >= 8 && form.password === form.confirmPassword;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true); setError('');
    try {
      const payload = { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password };
      const res = await fetch('http://localhost:5000/api/auth/admin/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('token', data.token);
      login({ _id: data.id, name: data.name, email: data.email, role: data.role }, data.role, data.token);
      navigate('/admin/dashboard');
    } catch (err) { setError(err.message || 'Signup failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(170deg, ${C.inkBlack} 0%, ${C.navyDeep} 50%, #050E1F 100%)`,
      fontFamily: 'DM Sans, sans-serif', padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(220,230,255,0.28) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,16px)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-14px)} }
        @keyframes pulseShield { 0%,100%{box-shadow:0 0 24px rgba(232,160,32,0.3)} 50%{box-shadow:0 0 40px rgba(232,160,32,0.5)} }
      `}</style>

      {/* Background */}
      <div style={{ position: 'absolute', top: '-8%', right: '-4%', width: 480, height: 480, borderRadius: '50%', background: `radial-gradient(circle, rgba(11,181,181,0.07) 0%, transparent 60%)`, animation: 'floatOrb1 10s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '-4%', width: 420, height: 420, borderRadius: '50%', background: `radial-gradient(circle, rgba(232,160,32,0.07) 0%, transparent 65%)`, animation: 'floatOrb2 12s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(11,181,181,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(11,181,181,0.03) 1px,transparent 1px)`, backgroundSize: '64px 64px', pointerEvents: 'none', opacity: 0.4 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px rgba(11,181,181,0.4)` }}>
            <FiShield size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 24, color: C.white, letterSpacing: -0.5 }}>
            Pass<span style={{ color: C.tealBright }}>Gate</span>
            <span style={{ color: C.slateText, fontWeight: 300 }}> AI</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,22,48,0.72)', backdropFilter: 'blur(24px)', borderRadius: 24,
          border: `1px solid rgba(232,160,32,0.15)`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(232,160,32,0.08)`,
          padding: '40px 36px 34px', position: 'relative',
        }}>
          {/* Amber accent top line */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${C.amberLight}70, transparent)`, borderRadius: 2 }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `linear-gradient(135deg, rgba(13,79,79,0.8), rgba(10,118,118,0.6))`,
              border: `1.5px solid rgba(232,160,32,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulseShield 3s ease-in-out infinite',
            }}>
              <FiShield size={24} color={C.amberLight} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 800, color: C.white, letterSpacing: -0.7, lineHeight: 1.1, marginBottom: 4 }}>
                Admin Registration
              </h1>
              <p style={{ fontSize: 13, color: C.slateText, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>
                Create an authorized administrator account
              </p>
            </div>
          </div>

          {/* Warning badge */}
          <div style={{
            marginBottom: 24, padding: '11px 15px', borderRadius: 11,
            background: `rgba(232,160,32,0.07)`, border: `1px solid rgba(232,160,32,0.18)`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <FiShield size={13} style={{ color: C.amberLight, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: 'rgba(245,190,88,0.75)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5, margin: 0 }}>
              Admin accounts require institutional approval. Unauthorized access is prohibited.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FiAlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#f87171', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Full Name" icon={FiUser} value={form.name} onChange={set('name')} placeholder="Admin full name" />
            <Field label="Email Address" icon={FiMail} type="email" value={form.email} onChange={set('email')} placeholder="admin@institution.edu" />

            <div>
              <Field label="Password" icon={FiLock} type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters"
                rightEl={
                  <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,230,255,0.35)', padding: 0, display: 'flex' }}>
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                } />
              <StrengthBar password={form.password} />
            </div>

            <Field label="Confirm Password" icon={FiLock} type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password"
              error={form.confirmPassword && form.password !== form.confirmPassword ? "Passwords don't match" : ''}
              success={form.confirmPassword && form.password === form.confirmPassword}
              rightEl={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {form.confirmPassword && form.password === form.confirmPassword && <FiCheckCircle size={14} color="#10b981" />}
                  <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,230,255,0.35)', padding: 0, display: 'flex' }}>
                    {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              } />

            <button onClick={handleSubmit} disabled={!canSubmit || loading} style={{
              width: '100%', marginTop: 8, padding: '14px 20px', borderRadius: 12, border: 'none',
              cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
              background: canSubmit && !loading ? `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})` : 'rgba(255,255,255,0.07)',
              color: canSubmit && !loading ? '#fff' : 'rgba(220,230,255,0.25)',
              fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxShadow: canSubmit && !loading ? `0 8px 28px rgba(11,181,181,0.3)` : 'none',
              transition: 'all 0.28s',
            }}
              onMouseEnter={e => { if (canSubmit && !loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 36px rgba(11,181,181,0.45)`; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canSubmit ? `0 8px 28px rgba(11,181,181,0.3)` : 'none'; }}>
              {loading
                ? <><FiLoader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Registering…</>
                : <><FiCheckCircle size={15} /> Register Admin Account <FiArrowRight size={15} /></>}
            </button>
          </div>

          <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.07)`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: C.slateText, fontFamily: 'DM Sans, sans-serif' }}>
              Already registered?{' '}
              <Link to="/admin/login" style={{ color: C.tealBright, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiHash, FiHome, FiPhone, FiCheckCircle, FiAlertCircle, FiLoader
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
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

/* ─── Input Field ─── */
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
            color: C.white,
            fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none',
            transition: 'all 0.25s ease',
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

/* ─── Select Field ─── */
function SelectField({ label, value, onChange, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 3,
        textTransform: 'uppercase', color: focused ? C.tealBright : C.slateText,
        marginBottom: 8, fontFamily: 'DM Mono, monospace', transition: 'color 0.2s',
      }}>{label}</label>
      <select value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '13px 16px', borderRadius: 12,
          border: `1.5px solid ${focused ? C.tealBright : 'rgba(255,255,255,0.1)'}`,
          background: focused ? 'rgba(11,181,181,0.06)' : 'rgba(255,255,255,0.04)',
          color: value ? C.white : 'rgba(220,230,255,0.28)',
          fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none',
          transition: 'all 0.25s', appearance: 'none',
          boxShadow: focused ? `0 0 0 3px rgba(11,181,181,0.12)` : 'none',
        }}>
        <option value="" style={{ background: C.navyMid }}>{placeholder}</option>
        {options.map(o => <option key={o} value={o} style={{ background: C.navyMid }}>{o}</option>)}
      </select>
    </div>
  );
}

/* ─── Password Strength Bar ─── */
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
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= s ? colors[s] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
            boxShadow: i <= s ? `0 0 8px ${colors[s]}80` : 'none',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[s], fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
        {labels[s]} password
      </span>
    </div>
  );
}

/* ─── Step Indicator ─── */
function StepDots({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
      {[1, 2].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace',
            transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
            background: current > s
              ? 'linear-gradient(135deg, #0a7c7c, #10b981)'
              : current === s
                ? `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`
                : 'rgba(255,255,255,0.06)',
            color: current >= s ? '#fff' : C.slateText,
            border: `1.5px solid ${current >= s ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: current === s ? `0 0 20px rgba(11,181,181,0.4)` : 'none',
          }}>
            {current > s ? <FiCheckCircle size={14} /> : s}
          </div>
          {i < 1 && (
            <div style={{
              width: 48, height: 2, borderRadius: 1,
              background: current > 1
                ? `linear-gradient(90deg, ${C.tealBright}, rgba(11,181,181,0.3))`
                : 'rgba(255,255,255,0.08)',
              transition: 'background 0.5s',
            }} />
          )}
        </div>
      ))}
      <span style={{ fontSize: 10, color: C.slateText, fontFamily: 'DM Mono, monospace', letterSpacing: 1.5, marginLeft: 4 }}>
        STEP {current} / 2
      </span>
    </div>
  );
}

/* ─── Main Component ─── */
const StudentSignup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    collegeId: '', hostelRoom: '', phone: '', department: '', year: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const canNext1 = form.name.trim() && form.email.trim() && form.password.length >= 8 && form.password === form.confirmPassword;
  const canSubmit = canNext1 && form.collegeId.trim() && form.hostelRoom.trim();

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true); setError('');
    try {
      const payload = { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, studentId: form.collegeId.trim(), hostelRoom: form.hostelRoom.trim(), phone: form.phone.trim() || undefined };
      const res = await fetch('http://localhost:5000/api/auth/student/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('token', data.token);
      login({ _id: data.id, name: data.name, email: data.email, role: data.role }, data.role, data.token);
      navigate('/student/dashboard');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const btnStyle = (enabled) => ({
    width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
    background: enabled ? `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})` : 'rgba(255,255,255,0.07)',
    color: enabled ? '#fff' : 'rgba(220,230,255,0.25)',
    fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    boxShadow: enabled ? `0 8px 28px rgba(11,181,181,0.3)` : 'none',
    transition: 'all 0.28s',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(170deg, ${C.inkBlack} 0%, ${C.navyDeep} 50%, #050E1F 100%)`,
      fontFamily: 'DM Sans, sans-serif', padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, select::placeholder { color: rgba(220,230,255,0.28) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,18px)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-14px)} }
      `}</style>

      {/* Background */}
      <div style={{ position: 'absolute', top: '-8%', right: '-4%', width: 480, height: 480, borderRadius: '50%', background: `radial-gradient(circle, rgba(11,181,181,0.08) 0%, transparent 60%)`, animation: 'floatOrb1 10s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '-4%', width: 420, height: 420, borderRadius: '50%', background: `radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 65%)`, animation: 'floatOrb2 12s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(11,181,181,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(11,181,181,0.03) 1px,transparent 1px)`, backgroundSize: '64px 64px', pointerEvents: 'none', opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px rgba(11,181,181,0.4)` }}>
            <MdOutlineSchool size={21} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 24, color: C.white, letterSpacing: -0.5 }}>
            Pass<span style={{ color: C.tealBright }}>Gate</span>
            <span style={{ color: C.slateText, fontWeight: 300 }}> AI</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,22,48,0.7)', backdropFilter: 'blur(24px)', borderRadius: 24,
          border: `1px solid rgba(11,181,181,0.15)`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(11,181,181,0.1)`,
          padding: '38px 36px 32px', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${C.tealBright}70, transparent)`, borderRadius: 2 }} />

          <StepDots current={step} />

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 6 }}>
              {step === 1 ? 'Create Account' : 'Academic Details'}
            </h1>
            <p style={{ fontSize: 13, color: C.slateText, lineHeight: 1.6 }}>
              {step === 1 ? 'Set up your secure login credentials' : 'Tell us about your hostel and college'}
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FiAlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#f87171', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Full Name" icon={FiUser} value={form.name} onChange={set('name')} placeholder="Your full name" />
              <Field label="Email Address" icon={FiMail} type="email" value={form.email} onChange={set('email')} placeholder="student@college.edu" />
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
              <button onClick={() => { setError(''); setStep(2); }} disabled={!canNext1} style={{ ...btnStyle(canNext1), marginTop: 8 }}
                onMouseEnter={e => { if (canNext1) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 36px rgba(11,181,181,0.45)`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canNext1 ? `0 8px 28px rgba(11,181,181,0.3)` : 'none'; }}>
                Continue to Step 2 <FiArrowRight size={15} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="College ID / Roll No." icon={FiHash} value={form.collegeId} onChange={set('collegeId')} placeholder="e.g. CSE2021001" />
              <Field label="Hostel & Room Number" icon={FiHome} value={form.hostelRoom} onChange={set('hostelRoom')} placeholder="e.g. Block A, Room 204" />
              <Field label="Phone Number" icon={FiPhone} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 9876543210" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <SelectField label="Department" value={form.department} onChange={set('department')} options={['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Other']} placeholder="Select dept." />
                <SelectField label="Year" value={form.year} onChange={set('year')} options={['1st Year', '2nd Year', '3rd Year', '4th Year']} placeholder="Select year" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={() => { setError(''); setStep(1); }} style={{
                  padding: '13px 20px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)', border: `1.5px solid rgba(255,255,255,0.1)`,
                  color: C.slateLight, fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={!canSubmit || loading} style={{ ...btnStyle(canSubmit && !loading), flex: 1 }}
                  onMouseEnter={e => { if (canSubmit && !loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 14px 36px rgba(11,181,181,0.45)`; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canSubmit ? `0 8px 28px rgba(11,181,181,0.3)` : 'none'; }}>
                  {loading
                    ? <><FiLoader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
                    : <><FiCheckCircle size={15} /> Create Account</>}
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.07)`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: C.slateText, fontFamily: 'DM Sans, sans-serif' }}>
              Already have an account?{' '}
              <Link to="/student/login" style={{ color: C.tealBright, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
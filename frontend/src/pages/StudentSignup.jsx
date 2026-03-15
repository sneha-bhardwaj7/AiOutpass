import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiHash, FiHome, FiPhone, FiCheckCircle, FiAlertCircle, FiLoader
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

/* ─── Color tokens ─── */
const C = {
  deep: '#4A0F23',
  dark: '#2D0519',
  mid: '#8B2342',
  vivid: '#B8445E',
  light: '#C8607A',
  cream: '#FFF8EE',
  creamW: '#F7EDD8',
  creamM: '#EDD9B0',
  creamD: '#D4B896',
  gold: '#C8943A',
  goldL: '#E8B85C',
  text: '#1A0A10',
  textS: '#6B3040',
};

/* ─── Reusable Input Field ─── */
function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, error, success, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2,
        textTransform: 'uppercase', color: focused ? C.vivid : C.textS,
        marginBottom: 8, fontFamily: 'Outfit, sans-serif',
        transition: 'color 0.2s',
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: focused ? C.vivid : `rgba(107,48,64,0.4)`,
          transition: 'color 0.25s', pointerEvents: 'none',
        }}>
          <Icon size={15} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: rightEl ? '13px 44px 13px 42px' : '13px 16px 13px 42px',
            borderRadius: 14,
            border: `1.5px solid ${error ? '#ef4444' : success ? '#10b981' : focused ? C.vivid : 'rgba(212,184,150,0.5)'}`,
            background: focused ? 'rgba(255,255,255,0.95)' : 'rgba(255,252,246,0.8)',
            color: C.text,
            fontSize: 14,
            fontFamily: 'Outfit, sans-serif',
            outline: 'none',
            transition: 'all 0.25s ease',
            boxShadow: focused
              ? `0 0 0 3px rgba(184,68,94,0.1), 0 2px 12px rgba(184,68,94,0.06)`
              : '0 1px 4px rgba(74,15,35,0.04)',
          }}
        />
        {rightEl && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 11, color: '#ef4444', marginTop: 5, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
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
        display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 2,
        textTransform: 'uppercase', color: focused ? C.vivid : C.textS,
        marginBottom: 8, fontFamily: 'Outfit, sans-serif', transition: 'color 0.2s',
      }}>{label}</label>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '13px 16px', borderRadius: 14,
          border: `1.5px solid ${focused ? C.vivid : 'rgba(212,184,150,0.5)'}`,
          background: focused ? 'rgba(255,255,255,0.95)' : 'rgba(255,252,246,0.8)',
          color: value ? C.text : 'rgba(107,48,64,0.4)',
          fontSize: 14, fontFamily: 'Outfit, sans-serif', outline: 'none',
          transition: 'all 0.25s', appearance: 'none',
          boxShadow: focused ? `0 0 0 3px rgba(184,68,94,0.1)` : '0 1px 4px rgba(74,15,35,0.04)',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
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
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= s ? colors[s] : 'rgba(212,184,150,0.3)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[s], fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
        {labels[s]} password
      </span>
    </div>
  );
}

/* ─── Step Indicator ─── */
function StepDots({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
      {[1, 2].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
            background: current > s
              ? '#10b981'
              : current === s
                ? `linear-gradient(135deg, ${C.mid}, ${C.vivid})`
                : 'rgba(212,184,150,0.25)',
            color: current >= s ? 'white' : C.textS,
            boxShadow: current === s ? `0 4px 14px rgba(184,68,94,0.35)` : 'none',
          }}>
            {current > s ? <FiCheckCircle size={14} /> : s}
          </div>
          {i < 1 && (
            <div style={{
              width: 40, height: 2, borderRadius: 1,
              background: current > 1
                ? 'linear-gradient(90deg, #10b981, rgba(16,185,129,0.4))'
                : 'rgba(212,184,150,0.3)',
              transition: 'background 0.5s',
            }} />
          )}
        </div>
      ))}
      <span style={{ fontSize: 11, color: `rgba(107,48,64,0.5)`, fontFamily: 'Outfit, sans-serif', letterSpacing: 1, marginLeft: 4 }}>
        Step {current} of 2
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const canNext1 = form.name.trim() && form.email.trim() &&
    form.password.length >= 8 && form.password === form.confirmPassword;
  const canSubmit = canNext1 && form.collegeId.trim() && form.hostelRoom.trim();

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        studentId: form.collegeId.trim(),
        hostelRoom: form.hostelRoom.trim(),
        phone: form.phone.trim() || undefined,
      };

      console.log('📤 Signup request:', payload);

      const res = await fetch('http://localhost:5000/api/auth/student/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('📥 Signup response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);

      const user = {
        _id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      login(user, data.role, data.token);
      navigate('/student/dashboard');

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const panelAnim = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'Outfit', sans-serif",
      background: C.cream,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(107,48,64,0.35) !important; }
      `}</style>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative',
        background: `radial-gradient(ellipse at 70% 20%, rgba(212,184,150,0.2) 0%, transparent 50%), ${C.cream}`,
      }}>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, ...panelAnim }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.mid}, ${C.vivid})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdOutlineSchool size={18} color={C.cream} />
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 22, color: C.text }}>
              Pass<span style={{ color: C.vivid }}>With</span>AI
            </span>
          </div>

          <div style={{
            background: 'rgba(255,252,246,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(212,184,150,0.35)',
            boxShadow: '0 8px 48px rgba(74,15,35,0.08)',
            padding: '36px 36px 32px',
          }}>
            <StepDots current={step} />

            <div style={{ marginBottom: 28 }}>
              <h1 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 30, fontWeight: 700, color: C.text,
                letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 6,
              }}>
                {step === 1 ? 'Create Account' : 'Academic Details'}
              </h1>
              <p style={{ fontSize: 13, color: `rgba(107,48,64,0.55)`, lineHeight: 1.6 }}>
                {step === 1 ? 'Set up your login credentials' : 'Tell us about your hostel and college'}
              </p>
            </div>

            {error && (
              <div style={{
                marginBottom: 20, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <FiAlertCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: '#dc2626', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            {step === 1 && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Field label="Full Name" icon={FiUser} value={form.name} onChange={set('name')} placeholder="Your full name" />
                  <Field label="Email Address" icon={FiMail} type="email" value={form.email} onChange={set('email')} placeholder="student@college.edu" />

                  <div>
                    <Field
                      label="Password"
                      icon={FiLock}
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min. 8 characters"
                      rightEl={
                        <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: `rgba(107,48,64,0.45)`, padding: 0, display: 'flex' }}>
                          {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      }
                    />
                    <StrengthBar password={form.password} />
                  </div>

                  <Field
                    label="Confirm Password"
                    icon={FiLock}
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Re-enter password"
                    error={form.confirmPassword && form.password !== form.confirmPassword ? "Passwords don't match" : ''}
                    success={form.confirmPassword && form.password === form.confirmPassword}
                    rightEl={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {form.confirmPassword && form.password === form.confirmPassword && <FiCheckCircle size={14} color="#10b981" />}
                        <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: `rgba(107,48,64,0.45)`, padding: 0, display: 'flex' }}>
                          {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                      </div>
                    }
                  />
                </div>

                <button
                  onClick={() => { setError(''); setStep(2); }}
                  disabled={!canNext1}
                  style={{
                    width: '100%', marginTop: 24,
                    padding: '14px 20px', borderRadius: 14,
                    border: 'none', cursor: canNext1 ? 'pointer' : 'not-allowed',
                    background: canNext1
                      ? `linear-gradient(135deg, ${C.mid}, ${C.vivid})`
                      : 'rgba(212,184,150,0.4)',
                    color: canNext1 ? C.cream : `rgba(107,48,64,0.4)`,
                    fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: canNext1 ? `0 6px 20px rgba(184,68,94,0.3)` : 'none',
                    transition: 'all 0.25s',
                  }}
                >
                  Continue to Step 2 <FiArrowRight size={15} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Field label="College ID / Roll No." icon={FiHash} value={form.collegeId} onChange={set('collegeId')} placeholder="e.g. CSE2021001" />
                  <Field label="Hostel & Room Number" icon={FiHome} value={form.hostelRoom} onChange={set('hostelRoom')} placeholder="e.g. Block A, Room 204" />
                  <Field label="Phone Number" icon={FiPhone} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 9876543210" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <SelectField
                      label="Department"
                      value={form.department}
                      onChange={set('department')}
                      options={['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Other']}
                      placeholder="Select dept."
                    />
                    <SelectField
                      label="Year"
                      value={form.year}
                      onChange={set('year')}
                      options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
                      placeholder="Select year"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button
                    onClick={() => { setError(''); setStep(1); }}
                    style={{
                      padding: '13px 20px', borderRadius: 14,
                      background: 'transparent',
                      border: `1.5px solid rgba(212,184,150,0.6)`,
                      color: C.textS, fontSize: 14, fontWeight: 600,
                      fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    style={{
                      flex: 1, padding: '13px 20px', borderRadius: 14,
                      border: 'none', cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                      background: canSubmit && !loading
                        ? `linear-gradient(135deg, ${C.mid}, ${C.vivid})`
                        : 'rgba(212,184,150,0.4)',
                      color: canSubmit && !loading ? C.cream : `rgba(107,48,64,0.4)`,
                      fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: canSubmit && !loading ? `0 6px 20px rgba(184,68,94,0.3)` : 'none',
                      transition: 'all 0.25s',
                    }}
                  >
                    {loading
                      ? <><FiLoader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
                      : <><FiCheckCircle size={15} /> Create Account</>}
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(212,184,150,0.3)', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: `rgba(107,48,64,0.5)` }}>
                Already have an account?{' '}
                <Link to="/student/login" style={{ color: C.vivid, fontWeight: 700, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
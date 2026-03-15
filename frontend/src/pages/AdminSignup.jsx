import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiLoader, FiCheckCircle, FiAlertCircle, FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminSignup = () => {
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = passwordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];

  const canSubmit =
    form.name &&
    form.email &&
    form.password &&
    form.password === form.confirmPassword &&
    form.password.length >= 8;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      // ✅ FIX: Only send fields that backend expects
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      console.log('📤 Admin signup request:', payload);

      const res = await fetch('http://localhost:5000/api/auth/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('📥 Admin signup response:', data);

      if (!res.ok) throw new Error(data.message || 'Signup failed');

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
      console.error('❌ Admin signup error:', err);
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        fontFamily: "'Crimson Pro', serif",
        background: "linear-gradient(135deg, var(--cream-warm) 0%, var(--cream) 100%)"
      }}
    >
      {/* Floating blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--cream-deep)] opacity-40 blur-3xl blob-morph"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--burgundy-light)] opacity-20 blur-3xl blob-morph"></div>

      {/* Floating particles */}
      <div className="particle w-3 h-3 bg-[var(--gold)] left-[20%] top-[70%]" style={{ animationDuration: "9s" }}></div>
      <div className="particle w-2 h-2 bg-[var(--burgundy-light)] left-[60%] top-[80%]" style={{ animationDuration: "11s" }}></div>

      <div className="relative z-10 w-full max-w-lg anim-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 grad-burgundy rounded-xl flex items-center justify-center shadow-lg glow-burgundy">
            <FiShield size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black font-display text-[var(--text-dark)]">
            Pass<span className="grad-text-gold">WithAI</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 card-lift">
          <div className="mb-7">
            <h1 className="text-2xl font-black font-display text-[var(--text-dark)]">
              Admin Registration
            </h1>
            <p className="text-[var(--text-soft)] text-sm mt-1">
              Create an authorized administrator account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm flex gap-2">
              <FiAlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <DarkField label="Full Name" icon={FiUser} type="text" value={form.name} onChange={set('name')} placeholder="Admin name" />
            <DarkField label="Email Address" icon={FiMail} type="email" value={form.email} onChange={set('email')} placeholder="admin@institution.edu" />

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-mid)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 characters"
                  className="input-premium pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex gap-1 items-center">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full ${i<=strength ? strengthColor[strength] : "bg-gray-200"}`}
                    />
                  ))}
                  <span className="text-xs ml-2">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <DarkField label="Confirm Password" icon={FiLock} type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" />

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full py-3.5 grad-burgundy text-white rounded-xl font-bold flex items-center justify-center gap-2 btn-magnetic"
            >
              {loading
                ? <>
                    <FiLoader className="animate-spin" size={14}/>
                    Registering...
                  </>
                : <>
                    Register Admin Account
                    <FiArrowRight size={14}/>
                  </>
              }
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-soft)] text-sm">
              Already registered?{" "}
              <Link to="/admin/login" className="text-[var(--burgundy)] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DarkField = ({ label, icon: Icon, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-[var(--text-mid)] mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-premium pl-10"
      />
    </div>
  </div>
);

export default AdminSignup;
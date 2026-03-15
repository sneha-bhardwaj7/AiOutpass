import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLoader
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const StudentLogin = () => {
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
      console.log('📤 Login request');

      const res = await fetch('http://localhost:5000/api/auth/student/login', {
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
      console.log('📥 Login response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F7EDD8 0%, #FFF8EE 100%)',
        fontFamily: "'Outfit', sans-serif",
        padding: '24px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #8B2342, #B8445E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(184,68,94,0.3)',
          }}>
            <MdOutlineSchool size={22} color="#FFF8EE" />
          </div>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 700,
            fontSize: 28,
            color: '#1A0A10',
          }}>
            Pass<span style={{ color: '#B8445E' }}>With</span>AI
          </span>
        </div>

        <div style={{
          background: 'rgba(255,252,246,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(212,184,150,0.35)',
          boxShadow: '0 8px 48px rgba(74,15,35,0.08)',
          padding: '40px',
        }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 32,
              fontWeight: 700,
              color: '#1A0A10',
              marginBottom: 8,
            }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(107,48,64,0.6)' }}>
              Sign in to your student portal
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: 24,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: 13, color: '#dc2626' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#6B3040',
                marginBottom: 8,
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(107,48,64,0.4)',
                }} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="student@college.edu"
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 48px',
                    borderRadius: 14,
                    border: '1.5px solid rgba(212,184,150,0.5)',
                    background: 'rgba(255,252,246,0.8)',
                    color: '#1A0A10',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.25s',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#6B3040',
                marginBottom: 8,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(107,48,64,0.4)',
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '13px 48px 13px 48px',
                    borderRadius: 14,
                    border: '1.5px solid rgba(212,184,150,0.5)',
                    background: 'rgba(255,252,246,0.8)',
                    color: '#1A0A10',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.25s',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(107,48,64,0.45)',
                    padding: 0,
                  }}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 14,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #8B2342, #B8445E)',
                color: '#FFF8EE',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 6px 20px rgba(184,68,94,0.3)',
                transition: 'all 0.25s',
              }}
            >
              {loading ? (
                <>
                  <FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(212,184,150,0.3)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(107,48,64,0.5)' }}>
              Don't have an account?{' '}
              <Link to="/student/signup" style={{
                color: '#B8445E',
                fontWeight: 700,
                textDecoration: 'none',
              }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StudentLogin;
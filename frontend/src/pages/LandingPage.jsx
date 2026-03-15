import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap, FiUsers, FiCheckCircle, FiMenu, FiX } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
// import { BsWhatsapp } from 'react-icons/bs';
// import { AiOutlineRobot } from 'react-icons/ai';

/* ─── Color Tokens (same as original) ─── */
const C = {
  burgundyDeep:  '#4A0F23',
  burgundyDark:  '#5c001e',
  burgundyMid:   '#8B2342',
  burgundyVivid: '#B8445E',
  burgundyLight: '#C8607A',
  creamPure:     '#FFF8EE',
  creamWarm:     '#F7EDD8',
  creamMid:      '#EDD9B0',
  creamDark:     '#D4B896',
  gold:          '#C8943A',
  goldLight:     '#E8B85C',
  goldPale:      '#F5DFA8',
  textDark:      '#1A0A10',
};

/* ─── Inline styles ─── */
const S = {
  root: {
    fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
    background: C.creamPure,
    color: C.textDark,
    overflowX: 'hidden',
    minHeight: '100vh',
  },
};

/* ─── useInView hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    const isDecimal = String(target).includes('.');
    const end = parseFloat(target);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(isDecimal ? (ease * end).toFixed(1) : Math.round(ease * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#process' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '0' : '8px 0',
      transition: 'all 0.4s ease',
      background: scrolled ? 'rgba(74,15,35,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid rgba(255,255,255,0.08)` : 'none',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${C.burgundyMid}, ${C.burgundyVivid})`,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 16px rgba(184,68,94,0.35)`,
          }}>
            <span style={{ color: C.creamPure, fontWeight: 700, fontSize: 18, fontFamily: 'Cormorant Garamond, serif' }}>P</span>
          </div>
          <span style={{ color: C.creamPure, fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>
            Pass<span style={{ color: C.goldLight }}>With</span>AI
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="nav-links-desktop">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              color: 'rgba(247,237,216,0.7)', padding: '8px 16px', borderRadius: 8,
              textDecoration: 'none', fontSize: 14, fontFamily: 'Outfit, sans-serif', fontWeight: 500,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.color = C.creamPure; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(247,237,216,0.7)'; e.target.style.background = 'transparent'; }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="nav-ctas-desktop">
          <a href="/student/login" style={{
            color: 'rgba(247,237,216,0.8)', padding: '8px 18px', borderRadius: 8,
            textDecoration: 'none', fontSize: 14, fontFamily: 'Outfit, sans-serif', fontWeight: 500,
            border: '1px solid rgba(247,237,216,0.15)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = C.creamPure; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(247,237,216,0.8)'; }}>
            Sign In
          </a>
          <a href="/student/signup" style={{
            background: `linear-gradient(135deg, ${C.burgundyMid}, ${C.burgundyVivid})`,
            color: C.creamPure, padding: '9px 20px', borderRadius: 10,
            textDecoration: 'none', fontSize: 14, fontFamily: 'Outfit, sans-serif', fontWeight: 600,
            boxShadow: `0 4px 16px rgba(184,68,94,0.35)`, transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(184,68,94,0.45)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px rgba(184,68,94,0.35)`; }}>
            Get Started →
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(p => !p)} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, width: 36, height: 36, color: C.creamPure, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} className="nav-mobile-toggle">
          {open ? <FiX size={16} /> : <FiMenu size={16} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(74,15,35,0.98)', backdropFilter: 'blur(20px)',
          padding: '16px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', color: 'rgba(247,237,216,0.8)', padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none',
              fontFamily: 'Outfit, sans-serif', fontSize: 15,
            }}>{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <a href="/student/login" style={{
              flex: 1, textAlign: 'center', padding: '11px', borderRadius: 8,
              border: '1px solid rgba(247,237,216,0.2)', color: C.creamPure,
              textDecoration: 'none', fontFamily: 'Outfit, sans-serif', fontSize: 14,
            }}>Sign In</a>
            <a href="/student/signup" style={{
              flex: 1, textAlign: 'center', padding: '11px', borderRadius: 8,
              background: `linear-gradient(135deg, ${C.burgundyMid}, ${C.burgundyVivid})`,
              color: C.creamPure, textDecoration: 'none', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600,
            }}>Sign Up</a>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px) {
          .nav-links-desktop, .nav-ctas-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media(min-width:769px) {
          .nav-mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      minHeight: '100vh', position: 'relative',
      background: `linear-gradient(160deg, ${C.burgundyDeep} 0%, #2D0519 40%, #1A0A10 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Animated mesh background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(184,68,94,0.18) 0%, transparent 65%)`,
          animation: 'heroOrb1 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(200,148,58,0.12) 0%, transparent 65%)`,
          animation: 'heroOrb2 9s ease-in-out infinite',
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(247,237,216,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247,237,216,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${10 + (i * 7.5) % 80}%`,
            top: `${20 + (i * 13) % 60}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: i % 2 === 0 ? C.goldLight : C.burgundyLight,
            opacity: 0.5,
            animation: `particle ${4 + (i % 3)}s ease-in-out ${i * 0.4}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '120px 24px 80px', maxWidth: 860, margin: '0 auto' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(184,68,94,0.15)', border: `1px solid rgba(184,68,94,0.35)`,
          borderRadius: 100, padding: '6px 20px', marginBottom: 40,
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.goldLight, animation: 'pulse 2s infinite' }} />
          <span style={{ color: C.goldLight, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
            AI-Powered Campus Safety
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(52px, 9vw, 100px)',
          fontWeight: 300, lineHeight: 0.95, color: C.creamPure,
          letterSpacing: -2, marginBottom: 16,
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.8s 0.15s cubic-bezier(0.22,1,0.36,1)',
        }}>
          Smarter
          <span style={{
            display: 'block', fontStyle: 'italic', fontWeight: 600,
            background: `linear-gradient(135deg, ${C.burgundyLight}, ${C.goldLight})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Outpass.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 2.5vw, 24px)', letterSpacing: 5, textTransform: 'uppercase',
          color: 'rgba(247,237,216,0.45)', marginBottom: 32, fontFamily: 'Outfit, sans-serif', fontWeight: 300,
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}>Safer Campus.</p>

        <p style={{
          fontSize: 16, lineHeight: 1.9, color: 'rgba(247,237,216,0.55)',
          maxWidth: 520, margin: '0 auto 52px', fontFamily: 'Outfit, sans-serif', fontWeight: 300,
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}>
          Digitize your hostel outpass workflow with AI-driven consent verification,
          real-time parent notifications, and intelligent fraud detection.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72,
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <HoverBtn href="/student/login" primary>
            <MdOutlineSchool size={16} /> Student Portal <FiArrowRight size={14} />
          </HoverBtn>
          <HoverBtn href="/admin/login">
            <FiShield size={15} /> Admin Access
          </HoverBtn>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex', gap: 0, justifyContent: 'center',
          background: 'rgba(247,237,216,0.05)', border: '1px solid rgba(247,237,216,0.1)',
          borderRadius: 16, overflow: 'hidden', maxWidth: 480, margin: '0 auto',
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {[
            { val: 99, suffix: '%', label: 'AI Accuracy' },
            { val: 2, suffix: 'm', label: 'Avg Approval' },
            { val: 0, suffix: '', label: 'Manual Errors' },
          ].map(({ val, suffix, label }, i) => (
            <div key={label} style={{
              flex: 1, padding: '24px 16px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(247,237,216,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: C.goldLight, lineHeight: 1, marginBottom: 4 }}>
                <Counter target={val} suffix={suffix} />
              </div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(247,237,216,0.35)', fontFamily: 'Outfit, sans-serif' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll arrow */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        color: 'rgba(247,237,216,0.3)', animation: 'bounceY 2s ease-in-out infinite',
      }}>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, rgba(247,237,216,0.3), transparent)` }} />
        <span style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>Scroll</span>
      </div>

      <style>{`
        @keyframes heroOrb1 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(-20px,20px)} }
        @keyframes heroOrb2 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(20px,-15px)} }
        @keyframes particle { from{transform:translateY(0) scale(1);opacity:0.3} to{transform:translateY(-30px) scale(1.4);opacity:0.7} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
        @keyframes bounceY { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
      `}</style>
    </section>
  );
}

/* ─── Reusable hover button ─── */
function HoverBtn({ href, children, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '14px 28px', borderRadius: 12, textDecoration: 'none',
        fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 14,
        transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
        ...(primary ? {
          background: hov
            ? `linear-gradient(135deg, ${C.burgundyVivid}, ${C.burgundyLight})`
            : `linear-gradient(135deg, ${C.burgundyMid}, ${C.burgundyVivid})`,
          color: C.creamPure,
          boxShadow: hov ? `0 12px 32px rgba(184,68,94,0.5)` : `0 6px 20px rgba(184,68,94,0.3)`,
          transform: hov ? 'translateY(-3px)' : 'none',
        } : {
          background: hov ? 'rgba(247,237,216,0.1)' : 'rgba(247,237,216,0.05)',
          color: hov ? C.creamPure : 'rgba(247,237,216,0.75)',
          border: `1px solid ${hov ? 'rgba(247,237,216,0.3)' : 'rgba(247,237,216,0.15)'}`,
          transform: hov ? 'translateY(-3px)' : 'none',
        }),
      }}>
      {children}
    </a>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = ['AI Consent Analysis', 'WhatsApp Alerts', 'OTP Security', 'Fraud Detection', 'Audit Trails', 'Admin Dashboard', 'Real-Time Approval', 'Zero Manual Errors'];
  return (
    <div style={{ background: `linear-gradient(90deg, ${C.burgundyMid}, ${C.burgundyDeep} 50%, ${C.burgundyMid})`, overflow: 'hidden', padding: '14px 0', borderTop: `1px solid rgba(255,255,255,0.06)`, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 28px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, flexShrink: 0 }}>
            {item} <span style={{ color: C.goldLight, fontSize: 10 }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ title, desc, accent, index }) {
  const [hov, setHov] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [ref, visible] = useInView(0.08);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={handleClick}
      style={{
        background: hov
          ? `linear-gradient(145deg, ${C.burgundyMid} 0%, ${C.burgundyDeep} 100%)`
          : `linear-gradient(145deg, ${C.burgundyDeep} 0%, #3A0D1E 100%)`,
        border: `1px solid ${hov ? 'rgba(232,184,92,0.35)' : 'rgba(184,68,94,0.25)'}`,
        borderRadius: 24, padding: '40px 32px 36px', position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        transform: visible
          ? (clicked ? 'scale(0.97)' : hov ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)')
          : 'translateY(40px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 90}ms`,
        boxShadow: hov
          ? `0 28px 60px rgba(74,15,35,0.45), 0 0 0 1px rgba(232,184,92,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`
          : `0 8px 24px rgba(74,15,35,0.25), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Animated shimmer sweep on hover */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 24,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        animation: hov ? 'shimmerSweep 0.8s ease forwards' : 'none',
        pointerEvents: 'none',
      }} />

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '24px 24px 0 0',
        background: `linear-gradient(90deg, transparent, ${C.goldLight}, transparent)`,
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Glow orb top-right */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 140, height: 140,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(232,184,92,0.12) 0%, transparent 70%)`,
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Corner diamond decoration */}
      <div style={{
        position: 'absolute', top: 18, right: 18,
        width: 6, height: 6,
        background: hov ? C.goldLight : 'rgba(184,68,94,0.4)',
        transform: 'rotate(45deg)',
        transition: 'all 0.3s ease',
      }} />

      {/* Icon container
      <div style={{
        width: 56, height: 56, borderRadius: 16, marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? `rgba(232,184,92,0.15)` : 'rgba(247,237,216,0.07)',
        border: `1px solid ${hov ? 'rgba(232,184,92,0.4)' : 'rgba(247,237,216,0.12)'}`,
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        transform: hov ? 'scale(1.12) rotate(-6deg)' : 'scale(1) rotate(0deg)',
        boxShadow: hov ? `0 8px 24px rgba(0,0,0,0.3)` : 'none',
      }}>
        <Icon size={24} style={{ color: hov ? C.goldLight : C.creamMid, transition: 'color 0.3s' }} />
      </div> */}

      {/* Index tag */}
      <div style={{
        display: 'inline-block', padding: '2px 10px', borderRadius: 100,
        background: 'rgba(247,237,216,0.07)', border: '1px solid rgba(247,237,216,0.1)',
        fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
        color: 'rgba(247,237,216,0.35)', fontFamily: 'Outfit, sans-serif',
        marginBottom: 12,
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <h3 style={{
        color: hov ? C.creamPure : C.creamMid,
        fontSize: 20, fontWeight: 600, marginBottom: 12,
        fontFamily: 'Cormorant Garamond, serif', letterSpacing: 0.4,
        lineHeight: 1.2,
        transition: 'color 0.3s',
      }}>{title}</h3>

      <p style={{
        color: hov ? 'rgba(247,237,216,0.65)' : 'rgba(247,237,216,0.38)',
        fontSize: 14, lineHeight: 1.85,
        fontFamily: 'Outfit, sans-serif', fontWeight: 300,
        transition: 'color 0.3s',
      }}>{desc}</p>

      {/* Bottom arrow — appears on hover */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 24,
        opacity: hov ? 1 : 0,
        transform: hov ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all 0.35s ease',
      }}>
        <span style={{ fontSize: 12, color: C.goldLight, fontFamily: 'Outfit, sans-serif', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>Learn more</span>
        <FiArrowRight size={13} style={{ color: C.goldLight }} />
      </div>

      <style>{`
        @keyframes shimmerSweep {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Process Step ─── */
function ProcessStep({ step, title, desc, index }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{
      display: 'flex', gap: 20, alignItems: 'flex-start',
      opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-24px)',
      transition: `all 0.65s ${index * 100}ms cubic-bezier(0.22,1,0.36,1)`,
    }}>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.burgundyMid}, ${C.burgundyVivid})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.creamPure, fontWeight: 700, fontSize: 14, fontFamily: 'Outfit, sans-serif',
          boxShadow: `0 4px 16px rgba(184,68,94,0.3)`, flexShrink: 0,
        }}>{step}</div>
        {index < 4 && <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, rgba(184,68,94,0.4), transparent)`, marginTop: 4 }} />}
      </div>
      <div style={{ paddingTop: 10 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, color: C.textDark, marginBottom: 6, fontFamily: 'Cormorant Garamond, serif', letterSpacing: 0.3 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'rgba(26,10,16,0.55)', lineHeight: 1.7, fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Section Label ─── */
function SectionLabel({ children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 20, height: 1, background: C.burgundyVivid }} />
      <span style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: C.burgundyVivid, fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>{children}</span>
    </div>
  );
}

/* ─── Main Component ─── */
const features = [
  {  title: 'AI Consent Analysis', desc: 'LangChain analyzes parent responses with 95%+ accuracy to detect genuine consent vs. coercion.', accent: C.burgundyLight },
  {  title: 'Multi-Channel Notifications', desc: 'Parents receive WhatsApp, voice messages, and email with secure one-time verification links.', accent: '#2d9a5f' },
  { title: 'Fraud Detection', desc: 'AI risk analysis flags mismatches, suspicious patterns, and fake approvals in real time.', accent: C.gold },
  {  title: 'OTP Verification', desc: 'Multi-layer parent authentication prevents unauthorized approvals and ensures integrity.', accent: '#5b9cf6' },
  { title: 'Admin Dashboard', desc: 'Comprehensive control panel with AI summaries, risk indicators, and one-click workflows.', accent: '#a78bfa' },
  {  title: 'Audit Trails', desc: 'Tamper-proof logs of every action for regulatory compliance and accountability.', accent: '#34d399' },
];

const steps = [
  { step: '01', title: 'Student Submits Request', desc: 'Fill destination, dates, reason, and parent contact details in seconds.' },
  { step: '02', title: 'Parent Gets Notified', desc: 'WhatsApp, voice call & email sent with a secure approval link instantly.' },
  { step: '03', title: 'Parent Verifies & Approves', desc: 'OTP + identity verification confirms the parent is real and present.' },
  { step: '04', title: 'AI Analyzes Response', desc: 'LangChain validates consent, checks dates, and flags any anomalies.' },
  { step: '05', title: 'Admin Reviews & Decides', desc: 'Dashboard shows AI recommendation for swift final approval.' },
];

export default function LandingPage() {
  const [featRef, featVisible] = useInView(0.05);
  const [processRef, processVisible] = useInView(0.05);
  const [ctaRef, ctaVisible] = useInView(0.1);

  return (
    <div style={S.root}>
      <Navbar />
      <Hero />
      <Marquee />

      {/* ─── Features ─── */}
      <section id="features" style={{ padding: '110px 24px', background: C.creamWarm, position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(109,27,52,0.05) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(200,148,58,0.06) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        {/* Dot grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(109,27,52,0.08) 1px, transparent 1px)`, backgroundSize: '32px 32px', pointerEvents: 'none', opacity: 0.5 }} />

        <div ref={featRef} style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <SectionLabel>Platform Features</SectionLabel>
            <h2 style={{
              fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.textDark,
              letterSpacing: -1, lineHeight: 1.1, marginBottom: 16,
              opacity: featVisible ? 1 : 0, transform: featVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
            }}>
              Everything You{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 700, color: C.burgundyMid }}>Need</span>
            </h2>
            <p style={{
              fontSize: 15, color: 'rgba(26,10,16,0.5)', fontFamily: 'Outfit, sans-serif', fontWeight: 300,
              maxWidth: 440, margin: '0 auto',
              opacity: featVisible ? 1 : 0, transition: 'all 0.7s 0.15s cubic-bezier(0.22,1,0.36,1)',
            }}>
              Six powerful capabilities that make campus outpass management safe, smart, and seamless.
            </p>
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 20 }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="process" style={{ padding: '100px 24px', background: C.creamPure }}>
        <div ref={processRef} style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          {/* Left */}
          <div style={{
            opacity: processVisible ? 1 : 0, transform: processVisible ? 'translateX(0)' : 'translateX(-32px)',
            transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.textDark, letterSpacing: -1, lineHeight: 1.1, marginBottom: 20 }}>
              From Request<br />to <strong style={{ fontWeight: 700, color: C.burgundyMid }}>Approval</strong>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(26,10,16,0.5)', fontFamily: 'Outfit, sans-serif', fontWeight: 300, maxWidth: 360, marginBottom: 40 }}>
              A seamless five-step flow from submission to verified approval — all in under two minutes.
            </p>
            {/* Visual card */}
            <div style={{
              background: `linear-gradient(135deg, ${C.burgundyDeep}, ${C.burgundyMid})`,
              borderRadius: 20, padding: '28px 32px',
              boxShadow: `0 20px 60px rgba(74,15,35,0.25)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.goldLight, animation: 'pulse 2s infinite' }} />
                <span style={{ color: 'rgba(247,237,216,0.6)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>Live Platform Stats</span>
              </div>
              {[
                { label: 'Requests Processed Today', val: '247', color: C.goldLight },
                { label: 'Avg Response Time', val: '1m 42s', color: '#5b9cf6' },
                { label: 'Parent Satisfaction', val: '98.4%', color: '#34d399' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(247,237,216,0.5)', fontSize: 13, fontFamily: 'Outfit, sans-serif' }}>{label}</span>
                  <span style={{ color, fontWeight: 700, fontSize: 16, fontFamily: 'Outfit, sans-serif' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingTop: 16 }}>
            {steps.map((s, i) => <ProcessStep key={i} {...s} index={i} />)}
          </div>
        </div>
        <style>{`@media(max-width:768px){ #process > div { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
      </section>

      {/* ─── Testimonial / Trust band ─── */}
      <section style={{ background: C.creamWarm, padding: '60px 24px', borderTop: `1px solid ${C.creamMid}`, borderBottom: `1px solid ${C.creamMid}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: C.burgundyVivid, fontFamily: 'Outfit, sans-serif', fontWeight: 600, marginBottom: 32 }}>Trusted by Institutions</p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['MERN Stack', 'LangChain', 'n8n Automation', 'WhatsApp API', 'OTP Auth'].map(t => (
              <div key={t} style={{
                padding: '10px 22px', borderRadius: 100,
                background: 'rgba(109,27,52,0.07)', border: `1px solid rgba(109,27,52,0.15)`,
                color: C.burgundyMid, fontSize: 13, fontFamily: 'Outfit, sans-serif', fontWeight: 500,
              }}>{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="about" style={{ padding: '120px 24px', background: C.creamPure, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 60%, rgba(109,27,52,0.06) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div ref={ctaRef} style={{
          maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative',
          opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ height: 1, width: 60, background: `linear-gradient(90deg, transparent, ${C.burgundyVivid})` }} />
            <div style={{ width: 8, height: 8, background: C.burgundyVivid, transform: 'rotate(45deg)' }} />
            <div style={{ height: 1, width: 60, background: `linear-gradient(90deg, ${C.burgundyVivid}, transparent)` }} />
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: C.textDark, letterSpacing: -1, lineHeight: 1.1, marginBottom: 20 }}>
            Ready to Transform<br />
            <em style={{ fontStyle: 'italic', fontWeight: 600, color: C.burgundyMid }}>Your Campus?</em>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: 'rgba(26,10,16,0.5)', marginBottom: 48, fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
            Join forward-thinking institutions modernizing student safety with AI-powered outpass management and verified parent consent.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/student/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 14,
              background: `linear-gradient(135deg, ${C.burgundyMid}, ${C.burgundyVivid})`,
              color: C.creamPure, textDecoration: 'none', fontFamily: 'Outfit, sans-serif',
              fontWeight: 600, fontSize: 15, boxShadow: `0 8px 28px rgba(184,68,94,0.35)`,
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(184,68,94,0.45)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 28px rgba(184,68,94,0.35)`; }}>
              Get Started Now <FiArrowRight size={15} />
            </a>
            <a href="/admin/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '15px 32px', borderRadius: 14,
              border: `1.5px solid rgba(109,27,52,0.25)`,
              color: C.burgundyMid, textDecoration: 'none', fontFamily: 'Outfit, sans-serif',
              fontWeight: 600, fontSize: 15, transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(109,27,52,0.06)`; e.currentTarget.style.borderColor = `rgba(109,27,52,0.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `rgba(109,27,52,0.25)`; }}>
              <FiShield size={15} /> Admin Portal
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: C.burgundyDeep, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ color: C.creamMid, fontWeight: 700, fontSize: 20, letterSpacing: 0.5 }}>
            Pass<span style={{ color: C.goldLight }}>With</span>AI
          </span>
          <span style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.2)', fontFamily: 'Outfit, sans-serif' }}>
            © 2025 PassWithAI · Built with MERN + LangChain + n8n
          </span>
        </div>
      </footer>
    </div>
  );
}
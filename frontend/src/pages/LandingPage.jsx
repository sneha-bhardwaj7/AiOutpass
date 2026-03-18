import { useState, useEffect, useRef } from 'react';
import { FiArrowRight, FiShield, FiZap, FiUsers, FiCheckCircle, FiMenu, FiX, FiEye, FiLock, FiBarChart2, FiBell } from 'react-icons/fi';
import { MdOutlineSchool, MdOutlineVerified, MdAutoAwesome } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

/* ─── Color Tokens — Midnight Teal × Amber × Slate ─── */
const C = {
  // Core darks
  inkBlack:    '#080C14',
  navyDeep:    '#0A1628',
  navyMid:     '#0F2347',
  navyLight:   '#1A3A6B',

  // Teal / Emerald accents
  tealDeep:    '#0D4F4F',
  tealMid:     '#0A7C7C',
  tealBright:  '#0FB5B5',
  tealGlow:    '#1DE8E8',

  // Amber / Gold
  amber:       '#E8A020',
  amberLight:  '#F5BE58',
  amberPale:   '#FDE68A',

  // Slate / Silver
  slateGlass:  'rgba(255,255,255,0.04)',
  slateBorder: 'rgba(255,255,255,0.08)',
  slateText:   'rgba(220,230,255,0.55)',
  slateLight:  'rgba(220,230,255,0.75)',

  // Text
  white:       '#F0F6FF',
  offWhite:    '#D4E4FF',
};

/* ─── useInView ─── */
function useInView(threshold = 0.12) {
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
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
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
    const fn = () => setScrolled(window.scrollY > 50);
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
      transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
      background: scrolled ? 'rgba(8,12,20,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.slateBorder}` : 'none',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px rgba(11,181,181,0.4)`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.12))', borderRadius: 10 }} />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 17, fontFamily: 'Space Grotesk, sans-serif', position: 'relative' }}>P</span>
          </div>
          <span style={{ color: C.white, fontWeight: 700, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: -0.3 }}>
            Pass<span style={{ color: C.tealBright }}>Gate</span>
            <span style={{ color: C.slateText, fontWeight: 400 }}> AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="nav-links-desktop">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              color: C.slateLight, padding: '8px 18px', borderRadius: 8,
              textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.color = C.white; e.target.style.background = C.slateGlass; }}
              onMouseLeave={e => { e.target.style.color = C.slateLight; e.target.style.background = 'transparent'; }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="nav-ctas-desktop">
          <a href="/student/login" style={{
            color: C.slateLight, padding: '8px 20px', borderRadius: 8,
            textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            border: `1px solid ${C.slateBorder}`, transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.slateGlass; e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.slateLight; e.currentTarget.style.borderColor = C.slateBorder; }}>
            Sign In
          </a>
          <a href="/student/signup" style={{
            background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`,
            color: '#fff', padding: '9px 22px', borderRadius: 10,
            textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
            boxShadow: `0 4px 20px rgba(11,181,181,0.3)`, transition: 'all 0.28s',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 30px rgba(11,181,181,0.5)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 20px rgba(11,181,181,0.3)`; }}>
            Get Started →
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(p => !p)} style={{
          background: C.slateGlass, border: `1px solid ${C.slateBorder}`,
          borderRadius: 8, width: 38, height: 38, color: C.white, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} className="nav-mobile-toggle">
          {open ? <FiX size={16} /> : <FiMenu size={16} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(8,12,20,0.97)', backdropFilter: 'blur(20px)', padding: '16px 24px 24px', borderTop: `1px solid ${C.slateBorder}` }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', color: C.slateLight, padding: '13px 0',
              borderBottom: `1px solid ${C.slateBorder}`, textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
            }}>{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <a href="/student/login" style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 8, border: `1px solid ${C.slateBorder}`, color: C.white, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Sign In</a>
            <a href="/student/signup" style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 8, background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`, color: '#fff', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600 }}>Sign Up</a>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');
        @media(max-width:768px) { .nav-links-desktop,.nav-ctas-desktop{display:none!important} .nav-mobile-toggle{display:flex!important} }
        @media(min-width:769px) { .nav-mobile-toggle{display:none!important} }
      `}</style>
    </nav>
  );
}

/* ─── Floating Badge ─── */
function FloatingBadge({ children, style }) {
  return (
    <div style={{
      background: 'rgba(11,181,181,0.08)',
      border: `1px solid rgba(11,181,181,0.25)`,
      borderRadius: 100, padding: '7px 20px',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      backdropFilter: 'blur(12px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section style={{
      minHeight: '100vh', position: 'relative',
      background: `linear-gradient(170deg, ${C.inkBlack} 0%, ${C.navyDeep} 50%, #050E1F 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Dynamic spotlight that follows mouse */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 55% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(11,181,181,0.07) 0%, transparent 70%)`,
        transition: 'background 0.3s ease',
      }} />

      {/* Static glows */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '5%', right: '8%', width: 560, height: 560, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(11,181,181,0.10) 0%, transparent 60%)`,
          animation: 'pulse1 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '0%', left: '-5%', width: 480, height: 480, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(232,160,32,0.07) 0%, transparent 65%)`,
          animation: 'pulse2 11s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(26,58,107,0.6) 0%, transparent 70%)`,
          animation: 'pulse3 6s ease-in-out infinite',
        }} />

        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(11,181,181,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,181,181,0.04) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }} />

        {/* Floating orbs */}
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${8 + (i * 6.1) % 84}%`,
            top: `${15 + (i * 11.3) % 70}%`,
            width: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: i % 3 === 0 ? C.tealBright : i % 2 === 0 ? C.amber : C.navyLight,
            opacity: 0.6,
            animation: `orb${(i % 3) + 1} ${5 + (i % 4)}s ease-in-out ${i * 0.35}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Hero content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '130px 24px 90px', maxWidth: 920, margin: '0 auto' }}>

        {/* Badge */}
        <FloatingBadge style={{
          marginBottom: 44,
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.75s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.tealBright, display: 'inline-block', boxShadow: `0 0 8px ${C.tealBright}`, animation: 'blink 2s infinite' }} />
          <span style={{ color: C.tealBright, fontSize: 11, letterSpacing: 3.5, textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
            AI-Powered Campus Security
          </span>
        </FloatingBadge>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(54px, 9.5vw, 104px)', fontWeight: 800,
          lineHeight: 0.92, letterSpacing: -3,
          marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif',
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(28px)',
          transition: 'all 0.85s 0.1s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <span style={{ color: C.white }}>Secure</span>
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${C.tealBright} 0%, ${C.amberLight} 60%, ${C.tealGlow} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontStyle: 'italic', fontWeight: 300,
          }}>Outpass.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(13px, 2vw, 22px)', letterSpacing: 6, textTransform: 'uppercase',
          color: 'rgba(220,230,255,0.35)', marginBottom: 36,
          fontFamily: 'DM Mono, monospace', fontWeight: 400,
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}>Verified. Automated. Intelligent.</p>

        <p style={{
          fontSize: 16, lineHeight: 2, color: C.slateText,
          maxWidth: 540, margin: '0 auto 56px', fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.34s cubic-bezier(0.22,1,0.36,1)',
        }}>
          Transform your hostel outpass workflow with AI-driven parent consent verification, 
          real-time multi-channel notifications, and intelligent fraud detection that keeps every campus safe.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80,
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.46s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <GlowBtn href="/student/login" primary>
            <MdOutlineSchool size={17} /> Student Portal <FiArrowRight size={14} />
          </GlowBtn>
          <GlowBtn href="/admin/login">
            <FiShield size={15} /> Admin Dashboard
          </GlowBtn>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${C.slateBorder}`,
          borderRadius: 20, overflow: 'hidden', maxWidth: 500, margin: '0 auto',
          backdropFilter: 'blur(16px)',
          opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {[
            { val: 99, suffix: '%', label: 'AI Accuracy' },
            { val: 2, suffix: 'm', label: 'Avg Approval' },
            { val: 0, suffix: '', label: 'Manual Errors' },
          ].map(({ val, suffix, label }, i) => (
            <div key={label} style={{
              padding: '26px 16px', textAlign: 'center',
              borderRight: i < 2 ? `1px solid ${C.slateBorder}` : 'none',
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.tealBright, lineHeight: 1, marginBottom: 5, fontFamily: 'Space Grotesk, sans-serif', textShadow: `0 0 20px rgba(11,181,181,0.4)` }}>
                <Counter target={val} suffix={suffix} />
              </div>
              <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: C.slateText, fontFamily: 'DM Mono, monospace' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'bounce 2.5s ease-in-out infinite',
      }}>
        <div style={{ width: 1, height: 44, background: `linear-gradient(to bottom, ${C.tealBright}, transparent)`, opacity: 0.4 }} />
        <span style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: C.slateText, fontFamily: 'DM Mono, monospace' }}>scroll</span>
      </div>

      <style>{`
        @keyframes pulse1 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.12) translate(-24px,18px)} }
        @keyframes pulse2 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(18px,-16px)} }
        @keyframes pulse3 { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes orb1 { from{transform:translateY(0) scale(1);opacity:0.4} to{transform:translateY(-28px) scale(1.5);opacity:0.8} }
        @keyframes orb2 { from{transform:translateY(0) scale(1);opacity:0.3} to{transform:translateY(-20px) scale(1.3);opacity:0.7} }
        @keyframes orb3 { from{transform:translateY(0);opacity:0.2} to{transform:translateY(-16px);opacity:0.6} }
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }
      `}</style>
    </section>
  );
}

/* ─── Glow Button ─── */
function GlowBtn({ href, children, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '15px 32px', borderRadius: 14, textDecoration: 'none',
        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 15,
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        ...(primary ? {
          background: hov
            ? `linear-gradient(135deg, ${C.tealBright}, #0DD4D4)`
            : `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`,
          color: '#fff',
          boxShadow: hov ? `0 12px 40px rgba(11,181,181,0.55), 0 0 0 1px rgba(11,181,181,0.3)` : `0 6px 24px rgba(11,181,181,0.3)`,
          transform: hov ? 'translateY(-3px) scale(1.02)' : 'none',
        } : {
          background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          color: hov ? C.white : C.slateLight,
          border: `1px solid ${hov ? 'rgba(255,255,255,0.2)' : C.slateBorder}`,
          transform: hov ? 'translateY(-3px)' : 'none',
        }),
      }}>
      {children}
    </a>
  );
}

/* ─── Marquee Strip ─── */
function Marquee() {
  const items = ['AI Consent Analysis', 'WhatsApp Alerts', 'OTP Verification', 'Fraud Detection', 'Audit Trails', 'Admin Dashboard', 'Real-Time Approval', 'Zero Manual Errors', 'LangChain AI', 'n8n Automation'];
  return (
    <div style={{
      background: `linear-gradient(90deg, ${C.tealDeep} 0%, ${C.navyMid} 50%, ${C.tealDeep} 100%)`,
      overflow: 'hidden', padding: '16px 0',
      borderTop: `1px solid rgba(11,181,181,0.2)`,
      borderBottom: `1px solid rgba(11,181,181,0.2)`,
    }}>
      <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 32px',
            fontSize: 11, letterSpacing: 3.5, textTransform: 'uppercase',
            color: 'rgba(220,240,255,0.7)', fontFamily: 'DM Mono, monospace', flexShrink: 0,
          }}>
            {item} <span style={{ color: C.tealBright, fontSize: 10, textShadow: `0 0 8px ${C.tealBright}` }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ─── Feature Card ─── */
const featureIcons = [MdAutoAwesome, FiBell, FiShield, FiLock, FiBarChart2, FiEye];

function FeatureCard({ title, desc, index }) {
  const [hov, setHov] = useState(false);
  const [ref, visible] = useInView(0.06);
  const Icon = featureIcons[index % featureIcons.length];

  const accentColors = [C.tealBright, C.amber, '#A78BFA', '#34D399', '#60A5FA', '#F472B6'];
  const accent = accentColors[index % accentColors.length];

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(145deg, rgba(15,25,50,0.9), rgba(10,20,40,0.95))`
          : `linear-gradient(145deg, rgba(10,18,40,0.8), rgba(8,12,24,0.9))`,
        border: `1px solid ${hov ? `${accent}40` : C.slateBorder}`,
        borderRadius: 20, padding: '36px 30px', position: 'relative', overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
        transform: visible
          ? (hov ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)')
          : 'translateY(36px) scale(0.97)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 80}ms`,
        boxShadow: hov
          ? `0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)`,
        backdropFilter: 'blur(16px)',
      }}>

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: hov ? 1 : 0, transition: 'opacity 0.4s ease', borderRadius: '20px 20px 0 0',
      }} />

      {/* Background glow orb */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        opacity: hov ? 1 : 0.3, transition: 'opacity 0.4s', pointerEvents: 'none',
      }} />

      {/* Number + Icon row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
          transform: hov ? 'scale(1.1) rotate(-8deg)' : 'none',
          boxShadow: hov ? `0 0 20px ${accent}30` : 'none',
        }}>
          <Icon size={22} style={{ color: accent }} />
        </div>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: 2,
          color: `${accent}80`, fontWeight: 500,
        }}>/{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h3 style={{
        color: hov ? C.white : C.offWhite, fontSize: 19, fontWeight: 700,
        marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: -0.3,
        transition: 'color 0.3s',
      }}>{title}</h3>

      <p style={{
        color: hov ? 'rgba(220,230,255,0.62)' : 'rgba(220,230,255,0.38)',
        fontSize: 14, lineHeight: 1.9, fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
        transition: 'color 0.3s',
      }}>{desc}</p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 22,
        opacity: hov ? 1 : 0, transform: hov ? 'translateX(0)' : 'translateX(-10px)',
        transition: 'all 0.35s ease',
      }}>
        <span style={{ fontSize: 12, color: accent, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: 1 }}>Explore feature</span>
        <FiArrowRight size={13} style={{ color: accent }} />
      </div>
    </div>
  );
}

/* ─── Section Label ─── */
function SectionLabel({ children, light }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{ width: 24, height: 2, background: light ? C.tealBright : C.tealMid, borderRadius: 2 }} />
      <span style={{
        fontSize: 11, letterSpacing: 4.5, textTransform: 'uppercase',
        color: light ? C.tealBright : C.tealMid,
        fontFamily: 'DM Mono, monospace', fontWeight: 500,
      }}>{children}</span>
    </div>
  );
}

/* ─── Process Step ─── */
function ProcessStep({ step, title, desc, index, last }) {
  const [ref, visible] = useInView(0.08);
  return (
    <div ref={ref} style={{
      display: 'flex', gap: 20, alignItems: 'flex-start',
      opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-28px)',
      transition: `all 0.65s ${index * 110}ms cubic-bezier(0.22,1,0.36,1)`,
    }}>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.tealDeep}, ${C.tealMid})`,
          border: `2px solid ${C.tealBright}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.tealBright, fontWeight: 700, fontSize: 13,
          fontFamily: 'DM Mono, monospace',
          boxShadow: `0 0 20px rgba(11,181,181,0.2)`,
        }}>{step}</div>
        {!last && <div style={{ width: 1, height: 52, background: `linear-gradient(to bottom, ${C.tealBright}40, transparent)`, marginTop: 6 }} />}
      </div>
      <div style={{ paddingTop: 12 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, color: C.white, marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: -0.2 }}>{title}</h3>
        <p style={{ fontSize: 14, color: C.slateText, lineHeight: 1.75, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Data ─── */
const features = [
  { title: 'AI Consent Analysis', desc: 'LangChain analyzes parent responses with 95%+ accuracy, detecting genuine consent vs coercion using NLP-powered context understanding.', },
  { title: 'Multi-Channel Notifications', desc: 'Parents receive WhatsApp messages, automated voice calls, and email — all with secure one-time verification links for instant action.', },
  { title: 'Fraud Detection', desc: 'AI risk analysis flags mismatches, suspicious patterns, and fake approvals in real-time before they reach admin review.', },
  { title: 'OTP Verification', desc: 'Multi-layer parent authentication with time-limited OTPs prevents unauthorized approvals and ensures request integrity.', },
  { title: 'Admin Dashboard', desc: 'Comprehensive control panel with AI-generated summaries, color-coded risk indicators, and one-click approval workflows.', },
  { title: 'Audit Trails', desc: 'Tamper-proof, timestamped logs of every action — from submission to final approval — for full regulatory compliance.', },
];

const steps = [
  { step: '01', title: 'Student Submits Request', desc: 'Fill in destination, dates, reason, and parent contact details in under 60 seconds through the secure portal.' },
  { step: '02', title: 'Parent Gets Notified', desc: 'WhatsApp, voice call, and email delivered instantly with a unique secure approval link — no app needed.' },
  { step: '03', title: 'Parent Verifies & Approves', desc: 'OTP verification + text/video consent confirms the parent is authentic and acting without coercion.' },
  { step: '04', title: 'AI Analyzes Response', desc: 'LangChain validates consent semantics, date alignment, and flags anomalies for further review.' },
  { step: '05', title: 'Admin Reviews & Decides', desc: 'Dashboard surfaces AI recommendation — approve, flag, or reject — with full context in one view.' },
];

/* ─── Main ─── */
export default function LandingPage() {
  const [featRef, featVisible] = useInView(0.04);
  const [processRef, processVisible] = useInView(0.04);
  const [ctaRef, ctaVisible] = useInView(0.08);

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: C.inkBlack, color: C.white, overflowX: 'hidden', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Marquee />

      {/* ─── Features ─── */}
      <section id="features" style={{ padding: '120px 24px', background: `linear-gradient(180deg, ${C.inkBlack} 0%, ${C.navyDeep} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, rgba(11,181,181,0.04) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(11,181,181,0.06) 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.4, pointerEvents: 'none' }} />

        <div ref={featRef} style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <SectionLabel light>Platform Features</SectionLabel>
            <h2 style={{
              fontSize: 'clamp(38px, 5.5vw, 64px)', fontWeight: 800, color: C.white,
              letterSpacing: -2, lineHeight: 1.05, marginBottom: 18,
              fontFamily: 'Space Grotesk, sans-serif',
              opacity: featVisible ? 1 : 0, transform: featVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'all 0.75s cubic-bezier(0.22,1,0.36,1)',
            }}>
              Built for{' '}
              <span style={{ color: C.tealBright, fontStyle: 'italic', textShadow: `0 0 40px rgba(11,181,181,0.4)` }}>Every</span>
              {' '}Role
            </h2>
            <p style={{
              fontSize: 16, color: C.slateText, fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
              maxWidth: 460, margin: '0 auto',
              opacity: featVisible ? 1 : 0, transition: 'all 0.75s 0.15s cubic-bezier(0.22,1,0.36,1)',
            }}>
              Six purpose-built capabilities that modernize campus outpass management, end-to-end.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="process" style={{ padding: '110px 24px', background: C.navyDeep, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.tealBright}30, transparent)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.tealBright}20, transparent)` }} />

        <div ref={processRef} style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          {/* Left column */}
          <div style={{
            opacity: processVisible ? 1 : 0, transform: processVisible ? 'translateX(0)' : 'translateX(-36px)',
            transition: 'all 0.75s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <SectionLabel light>How It Works</SectionLabel>
            <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 800, color: C.white, letterSpacing: -2, lineHeight: 1.05, marginBottom: 22, fontFamily: 'Space Grotesk, sans-serif' }}>
              Request to<br />
              <span style={{ color: C.tealBright, textShadow: `0 0 30px rgba(11,181,181,0.35)` }}>Approval</span>
              <span style={{ color: C.slateText, fontWeight: 300, fontStyle: 'italic' }}> in minutes.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: C.slateText, fontFamily: 'DM Sans, sans-serif', fontWeight: 300, maxWidth: 380, marginBottom: 44 }}>
              A seamless five-step flow from submission to verified approval — with AI validation at every checkpoint.
            </p>

            {/* Live stats card */}
            <div style={{
              background: `linear-gradient(145deg, rgba(13,79,79,0.4), rgba(10,118,118,0.2))`,
              border: `1px solid rgba(11,181,181,0.2)`,
              borderRadius: 18, padding: '28px 30px',
              backdropFilter: 'blur(20px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(11,181,181,0.1)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: C.tealBright, display: 'inline-block', animation: 'blink 2s infinite', boxShadow: `0 0 10px ${C.tealBright}` }} />
                <span style={{ color: C.slateText, fontSize: 11, letterSpacing: 3.5, textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>Live System Metrics</span>
              </div>
              {[
                { label: 'Requests Processed Today', val: '247', color: C.amberLight },
                { label: 'Avg Response Time', val: '1m 42s', color: C.tealBright },
                { label: 'Parent Satisfaction Score', val: '98.4%', color: '#34D399' },
                { label: 'AI Accuracy Rate', val: '99.1%', color: '#A78BFA' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                  <span style={{ color: C.slateText, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
                  <span style={{ color, fontWeight: 700, fontSize: 15, fontFamily: 'DM Mono, monospace', textShadow: `0 0 12px ${color}60` }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12 }}>
            {steps.map((s, i) => <ProcessStep key={i} {...s} index={i} last={i === steps.length - 1} />)}
          </div>
        </div>
        <style>{`@media(max-width:768px){#process>div{grid-template-columns:1fr!important;gap:52px!important}}`}</style>
      </section>

      {/* ─── Trust Band ─── */}
      <section style={{ background: C.inkBlack, padding: '64px 24px', borderTop: `1px solid ${C.slateBorder}`, borderBottom: `1px solid ${C.slateBorder}` }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: C.slateText, fontFamily: 'DM Mono, monospace', marginBottom: 36 }}>Powered By</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['MERN Stack', 'LangChain AI', 'n8n Automation', 'WhatsApp API', 'OTP Auth', 'Face Matching'].map(t => (
              <div key={t} style={{
                padding: '10px 22px', borderRadius: 100,
                background: `rgba(11,181,181,0.06)`,
                border: `1px solid rgba(11,181,181,0.18)`,
                color: C.tealBright, fontSize: 12,
                fontFamily: 'DM Mono, monospace', fontWeight: 500,
                letterSpacing: 0.5,
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(11,181,181,0.14)`; e.currentTarget.style.borderColor = `rgba(11,181,181,0.4)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `rgba(11,181,181,0.06)`; e.currentTarget.style.borderColor = `rgba(11,181,181,0.18)`; e.currentTarget.style.transform = 'none'; }}
              >{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="about" style={{ padding: '130px 24px', background: `linear-gradient(180deg, ${C.inkBlack} 0%, ${C.navyDeep} 50%, ${C.inkBlack} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(11,181,181,0.05) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', border: `1px solid rgba(11,181,181,0.06)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 900, borderRadius: '50%', border: `1px solid rgba(11,181,181,0.04)`, pointerEvents: 'none' }} />

        <div ref={ctaRef} style={{
          maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative',
          opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'all 0.85s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* Decorative line ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', marginBottom: 36 }}>
            <div style={{ height: 1, width: 80, background: `linear-gradient(90deg, transparent, ${C.tealBright}60)` }} />
            <HiOutlineSparkles size={18} style={{ color: C.tealBright, filter: `drop-shadow(0 0 6px ${C.tealBright})` }} />
            <div style={{ height: 1, width: 80, background: `linear-gradient(90deg, ${C.tealBright}60, transparent)` }} />
          </div>

          <h2 style={{
            fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 800, color: C.white,
            letterSpacing: -2.5, lineHeight: 1.0, marginBottom: 22,
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            Ready to Digitize<br />
            <span style={{ color: C.tealBright, textShadow: `0 0 40px rgba(11,181,181,0.5)`, fontStyle: 'italic', fontWeight: 300 }}>Your Campus?</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.95, color: C.slateText, marginBottom: 52, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
            Join forward-thinking institutions replacing paper-based outpass systems with AI-powered, fraud-resistant automation. Students, parents, and admins — all in one seamless loop.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/student/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '17px 40px', borderRadius: 14,
              background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`,
              color: '#fff', textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 15,
              boxShadow: `0 8px 30px rgba(11,181,181,0.35)`, transition: 'all 0.3s',
              letterSpacing: 0.3,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 16px 44px rgba(11,181,181,0.5)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 30px rgba(11,181,181,0.35)`; }}>
              Get Started Free <FiArrowRight size={16} />
            </a>
            <a href="/admin/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 14,
              border: `1px solid rgba(11,181,181,0.25)`,
              color: C.tealBright, textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 15,
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(11,181,181,0.08)`; e.currentTarget.style.borderColor = `rgba(11,181,181,0.5)`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `rgba(11,181,181,0.25)`; e.currentTarget.style.transform = 'none'; }}>
              <FiShield size={16} /> Admin Portal
            </a>
          </div>

          {/* Social proof micro-strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 48 }}>
            <div style={{ display: 'flex' }}>
              {['#0FB5B5', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'].map((c, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: `${c}30`, border: `2px solid ${c}60`, marginLeft: i ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiCheckCircle size={11} style={{ color: c }} />
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: C.slateText, fontFamily: 'DM Sans, sans-serif' }}>
              Trusted by <strong style={{ color: C.white }}>500+</strong> students across campuses
            </span>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        background: C.inkBlack,
        borderTop: `1px solid ${C.slateBorder}`,
        padding: '44px 32px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 14px rgba(11,181,181,0.35)` }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>P</span>
            </div>
            <span style={{ color: C.offWhite, fontWeight: 700, fontSize: 17, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: -0.3 }}>
              Pass<span style={{ color: C.tealBright }}>Gate</span> <span style={{ color: C.slateText, fontWeight: 300 }}>AI</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['Features', 'How It Works', 'Admin Portal', 'Student Login'].map(l => (
              <a key={l} href="#" style={{ color: C.slateText, textDecoration: 'none', fontSize: 13, fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = C.white}
                onMouseLeave={e => e.target.style.color = C.slateText}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.15)', fontFamily: 'DM Mono, monospace' }}>
            © 2025 PassGate AI · MERN + LangChain + n8n
          </span>
        </div>
      </footer>
    </div>
  );
}
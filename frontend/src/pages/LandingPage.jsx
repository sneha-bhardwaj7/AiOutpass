// src/pages/LandingPage.jsx
import { useState, useEffect, useRef } from 'react';
import {
  FiArrowRight, FiShield, FiZap, FiUsers, FiCheckCircle,
  FiMenu, FiX, FiEye, FiLock, FiBarChart2, FiBell,
  FiChevronLeft, FiChevronRight, FiStar, FiActivity
} from 'react-icons/fi';
import { MdOutlineSchool, MdAutoAwesome, MdOutlineDashboard, MdOutlineVerifiedUser } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';
import { RiBrainLine, RiShieldCheckLine, RiBarChartBoxLine, RiNotificationLine, RiLockPasswordLine, RiFileTextLine } from 'react-icons/ri';

/* ── Palette ── */
const C = {
  pageBg:      '#F3F0FB',
  sectionAlt:  '#EBE6F7',
  deep:        '#6B5BA4',
  mid:         '#7C6BB5',
  bright:      '#9B8DC9',
  light:       '#B8ADDA',
  pale:        '#D8D0EE',
  superPale:   '#EDE9F5',
  ultraPale:   '#F7F4FC',
  accent:      '#F4A732',
  textDark:    '#1E1535',
  textMid:     '#3D2E6B',
  textLight:   'rgba(61,46,107,0.58)',
  textDimmed:  'rgba(61,46,107,0.36)',
  border:      'rgba(155,141,201,0.20)',
  cardBg:      '#FFFFFF',
};

/* ── useInView ── */
function useInView(threshold = 0.1) {
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

/* ── Fixed page background with waves + orbs ── */
function PageBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Base gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #EAE4F6 0%, #DDD5EE 35%, #CFC6E5 65%, #C4B8DC 100%)' }} />

      {/* Top-right large glowing orb */}
      <div style={{
        position: 'absolute', top: '-14%', right: '-10%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 38%, rgba(200,190,232,0.70) 0%, rgba(155,141,201,0.32) 45%, transparent 70%)',
      }} />

      {/* Bottom-left soft orb */}
      <div style={{
        position: 'absolute', bottom: '-12%', left: '-8%',
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle at 62% 62%, rgba(107,91,164,0.18) 0%, rgba(155,141,201,0.10) 55%, transparent 72%)',
      }} />

      {/* Center floating orb */}
      <div style={{
        position: 'absolute', top: '35%', left: '40%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(216,208,238,0.38) 0%, transparent 70%)',
        animation: 'floatOrb 10s ease-in-out infinite',
      }} />

      {/* Small top-left orb */}
      <div style={{
        position: 'absolute', top: '8%', left: '5%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,173,218,0.30) 0%, transparent 70%)',
        animation: 'floatOrb 7s ease-in-out 2s infinite',
      }} />

      {/* SVG bottom waves — the swooping curves from the image */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} viewBox="0 0 1440 280" preserveAspectRatio="none">
        <path fill="rgba(107,91,164,0.10)" d="M0,160 C200,220 400,80 600,140 C800,200 1000,60 1200,120 C1320,150 1400,100 1440,110 L1440,280 L0,280 Z" />
        <path fill="rgba(155,141,201,0.08)" d="M0,200 C300,140 500,260 750,190 C1000,120 1200,220 1440,180 L1440,280 L0,280 Z" />
        <path fill="rgba(184,173,218,0.06)" d="M0,240 C240,200 480,260 720,230 C960,200 1200,250 1440,220 L1440,280 L0,280 Z" />
      </svg>

      {/* Mid-page horizontal wave sweep */}
      <svg style={{ position: 'absolute', top: '48%', left: 0, width: '100%' }} viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path fill="rgba(107,91,164,0.06)" d="M0,50 C180,100 360,10 540,60 C720,110 900,20 1080,70 C1260,120 1380,40 1440,55 L1440,160 L0,160 Z" />
      </svg>

      {/* Diagonal light streak */}
      <div style={{
        position: 'absolute', top: '15%', left: '-15%',
        width: '130%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,173,218,0.35) 40%, rgba(200,190,232,0.45) 60%, transparent)',
        transform: 'rotate(-6deg)',
      }} />
      <div style={{
        position: 'absolute', top: '17%', left: '-15%',
        width: '130%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(155,141,201,0.15) 40%, rgba(184,173,218,0.22) 60%, transparent)',
        transform: 'rotate(-6deg)',
      }} />

      {/* Sparkle dots */}
      {[[8,14],[85,22],[18,60],[78,68],[50,40],[32,80],[90,52],[65,88],[42,28]].map(([x,y],i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: i % 3 === 0 ? 5 : 3, height: i % 3 === 0 ? 5 : 3,
          borderRadius: '50%',
          background: `rgba(107,91,164,${0.12 + i * 0.03})`,
          animation: `twinkle ${3 + i*0.35}s ease-in-out ${i*0.28}s infinite`,
        }} />
      ))}

      <style>{`
        @keyframes floatOrb { 0%,100%{transform:translate(0,0)} 33%{transform:translate(18px,-14px)} 66%{transform:translate(-12px,18px)} }
        @keyframes twinkle  { 0%,100%{opacity:0.25;transform:scale(1)} 50%{opacity:0.9;transform:scale(2)} }
      `}</style>
    </div>
  );
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      padding: scrolled ? '0' : '10px 20px',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{
        maxWidth: scrolled ? '100%' : 1160,
        margin: '0 auto',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(28px)',
        borderRadius: scrolled ? 0 : 16,
        border: '1px solid rgba(255,255,255,0.88)',
        boxShadow: '0 4px 32px rgba(107,91,164,0.11)',
        padding: '0 26px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62,
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 33, height: 33, borderRadius: 9, background: `linear-gradient(135deg, ${C.deep}, ${C.bright})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px rgba(107,91,164,0.32)` }}>
            <MdOutlineSchool size={17} color="#fff" />
          </div>
          <span style={{ fontFamily: "", fontWeight: 800, fontSize: 16.5, color: C.textDark, letterSpacing: -0.3 }}>
            <span style={{ color: C.mid }}>Passify</span>
            {/* <span style={{ color: C.textLight, fontWeight: 300, fontSize: 14 }}> AI</span> */}
          </span>
        </a>

        <div className="nav-desktop" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {['Features','How It Works','Testimonials','About'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`}
              style={{ color: C.textLight, padding: '6px 13px', borderRadius: 8, textDecoration: 'none', fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.textDark; e.currentTarget.style.background = C.superPale; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textLight; e.currentTarget.style.background = 'transparent'; }}>
              {l}
            </a>
          ))}
        </div>

        <div className="nav-desktop" style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          <a href="/student/login" style={{ color: C.textMid, padding: '7px 17px', borderRadius: 9, textDecoration: 'none', fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.55)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.superPale; e.currentTarget.style.borderColor = C.mid; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = C.border; }}>
            Sign In
          </a>
          <a href="/student/signup" style={{ background: `linear-gradient(135deg, ${C.mid}, ${C.bright})`, color: '#fff', padding: '8px 19px', borderRadius: 10, textDecoration: 'none', fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, boxShadow: `0 4px 16px rgba(107,91,164,0.30)`, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.24s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 26px rgba(107,91,164,0.42)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 16px rgba(107,91,164,0.30)`; }}>
            Get Started <FiArrowRight size={12} />
          </a>
        </div>

        <button onClick={() => setOpen(p => !p)} className="nav-mobile" style={{ background: C.superPale, border: `1px solid ${C.border}`, borderRadius: 8, width: 37, height: 37, color: C.textMid, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {open ? <FiX size={15} /> : <FiMenu size={15} />}
        </button>
      </div>

      {open && (
        <div style={{ maxWidth: 1160, margin: '7px auto 0', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: 14, padding: '14px 22px 18px', border: `1px solid ${C.border}`, boxShadow: '0 4px 24px rgba(107,91,164,0.10)' }}>
          {['Features','How It Works','Testimonials','About'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} onClick={() => setOpen(false)} style={{ display: 'block', color: C.textMid, padding: '11px 0', borderBottom: `1px solid ${C.border}`, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14.5 }}>{l}</a>
          ))}
          <div style={{ display: 'flex', gap: 9, marginTop: 13 }}>
            <a href="/student/login" style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:8, border:`1px solid ${C.border}`, color:C.textMid, textDecoration:'none', fontFamily:"'DM Sans', sans-serif", fontSize:14 }}>Sign In</a>
            <a href="/student/signup" style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:8, background:`linear-gradient(135deg, ${C.mid}, ${C.bright})`, color:'#fff', textDecoration:'none', fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:600 }}>Sign Up</a>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');
        @media(max-width:768px){.nav-desktop{display:none!important}.nav-mobile{display:flex!important}}
        @media(min-width:769px){.nav-mobile{display:none!important}}
      `}</style>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);
  const slides = [
    { headline: ['Admin','Control'], accent: 'At Glance', sub: 'Comprehensive dashboard with AI risk scoring, color-coded flags, and one-click approval for every outpass request.' },
    { headline: ['Smart','Outpass'], accent: 'Management', sub: 'Transform hostel outpass workflow with AI consent verification, real-time notifications, and intelligent fraud detection.' },
    { headline: ['Secure','Parent'], accent: 'Consent', sub: 'Parents receive WhatsApp, voice call, and email alerts with one-tap OTP verification — no app download needed.' },
  ];
  useEffect(() => {
    const t = setInterval(() => setActiveSlide(p => (p+1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);
  const slide = slides[activeSlide];

  return (
    <section style={{ minHeight: '60vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52,
        alignItems: 'center', padding: '100px 46px 78px',
        maxWidth: 1200, margin: '0 auto', width: '100%',
      }} className="hero-grid">

        {/* Left */}
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(18px)', transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}>
          <h1 key={`h-${activeSlide}`} style={{
            fontFamily: "", fontWeight: 800,
            fontSize: 'clamp(50px, 5.8vw, 84px)',
            lineHeight: 0.94, letterSpacing: -3,
            color: C.textDark, marginBottom: 8,
            animation: 'slideUpFade 0.55s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            {slide.headline[0]}<br />{slide.headline[1]}
          </h1>
          <div key={`a-${activeSlide}`} style={{
            fontFamily: "", fontWeight: 300,
            fontSize: 'clamp(32px, 3.8vw, 54px)',
            color: C.mid, fontStyle: 'italic', letterSpacing: -1,
            marginBottom: 20, animation: 'slideUpFade 0.55s 0.08s cubic-bezier(0.22,1,0.36,1) both',
          }}>{slide.accent}</div>
          <p key={`p-${activeSlide}`} style={{
            fontSize: 16, lineHeight: 1.88, color: C.textLight,
            maxWidth: 450, marginBottom: 34,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            animation: 'slideUpFade 0.55s 0.16s cubic-bezier(0.22,1,0.36,1) both',
          }}>{slide.sub}</p>

          <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap', marginBottom: 38 }}>
            <a href="/student/login" style={{
              display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:12,
              background:C.cardBg, color:C.textDark, fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:13.5,
              textDecoration:'none', boxShadow:'0 4px 20px rgba(107,91,164,0.13)', border:'1px solid rgba(255,255,255,0.9)',
              transition:'all 0.26s cubic-bezier(0.22,1,0.36,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(107,91,164,0.20)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(107,91,164,0.13)'; }}>
              <MdOutlineSchool size={16} style={{ color: C.mid }} /> Student Portal <FiArrowRight size={12} />
            </a>
            <a href="/admin/login" style={{
              display:'inline-flex', alignItems:'center', gap:8, padding:'11px 21px', borderRadius:12,
              background:`linear-gradient(135deg, ${C.deep}, ${C.bright})`, color:'#fff',
              fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:13.5,
              textDecoration:'none', boxShadow:`0 4px 20px rgba(107,91,164,0.36)`,
              transition:'all 0.26s cubic-bezier(0.22,1,0.36,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 12px 30px rgba(107,91,164,0.46)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 4px 20px rgba(107,91,164,0.36)`; }}>
              <MdOutlineDashboard size={15} /> Admin Dashboard
            </a>
          </div>

          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {slides.map((_,i) => (
              <button key={i} onClick={() => setActiveSlide(i)} style={{
                width: i===activeSlide ? 26 : 8, height: 8, borderRadius: 4,
                background: i===activeSlide ? C.mid : C.pale,
                border:'none', cursor:'pointer', padding:0,
                transition:'all 0.3s cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>
        </div>

        {/* Right: Dashboard card */}
        <div style={{ position:'relative', opacity:loaded?1:0, transform:loaded?'none':'translateY(22px)', transition:'all 0.9s 0.22s cubic-bezier(0.22,1,0.36,1)' }}>
          <div style={{
            background:'rgba(255,255,255,0.70)', backdropFilter:'blur(30px)',
            border:'1px solid rgba(255,255,255,0.88)', borderRadius:22, padding:'22px',
            boxShadow:'0 26px 76px rgba(107,91,164,0.16), 0 4px 16px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:27, height:27, borderRadius:7, background:`linear-gradient(135deg, ${C.deep}, ${C.bright})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MdOutlineSchool size={14} color="#fff" />
                </div>
                <span style={{ fontFamily:"", fontWeight:700, fontSize:12.5, color:C.textDark }}>Passify <span style={{ color:C.mid }}>AI</span></span>
              </div>
              <div style={{ display:'flex' }}>
                {['#C4B0E0','#A896CE','#8E7EBC'].map((c,i) => (
                  <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:c, border:'2.5px solid rgba(255,255,255,0.9)', marginLeft:i?-8:0, boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }} />
                ))}
              </div>
            </div>

            <div style={{ background:C.ultraPale, borderRadius:13, padding:'13px 17px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontFamily:"", fontWeight:800, fontSize:32, color:C.textDark, letterSpacing:-1 }}>120</span>
                <span style={{ fontSize:12.5, color:C.textLight, fontFamily:"'DM Sans', sans-serif" }}>requests today</span>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FFFBEF', border:'1px solid #EFE0A0', borderRadius:11, padding:'9px 13px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:23, height:23, borderRadius:6, background:C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <FiActivity size={12} color="#fff" />
                </div>
                {/* <span style={{ fontSize:12.5, fontFamily:"'DM Sans', sans-serif", color:'#7A5C00', fontWeight:600 }}>AI Risk Score: Medium</span> */}
              </div>
              <span style={{ fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:19, color:C.textDark }}>5</span>
            </div>

            {/* Chart */}
            <div style={{ background:C.ultraPale, borderRadius:13, padding:'11px 13px', marginBottom:12 }}>
              <svg viewBox="0 0 280 88" style={{ width:'100%', height:88, overflow:'visible' }}>
                <defs>
                  <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.mid} stopOpacity="0.26"/>
                    <stop offset="100%" stopColor={C.mid} stopOpacity="0.02"/>
                  </linearGradient>
                </defs>
                {[18,40,62].map(y=>(
                  <line key={y} x1="20" y1={y} x2="280" y2={y} stroke="rgba(107,91,164,0.07)" strokeWidth="1"/>
                ))}
                {[['100d',6],['50.0',28],['10.0',50]].map(([l,y])=>(
                  <text key={l} x="0" y={y+4} fill={C.textDimmed} fontSize="6.5" fontFamily="DM Mono">{l}</text>
                ))}
                <path d="M22,68 C42,63 58,56 78,50 S106,42 126,34 S150,20 170,14 S200,11 220,8 S252,5 272,3" fill="none" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22,68 C42,63 58,56 78,50 S106,42 126,34 S150,20 170,14 S200,11 220,8 S252,5 272,3 V80 H22 Z" fill="url(#cg2)"/>
                <circle cx="272" cy="3" r="4" fill={C.mid} stroke="white" strokeWidth="2"/>
                {['Mon','Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>(
                  <text key={i} x={22+i*36} y={86} fill={C.textDimmed} fontSize="6.5" fontFamily="DM Mono" textAnchor="middle">{d}</text>
                ))}
              </svg>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex' }}>
                {['#9B8DC9','#7C6BB5','#B8ADDA','#6B5BA4'].map((c,i)=>(
                  <div key={i} style={{ width:26, height:26, borderRadius:'50%', background:c, border:'2px solid #fff', marginLeft:i?-7:0 }} />
                ))}
              </div>
              <div style={{ display:'flex', gap:13, alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#7EDBA8', boxShadow:'0 0 6px rgba(126,219,168,0.65)', animation:'pulseDot 2s infinite' }} />
                  <span style={{ fontSize:10, color:C.textLight, fontFamily:"'DM Mono', monospace" }}>Requests 1A</span>
                </div>
                <span style={{ fontSize:10, color:C.textDimmed, fontFamily:"'DM Mono', monospace" }}>30:43 +0</span>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          {/* <div style={{ position:'absolute', top:-17, left:-22, background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.92)', borderRadius:13, padding:'9px 13px', boxShadow:'0 8px 26px rgba(107,91,164,0.14)', animation:'floatCard1 5s ease-in-out infinite' }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:17, color:C.mid }}>98%</div>
            <div style={{ fontSize:9.5, color:C.textDimmed, fontFamily:"'DM Sans', sans-serif" }}>accuracy</div>
          </div>
          <div style={{ position:'absolute', bottom:-15, right:-18, background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.92)', borderRadius:13, padding:'9px 15px', boxShadow:'0 8px 26px rgba(107,91,164,0.14)', animation:'floatCard2 6s ease-in-out 1.2s infinite' }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontWeight:700, fontSize:17, color:C.mid }}>5,000+</div>
            <div style={{ fontSize:9.5, color:C.textDimmed, fontFamily:"'DM Sans', sans-serif" }}>requests processed</div>
          </div> */}
        </div>
      </div>

      <style>{`
        @keyframes slideUpFade  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.7)} }
        @keyframes floatCard1   { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-9px) rotate(0deg)} }
        @keyframes floatCard2   { 0%,100%{transform:translateY(0) rotate(1deg)} 50%{transform:translateY(-8px) rotate(0deg)} }
        @keyframes marqueeAnim  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @media(max-width:768px){.hero-grid{grid-template-columns:1fr!important;padding:108px 20px 56px!important;gap:28px!important}}
      `}</style>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ['AI Consent Analysis','WhatsApp Alerts','OTP Verification','Fraud Detection','Audit Trails','Admin Dashboard','Real-Time Approval','Zero Manual Errors','LangChain AI','n8n Automation'];
  return (
    <div style={{ background:`linear-gradient(90deg, ${C.deep}, ${C.mid}, ${C.bright}, ${C.mid}, ${C.deep})`, overflow:'hidden', padding:'12px 0', position:'relative', zIndex:2 }}>
      <div style={{ display:'flex', animation:'marqueeAnim 22s linear infinite', whiteSpace:'nowrap' }}>
        {[...items,...items].map((item,i)=>(
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'0 22px', fontSize:10.5, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.75)', fontFamily:"'DM Mono', monospace", flexShrink:0 }}>
            {item} <span style={{ color:'rgba(255,255,255,0.28)', fontSize:7 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ label, title, accent, sub, light, center=true }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{ textAlign:center?'center':'left', marginBottom:50 }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <div style={{ width:18, height:2, background:light?'rgba(255,255,255,0.5)':C.mid, borderRadius:2 }} />
        <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, letterSpacing:'0.28em', textTransform:'uppercase', color:light?'rgba(255,255,255,0.65)':C.mid, fontWeight:500 }}>{label}</span>
        <div style={{ width:18, height:2, background:light?'rgba(255,255,255,0.5)':C.mid, borderRadius:2 }} />
      </div>
      <h2 style={{
        fontFamily:"", fontWeight:800,
        fontSize:'clamp(30px, 4vw, 52px)',
        lineHeight:1.06, letterSpacing:-1.5, marginBottom:13,
        color:light?'#fff':C.textDark,
        opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(20px)',
        transition:'all 0.7s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {title}{' '}
        {accent && <span style={{ color:light?'rgba(255,255,255,0.50)':C.mid, fontStyle:'italic', fontWeight:300 }}>{accent}</span>}
      </h2>
      {sub && <p style={{ fontSize:15.5, color:light?'rgba(255,255,255,0.62)':C.textLight, fontFamily:"'DM Sans', sans-serif", fontWeight:300, maxWidth:500, margin:center?'0 auto':undefined, lineHeight:1.82, opacity:visible?1:0, transition:'opacity 0.7s 0.15s' }}>{sub}</p>}
    </div>
  );
}

/* ── Features ── */
const FEATURES = [
  { icon: RiBrainLine,        title:'AI Consent Analysis',  desc:'LangChain NLP analyzes parent responses with 95%+ accuracy, detecting genuine consent vs coercion in real time.', num:'01', grad:`linear-gradient(135deg,#9B8DC9,#7C6BB5)` },
  { icon: RiNotificationLine, title:'Multi-Channel Alerts', desc:'Parents get WhatsApp, automated voice call, and email — all with secure one-time verification links for instant action.', num:'02', grad:`linear-gradient(135deg,#A896CE,#8878BC)` },
  { icon: RiShieldCheckLine,  title:'Fraud Detection',      desc:'AI risk scoring flags mismatches, suspicious patterns, and fake approvals before they ever reach admin review.', num:'03', grad:`linear-gradient(135deg,#7C6BB5,#6055A0)` },
  { icon: RiLockPasswordLine, title:'OTP Verification',     desc:'Multi-layer parent auth with time-limited OTPs prevents unauthorized approvals and ensures full request integrity.', num:'04', grad:`linear-gradient(135deg,#9B8DC9,#6B5BA4)` },
  { icon: RiBarChartBoxLine,  title:'Analytics Dashboard',  desc:'Comprehensive control panel with AI risk indicators, one-click approval workflows, and real-time analytics charts.', num:'05', grad:`linear-gradient(135deg,#B8ADDA,#8E7EBC)` },
  { icon: RiFileTextLine,     title:'Audit Trails',         desc:'Tamper-proof timestamped logs of every action — submission to final approval — for full regulatory compliance.', num:'06', grad:`linear-gradient(135deg,#7C6BB5,#9B8DC9)` },
];

function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const total = FEATURES.length;
  const prev = () => setActive(p=>(p-1+total)%total);
  const next = () => setActive(p=>(p+1)%total);
  useEffect(()=>{ const t=setInterval(next,3600); return ()=>clearInterval(t); },[]);
  const visible3 = [0,1,2].map(i=>FEATURES[(active+i)%total]);

  return (
    <section id="features" style={{ padding:'92px 24px', position:'relative', zIndex:2 }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionHeader label="Platform Features" title="Built for" accent="Every Role" sub="Six purpose-built capabilities that modernize campus outpass management, end-to-end." />
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:17, marginBottom:28 }} className="feature-grid">
            {visible3.map((f,i)=>{
              const Icon=f.icon; const isCenter=i===1;
              return (
                <div key={`${f.num}-${active}`} style={{
                  background:isCenter?`linear-gradient(145deg,${C.deep},${C.mid})`:'rgba(255,255,255,0.72)',
                  backdropFilter:'blur(18px)',
                  border:`1px solid ${isCenter?'transparent':'rgba(255,255,255,0.86)'}`,
                  borderRadius:20, padding:'32px 26px',
                  boxShadow:isCenter?`0 20px 54px rgba(107,91,164,0.34)`:'0 4px 18px rgba(107,91,164,0.08)',
                  transform:isCenter?'scale(1.05) translateY(-10px)':'scale(1)',
                  transition:'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  animation:`fadeInUp 0.5s ${i*0.07}s both`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:19 }}>
                    <div style={{ width:46, height:46, borderRadius:13, background:isCenter?'rgba(255,255,255,0.18)':f.grad, border:`1px solid ${isCenter?'rgba(255,255,255,0.25)':'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:isCenter?'none':'0 4px 14px rgba(107,91,164,0.24)' }}>
                      <Icon size={21} style={{ color:'#fff' }} />
                    </div>
                    <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10.5, color:isCenter?'rgba(255,255,255,0.32)':C.textDimmed, letterSpacing:2 }}>/{f.num}</span>
                  </div>
                  <h3 style={{ fontFamily:"", fontWeight:700, fontSize:17.5, color:isCenter?'#fff':C.textDark, marginBottom:8, letterSpacing:-0.2 }}>{f.title}</h3>
                  <p style={{ fontSize:13.5, lineHeight:1.82, color:isCenter?'rgba(255,255,255,0.67)':C.textLight, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:13 }}>
            <button onClick={prev} style={{ width:40, height:40, borderRadius:'50%', border:`1.5px solid ${C.border}`, background:'rgba(255,255,255,0.70)', backdropFilter:'blur(8px)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMid, transition:'all 0.2s', boxShadow:'0 2px 10px rgba(107,91,164,0.08)' }}
              onMouseEnter={e=>{e.currentTarget.style.background=C.superPale;e.currentTarget.style.borderColor=C.mid;}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.70)';e.currentTarget.style.borderColor=C.border;}}>
              <FiChevronLeft size={17}/>
            </button>
            <div style={{ display:'flex', gap:6 }}>
              {FEATURES.map((_,i)=>(
                <button key={i} onClick={()=>setActive(i)} style={{ width:i===active?22:8, height:8, borderRadius:4, background:i===active?C.mid:C.pale, border:'none', cursor:'pointer', padding:0, transition:'all 0.3s cubic-bezier(0.22,1,0.36,1)' }} />
              ))}
            </div>
            <button onClick={next} style={{ width:40, height:40, borderRadius:'50%', border:`1.5px solid ${C.border}`, background:'rgba(255,255,255,0.70)', backdropFilter:'blur(8px)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMid, transition:'all 0.2s', boxShadow:'0 2px 10px rgba(107,91,164,0.08)' }}
              onMouseEnter={e=>{e.currentTarget.style.background=C.superPale;e.currentTarget.style.borderColor=C.mid;}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.70)';e.currentTarget.style.borderColor=C.border;}}>
              <FiChevronRight size={17}/>
            </button>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.feature-grid{grid-template-columns:1fr!important}.feature-grid>div:not(:nth-child(2)){display:none}}`}</style>
    </section>
  );
}

/* ── Stats Band ── */
function StatsBand() {
  const data = [
    { icon:FiCheckCircle, num:'5,000+', label:'requests processed', grad:`linear-gradient(135deg,#7C6BB5,#9B8DC9)` },
    { icon:RiShieldCheckLine, num:'98%', label:'accuracy', grad:`linear-gradient(135deg,#6B5BA4,#8878BC)` },
    { icon:FiUsers, num:'50+', label:'admins using', grad:`linear-gradient(135deg,#9B8DC9,#7C6BB5)` },
  ];
  return (
    <section style={{ padding:'0 24px 68px', position:'relative', zIndex:2 }}>
      <div style={{ maxWidth:940, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:17 }} className="stats-band">
        {data.map(({icon:Icon,num,label,grad})=>(
          <div key={label} style={{ background:'rgba(255,255,255,0.72)', backdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.88)', borderRadius:17, padding:'20px 24px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 4px 18px rgba(107,91,164,0.08)' }}>
            <div style={{ width:44, height:44, borderRadius:12, background:grad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(107,91,164,0.26)' }}>
              <Icon size={20} style={{ color:'#fff' }} />
            </div>
            <div>
              <div style={{ fontFamily:"", fontWeight:800, fontSize:22, color:C.textDark, lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:12, color:C.textLight, fontFamily:"'DM Sans', sans-serif", marginTop:2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:768px){.stats-band{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ── How It Works ── */
const STEPS = [
  { num:'01', icon:MdOutlineSchool,       title:'Student Submits Request',  desc:'Fill destination, dates, reason, and parent contact in under 60 seconds through the secure student portal.' },
  { num:'02', icon:RiNotificationLine,    title:'Parent Gets Notified',      desc:'WhatsApp, voice call, and email delivered instantly with a unique secure approval link — no app needed.' },
  { num:'03', icon:MdOutlineVerifiedUser, title:'Parent Verifies & Approves',desc:'OTP verification + text/video consent confirms the parent is authentic and acting without coercion.' },
  { num:'04', icon:RiBrainLine,           title:'AI Analyzes Response',      desc:'LangChain validates consent semantics, date alignment, and flags anomalies for further review.' },
  { num:'05', icon:MdOutlineDashboard,    title:'Admin Reviews & Decides',   desc:'Dashboard surfaces AI recommendation — approve, flag, or reject — with full context in one view.' },
];

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setActiveStep(p=>(p+1)%STEPS.length),3000); return ()=>clearInterval(t); },[]);

  return (
    <section id="how-it-works" style={{ padding:'92px 24px', background:`linear-gradient(155deg,${C.deep} 0%,${C.mid} 55%,${C.bright} 100%)`, position:'relative', overflow:'hidden', zIndex:2 }}>
      <div style={{ position:'absolute', top:'-8%', right:'-4%', width:360, height:360, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-6%', left:'-3%', width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
      <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', opacity:0.14 }} viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill="rgba(255,255,255,0.3)" d="M0,35 C360,90 720,0 1080,55 C1260,82 1380,28 1440,45 L1440,100 L0,100 Z"/>
      </svg>

      <div style={{ maxWidth:1060, margin:'0 auto', position:'relative', zIndex:1 }}>
        <SectionHeader label="How It Works" title="Request to" accent="Approval in Minutes" light center={false} sub="A seamless five-step flow from submission to verified approval — with AI validation at every checkpoint." />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'start' }} className="process-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {STEPS.map((s,i)=>{
              const Icon=s.icon;
              return (
                <div key={i} onClick={()=>setActiveStep(i)} style={{ display:'flex', gap:13, alignItems:'flex-start', padding:'13px 15px', borderRadius:13, cursor:'pointer', background:i===activeStep?'rgba(255,255,255,0.15)':'transparent', border:`1px solid ${i===activeStep?'rgba(255,255,255,0.24)':'transparent'}`, transition:'all 0.28s cubic-bezier(0.22,1,0.36,1)' }}>
                  <div style={{ width:37, height:37, borderRadius:'50%', flexShrink:0, background:i===activeStep?'#fff':'rgba(255,255,255,0.14)', border:`1.5px solid ${i===activeStep?'#fff':'rgba(255,255,255,0.24)'}`, display:'flex', alignItems:'center', justifyContent:'center', color:i===activeStep?C.deep:'rgba(255,255,255,0.70)', transition:'all 0.28s', boxShadow:i===activeStep?'0 4px 14px rgba(0,0,0,0.12)':'none' }}>
                    <Icon size={15}/>
                  </div>
                  <div style={{ paddingTop:5 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2 }}>
                      <span style={{ fontFamily:"'DM Mono', monospace", fontSize:9.5, color:i===activeStep?'rgba(255,255,255,0.52)':'rgba(255,255,255,0.32)', letterSpacing:1 }}>{s.num}</span>
                      <h4 style={{ fontFamily:"", fontWeight:700, fontSize:14.5, color:i===activeStep?'#fff':'rgba(255,255,255,0.60)', margin:0, transition:'color 0.28s' }}>{s.title}</h4>
                    </div>
                    {i===activeStep && (
                      <p style={{ fontSize:12.5, color:'rgba(255,255,255,0.60)', fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.7, margin:0, animation:'fadeInUp 0.3s both' }}>{s.desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background:'rgba(255,255,255,0.11)', border:'1px solid rgba(255,255,255,0.20)', borderRadius:20, padding:'26px 24px', backdropFilter:'blur(16px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:19 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#7EDBA8', boxShadow:'0 0 8px rgba(126,219,168,0.7)', animation:'pulseDot 2s infinite' }} />
              <span style={{ fontFamily:"'DM Mono', monospace", fontSize:9.5, color:'rgba(255,255,255,0.50)', letterSpacing:'0.24em', textTransform:'uppercase' }}>Live System Metrics</span>
            </div>
            {[['Requests Processed Today','247','#fff'],['Avg Response Time','1m 42s','rgba(255,255,255,0.88)'],['Parent Satisfaction','98.4%','#7EDBA8'],['AI Accuracy Rate','99.1%','#7EDBA8']].map(([l,v,vc])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color:'rgba(255,255,255,0.50)', fontSize:12.5, fontFamily:"'DM Sans', sans-serif" }}>{l}</span>
                <span style={{ color:vc, fontWeight:700, fontSize:14.5, fontFamily:"'DM Mono', monospace" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:17, padding:'12px', borderRadius:10, background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:8 }}>
              <FiZap size={14} style={{ color:'rgba(255,255,255,0.62)', flexShrink:0 }}/>
              <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.50)', fontFamily:"'DM Sans', sans-serif", lineHeight:1.5 }}>
                Step <strong style={{ color:'#fff' }}>{STEPS[activeStep].num}</strong> — {STEPS[activeStep].title}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.process-grid{grid-template-columns:1fr!important;gap:28px!important}}`}</style>
    </section>
  );
}

/* ── Testimonials ── */
const TESTIMONIALS = [
  { name:'Priya Sharma',     role:'Hostel Warden, NIT Delhi',    text:'Passify AI has completely transformed how we manage outpass requests. What used to take hours now takes minutes. The AI consent verification is remarkably accurate.', rating:5, initials:'PS' },
  { name:'Dr. Rajesh Kumar', role:'Dean of Students, IIT Bombay',text:'The fraud detection alone has saved us from dozens of fake approvals. Parents love the WhatsApp notifications. Implementation was seamless.', rating:5, initials:'RK' },
  { name:'Ananya Iyer',      role:'Student, VIT Vellore',        text:'Submitting an outpass used to be a 2-day ordeal. Now my parents get notified instantly and approve in minutes. Completely stress-free.', rating:5, initials:'AI' },
  { name:'Vikram Nair',      role:'Admin Officer, BITS Pilani',  text:"The audit trail feature is excellent for compliance. The dashboard gives us a bird's eye view of everything in real time.", rating:5, initials:'VN' },
  { name:'Meera Patel',      role:'Parent, RVCE Bangalore',      text:"Incredibly easy. I get a WhatsApp message, click the link, enter OTP, and I'm done. No apps, no complications whatsoever.", rating:5, initials:'MP' },
];

function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = TESTIMONIALS.length;
  useEffect(()=>{ if(!autoplay) return; const t=setInterval(()=>setActive(p=>(p+1)%total),4000); return ()=>clearInterval(t); },[autoplay]);
  const prev=()=>{setAutoplay(false);setActive(p=>(p-1+total)%total);};
  const next=()=>{setAutoplay(false);setActive(p=>(p+1)%total);};
  const cards=[-1,0,1].map(i=>({...TESTIMONIALS[(active+i+total)%total],offset:i}));

  return (
    <section id="testimonials" style={{ padding:'92px 24px', position:'relative', zIndex:2, overflow:'hidden' }}>
      <div style={{ maxWidth:1060, margin:'0 auto' }}>
        <SectionHeader label="Testimonials" title="Loved by" accent="Every Campus" sub="Hear from wardens, admins, students, and parents who use Passify AI every day." />
        <div style={{ position:'relative', height:305, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:34 }}>
          {cards.map(({name,role,text,rating,initials,offset})=>(
            <div key={`${name}-${active}`} style={{
              position:'absolute', width:offset===0?460:345,
              background:offset===0?`linear-gradient(145deg,${C.deep},${C.mid})`:'rgba(255,255,255,0.72)',
              backdropFilter:'blur(18px)',
              border:`1px solid ${offset===0?'transparent':'rgba(255,255,255,0.86)'}`,
              borderRadius:20, padding:offset===0?'28px 26px':'20px 20px',
              boxShadow:offset===0?`0 22px 58px rgba(107,91,164,0.33)`:'0 4px 18px rgba(107,91,164,0.08)',
              transform:`translateX(${offset*65}%) scale(${offset===0?1:0.87})`,
              opacity:offset===0?1:0.46, zIndex:offset===0?2:1,
              transition:'all 0.44s cubic-bezier(0.22,1,0.36,1)',
              cursor:offset!==0?'pointer':'default',
            }} onClick={()=>offset!==0&&setActive((active+offset+total)%total)}>
              <div style={{ display:'flex', gap:3, marginBottom:11 }}>
                {Array(rating).fill(null).map((_,i)=>(
                  <FiStar key={i} size={12} style={{ color:offset===0?'rgba(255,255,255,0.82)':C.accent, fill:offset===0?'rgba(255,255,255,0.82)':C.accent }} />
                ))}
              </div>
              <p style={{ fontSize:offset===0?14:12.5, color:offset===0?'rgba(255,255,255,0.80)':C.textLight, fontFamily:"'DM Sans', sans-serif", fontWeight:300, lineHeight:1.78, marginBottom:17, fontStyle:'italic' }}>"{text}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:35, height:35, borderRadius:'50%', flexShrink:0, background:offset===0?'rgba(255,255,255,0.18)':C.superPale, border:`1.5px solid ${offset===0?'rgba(255,255,255,0.28)':C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono', monospace", fontSize:10.5, fontWeight:600, color:offset===0?'#fff':C.mid }}>{initials}</div>
                <div>
                  <p style={{ fontFamily:"", fontWeight:700, fontSize:13, color:offset===0?'#fff':C.textDark, marginBottom:1 }}>{name}</p>
                  <p style={{ fontSize:10.5, color:offset===0?'rgba(255,255,255,0.46)':C.textDimmed, fontFamily:"'DM Sans', sans-serif" }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:13 }}>
          <button onClick={prev} style={{ width:40, height:40, borderRadius:'50%', border:`1.5px solid ${C.border}`, background:'rgba(255,255,255,0.70)', backdropFilter:'blur(8px)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMid, transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.mid;e.currentTarget.style.background=C.superPale;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='rgba(255,255,255,0.70)';}}>
            <FiChevronLeft size={17}/>
          </button>
          <div style={{ display:'flex', gap:6 }}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>{setAutoplay(false);setActive(i);}} style={{ width:i===active?22:8, height:8, borderRadius:4, background:i===active?C.mid:C.pale, border:'none', cursor:'pointer', padding:0, transition:'all 0.3s cubic-bezier(0.22,1,0.36,1)' }} />
            ))}
          </div>
          <button onClick={next} style={{ width:40, height:40, borderRadius:'50%', border:`1.5px solid ${C.border}`, background:'rgba(255,255,255,0.70)', backdropFilter:'blur(8px)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMid, transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.mid;e.currentTarget.style.background=C.superPale;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='rgba(255,255,255,0.70)';}}>
            <FiChevronRight size={17}/>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASection() {
  const [ref, visible] = useInView(0.1);
  return (
    <section id="about" style={{ padding:'106px 24px', background:`linear-gradient(155deg,${C.deep} 0%,${C.mid} 55%,${C.bright} 100%)`, position:'relative', overflow:'hidden', zIndex:2 }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:540, height:540, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.07)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:820, height:820, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)', pointerEvents:'none' }} />
      <svg style={{ position:'absolute', top:0, left:0, width:'100%', opacity:0.11 }} viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path fill="rgba(255,255,255,0.3)" d="M0,28 C360,75 720,0 1080,46 C1260,70 1380,18 1440,36 L1440,0 L0,0 Z"/>
      </svg>
      <div ref={ref} style={{ maxWidth:640, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1, opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(26px)', transition:'all 0.85s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:26 }}>
          <div style={{ height:1, width:48, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.4))' }} />
          <HiOutlineSparkles size={16} style={{ color:'rgba(255,255,255,0.72)' }} />
          <div style={{ height:1, width:48, background:'linear-gradient(90deg, rgba(255,255,255,0.4), transparent)' }} />
        </div>
        <h2 style={{ fontFamily:"", fontWeight:800, fontSize:'clamp(32px, 4.8vw, 58px)', lineHeight:1.03, letterSpacing:-2, color:'#fff', marginBottom:15 }}>
          Ready to Digitize<br />
          <span style={{ color:'rgba(255,255,255,0.50)', fontStyle:'italic', fontWeight:300 }}>Your Campus?</span>
        </h2>
        <p style={{ fontSize:15.5, color:'rgba(255,255,255,0.64)', lineHeight:1.9, marginBottom:42, fontFamily:"'DM Sans', sans-serif", fontWeight:300 }}>
          Join forward-thinking institutions replacing paper-based outpass systems with AI-powered, fraud-resistant automation.
        </p>
        <div style={{ display:'flex', gap:11, justifyContent:'center', flexWrap:'wrap', marginBottom:38 }}>
          <a href="/student/signup" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 30px', borderRadius:12, background:'#FFFFFF', color:C.deep, fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:14, textDecoration:'none', boxShadow:'0 6px 22px rgba(0,0,0,0.12)', transition:'all 0.26s' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 14px 34px rgba(0,0,0,0.18)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 22px rgba(0,0,0,0.12)';}}>
            Get Started Free <FiArrowRight size={13}/>
          </a>
          <a href="/admin/login" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.30)', color:'#fff', fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:14, textDecoration:'none', background:'rgba(255,255,255,0.11)', transition:'all 0.26s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.20)';e.currentTarget.style.transform='translateY(-3px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.11)';e.currentTarget.style.transform='none';}}>
            <RiShieldCheckLine size={15}/> Admin Portal
          </a>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
          <div style={{ display:'flex' }}>
            {['PS','RK','AI','VN','MP'].map((init,i)=>(
              <div key={i} style={{ width:29, height:29, borderRadius:'50%', background:'rgba(255,255,255,0.20)', border:'2px solid rgba(255,255,255,0.35)', marginLeft:i?-7:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono', monospace", fontSize:9, fontWeight:600, color:'#fff' }}>{init}</div>
            ))}
          </div>
          <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.64)', fontFamily:"'DM Sans', sans-serif" }}>
            Trusted by <strong style={{ color:'#fff' }}>500+</strong> students across campuses
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{ background:C.deep, padding:'38px 30px', borderTop:'1px solid rgba(255,255,255,0.09)', position:'relative', zIndex:2 }}>
      <div style={{ maxWidth:1240, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:29, height:29, borderRadius:8, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MdOutlineSchool size={15} color="#fff"/>
          </div>
          <span style={{ fontFamily:"", fontWeight:800, fontSize:16, color:'#fff', letterSpacing:-0.2 }}>
            <span style={{ color:'rgba(255,255,255,0.50)' }}>Passify</span>
            {/* <span style={{ color:'rgba(255,255,255,0.28)', fontWeight:300 }}> AI</span> */}
          </span>
        </div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {['Features','How It Works','Admin Portal','Student Login'].map(l=>(
            <a key={l} href="#" style={{ color:'rgba(255,255,255,0.40)', textDecoration:'none', fontSize:12.5, fontFamily:"'DM Sans', sans-serif", transition:'color 0.18s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#fff'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.40)'}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize:10.5, letterSpacing:'0.08em', color:'rgba(255,255,255,0.18)', fontFamily:"'DM Mono', monospace" }}>
          © 2025 Passify AI · MERN + LangChain + n8n
        </span>
      </div>
    </footer>
  );
}

/* ── Main ── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", color:C.textDark, overflowX:'hidden', minHeight:'100vh', position:'relative' }}>
      <PageBackground />
      <Navbar />
      <Hero />
      <Marquee />
      <FeatureCarousel />
      <StatsBand />
      <HowItWorks />
      <TestimonialsCarousel />
      <CTASection />
      <Footer />
    </div>
  );
}
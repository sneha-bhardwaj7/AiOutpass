// src/components/StudentLayout.jsx
// THE FIX: <PageBackground/> is rendered here so every student page automatically
// gets the lavender-purple orb background. Individual pages need no changes.

import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiClock, FiLogOut, FiUser, FiChevronRight } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import PageBackground, { T, GCSS } from './Pagebackground';

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: '/student/dashboard', label: 'Dashboard',   icon: FiHome       },
    { to: '/student/request',   label: 'New Request',  icon: FiPlusCircle },
    { to: '/student/status',    label: 'My Status',    icon: FiClock      },
    { to: '/student/profile',   label: 'My Profile',   icon: FiUser       },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
      <style>{GCSS + `
        .nav-sb { transition: background 0.18s, color 0.18s; }
        .nav-sb:hover { background: rgba(255,255,255,0.12) !important; color: rgba(255,255,255,0.92) !important; }
        .sb-logout { transition: all 0.18s; }
        .sb-logout:hover { background: rgba(255,255,255,0.10) !important; color: rgba(255,255,255,0.92) !important; }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(16px,-12px)} 66%{transform:translate(-12px,16px)} }
        @keyframes dotPulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.65)} }
        @keyframes twinkle2   { 0%,100%{opacity:0.22;transform:scale(1)} 50%{opacity:0.88;transform:scale(2.3)} }
        @keyframes pageEnter  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .page-enter { animation: pageEnter 0.42s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── PageBackground renders lavender orbs + waves behind everything ── */}
      <PageBackground />

      {/* ── Sidebar ── */}
      <aside style={{
        width: 248, flexShrink: 0, position: 'fixed', height: '100%', zIndex: 30,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: `linear-gradient(180deg,${T.sideTop} 0%,${T.sideBg} 45%,${T.mid} 100%)`,
        borderRight: `1px solid ${T.sideBd}`,
        boxShadow: '4px 0 28px rgba(91,74,155,0.22)',
      }}>
        {/* Decorative orbs inside sidebar */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none', animation:'floatOrb2 10s ease-in-out infinite' }}/>
        <div style={{ position:'absolute', bottom:'-55px', left:'-55px', width:190, height:190, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }}/>
        {[[82,18],[14,55],[78,72],[30,85]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:3, height:3, borderRadius:'50%', background:`rgba(255,255,255,${0.14+i*0.06})`, animation:`twinkle2 ${3.5+i*0.4}s ease-in-out ${i*0.3}s infinite`, pointerEvents:'none' }}/>
        ))}

        {/* Logo */}
        <div style={{ padding:'22px 20px 18px', borderBottom:`1px solid ${T.sideBd}`, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:11 }}>
            <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.26)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 14px rgba(0,0,0,0.10)' }}>
              <MdOutlineSchool style={{ color:'#fff', fontSize:20 }}/>
            </div>
            <div>
              <p style={{ fontWeight:800, fontSize:17, color:'#fff', letterSpacing:-0.4, lineHeight:1 }}>
                Pass<span style={{ color:'rgba(255,255,255,0.52)' }}>Gate</span>
                <span style={{ fontWeight:300, color:'rgba(255,255,255,0.38)', fontSize:14 }}> AI</span>
              </p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.34)', letterSpacing:'0.20em', textTransform:'uppercase', marginTop:2 }}>Student Portal</p>
            </div>
          </div>
        </div>

        {/* User badge */}
        <div style={{ margin:'14px 14px 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 13px', borderRadius:14, background:'rgba(255,255,255,0.13)', border:'1px solid rgba(255,255,255,0.20)' }}>
            <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FiUser size={15} color="#fff"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:'#fff', fontSize:13, fontWeight:600, lineHeight:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Student'}</p>
              <p style={{ color:'rgba(255,255,255,0.46)', fontSize:9.5, letterSpacing:'0.10em', textTransform:'uppercase', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.collegeId || 'ID: N/A'}</p>
            </div>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#7EDBA8', flexShrink:0, boxShadow:'0 0 8px rgba(126,219,168,0.75)', animation:'dotPulse 2.5s infinite' }}/>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:'18px 10px', overflowY:'auto' }}>
          <p style={{ fontSize:8.5, fontWeight:700, letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(255,255,255,0.26)', padding:'0 10px', marginBottom:8 }}>Navigation</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} style={{ textDecoration:'none', display:'block' }}>
              {({ isActive }) => (
                <div className={isActive ? '' : 'nav-sb'} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 11px', borderRadius:13, marginBottom:3, background:isActive?'rgba(255,255,255,0.18)':'transparent', position:'relative', cursor:'pointer', transition:'background 0.18s' }}>
                  {isActive && <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:3, height:20, borderRadius:'0 3px 3px 0', background:'#fff' }}/>}
                  <Icon size={15} style={{ color:isActive?'#fff':'rgba(255,255,255,0.52)', flexShrink:0 }}/>
                  <span style={{ flex:1, fontSize:13, fontWeight:isActive?600:400, color:isActive?'#fff':'rgba(255,255,255,0.52)' }}>{label}</span>
                  {isActive && <FiChevronRight size={12} style={{ color:'rgba(255,255,255,0.38)', flexShrink:0 }}/>}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* AI engine status */}
        <div style={{ margin:'0 14px 10px', padding:'10px 13px', background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#7EDBA8', animation:'dotPulse 2.2s ease-in-out infinite', boxShadow:'0 0 8px rgba(126,219,168,0.70)', flexShrink:0 }}/>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.55)', letterSpacing:'0.08em' }}>AI Engine Active</span>
        </div>

        {/* Logout */}
        <div style={{ padding:'6px 10px 18px', borderTop:`1px solid ${T.sideBd}` }}>
          <button onClick={() => { logout(); navigate('/student/login'); }} className="sb-logout"
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 11px', borderRadius:13, border:'none', background:'transparent', color:'rgba(255,255,255,0.44)', fontSize:13, cursor:'pointer', marginTop:4 }}>
            <FiLogOut size={14}/><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content — key on pathname triggers page-enter on route change */}
      <main style={{ flex:1, marginLeft:248, minHeight:'100vh', position:'relative', zIndex:1 }}>
        <div key={location.pathname} className="page-enter" style={{ padding:32 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
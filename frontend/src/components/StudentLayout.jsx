import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiClock, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const C = {
  inkBlack: '#080C14', navyDeep: '#0A1628', navyMid: '#0F2347',
  tealMid: '#0A7C7C', tealBright: '#0FB5B5',
  slateBorder: 'rgba(255,255,255,0.08)', slateText: 'rgba(220,230,255,0.55)',
  white: '#F0F6FF',
};

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/student/dashboard', label: 'Dashboard',   icon: FiHome },
    { to: '/student/request',   label: 'New Request',  icon: FiPlusCircle },
    { to: '/student/status',    label: 'My Status',    icon: FiClock },
    { to: '/student/profile',   label: 'My Profile',   icon: FiUser },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:`linear-gradient(170deg, ${C.inkBlack} 0%, ${C.navyDeep} 100%)`, fontFamily:'DM Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .sb-link { transition: all 0.2s cubic-bezier(0.22,1,0.36,1); }
        .sb-link:hover:not(.sb-active) { background: rgba(11,181,181,0.08) !important; color: #F0F6FF !important; }
        .logout-btn:hover { background: rgba(248,113,113,0.1) !important; color: #f87171 !important; }
        @keyframes sbPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width:256, background:'rgba(8,12,20,0.95)', backdropFilter:'blur(20px)',
        display:'flex', flexDirection:'column', position:'fixed', height:'100%', zIndex:30,
        borderRight:`1px solid ${C.slateBorder}`,
        boxShadow:'4px 0 30px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ padding:'22px 20px 18px', borderBottom:`1px solid ${C.slateBorder}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, background:`linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px rgba(11,181,181,0.35)`, flexShrink:0 }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:18, fontFamily:'Space Grotesk, sans-serif' }}>P</span>
            </div>
            <div>
              <p style={{ color:C.white, fontWeight:700, fontSize:17, fontFamily:'Space Grotesk, sans-serif', letterSpacing:-0.3, lineHeight:1 }}>
                Pass<span style={{ color:C.tealBright }}>Gate</span> AI
              </p>
              <p style={{ color:'rgba(220,230,255,0.3)', fontSize:9, fontFamily:'DM Mono, monospace', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:3 }}>Student Portal</p>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div style={{ margin:'14px 14px 0', padding:'12px 14px', background:'rgba(11,181,181,0.06)', border:`1px solid rgba(11,181,181,0.15)`, borderRadius:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FiUser size={15} color="#fff"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:C.white, fontSize:13, fontWeight:600, fontFamily:'DM Sans, sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Student'}</p>
              <p style={{ color:'rgba(220,230,255,0.35)', fontSize:10, fontFamily:'DM Mono, monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.collegeId || 'ID: N/A'}</p>
            </div>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#34D399', flexShrink:0, animation:'sbPulse 2.2s ease-in-out infinite', boxShadow:'0 0 8px rgba(52,211,153,0.5)' }}/>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'20px 10px 10px', overflowY:'auto' }}>
          <p style={{ fontSize:'8.5px', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)', padding:'0 12px', marginBottom:8, fontFamily:'DM Mono, monospace' }}>Navigation</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `sb-link${isActive ? ' sb-active' : ''}`}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:11, padding:'11px 12px', borderRadius:12,
                marginBottom:3, textDecoration:'none', fontSize:13, fontWeight: isActive ? 600 : 400,
                background: isActive ? `linear-gradient(135deg, ${C.tealMid}, ${C.tealBright})` : 'transparent',
                color: isActive ? '#fff' : 'rgba(220,230,255,0.45)',
                boxShadow: isActive ? `0 4px 16px rgba(11,181,181,0.3)` : 'none',
              })}>
              {({ isActive }) => (
                <>
                  <span style={{ width:28, height:28, borderRadius:8, background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={14} style={{ color: isActive ? '#fff' : C.tealBright }}/>
                  </span>
                  <span style={{ flex:1, fontFamily:'DM Sans, sans-serif' }}>{label}</span>
                  {isActive && <div style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,0.6)' }}/>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* AI Status */}
        <div style={{ margin:'0 14px 10px', padding:'10px 13px', background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.15)', borderRadius:12, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#34D399', animation:'sbPulse 2.2s ease-in-out infinite', boxShadow:'0 0 8px rgba(52,211,153,0.5)' }}/>
          <span style={{ fontSize:10, fontFamily:'DM Mono, monospace', color:'rgba(52,211,153,0.8)', letterSpacing:'0.06em' }}>AI Engine Active</span>
        </div>

        {/* Logout */}
        <div style={{ padding:'0 10px 16px' }}>
          <button onClick={() => { logout(); navigate('/student/login'); }} className="logout-btn"
            style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'11px 12px', borderRadius:12, background:'none', border:'none', cursor:'pointer', color:'rgba(220,230,255,0.3)', fontSize:13, fontFamily:'DM Sans, sans-serif', transition:'all 0.2s', textAlign:'left' }}>
            <span style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FiLogOut size={14}/>
            </span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, marginLeft:256, minHeight:'100vh' }}>
        <div style={{ padding:32 }}>{children}</div>
      </main>
    </div>
  );
};

export default StudentLayout;
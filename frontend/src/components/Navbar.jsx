// src/components/AdminLayout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiList, FiBarChart2, FiFileText, FiLogOut,
  FiShield, FiSettings, FiUsers, FiChevronRight,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const C = {
  inkBlack:    '#080C14',
  navyDeep:    '#0A1628',
  magentaMid:     '#8E2A7A',
  magentaBright:  '#A23B88',
  amber:       '#E8A020',
  amberLight:  '#F5BE58',
  slateBorder: 'rgba(255,255,255,0.08)',
  slateText:   'rgba(220,230,255,0.55)',
  white:       '#F0F6FF',
};

const navLinks = [
  { to: '/admin/dashboard',  label: 'Dashboard',    icon: FiGrid,      badge: null },
  { to: '/admin/requests',   label: 'All Requests', icon: FiList,      badge: '12' },
  { to: '/admin/analytics',  label: 'Analytics',    icon: FiBarChart2, badge: null },
  { to: '/admin/audit-logs', label: 'Audit Logs',   icon: FiFileText,  badge: null },
  { to: '/admin/parents',    label: 'Parents',      icon: FiUsers,     badge: null },
  { to: '/admin/profile',    label: 'My Profile',   icon: FiShield,    badge: null },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside style={{
      width:256, background:'rgba(8,12,20,0.97)', backdropFilter:'blur(20px)',
      display:'flex', flexDirection:'column', position:'fixed', height:'100%', zIndex:40,
      borderRight:`1px solid rgba(232,160,32,0.12)`,
      boxShadow:'4px 0 30px rgba(0,0,0,0.5)',
      fontFamily:'DM Sans, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .admin-sb-link { transition: all 0.2s cubic-bezier(0.22,1,0.36,1); text-decoration: none; }
        .admin-sb-link:hover:not(.admin-sb-active) { background: rgba(162,59,136,0.07) !important; color: #F0F6FF !important; }
        .admin-logout:hover { background: rgba(248,113,113,0.1) !important; color: #f87171 !important; }
        .admin-settings:hover { background: rgba(255,255,255,0.06) !important; color: #F0F6FF !important; }
        @keyframes adminPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>

      {/* Logo */}
      <div style={{ padding:'22px 20px 18px', borderBottom:`1px solid rgba(232,160,32,0.1)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, background:`linear-gradient(135deg, #8E2A7A, #A23B88)`, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px rgba(162,59,136,0.35)`, flexShrink:0 }}>
            <FiShield size={19} color="#fff"/>
          </div>
          <div>
            <p style={{ color:C.white, fontWeight:700, fontSize:17, fontFamily:'Space Grotesk, sans-serif', letterSpacing:-0.3, lineHeight:1 }}>
              Pass<span style={{ color:'#A23B88' }}>Gate</span> AI
            </p>
            <p style={{ color:'rgba(220,230,255,0.25)', fontSize:9, fontFamily:'DM Mono, monospace', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:3 }}>Admin Console</p>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div style={{ margin:'14px 14px 0', padding:'12px 14px', background:`rgba(232,160,32,0.07)`, border:`1px solid rgba(232,160,32,0.18)`, borderRadius:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:`linear-gradient(135deg, rgba(13,79,79,0.8), rgba(10,118,118,0.6))`, border:`1px solid rgba(232,160,32,0.3)`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:C.amberLight, fontWeight:800, fontSize:14, fontFamily:'Space Grotesk, sans-serif' }}>{user?.name?.[0]?.toUpperCase() || 'A'}</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ color:C.white, fontSize:13, fontWeight:600, fontFamily:'DM Sans, sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Admin'}</p>
            <p style={{ color:C.amberLight, fontSize:9, fontWeight:700, fontFamily:'DM Mono, monospace', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:2 }}>Administrator</p>
          </div>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#34D399', flexShrink:0, animation:'adminPulse 2.2s ease-in-out infinite', boxShadow:'0 0 8px rgba(52,211,153,0.5)' }}/>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'18px 10px 10px', overflowY:'auto', scrollbarWidth:'none' }}>
        <p style={{ fontSize:'8.5px', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.12)', padding:'0 12px', marginBottom:6, fontFamily:'DM Mono, monospace' }}>Navigation</p>
        {navLinks.map(({ to, label, icon: Icon, badge }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `admin-sb-link${isActive ? ' admin-sb-active' : ''}`}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:11, padding:'11px 12px', borderRadius:12,
              marginBottom:3, fontSize:13, fontWeight: isActive ? 600 : 400,
              background: isActive ? `linear-gradient(135deg, #8E2A7A, #A23B88)` : 'transparent',
              color: isActive ? '#fff' : 'rgba(220,230,255,0.4)',
              boxShadow: isActive ? `0 4px 16px rgba(162,59,136,0.28)` : 'none',
            })}
            {({ isActive }) => (
              <>
                <span style={{ width:28, height:28, borderRadius:8, background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.2s' }}>
                  <Icon size={14}/>
                </span>
                <span style={{ flex:1, fontFamily:'DM Sans, sans-serif' }}>{label}</span>
                {badge && (
                  <span style={{ padding:'2px 8px', borderRadius:20, fontSize:'9.5px', fontWeight:700, fontFamily:'DM Mono, monospace', background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(232,160,32,0.15)', color: isActive ? 'rgba(255,255,255,0.85)' : C.amberLight }}>{badge}</span>
                )}
                {isActive && <FiChevronRight size={12} style={{ opacity:0.45 }}/>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height:1, margin:'0 14px', background:'rgba(255,255,255,0.05)' }}/>

      {/* AI Status */}
      <div style={{ margin:'10px 14px', padding:'10px 13px', background:'rgba(162,59,136,0.06)', border:'1px solid rgba(162,59,136,0.15)', borderRadius:12, display:'flex', alignItems:'center', gap:9 }}>
        <HiOutlineSparkles size={14} style={{ color:'#A23B88', flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:11, fontWeight:600, color:C.white, fontFamily:'DM Sans, sans-serif', lineHeight:1 }}>AI Engine</p>
          <p style={{ fontSize:9, color:'#34D399', fontFamily:'DM Mono, monospace', marginTop:2 }}>Active & Running</p>
        </div>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'#34D399', animation:'adminPulse 2.2s ease-in-out infinite', boxShadow:'0 0 6px rgba(52,211,153,0.6)' }}/>
      </div>

      {/* Bottom */}
      <div style={{ padding:'0 10px 14px' }}>
        <button className="admin-settings" style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'11px 12px', borderRadius:12, background:'none', border:'none', cursor:'pointer', color:'rgba(220,230,255,0.28)', fontSize:13, fontFamily:'DM Sans, sans-serif', transition:'all 0.2s', textAlign:'left', marginBottom:2 }}>
          <span style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}><FiSettings size={14}/></span>
          Settings
        </button>
        <button className="admin-logout" onClick={() => { logout?.(); navigate('/admin/login'); }}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'11px 12px', borderRadius:12, background:'none', border:'none', cursor:'pointer', color:'rgba(220,230,255,0.28)', fontSize:13, fontFamily:'DM Sans, sans-serif', transition:'all 0.2s', textAlign:'left' }}>
          <span style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}><FiLogOut size={14}/></span>
          Logout
        </button>
      </div>
    </aside>
  );
};

const AdminLayout = ({ children, title, subtitle }) => (
  <div style={{ minHeight:'100vh', display:'flex', background:`linear-gradient(170deg, #080C14 0%, #0A1628 100%)`, fontFamily:'DM Sans, sans-serif' }}>
    <AdminSidebar />
    <main style={{ flex:1, marginLeft:256, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {(title || subtitle) && (
        <div style={{
          position:'sticky', top:0, zIndex:20,
          background:'rgba(8,12,20,0.92)', backdropFilter:'blur(16px)',
          borderBottom:`1px solid rgba(255,255,255,0.07)`,
          padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            {title    && <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:800, fontSize:22, color:'#F0F6FF', letterSpacing:-0.6, lineHeight:1 }}>{title}</h1>}
            {subtitle && <p style={{ fontSize:11, color:'rgba(220,230,255,0.4)', marginTop:4, fontFamily:'DM Mono, monospace' }}>{subtitle}</p>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 14px', background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#34D399', animation:'adminPulse 2.2s ease-in-out infinite', boxShadow:'0 0 8px rgba(52,211,153,0.5)' }}/>
            <span style={{ fontSize:10, fontWeight:700, color:'rgba(52,211,153,0.9)', fontFamily:'DM Mono, monospace', letterSpacing:'0.08em' }}>LIVE</span>
          </div>
        </div>
      )}
      <div style={{ padding:'28px 32px', flex:1 }}>{children}</div>
    </main>
    <style>{`@keyframes adminPulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
  </div>
);

export default AdminLayout;
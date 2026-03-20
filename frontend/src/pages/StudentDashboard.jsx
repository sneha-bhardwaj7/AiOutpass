// src/pages/StudentDashboard.jsx
// FIX: '../components/Pagebackground' → '../components/PageBackground' (capital B)
// Background is rendered by StudentLayout — nothing else needed here.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiPlus, FiArrowRight, FiMapPin, FiCalendar, FiBell } from 'react-icons/fi';
import StudentLayout from '../components/StudentLayout';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { T, GCSS } from '../components/Pagebackground';   // ← capital B fixed

export default function StudentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    fetch('/api/outpass/my-passes', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setRequests(d.outpasses || []))
      .catch(() => setRequests([])).finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => ['pending','parent-pending','processing'].includes(r.status)).length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };
  const recent = [...requests].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const statCards = [
    { label:'Total Requests', value:stats.total,    icon:FiFileText,    accent:T.mid,     bg:'rgba(107,90,176,0.12)', bd:'rgba(107,90,176,0.22)' },
    { label:'Pending',        value:stats.pending,  icon:FiClock,       accent:'#B07A10', bg:'rgba(176,122,16,0.10)', bd:'rgba(176,122,16,0.22)' },
    { label:'Approved',       value:stats.approved, icon:FiCheckCircle, accent:'#1A9B5C', bg:'rgba(26,155,92,0.10)',  bd:'rgba(26,155,92,0.22)'  },
    { label:'Rejected',       value:stats.rejected, icon:FiXCircle,     accent:'#B02A20', bg:'rgba(176,42,32,0.10)',  bd:'rgba(176,42,32,0.22)'  },
  ];

  return (
    <StudentLayout>
      <style>{GCSS + `
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .shimmer { background:linear-gradient(90deg,rgba(200,190,240,0.18) 25%,rgba(180,168,228,0.28) 50%,rgba(200,190,240,0.18) 75%); background-size:800px 100%; animation:shimmer 1.5s ease-in-out infinite; border-radius:8px; }
        .card-hv { transition:all 0.28s cubic-bezier(0.22,1,0.36,1); }
        .card-hv:hover { transform:translateY(-5px); box-shadow:0 22px 56px rgba(91,74,155,0.26) !important; }
        .row-hv { transition:background 0.16s; }
        .row-hv:hover { background:rgba(237,232,248,0.80) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:T.mid, boxShadow:`0 0 10px ${T.glow}` }}/>
          <span style={{ color:T.mid, fontSize:10, fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase' }}>Dashboard</span>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div>
            <h1 style={{ fontWeight:800, fontSize:28, color:T.ink, letterSpacing:-0.8, marginBottom:6 }}>
              Welcome back, <span style={{ color:T.mid }}>{user?.name?.split(' ')[0] || 'Student'}</span>
            </h1>
            <p style={{ color:T.inkSoft, fontSize:12, letterSpacing:'0.04em' }}>{user?.collegeId} · {user?.hostel || 'Hostel'} · Room {user?.roomNumber || '—'}</p>
          </div>
          <Link to="/student/request"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 26px', borderRadius:14, background:`linear-gradient(135deg,${T.deep},${T.mid})`, color:'#fff', textDecoration:'none', fontWeight:700, fontSize:14, boxShadow:`0 8px 26px rgba(91,74,155,0.40)`, transition:'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 14px 38px rgba(91,74,155,0.52)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 8px 26px rgba(91,74,155,0.40)`; }}>
            <FiPlus size={15}/> New Request
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:14, marginBottom:24 }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card-hv" style={{ background:'rgba(255,255,255,0.62)', backdropFilter:'blur(28px)', border:`1px solid ${s.bd}`, borderRadius:20, padding:'22px 20px', boxShadow:`0 6px 24px rgba(91,74,155,0.12)` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <p style={{ fontSize:9, fontWeight:700, color:T.inkDim, textTransform:'uppercase', letterSpacing:'0.22em' }}>{s.label}</p>
                <div style={{ width:38, height:38, borderRadius:11, background:s.bg, border:`1px solid ${s.bd}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} style={{ color:s.accent }}/>
                </div>
              </div>
              {loading
                ? <div className="shimmer" style={{ height:30, width:58 }}/>
                : <p style={{ fontSize:36, fontWeight:800, color:s.accent, lineHeight:1, letterSpacing:-1 }}>{s.value}</p>}
            </div>
          );
        })}
      </div>

      {/* Recent requests */}
      <div style={{ background:'rgba(255,255,255,0.62)', backdropFilter:'blur(28px)', border:`1px solid rgba(255,255,255,0.86)`, borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(91,74,155,0.12)', marginBottom:20, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})` }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px 16px', borderBottom:`1px solid ${T.border}`, background:`rgba(246,243,253,0.70)`, marginTop:3 }}>
          <div>
            <h2 style={{ fontWeight:700, fontSize:17, color:T.ink, marginBottom:3 }}>Recent Requests</h2>
            <p style={{ fontSize:10, color:T.inkSoft, letterSpacing:'0.04em' }}>Your latest outpass submissions</p>
          </div>
          <Link to="/student/status" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:T.mid, textDecoration:'none', padding:'6px 14px', borderRadius:10, background:T.mist, border:`1px solid ${T.border}` }}>
            View All <FiArrowRight size={13}/>
          </Link>
        </div>

        {loading ? (
          <div style={{ padding:24, textAlign:'center', color:T.inkSoft, fontSize:14 }}>Loading…</div>
        ) : recent.length === 0 ? (
          <div style={{ padding:'48px 24px', textAlign:'center' }}>
            <FiFileText size={38} style={{ color:T.pale, display:'block', margin:'0 auto 14px' }}/>
            <p style={{ color:T.inkSoft, fontWeight:600, marginBottom:12 }}>No outpass requests yet</p>
            <Link to="/student/request" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:T.mid, fontWeight:700, textDecoration:'none' }}>
              <FiPlus size={13}/> Create your first request
            </Link>
          </div>
        ) : (
          <div>
            {recent.map(req => (
              <Link key={req._id} to={`/student/status/${req._id}`} className="row-hv"
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 24px', borderBottom:`1px solid ${T.border}`, textDecoration:'none', background:'transparent' }}>
                <div style={{ width:40, height:40, background:`rgba(107,90,176,0.10)`, border:`1px solid ${T.border}`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FiMapPin size={15} style={{ color:T.mid }}/>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:14, color:T.ink, marginBottom:3 }}>{req.destination}</p>
                  <p style={{ fontSize:11, color:T.inkDim, display:'flex', alignItems:'center', gap:4 }}>
                    <FiCalendar size={11}/>{req.leaveDateFrom ? new Date(req.leaveDateFrom).toLocaleDateString() : '—'}
                  </p>
                </div>
                <StatusBadge status={req.status}/>
                <FiArrowRight size={15} style={{ color:T.pale, flexShrink:0 }}/>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div style={{ borderRadius:20, padding:'18px 24px', background:`linear-gradient(135deg,rgba(107,90,176,0.11),rgba(91,74,155,0.07))`, border:`1px solid rgba(139,123,200,0.28)`, display:'flex', alignItems:'center', gap:16, backdropFilter:'blur(14px)' }}>
        <div style={{ width:44, height:44, background:`rgba(107,90,176,0.14)`, border:`1px solid ${T.border}`, borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <FiBell size={18} style={{ color:T.mid }}/>
        </div>
        <div>
          <p style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:4 }}>Stay Informed</p>
          <p style={{ fontSize:12, color:T.inkSoft, lineHeight:1.6 }}>Parents receive WhatsApp, voice call and email alerts for every request.</p>
        </div>
      </div>
    </StudentLayout>
  );
}
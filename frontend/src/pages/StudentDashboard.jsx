// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText, FiClock, FiCheckCircle, FiXCircle,
  FiPlus, FiArrowRight, FiMapPin, FiCalendar, FiBell
} from "react-icons/fi";
import StudentLayout from "../components/StudentLayout";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    fetch("/api/outpass/my-passes", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setRequests(data.outpasses || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => ["pending","parent-pending","processing"].includes(r.status)).length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const recent = [...requests].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);

  const statCards = [
    { label:"Total Requests", value:stats.total,    icon:FiFileText,    accent:"#0FB5B5", bg:"rgba(11,181,181,0.1)"  },
    { label:"Pending",        value:stats.pending,  icon:FiClock,       accent:"#F5BE58", bg:"rgba(245,190,88,0.1)"  },
    { label:"Approved",       value:stats.approved, icon:FiCheckCircle, accent:"#34D399", bg:"rgba(52,211,153,0.1)"  },
    { label:"Rejected",       value:stats.rejected, icon:FiXCircle,     accent:"#F87171", bg:"rgba(248,113,113,0.1)" },
  ];

  return (
    <StudentLayout>
      <style>{`
        .stat-card { transition: all 0.28s cubic-bezier(0.22,1,0.36,1); }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.25) !important; }
        .req-row { transition: background 0.18s; cursor: pointer; }
        .req-row:hover { background: rgba(11,181,181,0.05) !important; }
        @keyframes shimmer2 { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .shimmer2 { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%); background-size: 800px 100%; animation: shimmer2 1.4s ease-in-out infinite; border-radius: 8px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:32, fontFamily:'DM Sans, sans-serif' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#0FB5B5', boxShadow:'0 0 8px #0FB5B5' }}/>
          <span style={{ color:'#0FB5B5', fontSize:10, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', fontFamily:'DM Mono, monospace' }}>Dashboard</span>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:28, fontWeight:800, color:'#F0F6FF', letterSpacing:-0.8, marginBottom:5 }}>
              Welcome back, <span style={{ color:'#0FB5B5' }}>{user?.name?.split(" ")[0] || "Student"}</span>
            </h1>
            <p style={{ color:'rgba(220,230,255,0.4)', fontSize:12, fontFamily:'DM Mono, monospace' }}>
              {user?.collegeId} · {user?.hostel || "Hostel"} · Room {user?.roomNumber || "—"}
            </p>
          </div>
          <Link to="/student/request" style={{
            display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:12,
            background:'linear-gradient(135deg,#0A7C7C,#0FB5B5)', color:'#fff', textDecoration:'none',
            fontFamily:'DM Sans, sans-serif', fontWeight:700, fontSize:14,
            boxShadow:'0 6px 20px rgba(11,181,181,0.3)', transition:'all 0.25s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 30px rgba(11,181,181,0.45)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 20px rgba(11,181,181,0.3)'}}>
            <FiPlus size={15}/> New Request
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
        {statCards.map((s,i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card" style={{
              background:'rgba(15,22,48,0.75)', backdropFilter:'blur(16px)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:18,
              padding:'22px 20px', boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <p style={{ fontSize:9, fontWeight:700, color:'rgba(220,230,255,0.4)', textTransform:'uppercase', letterSpacing:'0.2em', fontFamily:'DM Mono, monospace' }}>{s.label}</p>
                <div style={{ width:36, height:36, borderRadius:10, background:s.bg, border:`1px solid ${s.accent}25`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={17} style={{ color:s.accent }}/>
                </div>
              </div>
              {loading
                ? <div className="shimmer2" style={{ height:28, width:56 }}/>
                : <p style={{ fontSize:34, fontWeight:800, color:s.accent, fontFamily:'Space Grotesk, sans-serif', lineHeight:1, textShadow:`0 0 24px ${s.accent}50` }}>{s.value}</p>
              }
            </div>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div style={{ background:'rgba(15,22,48,0.75)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.2)', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(11,181,181,0.03)' }}>
          <div>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:17, color:'#F0F6FF', marginBottom:3 }}>Recent Requests</h2>
            <p style={{ fontSize:10, color:'rgba(220,230,255,0.35)', fontFamily:'DM Mono, monospace' }}>Your latest outpass submissions</p>
          </div>
          <Link to="/student/status" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:'#0FB5B5', textDecoration:'none' }}>
            View All <FiArrowRight size={13}/>
          </Link>
        </div>

        {loading ? (
          <div style={{ padding:24, textAlign:'center', color:'rgba(220,230,255,0.35)', fontFamily:'DM Sans, sans-serif', fontSize:14 }}>Loading…</div>
        ) : recent.length === 0 ? (
          <div style={{ padding:'48px 24px', textAlign:'center' }}>
            <FiFileText size={36} style={{ color:'rgba(220,230,255,0.15)', display:'block', margin:'0 auto 12px' }}/>
            <p style={{ color:'rgba(220,230,255,0.35)', fontFamily:'DM Sans, sans-serif', fontWeight:600, marginBottom:10 }}>No outpass requests yet</p>
            <Link to="/student/request" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'#0FB5B5', fontWeight:700, textDecoration:'none' }}>
              <FiPlus size={13}/> Create your first request
            </Link>
          </div>
        ) : (
          <div>
            {recent.map(req => (
              <Link key={req._id} to={`/student/status/${req._id}`} className="req-row" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', textDecoration:'none' }}>
                <div style={{ width:38, height:38, background:'rgba(11,181,181,0.1)', border:'1px solid rgba(11,181,181,0.2)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FiMapPin size={15} style={{ color:'#0FB5B5' }}/>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:14, color:'#F0F6FF', fontFamily:'DM Sans, sans-serif', marginBottom:3 }}>{req.destination}</p>
                  <p style={{ fontSize:11, color:'rgba(220,230,255,0.35)', display:'flex', alignItems:'center', gap:4, fontFamily:'DM Mono, monospace' }}>
                    <FiCalendar size={11}/>
                    {req.leaveDateFrom ? new Date(req.leaveDateFrom).toLocaleDateString() : "—"}
                  </p>
                </div>
                <StatusBadge status={req.status}/>
                <FiArrowRight size={15} style={{ color:'rgba(220,230,255,0.18)', flexShrink:0 }}/>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div style={{ borderRadius:18, padding:'16px 22px', background:'linear-gradient(135deg, rgba(13,79,79,0.5), rgba(10,118,118,0.3))', border:'1px solid rgba(11,181,181,0.2)', display:'flex', alignItems:'center', gap:16, backdropFilter:'blur(12px)' }}>
        <div style={{ width:40, height:40, background:'rgba(11,181,181,0.12)', border:'1px solid rgba(11,181,181,0.22)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <FiBell size={17} style={{ color:'#0FB5B5' }}/>
        </div>
        <div>
          <p style={{ fontWeight:700, fontSize:13, color:'#F0F6FF', marginBottom:3, fontFamily:'DM Sans, sans-serif' }}>Stay Informed</p>
          <p style={{ fontSize:12, color:'rgba(220,230,255,0.45)', fontFamily:'DM Sans, sans-serif' }}>Parents receive WhatsApp, voice call and email alerts for every request.</p>
        </div>
      </div>
    </StudentLayout>
  );
}
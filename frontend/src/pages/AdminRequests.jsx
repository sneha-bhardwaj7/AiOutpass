// src/pages/AdminRequests.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, Filter } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import OutpassTable from "../components/OutpassTable";
import { outpassAPI } from "../services/api";

const C = {
  magentaMid:'#8E2A7A', magentaBright:'#A23B88',
  amberLight:'#F5BE58', green:'#34D399', red:'#F87171', purple:'#A78BFA',
  slateBorder:'rgba(255,255,255,0.08)', slateText:'rgba(220,230,255,0.55)', white:'#F0F6FF',
};

const STATUS_FILTERS = [
  { key:"all",           label:"All",           accent:C.magentaBright, bg:"rgba(162,59,136,0.12)",  border:"rgba(162,59,136,0.25)"  },
  { key:"pending",       label:"Pending Parent", accent:C.amberLight, bg:"rgba(245,190,88,0.12)",  border:"rgba(245,190,88,0.25)"  },
  { key:"pending-admin", label:"Pending Admin",  accent:C.purple,     bg:"rgba(167,139,250,0.12)", border:"rgba(167,139,250,0.25)" },
  { key:"approved",      label:"Approved",       accent:C.green,      bg:"rgba(52,211,153,0.12)",  border:"rgba(52,211,153,0.25)"  },
  { key:"rejected",      label:"Rejected",       accent:C.red,        bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.25)" },
];

export default function AdminRequests() {
  const [allRequests,  setAllRequests]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchParams] = useSearchParams();

  useEffect(() => { const s = searchParams.get("status"); if(s) setActiveFilter(s); }, [searchParams]);

  const fetchRequests = async () => {
    try { const data = await outpassAPI.getAll(); setAllRequests(data.requests||[]); }
    catch(e){ console.error(e); } finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { fetchRequests(); }, []);

  const filtered = activeFilter === "all" ? allRequests : allRequests.filter(r => r.status === activeFilter);
  const activeCfg = STATUS_FILTERS.find(f => f.key === activeFilter) || STATUS_FILTERS[0];

  return (
    <AdminLayout title="All Requests" subtitle="Manage and review all outpass submissions">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        @keyframes spinR { to { transform:rotate(360deg); } }
        .ft { transition:all 0.2s cubic-bezier(0.22,1,0.36,1); }
        .ft:hover { transform:translateY(-1px); }
      `}</style>

      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:20 }}>
       <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8 }}>
  
  {/* Filter Label */}
  <div
    style={{
      display:'flex',
      alignItems:'center',
      gap:6,
      padding:'6px 12px',
      background:'rgba(255,255,255,0.08)',
      border:'1px solid rgba(255,255,255,0.15)',
      borderRadius:10
    }}
  >
    <Filter size={12} style={{ color:C.slateText }}/>
    <span
      style={{
        fontSize:10,
        fontWeight:700,
        color:C.slateText,
        fontFamily:'DM Mono,monospace',
        letterSpacing:'0.15em',
        textTransform:'uppercase'
      }}
    >
      Filter
    </span>
  </div>

  {/* Buttons */}
  {STATUS_FILTERS.map(({ key, label, accent }) => {
    const isActive = activeFilter === key;

    const count =
      key === "all"
        ? allRequests.length
        : allRequests.filter(r => r.status === key).length;

    return (
      <button
        key={key}
        onClick={() => setActiveFilter(key)}
        className="ft"
        style={{
          display:'flex',
          alignItems:'center',
          gap:6,
          padding:'8px 16px',
          borderRadius:12,
          fontSize:12,
          fontWeight:isActive ? 700 : 600,
          fontFamily:'DM Sans,sans-serif',

          // ✅ FIXED VISIBILITY
          background: isActive
            ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
            : 'rgba(255,255,255,0.12)',

          color: isActive
            ? '#ffffff'
            : 'rgba(255,255,255,0.85)',

          border: isActive
            ? `1px solid ${accent}`
            : '1px solid rgba(255,255,255,0.2)',

          cursor:'pointer',

          // ✨ POP EFFECT
          boxShadow: isActive
            ? `0 6px 20px ${accent}40`
            : '0 2px 6px rgba(0,0,0,0.1)',

          backdropFilter:'blur(6px)',

          transition:'all 0.25s ease'
        }}
      >
        {label}

        {/* Count Badge */}
        {key !== "all" && count > 0 && (
          <span
            style={{
              display:'inline-flex',
              alignItems:'center',
              justifyContent:'center',
              minWidth:18,
              height:18,
              borderRadius:100,

              background: isActive
                ? 'rgba(255,255,255,0.25)'
                : 'rgba(255,255,255,0.15)',

              color:'#fff',

              fontSize:9,
              fontWeight:800,
              fontFamily:'DM Mono,monospace',
              padding:'0 5px'
            }}
          >
            {count}
          </span>
        )}
      </button>
    );
  })}
</div>
        <button onClick={() => { setRefreshing(true); fetchRequests(); }} disabled={refreshing}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', fontSize:12, fontWeight:600, fontFamily:'DM Sans,sans-serif', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, cursor:'pointer', color:C.slateText, opacity:refreshing?0.55:1, transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#A23B88'; e.currentTarget.style.color = '#A23B88'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = C.slateText; }}>
          <RefreshCw size={13} style={{ animation:refreshing?'spinR 0.9s linear infinite':'none' }}/> Refresh
        </button>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 13px', background:activeCfg.bg, border:`1px solid ${activeCfg.border}`, borderRadius:20 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:activeCfg.accent, display:'inline-block', boxShadow:`0 0 6px ${activeCfg.accent}` }}/>
          <span style={{ fontSize:11, fontWeight:700, color:activeCfg.accent, fontFamily:'DM Mono,monospace' }}>
            {filtered.length} {activeFilter === "all" ? "total" : activeFilter} request{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        {activeFilter !== "all" && (
          <span style={{ fontSize:11, color:C.slateText, fontFamily:'DM Mono,monospace' }}>of {allRequests.length} total</span>
        )}
      </div>

      <OutpassTable data={filtered} loading={loading} showActions={true}/>
    </AdminLayout>
  );
}
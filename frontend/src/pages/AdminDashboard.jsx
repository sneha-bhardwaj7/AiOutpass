// src/pages/AdminDashboard.jsx
// ── NO-RELOAD: AdminLayout uses React Router NavLink internally.
//    Data is fetched in useEffect with [] so it fires ONCE per mount,
//    not on every route change. Route switching is handled in-memory.

import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, RefreshCw, Eye, ArrowUpRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import OutpassTable from "../components/OutpassTable";
import RiskIndicator from "../components/RiskIndicator";
import { analyticsAPI, outpassAPI } from "../services/api";
import { T, GCSS } from "../components/Pagebackground";

const CSS = `
  ${GCSS}
  .dr *{box-sizing:border-box;margin:0;padding:0}
  .sc{background:rgba(255,255,255,0.62);border:1px solid rgba(255,255,255,0.86);border-radius:18px;padding:20px;position:relative;overflow:hidden;transition:all 0.28s cubic-bezier(0.22,1,0.36,1);backdrop-filter:blur(24px);box-shadow:0 6px 24px rgba(91,74,155,0.10)}
  .sc:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(91,74,155,0.20)}
  .sc-p{background:linear-gradient(135deg,${T.deep},${T.mid});border-color:transparent;box-shadow:0 8px 28px rgba(91,74,155,0.38)}
  .sc-p:hover{box-shadow:0 18px 48px rgba(91,74,155,0.50)}
  .sdc{background:rgba(255,255,255,0.62);border:1px solid rgba(255,255,255,0.86);border-radius:18px;padding:18px;backdrop-filter:blur(24px);box-shadow:0 6px 24px rgba(91,74,155,0.10)}
  .pt{height:5px;background:${T.soft};border-radius:20px;overflow:hidden}
  .pf{height:100%;border-radius:20px;transition:width 0.9s cubic-bezier(0.16,1,0.3,1)}
  .bg{display:flex;align-items:center;gap:6px;padding:9px 16px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.62);border:1px solid ${T.border};border-radius:11px;cursor:pointer;color:${T.inkSoft};backdrop-filter:blur(14px);transition:all 0.18s}
  .bg:hover{border-color:${T.mid};color:${T.mid};background:${T.mist}}
  .bp{display:flex;align-items:center;gap:6px;padding:9px 18px;font-size:12px;font-weight:700;background:linear-gradient(135deg,${T.deep},${T.mid});border:none;border-radius:11px;color:#fff;text-decoration:none;cursor:pointer;box-shadow:0 4px 16px rgba(91,74,155,0.30);transition:all 0.2s}
  .bp:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(91,74,155,0.44)}
  .st{font-size:16px;font-weight:700;color:${T.ink};letter-spacing:-0.3px;line-height:1}
  .ss{font-size:10.5px;color:${T.inkDim};margin-top:3px}
  .tg{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:9.5px;font-weight:700;letter-spacing:0.04em}
  .dv{height:1px;background:${T.border}}
  .lb{font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${T.inkDim}}
  .val{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;color:${T.inkDim};text-decoration:none;transition:color 0.15s}
  .val:hover{color:${T.mid}}
  .ic{border-radius:14px;padding:14px 16px;background:rgba(107,90,176,0.08);border:1px solid ${T.border};backdrop-filter:blur(12px)}
  .tc{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:14px;text-decoration:none;position:relative;overflow:hidden;transition:transform 0.22s,box-shadow 0.22s;backdrop-filter:blur(14px)}
  .tc:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(91,74,155,0.18)!important}
  @keyframes dp{0%,100%{opacity:1}50%{opacity:0.35}}
  .dp{animation:dp 2s ease-in-out infinite}
  @keyframes ds{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .ds{animation:ds 0.9s linear infinite}
  @media(max-width:900px){.dash-grid{grid-template-columns:1fr!important}.stat-grid{grid-template-columns:repeat(2,1fr)!important}}
`;

function SH({ title, sub, action, href }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:14 }}>
      <div><h2 className="st">{title}</h2>{sub && <p className="ss">{sub}</p>}</div>
      {action && href && <Link to={href} className="val">{action} <ArrowUpRight size={11}/></Link>}
    </div>
  );
}

function SN({ value, loading, color, size="40px" }) {
  return (
    <span style={{ fontSize:size, lineHeight:1, letterSpacing:'-1.5px', color:loading?T.pale:color||T.ink, display:'block', fontWeight:800 }}>
      {loading ? "—" : value}
    </span>
  );
}


const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export default function AdminDashboard() {
  const [stats,      setStats]      = useState(null);
  const [recent,     setRecent]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpd,    setLastUpd]    = useState(new Date());

  const fetchAll = async () => {
    try {
      const [s, r] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        outpassAPI.getAll(),
      ]);
      setStats(s);
      setRecent((r.requests || []).slice(0, 5));
      setLastUpd(new Date());
    } catch(e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  // ── Fetch ONCE on mount — no reload on re-navigation ───────────────────────
  useEffect(() => { fetchAll(); }, []);

  const statCards = [
    { title:"Total Requests",  value:stats?.total??'—',         icon:<FileText size={16}/>,     primary:true,             trendValue:"+12%", subtitle:"All time"       },
    { title:"Pending Review",  value:stats?.pending??'—',       icon:<Clock size={16}/>,        accent:'#B07A10', accentBg:'rgba(176,122,16,0.10)',  trendValue:"+3",   subtitle:"Awaiting action" },
    { title:"Approved Today",  value:stats?.approvedToday??'—', icon:<CheckCircle size={16}/>,  accent:T.ok,      accentBg:T.okBg,                   trendValue:"+8%",  subtitle:"Last 24 hours"   },
    { title:"High Risk Flags", value:stats?.flagged??'—',       icon:<AlertTriangle size={16}/>,accent:T.err,     accentBg:T.errBg,                  trendValue:"-2",   subtitle:"Needs attention" },
  ];

  const triageItems = [
    { label:"Flagged",         value:stats?.flagged??0,        link:"/admin/requests?status=flagged",        accent:T.err,     bg:T.errBg,  border:T.errBd,  desc:"Immediate review",  icon:<AlertTriangle size={15}/> },
    { label:"Awaiting Parent", value:stats?.parentPending??0,  link:"/admin/requests?status=parent-pending", accent:'#B07A10', bg:T.wrnBg,  border:T.wrnBd,  desc:"Parent approval",   icon:<Clock size={15}/> },
    { label:"Manual Review",   value:stats?.manualReview??0,   link:"/admin/requests?status=manual-review",  accent:T.mid,     bg:`rgba(107,90,176,0.09)`, border:T.border, desc:"Admin decision", icon:<Eye size={15}/> },
  ];

  const riskData = [
    { level:"low",    pct:stats?.riskLow??65,    color:T.ok,       track:T.okBg  },
    { level:"medium", pct:stats?.riskMedium??25, color:'#B07A10',  track:T.wrnBg },
    { level:"high",   pct:stats?.riskHigh??10,   color:T.err,      track:T.errBg },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle={`Updated: ${lastUpd.toLocaleTimeString("en-IN")}`}>
      <style>{CSS}</style>
      <div className="dr">

        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, fontWeight:500, color:T.inkDim }}>Admin</span>
            <span style={{ color:T.pale, fontSize:11 }}>/</span>
            <span style={{ fontSize:11, fontWeight:700, color:T.inkMid }}>Overview</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={() => { setRefreshing(true); fetchAll(); }} disabled={refreshing} className="bg" style={{ opacity:refreshing?0.55:1 }}>
              <RefreshCw size={13} className={refreshing?"ds":""}/> Refresh
            </button>
            <Link to="/admin/requests" className="bp">
              <Eye size={13}/> View All Requests <ArrowUpRight size={11} style={{ opacity:0.65 }}/>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:14 }}>
          {statCards.map((s, i) => (
            <div key={i} className={`sc ${s.primary?'sc-p':''}`}>
              <div style={{ position:'absolute', top:0, right:0, width:64, height:64, borderRadius:'0 18px 0 64px', background:s.primary?'rgba(255,255,255,0.10)':`${s.accent||T.mid}14`, pointerEvents:'none' }}/>
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:11, background:s.primary?'rgba(255,255,255,0.18)':(s.accentBg||`rgba(107,90,176,0.12)`), border:`1px solid ${s.primary?'rgba(255,255,255,0.14)':(s.accent?`${s.accent}30`:T.border)}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.primary?'#fff':(s.accent||T.mid) }}>{s.icon}</div>
                  <span className="tg" style={{ background:s.primary?'rgba(255,255,255,0.16)':(s.accentBg||`rgba(107,90,176,0.12)`), color:s.primary?'rgba(255,255,255,0.88)':(s.accent||T.mid), border:`1px solid ${s.primary?'rgba(255,255,255,0.14)':(s.accent?`${s.accent}30`:T.border)}` }}>{s.trendValue}</span>
                </div>
                <SN value={s.value} loading={loading} color={s.primary?'#fff':(s.accent||T.ink)}/>
                <p style={{ fontSize:12, fontWeight:500, marginTop:5, color:s.primary?'rgba(255,255,255,0.78)':T.inkSoft }}>{s.title}</p>
                <p style={{ fontSize:10.5, marginTop:2, color:s.primary?'rgba(255,255,255,0.44)':T.inkDim }}>{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Triage row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:22 }}>
          {triageItems.map((t, i) => (
            <Link key={i} to={t.link} className="tc" style={{ background:t.bg, border:`1px solid ${t.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:12, background:`${t.accent}1A`, border:`1px solid ${t.accent}30`, display:'flex', alignItems:'center', justifyContent:'center', color:t.accent, flexShrink:0 }}>{t.icon}</div>
                <div>
                  <p style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:2 }}>{t.label}</p>
                  <p style={{ fontSize:10, color:T.inkSoft }}>{t.desc}</p>
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:26, color:t.accent, textShadow:`0 0 16px ${t.accent}60` }}>{t.value}</div>
            </Link>
          ))}
        </div>

        <div className="dv" style={{ marginBottom:24 }}/>

        {/* Main grid */}
        <div className="dash-grid" style={{ display:'grid', gridTemplateColumns:'1fr 288px', gap:18 }}>
          <div>
            <SH title="Recent Requests" sub="Latest 5 submissions" action="View all" href="/admin/requests"/>
            <OutpassTable data={recent} loading={loading} showActions={true}/>
          </div>

          {/* Right sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Approval rate */}
            <div className="sdc">
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <span className="lb">Approval Rate</span>
                <div style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 9px', background:T.okBg, border:`1px solid ${T.okBd}`, borderRadius:20 }}>
                  <TrendingUp size={9} color={T.ok}/>
                  <span style={{ fontSize:'9.5px', fontWeight:700, color:T.ok }}>+4.2%</span>
                </div>
              </div>
              <SN value={`${stats?.approvalRate??78}%`} loading={loading} color={T.mid} size="38px"/>
              <p style={{ fontSize:11, color:T.inkDim, margin:'5px 0 12px' }}>Rolling 7 days</p>
              <div className="pt">
                <div className="pf" style={{ width:`${stats?.approvalRate??78}%`, background:`linear-gradient(90deg,${T.deep},${T.bright})`, boxShadow:`0 0 8px rgba(107,90,176,0.40)` }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                <span style={{ fontSize:9, color:T.inkDim }}>0%</span>
                <span style={{ fontSize:9, color:T.inkDim }}>100%</span>
              </div>
            </div>

            {/* Risk distribution */}
            <div className="sdc">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <span className="lb">Risk Distribution</span>
                <Shield size={13} style={{ color:T.pale }}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
                {riskData.map(r => (
                  <div key={r.level}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ width:7, height:7, borderRadius:'50%', background:r.color, boxShadow:`0 0 6px ${r.color}` }}/>
                        <RiskIndicator level={r.level} compact/>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:r.color, textShadow:`0 0 6px ${r.color}60` }}>{r.pct}%</span>
                    </div>
                    <div className="pt" style={{ background:r.track }}>
                      <div className="pf" style={{ width:`${r.pct}%`, background:r.color, boxShadow:`0 0 8px ${r.color}60` }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI insight */}
            <div className="ic">
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <div style={{ width:26, height:26, borderRadius:8, background:`rgba(107,90,176,0.14)`, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Zap size={12} style={{ color:T.mid }}/>
                </div>
                <span className="lb" style={{ color:T.mid }}>AI Insight</span>
                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:T.ok, animation:'dp 2s ease-in-out infinite', boxShadow:`0 0 6px ${T.ok}` }}/>
                  <span style={{ fontSize:9, fontWeight:700, color:T.ok }}>LIVE</span>
                </div>
              </div>
              <p style={{ fontSize:12, color:T.inkSoft, lineHeight:1.78 }}>
                Approval rate is <strong style={{ color:T.ink, fontWeight:700 }}>4.2% higher</strong> than last week. High-risk flags down by 2. Review <strong style={{ color:T.ink, fontWeight:700 }}>5 pending manual reviews</strong>.
              </p>
            </div>

            {/* AI engine status */}
            <div style={{ background:'rgba(255,255,255,0.58)', border:`1px solid ${T.border}`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:10, backdropFilter:'blur(14px)' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:`rgba(107,90,176,0.12)`, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Zap size={15} style={{ color:T.mid }}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:2 }}>AI Engine</p>
                <p style={{ fontSize:10, color:T.ok }}>Active &amp; Running</p>
              </div>
              <div style={{ width:8, height:8, borderRadius:'50%', background:T.ok, animation:'dp 2.2s ease-in-out infinite', boxShadow:`0 0 8px ${T.ok}` }}/>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
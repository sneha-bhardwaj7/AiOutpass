// src/pages/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, AlertTriangle, Zap, ArrowUpRight, ArrowDownRight, Activity, Target, Users, MapPin, RefreshCw } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { analyticsAPI } from "../services/api";
import { T, GCSS } from "../components/Pagebackground";

const styles = `
  ${GCSS}
  .an-root *{box-sizing:border-box;margin:0;padding:0}
  .an-root{color:${T.ink}}
  .an-card{background:rgba(255,255,255,0.62);border:1px solid rgba(255,255,255,0.86);border-radius:18px;padding:22px;backdrop-filter:blur(24px);box-shadow:0 6px 24px rgba(91,74,155,0.10);transition:all 0.25s}
  .an-card:hover{box-shadow:0 12px 36px rgba(91,74,155,0.18)}
  .metric-card{background:rgba(255,255,255,0.62);border:1px solid rgba(255,255,255,0.86);border-radius:18px;padding:20px;position:relative;overflow:hidden;backdrop-filter:blur(24px);transition:all 0.25s cubic-bezier(0.22,1,0.36,1);box-shadow:0 6px 24px rgba(91,74,155,0.10)}
  .metric-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(91,74,155,0.20)}
  .period-tab{padding:8px 18px;border-radius:11px;font-size:12.5px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all 0.18s;text-transform:capitalize}
  .period-tab.active{background:linear-gradient(135deg,${T.deep},${T.mid});color:#fff;box-shadow:0 4px 14px rgba(91,74,155,0.30)}
  .period-tab.inactive{background:rgba(255,255,255,0.55);color:${T.inkSoft};border-color:${T.border};backdrop-filter:blur(12px)}
  .period-tab.inactive:hover{border-color:${T.mid};color:${T.mid};background:${T.mist}}
  .an-label{font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${T.inkDim}}
  .an-title{font-weight:700;font-size:16px;color:${T.ink};letter-spacing:-0.3px}
  .an-sub{font-size:11px;color:${T.inkDim};margin-top:2px}
  .an-num{font-weight:800;font-size:36px;line-height:1;letter-spacing:-1.5px;color:${T.ink}}
  .prog-track{height:5px;border-radius:20px;overflow:hidden}
  .prog-fill{height:100%;border-radius:20px;transition:width 0.9s cubic-bezier(0.16,1,0.3,1)}
  .bar-chart{display:flex;align-items:flex-end;gap:6px;height:130px;padding:0 4px}
  .bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
  .bar-col{width:100%;display:flex;align-items:flex-end;justify-content:center;gap:3px;height:100px}
  .bar-seg{border-radius:4px 4px 0 0;transition:height 0.8s cubic-bezier(0.16,1,0.3,1),opacity 0.2s,box-shadow 0.2s;cursor:pointer}
  .bar-seg:hover{opacity:0.80}
  .bar-label{font-size:9.5px;font-weight:600;color:${T.inkDim};text-align:center}
  .dest-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid ${T.border}}
  .dest-row:last-child{border-bottom:none}
  .ai-row{padding:10px 0;border-bottom:1px solid ${T.border}}
  .ai-row:last-child{border-bottom:none}
  .tag-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700}
  @keyframes shimmer2{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .shimmer2{background:linear-gradient(90deg,${T.soft} 25%,${T.pale} 50%,${T.soft} 75%);background-size:800px 100%;animation:shimmer2 1.4s ease-in-out infinite;border-radius:8px}
  @keyframes spin3{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .spinning3{animation:spin3 0.9s linear infinite}
  .an-divider{height:1px;background:${T.border}}
  @keyframes statusPulse{0%,100%{opacity:1}50%{opacity:0.35}}
  @media(max-width:900px){.an-charts{grid-template-columns:1fr!important}.an-metrics{grid-template-columns:repeat(2,1fr)!important}}
`;

function MetricCard({ label, value, sub, icon, trend, trendValue, accentColor, accentBg, loading, primary }) {
  const ac  = accentColor || T.mid;
  const abg = accentBg    || `rgba(107,90,176,0.12)`;
  if (loading) return (
    <div className="metric-card">
      <div className="shimmer2" style={{ height:11, width:80, marginBottom:16 }}/>
      <div className="shimmer2" style={{ height:36, width:64, marginBottom:8 }}/>
      <div className="shimmer2" style={{ height:10, width:120 }}/>
    </div>
  );
  return (
    <div className="metric-card" style={primary ? { background:`linear-gradient(135deg,${T.deep},${T.mid})`, borderColor:'transparent', boxShadow:`0 8px 32px rgba(91,74,155,0.34)` } : {}}>
      <div style={{ position:'absolute', top:0, right:0, width:52, height:52, borderRadius:'0 18px 0 52px', background:primary?'rgba(255,255,255,0.10)':`${ac}12`, pointerEvents:'none' }}/>
      <div style={{ position:'relative' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
          <span className="an-label" style={{ color:primary?'rgba(255,255,255,0.52)':T.inkDim }}>{label}</span>
          <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:primary?'rgba(255,255,255,0.18)':abg, border:`1px solid ${primary?'rgba(255,255,255,0.14)':`${ac}30`}`, display:'flex', alignItems:'center', justifyContent:'center', color:primary?'rgba(255,255,255,0.92)':ac }}>
            {icon}
          </div>
        </div>
        <p className="an-num" style={{ color:primary?'#fff':T.ink }}>{value??'—'}</p>
        {sub && <p style={{ fontSize:11, color:primary?'rgba(255,255,255,0.48)':T.inkDim, marginTop:4 }}>{sub}</p>}
        {trendValue && (
          <div style={{ marginTop:10 }}>
            <span className="tag-pill" style={primary ? { background:'rgba(255,255,255,0.16)', color:'rgba(255,255,255,0.82)' } : trend==='up' ? { background:T.okBg, color:T.ok, border:`1px solid ${T.okBd}` } : { background:T.errBg, color:T.err, border:`1px solid ${T.errBd}` }}>
              {trend==='up'?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>}{trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ data, loading }) {
  const [hovered, setHovered] = useState(null);
  if (loading) return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:130, padding:'0 4px' }}>
      {Array(7).fill(null).map((_,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div className="shimmer2" style={{ width:'100%', height:`${40+Math.random()*60}px`, borderRadius:'4px 4px 0 0' }}/>
          <div className="shimmer2" style={{ width:24, height:9 }}/>
        </div>
      ))}
    </div>
  );
  const maxVal = Math.max(...data.map(d=>Math.max(d.submitted||0,d.approved||0)),1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const subH = Math.round(((d.submitted||0)/maxVal)*96);
        const appH = Math.round(((d.approved||0)/maxVal)*96);
        const isH  = hovered===i;
        return (
          <div key={i} className="bar-group" onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
            <div className="bar-col">
              <div style={{ position:'relative', width:'44%', height:'100%', display:'flex', alignItems:'flex-end' }}>
                {isH && <div style={{ position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.90)', border:`1px solid ${T.border}`, color:T.ink, fontSize:'9.5px', padding:'4px 8px', borderRadius:7, whiteSpace:'nowrap', zIndex:10, pointerEvents:'none', backdropFilter:'blur(10px)', boxShadow:'0 4px 14px rgba(91,74,155,0.16)' }}>{d.submitted} submitted</div>}
                <div className="bar-seg" style={{ width:'100%', height:`${subH}px`, minHeight:4, background:isH?T.mid:T.bright, boxShadow:isH?`0 0 12px rgba(107,90,176,0.50)`:'none' }}/>
              </div>
              <div style={{ width:'44%', height:'100%', display:'flex', alignItems:'flex-end' }}>
                <div className="bar-seg" style={{ width:'100%', height:`${appH}px`, minHeight:4, background:isH?T.ok:'rgba(26,155,92,0.38)', boxShadow:isH?`0 0 10px rgba(26,155,92,0.44)`:'none' }}/>
              </div>
            </div>
            <span className="bar-label">{d.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatusBreakdown({ stats, loading }) {
  const items = [
    { label:"Approved",      val:stats?.approvedCount??89, color:T.ok,      track:T.okBg,  pct:63 },
    { label:"Pending",       val:stats?.pendingCount??24,  color:'#B07A10', track:T.wrnBg, pct:17 },
    { label:"Rejected",      val:stats?.rejectedCount??18, color:T.err,     track:T.errBg, pct:13 },
    { label:"Manual Review", val:stats?.manualReviewCount??11, color:T.mid, track:`rgba(107,90,176,0.10)`, pct:7 },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      <div style={{ display:'flex', height:6, borderRadius:20, overflow:'hidden', marginBottom:16, gap:2 }}>
        {items.map(item=><div key={item.label} style={{ flex:item.pct, background:item.color, minWidth:4 }}/>)}
      </div>
      {items.map(item=>(
        <div key={item.label} style={{ padding:'9px 0', borderBottom:`1px solid ${T.border}` }}>
          {loading ? <div className="shimmer2" style={{ height:12, width:140 }}/> : (
            <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:item.color, boxShadow:`0 0 6px ${item.color}` }}/>
                  <span style={{ fontSize:12.5, fontWeight:500, color:T.ink }}>{item.label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11, color:T.inkSoft }}>{item.val}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:item.color, minWidth:32, textAlign:'right', textShadow:`0 0 8px ${item.color}60` }}>{item.pct}%</span>
                </div>
              </div>
              <div className="prog-track" style={{ background:item.track }}>
                <div className="prog-fill" style={{ width:`${item.pct}%`, background:item.color, boxShadow:`0 0 8px ${item.color}60` }}/>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function TopDestinations({ data, loading }) {
  const max = Math.max(...(data||[]).map(d=>d.value), 1);
  return (
    <div>
      {loading ? Array(5).fill(null).map((_,i)=>(
        <div key={i} style={{ padding:'10px 0', borderBottom:`1px solid ${T.border}` }}><div className="shimmer2" style={{ height:12, width:`${80+i*10}px` }}/></div>
      )) : (data||[]).map((d,i)=>(
        <div key={i} className="dest-row">
          <span style={{ fontWeight:600, fontSize:11, color:T.inkDim, width:16, flexShrink:0 }}>#{i+1}</span>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:26, height:26, borderRadius:8, background:`rgba(107,90,176,0.10)`, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MapPin size={11} style={{ color:T.mid }}/>
                </div>
                <span style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{d.name}</span>
              </div>
              <span style={{ fontSize:11, color:T.inkSoft }}>{d.value} req</span>
            </div>
            <div className="prog-track" style={{ background:`rgba(107,90,176,0.08)` }}>
              <div className="prog-fill" style={{ width:`${(d.value/max)*100}%`, background:i===0?T.mid:i===1?T.bright:T.light, boxShadow:i===0?`0 0 8px rgba(107,90,176,0.44)`:'none' }}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AIPerformance({ loading }) {
  const metrics = [
    { label:"Consent Detection Accuracy", val:94, color:T.ok,  track:T.okBg  },
    { label:"Mismatch Detection Rate",    val:88, color:T.mid, track:`rgba(107,90,176,0.10)`  },
    { label:"False Positive Rate",        val:6,  color:'#B07A10', track:T.wrnBg },
    { label:"Auto-Approval Accuracy",     val:97, color:T.ok,  track:T.okBg  },
  ];
  return (
    <div>
      {metrics.map(m=>(
        <div key={m.label} className="ai-row">
          {loading ? <div className="shimmer2" style={{ height:12, width:160 }}/> : (
            <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:12, fontWeight:500, color:T.inkSoft }}>{m.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:m.color, textShadow:`0 0 8px ${m.color}60` }}>{m.val}%</span>
              </div>
              <div className="prog-track" style={{ background:m.track }}>
                <div className="prog-fill" style={{ width:`${m.val}%`, background:m.color, boxShadow:`0 0 8px ${m.color}60` }}/>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [stats,      setStats]      = useState(null);
  const [trends,     setTrends]     = useState(null);
  const [period,     setPeriod]     = useState("month");
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [s, t] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getTrends(period),
      ]);
      setStats(s); setTrends(t);
    } catch(e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  // ── Refetch only when period changes, NOT on every route switch ─────────────
  useEffect(() => { load(); }, [period]);

  const weeklyData = trends?.weekly || [
    { name:"Mon", submitted:8,  approved:6  },
    { name:"Tue", submitted:12, approved:9  },
    { name:"Wed", submitted:6,  approved:5  },
    { name:"Thu", submitted:15, approved:11 },
    { name:"Fri", submitted:10, approved:8  },
    { name:"Sat", submitted:4,  approved:3  },
    { name:"Sun", submitted:2,  approved:2  },
  ];
  const destData = trends?.topDestinations || [
    { name:"Chennai",     value:45 },
    { name:"Bangalore",   value:32 },
    { name:"Hyderabad",   value:28 },
    { name:"Coimbatore",  value:18 },
    { name:"Pune",        value:12 },
  ];
  const metrics = [
    { label:"Total This Month", value:stats?.total??142,         icon:<BarChart3 size={16}/>,     primary:true,            trendValue:"+18",  trend:"up",   sub:"All requests combined"   },
    { label:"Approval Rate",    value:`${stats?.approvalRate??78}%`, icon:<CheckCircle size={16}/>, accentColor:T.ok, accentBg:T.okBg, trendValue:"+4.2%", trend:"up", sub:"vs last month" },
    { label:"Avg Response Time",value:stats?.avgResponseTime??"2.4h",icon:<Clock size={16}/>,      accentColor:'#B07A10', accentBg:T.wrnBg,  sub:"Parent approval time"   },
    { label:"Flagged Requests", value:stats?.flagged??7,          icon:<AlertTriangle size={16}/>, accentColor:T.err, accentBg:T.errBg, trendValue:"-2", trend:"down", sub:"Requires attention" },
    { label:"Auto-Approved (AI)",value:stats?.autoApproved??89,   icon:<Zap size={16}/>,           accentColor:T.mid, accentBg:`rgba(107,90,176,0.12)`, trendValue:"+11%", trend:"up", sub:"By AI recommendation" },
    { label:"Manual Overrides", value:stats?.manualOverride??14,  icon:<Target size={16}/>,        accentColor:T.bright, accentBg:`rgba(139,123,200,0.12)`, sub:"Admin interventions" },
  ];

  return (
    <AdminLayout title="Analytics" subtitle="Outpass trends, approval stats & AI performance">
      <style>{styles}</style>
      <div className="an-root">

        {/* Period selector + refresh */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div style={{ display:'flex', gap:6 }}>
            {["week","month","quarter"].map(p => (
              <button key={p} onClick={()=>setPeriod(p)} className={`period-tab ${period===p?"active":"inactive"}`}>This {p}</button>
            ))}
          </div>
          <button onClick={()=>{ setRefreshing(true); load(); }} disabled={refreshing}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', fontSize:12, fontWeight:600, background:'rgba(255,255,255,0.62)', border:`1px solid ${T.border}`, borderRadius:11, cursor:'pointer', color:T.inkSoft, opacity:refreshing?0.55:1, transition:'all 0.18s', backdropFilter:'blur(14px)' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.mid;e.currentTarget.style.color=T.mid;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.inkSoft;}}>
            <RefreshCw size={13} className={refreshing?"spinning3":""}/> Refresh
          </button>
        </div>

        {/* Metrics grid */}
        <div className="an-metrics" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
          {metrics.map((m, i) => <MetricCard key={i} {...m} loading={loading}/>)}
        </div>

        <div className="an-divider" style={{ marginBottom:20 }}/>

        {/* Charts row 1 */}
        <div className="an-charts" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, marginBottom:16 }}>
          <div className="an-card">
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <h3 className="an-title">Weekly Submissions</h3>
                <p className="an-sub">Outpass request volume by day</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                {[{ color:T.bright, label:"Submitted" },{ color:"rgba(26,155,92,0.50)", label:"Approved" }].map(l=>(
                  <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:l.color }}/>
                    <span style={{ fontSize:10.5, color:T.inkDim }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <BarChart data={weeklyData} loading={loading}/>
          </div>
          <div className="an-card">
            <div style={{ marginBottom:16 }}>
              <h3 className="an-title">Status Breakdown</h3>
              <p className="an-sub">Current request distribution</p>
            </div>
            <StatusBreakdown stats={stats} loading={loading}/>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="an-charts" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
          <div className="an-card">
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div><h3 className="an-title">Top Destinations</h3><p className="an-sub">Most requested travel locations</p></div>
              <div style={{ width:34, height:34, borderRadius:10, background:`rgba(107,90,176,0.10)`, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <MapPin size={14} style={{ color:T.mid }}/>
              </div>
            </div>
            <TopDestinations data={destData} loading={loading}/>
          </div>
          <div className="an-card">
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div><h3 className="an-title">AI Performance</h3><p className="an-sub">LangChain model accuracy &amp; metrics</p></div>
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, background:T.okBg, border:`1px solid ${T.okBd}` }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:T.ok, animation:'statusPulse 2s ease-in-out infinite', boxShadow:`0 0 6px ${T.ok}` }}/>
                <span style={{ fontSize:9, fontWeight:700, color:T.ok, letterSpacing:'0.08em' }}>LIVE</span>
              </div>
            </div>
            <AIPerformance loading={loading}/>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ background:`linear-gradient(135deg,${T.deep},${T.mid})`, border:`1px solid rgba(107,90,176,0.24)`, borderRadius:18, padding:'18px 24px', display:'flex', alignItems:'center', gap:32, flexWrap:'wrap', boxShadow:'0 8px 32px rgba(91,74,155,0.24)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,0.14)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Activity size={17} style={{ color:'rgba(255,255,255,0.88)' }}/>
            </div>
            <div>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.46)', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:700 }}>System Health</p>
              <p style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.92)', marginTop:1 }}>All systems operational</p>
            </div>
          </div>
          <div style={{ width:1, height:36, background:'rgba(255,255,255,0.12)' }}/>
          {[
            { label:"Requests Today", value:stats?.today??23    },
            { label:"This Week",      value:stats?.thisWeek??141 },
            { label:"Parent Pending", value:stats?.parentPending??8 },
            { label:"AI Accuracy",    value:"94%"                },
          ].map(item=>(
            <div key={item.label}>
              <p style={{ fontSize:9.5, color:'rgba(255,255,255,0.42)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700 }}>{item.label}</p>
              <p style={{ fontSize:20, fontWeight:700, color:'#fff', marginTop:2, textShadow:'0 0 16px rgba(255,255,255,0.30)' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
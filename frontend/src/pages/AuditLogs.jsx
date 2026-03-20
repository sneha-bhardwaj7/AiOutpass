// src/pages/AuditLogs.jsx
import { useEffect, useState } from "react";
import { Search, Filter, Download, Shield, User, Zap, CheckCircle, XCircle, AlertTriangle, Eye, RefreshCw, Clock, ChevronDown } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { analyticsAPI } from "../services/api";
import { T, GCSS } from "../components/Pagebackground";

const actionConfig = {
  request_submitted:{ icon:<User size={13}/>,         color:T.bright,  bg:`rgba(139,123,200,0.12)`, border:`rgba(139,123,200,0.26)`, label:"Request Submitted" },
  parent_notified:  { icon:<Zap size={13}/>,          color:T.mid,     bg:`rgba(107,90,176,0.12)`,  border:`rgba(107,90,176,0.26)`,  label:"Parent Notified"   },
  parent_approved:  { icon:<CheckCircle size={13}/>,  color:T.ok,      bg:T.okBg,                   border:T.okBd,                   label:"Parent Approved"   },
  parent_rejected:  { icon:<XCircle size={13}/>,      color:T.err,     bg:T.errBg,                  border:T.errBd,                  label:"Parent Rejected"   },
  admin_approved:   { icon:<CheckCircle size={13}/>,  color:T.ok,      bg:T.okBg,                   border:T.okBd,                   label:"Admin Approved"    },
  admin_rejected:   { icon:<XCircle size={13}/>,      color:T.err,     bg:T.errBg,                  border:T.errBd,                  label:"Admin Rejected"    },
  flagged:          { icon:<AlertTriangle size={13}/>,color:'#B07A10',  bg:T.wrnBg,                  border:T.wrnBd,                  label:"Flagged"           },
  manual_review:    { icon:<Eye size={13}/>,          color:T.mid,     bg:`rgba(107,90,176,0.10)`,  border:T.border,                 label:"Manual Review"     },
  ai_analyzed:      { icon:<Zap size={13}/>,          color:T.deep,    bg:`rgba(91,74,155,0.12)`,   border:`rgba(91,74,155,0.28)`,   label:"AI Analyzed"       },
};

const actorConfig = {
  student:{ color:T.bright,  bg:`rgba(139,123,200,0.12)`, border:`rgba(139,123,200,0.26)` },
  admin:  { color:'#B07A10', bg:T.wrnBg,                  border:T.wrnBd                  },
  system: { color:T.inkSoft, bg:`rgba(255,255,255,0.35)`,  border:T.border                 },
  ai:     { color:T.deep,    bg:`rgba(91,74,155,0.12)`,   border:`rgba(91,74,155,0.28)`   },
  parent: { color:T.ok,      bg:T.okBg,                   border:T.okBd                   },
};

const sampleLogs = [
  { _id:"1", action:"request_submitted", actorName:"Ravi Kumar",            actorType:"student", targetId:"OP001", meta:"Destination: Chennai",       createdAt:new Date(Date.now()-3600000).toISOString() },
  { _id:"2", action:"parent_notified",   actorName:"System (n8n)",          actorType:"system",  targetId:"OP001", meta:"WhatsApp + Email + Voice",   createdAt:new Date(Date.now()-3500000).toISOString() },
  { _id:"3", action:"ai_analyzed",       actorName:"LangChain AI",          actorType:"ai",      targetId:"OP001", meta:"Consent: 92% | Risk: Low",   createdAt:new Date(Date.now()-3400000).toISOString() },
  { _id:"4", action:"parent_approved",   actorName:"Suresh Kumar (Parent)", actorType:"parent",  targetId:"OP001", meta:"OTP verified + Live photo",  createdAt:new Date(Date.now()-3300000).toISOString() },
  { _id:"5", action:"admin_approved",    actorName:"Dr. Priya (Admin)",     actorType:"admin",   targetId:"OP001", meta:"AI recommendation accepted", createdAt:new Date(Date.now()-3200000).toISOString() },
  { _id:"6", action:"request_submitted", actorName:"Ananya Singh",          actorType:"student", targetId:"OP002", meta:"Destination: Bangalore",     createdAt:new Date(Date.now()-7200000).toISOString() },
  { _id:"7", action:"flagged",           actorName:"LangChain AI",          actorType:"ai",      targetId:"OP002", meta:"Date mismatch detected",     createdAt:new Date(Date.now()-7100000).toISOString() },
  { _id:"8", action:"manual_review",     actorName:"Dr. Priya (Admin)",     actorType:"admin",   targetId:"OP002", meta:"Escalated for review",       createdAt:new Date(Date.now()-7000000).toISOString() },
];

function exportCSV(logs) {
  const headers = ["ID","Action","Actor","Actor Type","Request ID","Details","Date","Time"];
  const rows = logs.map(log => {
    const d = new Date(log.createdAt);
    return [log._id, actionConfig[log.action]?.label||log.action, log.actorName, log.actorType, log.targetId,
      '"'+(log.meta||"").replace(/"/g,'""')+'"',
      d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
      d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})].join(",");
  });
  const blob = new Blob([[headers.join(","),...rows].join("\n")],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download="audit-logs-"+new Date().toISOString().slice(0,10)+".csv"; a.click();
  URL.revokeObjectURL(url);
}

const css = `
  ${GCSS}
  .al-root *{box-sizing:border-box;margin:0;padding:0}
  .al-root{color:${T.ink}}
  .al-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:18px}
  .al-sw{flex:1;min-width:220px;position:relative}
  .al-sw input{width:100%;padding:10px 16px 10px 38px;font-size:13px;background:rgba(255,255,255,0.62);border:1.5px solid ${T.border};border-radius:12px;outline:none;color:${T.ink};transition:all 0.18s;backdrop-filter:blur(14px)}
  .al-sw input:focus{border-color:${T.focusBd};box-shadow:${T.focusSh}}
  .al-sw input::placeholder{color:${T.inkDim}}
  .al-si{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:${T.inkDim};pointer-events:none}
  .al-selw{position:relative}
  .al-selw select{padding:10px 32px 10px 34px;font-size:12.5px;font-weight:500;background:rgba(255,255,255,0.62);border:1.5px solid ${T.border};border-radius:12px;outline:none;appearance:none;cursor:pointer;color:${T.inkSoft};transition:all 0.18s;backdrop-filter:blur(14px)}
  .al-selw select:focus{border-color:${T.focusBd}}
  .al-sil{position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none;color:${T.inkDim}}
  .al-sir{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:${T.inkDim}}
  .al-btn{display:flex;align-items:center;gap:6px;padding:10px 16px;font-size:12.5px;font-weight:600;background:rgba(255,255,255,0.62);border:1.5px solid ${T.border};border-radius:12px;cursor:pointer;color:${T.inkSoft};transition:all 0.18s;white-space:nowrap;backdrop-filter:blur(14px)}
  .al-btn:hover{border-color:${T.mid};color:${T.mid};background:${T.mist}}
  .al-btn.ex:hover{border-color:${T.ok};color:${T.ok};background:${T.okBg}}
  .al-cp{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;background:rgba(107,90,176,0.10);border:1px solid ${T.border};white-space:nowrap}
  .al-cd{width:6px;height:6px;border-radius:50%;background:${T.mid};box-shadow:0 0 6px ${T.mid}}
  .al-ct{font-size:11.5px;font-weight:700;color:${T.mid}}
  .al-card{background:rgba(255,255,255,0.62);border:1px solid rgba(255,255,255,0.86);border-radius:20px;overflow:hidden;backdrop-filter:blur(24px);box-shadow:0 6px 28px rgba(91,74,155,0.12)}
  .al-thead{display:grid;grid-template-columns:44px 1fr 100px 180px 90px;padding:11px 20px;background:rgba(246,243,253,0.70);border-bottom:1px solid ${T.border}}
  .al-th{font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${T.inkDim};display:flex;align-items:center}
  .al-row{display:grid;grid-template-columns:44px 1fr 100px 180px 90px;align-items:center;padding:13px 20px;border-bottom:1px solid ${T.border};transition:background 0.14s;cursor:default}
  .al-row:last-child{border-bottom:none}
  .al-row:hover{background:${T.mist}}
  .al-ib{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .al-ap{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:9.5px;font-weight:700;text-transform:capitalize;white-space:nowrap}
  .al-rid{display:inline-flex;align-items:center;padding:4px 10px;border-radius:9px;font-size:11px;font-weight:600;background:rgba(107,90,176,0.08);color:${T.inkMid};border:1px solid ${T.border};white-space:nowrap}
  .al-meta{font-size:11.5px;color:${T.inkSoft};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:170px}
  .al-tm{font-size:11.5px;font-weight:500;color:${T.inkMid};display:block}
  .al-td{font-size:10px;color:${T.inkDim};margin-top:1px;display:block}
  @keyframes alSh{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .al-sh{background:linear-gradient(90deg,${T.soft} 25%,${T.pale} 50%,${T.soft} 75%);background-size:800px 100%;animation:alSh 1.4s ease-in-out infinite;border-radius:7px}
  .al-empty{padding:64px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
  .al-ei{width:58px;height:58px;border-radius:18px;background:rgba(107,90,176,0.10);border:1px solid ${T.border};display:flex;align-items:center;justify-content:center;color:${T.mid}}
  .al-et{font-size:14px;font-weight:700;color:${T.ink}}
  .al-es{font-size:12px;color:${T.inkSoft}}
  @keyframes alSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .al-spin{animation:alSpin 0.9s linear infinite}
  @keyframes alFd{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
  .al-fd{animation:alFd 0.22s ease forwards}
  .qfc{display:flex;align-items:center;gap:6px;padding:6px 13px;border-radius:20px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.18s;border:1px solid transparent;backdrop-filter:blur(10px)}
  .qfc:hover{transform:translateY(-1px)}
  select option{background:#fff;color:${T.ink}}
`;

export default function AuditLogs() {
  const [logs,         setLogs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [search,       setSearch]       = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const load = () => {
    analyticsAPI.getAuditLogs()
      .then(d  => setLogs(d.logs || sampleLogs))
      .catch(() => setLogs(sampleLogs))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  // ── Fetch ONCE on mount ─────────────────────────────────────────────────────
  useEffect(() => { load(); }, []);

  const filtered = logs.filter(log => {
    const q = search.toLowerCase();
    return (
      (log.actorName?.toLowerCase().includes(q) || log.targetId?.toLowerCase().includes(q) || log.meta?.toLowerCase().includes(q)) &&
      (actionFilter === "all" || log.action === actionFilter)
    );
  });

  const quickFilters = [
    { key:"all",           label:"All",        color:T.mid,     bg:`rgba(107,90,176,0.10)`, border:T.border              },
    { key:"admin_approved",label:"Approved",   color:T.ok,      bg:T.okBg,                  border:T.okBd                },
    { key:"flagged",       label:"Flagged",    color:'#B07A10', bg:T.wrnBg,                 border:T.wrnBd               },
    { key:"ai_analyzed",   label:"AI Actions", color:T.deep,    bg:`rgba(91,74,155,0.12)`,  border:`rgba(91,74,155,0.28)` },
    { key:"admin_rejected",label:"Rejected",   color:T.err,     bg:T.errBg,                 border:T.errBd               },
  ];

  return (
    <AdminLayout title="Audit Logs" subtitle="Complete history of all system actions and events">
      <style>{css}</style>
      <div className="al-root">

        {/* Toolbar */}
        <div className="al-toolbar">
          <div className="al-sw">
            <Search size={14} className="al-si"/>
            <input type="text" placeholder="Search by actor, request ID, or details…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="al-selw">
            <Filter size={12} className="al-sil"/>
            <select value={actionFilter} onChange={e=>setActionFilter(e.target.value)}>
              <option value="all">All Actions</option>
              {Object.entries(actionConfig).map(([key,val])=><option key={key} value={key}>{val.label}</option>)}
            </select>
            <ChevronDown size={10} className="al-sir"/>
          </div>
          <button className="al-btn ex" onClick={()=>exportCSV(filtered)}><Download size={13}/> Export CSV</button>
          <button className="al-btn" onClick={()=>{ setRefreshing(true); load(); }} disabled={refreshing} style={{ opacity:refreshing?0.55:1 }}>
            <RefreshCw size={13} className={refreshing?"al-spin":""}/> Refresh
          </button>
          <div className="al-cp"><div className="al-cd"/><span className="al-ct">{filtered.length} entries</span></div>
        </div>

        {/* Quick filter pills */}
        <div style={{ display:'flex', gap:6, marginBottom:18, flexWrap:'wrap' }}>
          {quickFilters.map(qf => {
            const count = qf.key==="all" ? logs.length : logs.filter(l=>l.action===qf.key).length;
            const isA   = actionFilter === qf.key;
            return (
              <button key={qf.key} className="qfc" onClick={()=>setActionFilter(qf.key)}
                style={{ background:isA?qf.bg:'rgba(255,255,255,0.55)', color:isA?qf.color:T.inkSoft, borderColor:isA?qf.border:T.border, fontWeight:isA?700:500, boxShadow:isA?`0 4px 16px ${qf.color}25`:'none' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:qf.color, opacity:isA?1:0.40, boxShadow:isA?`0 0 6px ${qf.color}`:'none' }}/>
                {qf.label}
                <span style={{ fontSize:10, fontWeight:800, padding:'1px 6px', borderRadius:20, background:isA?`${qf.color}1A`:'rgba(107,90,176,0.08)', color:isA?qf.color:T.inkDim }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="al-card">
          {/* Accent bar */}
          <div style={{ height:3, background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})` }}/>

          <div className="al-thead">
            <div className="al-th"/>
            <div className="al-th">Action / Actor</div>
            <div className="al-th">Request</div>
            <div className="al-th">Details</div>
            <div className="al-th">Time</div>
          </div>

          <div>
            {loading ? Array(8).fill(null).map((_,i)=>(
              <div key={i} className="al-row" style={{ display:'flex', gap:16, alignItems:'center' }}>
                <div className="al-sh" style={{ width:34, height:34, borderRadius:10, flexShrink:0 }}/>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                  <div className="al-sh" style={{ height:12, width:160 }}/>
                  <div className="al-sh" style={{ height:10, width:110 }}/>
                </div>
                <div className="al-sh" style={{ height:10, width:54 }}/>
                <div className="al-sh" style={{ height:10, width:120 }}/>
                <div className="al-sh" style={{ height:10, width:48 }}/>
              </div>
            )) : filtered.length===0 ? (
              <div className="al-empty">
                <div className="al-ei"><Shield size={24}/></div>
                <p className="al-et">No audit logs found</p>
                <p className="al-es">Try adjusting your search or filter</p>
              </div>
            ) : filtered.map((log, i) => {
              const cfg    = actionConfig[log.action] || { icon:<Shield size={13}/>, color:T.inkSoft, bg:`rgba(255,255,255,0.35)`, border:T.border, label:log.action };
              const actCfg = actorConfig[log.actorType] || actorConfig.system;
              const d      = new Date(log.createdAt);
              return (
                <div key={log._id} className="al-row al-fd" style={{ animationDelay:`${i*0.025}s` }}>
                  <div className="al-ib" style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.color }}>{cfg.icon}</div>
                  <div style={{ paddingRight:12 }}>
                    <p style={{ fontSize:12.5, fontWeight:700, color:cfg.color, lineHeight:1, marginBottom:4 }}>{cfg.label}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11.5, color:T.inkSoft }}>{log.actorName}</span>
                      <span className="al-ap" style={{ background:actCfg.bg, color:actCfg.color, border:`1px solid ${actCfg.border}` }}>{log.actorType}</span>
                    </div>
                  </div>
                  <div><span className="al-rid">#{log.targetId}</span></div>
                  <div title={log.meta}><p className="al-meta">{log.meta}</p></div>
                  <div style={{ textAlign:'right' }}>
                    <span className="al-tm">{d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>
                    <span className="al-td">{d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:`1px solid ${T.border}`, background:`rgba(246,243,253,0.70)` }}>
              <p style={{ fontSize:11.5, color:T.inkSoft }}>
                Showing <strong style={{ color:T.inkMid }}>{filtered.length}</strong> of <strong style={{ color:T.inkMid }}>{logs.length}</strong> entries
              </p>
              <button className="al-btn ex" onClick={()=>exportCSV(filtered)} style={{ padding:'7px 14px', fontSize:11.5 }}>
                <Download size={12}/> Download {filtered.length} rows
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
// src/pages/AuditLogs.jsx
import { useEffect, useState } from "react";
import {
  Search, Filter, Download, Shield, User, Zap,
  CheckCircle, XCircle, AlertTriangle, Eye, RefreshCw,
  Clock, ChevronDown,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { analyticsAPI } from "../services/api";

/* ─── Design tokens ─────────────────────────────────────────────── */
const C = {
  crimson:     "#8B1A1A",
  crimsonDeep: "#5c0d1a",
  ink:         "#1a0608",
  inkMid:      "#3d0a10",
  surface:     "#ffffff",
  bg:          "#f4ede4",
  border:      "#ede8e3",
  borderMid:   "rgba(139,26,26,0.10)",
  muted:       "#a08070",
  mutedLight:  "#c4a89a",
  green:       "#059669", greenBg: "#ecfdf5", greenBorder: "#a7f3d0", greenText: "#064e3b",
  amber:       "#d97706", amberBg: "#fffbeb", amberBorder: "#fde68a", amberText: "#78350f",
  red:         "#dc2626", redBg:   "#fef2f2", redBorder:   "#fecaca", redText:   "#7f1d1d",
  blue:        "#1d4ed8", blueBg:  "#eff6ff", blueBorder:  "#bfdbfe", blueText:  "#1e3a8a",
  violet:      "#7c3aed", violetBg:"#f5f3ff", violetBorder:"#ddd6fe", violetText:"#4c1d95",
  indigo:      "#4338ca", indigoBg:"#eef2ff", indigoBorder:"#c7d2fe", indigoText:"#312e81",
  gray:        "#6b7280", grayBg:  "#f9fafb", grayBorder:  "#e5e7eb", grayText:  "#374151",
};

/* ─── Action config ─────────────────────────────────────────────── */
const actionConfig = {
  request_submitted: { icon: <User size={13} />,         color: C.blue,   bg: C.blueBg,   border: C.blueBorder,   label: "Request Submitted" },
  parent_notified:   { icon: <Zap size={13} />,          color: C.violet, bg: C.violetBg, border: C.violetBorder, label: "Parent Notified"   },
  parent_approved:   { icon: <CheckCircle size={13} />,  color: C.green,  bg: C.greenBg,  border: C.greenBorder,  label: "Parent Approved"   },
  parent_rejected:   { icon: <XCircle size={13} />,      color: C.red,    bg: C.redBg,    border: C.redBorder,    label: "Parent Rejected"   },
  admin_approved:    { icon: <CheckCircle size={13} />,  color: C.green,  bg: C.greenBg,  border: C.greenBorder,  label: "Admin Approved"    },
  admin_rejected:    { icon: <XCircle size={13} />,      color: C.red,    bg: C.redBg,    border: C.redBorder,    label: "Admin Rejected"    },
  flagged:           { icon: <AlertTriangle size={13} />,color: C.amber,  bg: C.amberBg,  border: C.amberBorder,  label: "Flagged"           },
  manual_review:     { icon: <Eye size={13} />,          color: C.violet, bg: C.violetBg, border: C.violetBorder, label: "Manual Review"     },
  ai_analyzed:       { icon: <Zap size={13} />,          color: C.indigo, bg: C.indigoBg, border: C.indigoBorder, label: "AI Analyzed"       },
};

/* ─── Actor type config ──────────────────────────────────────────── */
const actorConfig = {
  student: { color: C.blue,   bg: C.blueBg,   border: C.blueBorder   },
  admin:   { color: C.crimson,bg: "#fdf5f5",  border: "rgba(139,26,26,0.18)" },
  system:  { color: C.gray,   bg: C.grayBg,   border: C.grayBorder   },
  ai:      { color: C.indigo, bg: C.indigoBg, border: C.indigoBorder  },
  parent:  { color: C.green,  bg: C.greenBg,  border: C.greenBorder   },
};

/* ─── Sample data ───────────────────────────────────────────────── */
const sampleLogs = [
  { _id:"1", action:"request_submitted", actorName:"Ravi Kumar",           actorType:"student", targetId:"OP001", meta:"Destination: Chennai",          createdAt: new Date(Date.now()-3600000).toISOString() },
  { _id:"2", action:"parent_notified",   actorName:"System (n8n)",         actorType:"system",  targetId:"OP001", meta:"WhatsApp + Email + Voice",       createdAt: new Date(Date.now()-3500000).toISOString() },
  { _id:"3", action:"ai_analyzed",       actorName:"LangChain AI",         actorType:"ai",      targetId:"OP001", meta:"Consent: 92% | Risk: Low",       createdAt: new Date(Date.now()-3400000).toISOString() },
  { _id:"4", action:"parent_approved",   actorName:"Suresh Kumar (Parent)",actorType:"parent",  targetId:"OP001", meta:"OTP verified + Live photo",      createdAt: new Date(Date.now()-3300000).toISOString() },
  { _id:"5", action:"admin_approved",    actorName:"Dr. Priya (Admin)",    actorType:"admin",   targetId:"OP001", meta:"AI recommendation accepted",     createdAt: new Date(Date.now()-3200000).toISOString() },
  { _id:"6", action:"request_submitted", actorName:"Ananya Singh",         actorType:"student", targetId:"OP002", meta:"Destination: Bangalore",         createdAt: new Date(Date.now()-7200000).toISOString() },
  { _id:"7", action:"flagged",           actorName:"LangChain AI",         actorType:"ai",      targetId:"OP002", meta:"Date mismatch detected",         createdAt: new Date(Date.now()-7100000).toISOString() },
  { _id:"8", action:"manual_review",     actorName:"Dr. Priya (Admin)",    actorType:"admin",   targetId:"OP002", meta:"Escalated for review",           createdAt: new Date(Date.now()-7000000).toISOString() },
];

/* ─── CSV Export helper ─────────────────────────────────────────── */
function exportCSV(logs) {
  const headers = ["ID","Action","Actor","Actor Type","Request ID","Details","Date","Time"];
  const rows = logs.map(log => {
    const d = new Date(log.createdAt);
    return [
      log._id,
      actionConfig[log.action]?.label || log.action,
      log.actorName,
      log.actorType,
      log.targetId,
      `"${(log.meta || "").replace(/"/g,'""')}"`,
      d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
      d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }),
    ].join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `audit-logs-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Styles ────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .al-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .al-root { font-family: 'Sora', sans-serif; color: ${C.ink}; }

  /* ── Toolbar ── */
  .al-toolbar {
    display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }

  .al-search-wrap { flex: 1; min-width: 220px; position: relative; }
  .al-search-wrap input {
    width: 100%; padding: 10px 16px 10px 38px;
    font-size: 12.5px; font-family: 'Sora', sans-serif;
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 11px; outline: none; color: ${C.inkMid};
    transition: border-color 0.16s, box-shadow 0.16s;
  }
  .al-search-wrap input:focus {
    border-color: ${C.crimson};
    box-shadow: 0 0 0 3px rgba(139,26,26,0.07);
  }
  .al-search-wrap input::placeholder { color: ${C.mutedLight}; }
  .al-search-icon {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%); color: ${C.mutedLight}; pointer-events: none;
  }

  .al-select-wrap { position: relative; }
  .al-select-wrap select {
    padding: 10px 34px 10px 36px;
    font-size: 12.5px; font-family: 'Sora', sans-serif; font-weight: 500;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 11px; outline: none; appearance: none;
    cursor: pointer; color: ${C.inkMid};
    transition: border-color 0.16s;
  }
  .al-select-wrap select:focus { border-color: ${C.crimson}; }
  .al-select-icon-l {
    position: absolute; left: 11px; top: 50%;
    transform: translateY(-50%); pointer-events: none; color: ${C.mutedLight};
  }
  .al-select-icon-r {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%); pointer-events: none; color: ${C.mutedLight};
  }

  .al-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 16px; font-size: 12.5px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 11px; cursor: pointer; color: ${C.muted};
    transition: all 0.16s; white-space: nowrap;
  }
  .al-btn:hover { border-color: ${C.crimson}; color: ${C.crimson}; background: #fdf5f5; }
  .al-btn.export:hover { border-color: ${C.green}; color: ${C.green}; background: ${C.greenBg}; }

  .al-count-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 20px;
    background: #f5f0eb; border: 1.5px solid ${C.border};
    white-space: nowrap;
  }
  .al-count-dot { width: 6px; height: 6px; border-radius: 50%; background: ${C.crimson}; opacity: 0.55; }
  .al-count-text { font-size: 11.5px; font-weight: 600; color: #7a4a3a; font-family: 'Sora', sans-serif; }

  /* ── Table card ── */
  .al-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  /* ── Table header ── */
  .al-thead {
    display: grid;
    grid-template-columns: 48px 1fr 100px 180px 90px;
    gap: 0;
    padding: 11px 20px;
    background: #faf8f6;
    border-bottom: 1.5px solid ${C.border};
  }
  .al-th {
    font-size: 9.5px; font-weight: 800;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: ${C.muted}; font-family: 'Sora', sans-serif;
    display: flex; align-items: center;
  }

  /* ── Log rows ── */
  .al-row {
    display: grid;
    grid-template-columns: 48px 1fr 100px 180px 90px;
    gap: 0; align-items: center;
    padding: 14px 20px;
    border-bottom: 1.5px solid #f5f0eb;
    transition: background 0.13s;
    cursor: default;
  }
  .al-row:last-child { border-bottom: none; }
  .al-row:hover { background: #fdf9f7; }

  /* ── Action icon box ── */
  .al-icon-box {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Actor type pill ── */
  .al-actor-pill {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 20px;
    font-size: 9.5px; font-weight: 700;
    font-family: 'Sora', sans-serif;
    text-transform: capitalize; white-space: nowrap;
  }

  /* ── Request ID chip ── */
  .al-reqid {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    background: #f5f0eb; color: ${C.inkMid};
    border: 1.5px solid ${C.border};
    white-space: nowrap;
  }

  /* ── Meta text ── */
  .al-meta {
    font-size: 11.5px; color: ${C.muted};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    max-width: 170px;
  }

  /* ── Timestamp ── */
  .al-time-main {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px; font-weight: 500; color: ${C.muted};
    display: block;
  }
  .al-time-date {
    font-size: 10px; color: ${C.mutedLight};
    margin-top: 1px; display: block;
    font-family: 'Sora', sans-serif;
  }

  /* ── Shimmer ── */
  @keyframes alShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .al-shimmer {
    background: linear-gradient(90deg, #f0ebe6 25%, #e8e2dc 50%, #f0ebe6 75%);
    background-size: 800px 100%;
    animation: alShimmer 1.4s ease-in-out infinite;
    border-radius: 7px;
  }

  /* ── Empty state ── */
  .al-empty {
    padding: 64px 20px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .al-empty-icon {
    width: 56px; height: 56px; border-radius: 18px;
    background: #f5f0eb;
    display: flex; align-items: center; justify-content: center;
    color: ${C.mutedLight};
  }
  .al-empty-title { font-size: 14px; font-weight: 600; color: ${C.muted}; }
  .al-empty-sub   { font-size: 12px; color: ${C.mutedLight}; }

  /* ── Refresh spin ── */
  @keyframes alSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .al-spin { animation: alSpin 0.9s linear infinite; }

  /* ── Row fade-in ── */
  @keyframes alFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  .al-fade { animation: alFade 0.22s ease forwards; }

  /* ── Summary header strip ── */
  .al-summary {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 20px;
    background: #faf8f6;
    border-bottom: 1.5px solid ${C.border};
    flex-wrap: wrap;
  }
  .al-summary-item {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer; transition: all 0.15s;
    border: 1.5px solid transparent;
  }
  .al-summary-item:hover { opacity: 0.80; }
  .al-summary-item.active-filter { border-width: 1.5px; }
`;

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AuditLogs() {
  const [logs,          setLogs]          = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [search,        setSearch]        = useState("");
  const [actionFilter,  setActionFilter]  = useState("all");

  const load = () => {
    analyticsAPI
      .getAuditLogs()
      .then(data => setLogs(data.logs || sampleLogs))
      .catch(()   => setLogs(sampleLogs))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { load(); }, []);

  const handleRefresh = () => { setRefreshing(true); load(); };

  /* ── filter ── */
  const filtered = logs.filter(log => {
    const q = search.toLowerCase();
    return (
      (log.actorName?.toLowerCase().includes(q) ||
       log.targetId?.toLowerCase().includes(q)  ||
       log.meta?.toLowerCase().includes(q))      &&
      (actionFilter === "all" || log.action === actionFilter)
    );
  });

  /* ── quick-filter counts ── */
  const quickFilters = [
    { key: "all",           label: "All",          color: C.crimson, bg: "#fdf5f5", border: "rgba(139,26,26,0.18)" },
    { key: "admin_approved",label: "Approved",     color: C.green,   bg: C.greenBg,  border: C.greenBorder  },
    { key: "flagged",       label: "Flagged",      color: C.amber,   bg: C.amberBg,  border: C.amberBorder  },
    { key: "ai_analyzed",   label: "AI Actions",   color: C.indigo,  bg: C.indigoBg, border: C.indigoBorder },
    { key: "admin_rejected",label: "Rejected",     color: C.red,     bg: C.redBg,    border: C.redBorder    },
  ];

  return (
    <>
      <style>{styles}</style>
      <AdminLayout title="Audit Logs" subtitle="Complete history of all system actions and events">
        <div className="al-root">

          {/* ── Toolbar ── */}
          <div className="al-toolbar">

            {/* Search */}
            <div className="al-search-wrap">
              <Search size={14} className="al-search-icon" />
              <input
                type="text"
                placeholder="Search by actor, request ID, or details…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Action filter */}
            <div className="al-select-wrap">
              <Filter size={12} className="al-select-icon-l" />
              <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
                <option value="all">All Actions</option>
                {Object.entries(actionConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <ChevronDown size={10} className="al-select-icon-r" />
            </div>

            {/* Export CSV */}
            <button className="al-btn export" onClick={() => exportCSV(filtered)}>
              <Download size={13} /> Export CSV
            </button>

            {/* Refresh */}
            <button
              className="al-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ opacity: refreshing ? 0.55 : 1 }}
            >
              <RefreshCw size={13} className={refreshing ? "al-spin" : ""} />
              Refresh
            </button>

            {/* Count */}
            <div className="al-count-pill">
              <div className="al-count-dot" />
              <span className="al-count-text">{filtered.length} entries</span>
            </div>
          </div>

          {/* ── Quick filter chips ── */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
            {quickFilters.map(qf => {
              const count = qf.key === "all" ? logs.length : logs.filter(l => l.action === qf.key).length;
              const isActive = actionFilter === qf.key;
              return (
                <button
                  key={qf.key}
                  className="al-summary-item"
                  onClick={() => setActionFilter(qf.key)}
                  style={{
                    background: isActive ? qf.bg : C.surface,
                    color: isActive ? qf.color : C.muted,
                    borderColor: isActive ? qf.border : C.border,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: qf.color, opacity: isActive ? 1 : 0.35,
                    flexShrink: 0,
                  }} />
                  {qf.label}
                  <span style={{
                    fontSize: "10px", fontWeight: 700,
                    padding: "1px 6px", borderRadius: "20px",
                    background: isActive ? `${qf.color}18` : "#f5f0eb",
                    color: isActive ? qf.color : C.mutedLight,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* ── Log table ── */}
          <div className="al-card">

            {/* Table header */}
            <div className="al-thead">
              <div className="al-th" />
              <div className="al-th">Action / Actor</div>
              <div className="al-th">Request</div>
              <div className="al-th">Details</div>
              <div className="al-th">Time</div>
            </div>

            {/* Rows */}
            <div>
              {loading ? (
                Array(8).fill(null).map((_, i) => (
                  <div key={i} className="al-row" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div className="al-shimmer" style={{ width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div className="al-shimmer" style={{ height: "12px", width: "160px" }} />
                      <div className="al-shimmer" style={{ height: "10px", width: "110px" }} />
                    </div>
                    <div className="al-shimmer" style={{ height: "10px", width: "54px" }} />
                    <div className="al-shimmer" style={{ height: "10px", width: "120px" }} />
                    <div className="al-shimmer" style={{ height: "10px", width: "48px" }} />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="al-empty">
                  <div className="al-empty-icon">
                    <Shield size={24} />
                  </div>
                  <p className="al-empty-title">No audit logs found</p>
                  <p className="al-empty-sub">Try adjusting your search or filter</p>
                </div>
              ) : (
                filtered.map((log, i) => {
                  const cfg = actionConfig[log.action] || {
                    icon: <Shield size={13} />, color: C.gray,
                    bg: C.grayBg, border: C.grayBorder, label: log.action,
                  };
                  const actCfg = actorConfig[log.actorType] || actorConfig.system;
                  const d = new Date(log.createdAt);

                  return (
                    <div
                      key={log._id}
                      className="al-row al-fade"
                      style={{ animationDelay: `${i * 0.025}s` }}
                    >
                      {/* Icon box */}
                      <div
                        className="al-icon-box"
                        style={{
                          background: cfg.bg,
                          border: `1.5px solid ${cfg.border}`,
                          color: cfg.color,
                        }}
                      >
                        {cfg.icon}
                      </div>

                      {/* Action + Actor */}
                      <div style={{ paddingRight: "12px" }}>
                        <p style={{
                          fontSize: "12.5px", fontWeight: 700,
                          color: cfg.color, lineHeight: 1, marginBottom: "4px",
                        }}>
                          {cfg.label}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11.5px", color: C.muted }}>{log.actorName}</span>
                          <span
                            className="al-actor-pill"
                            style={{
                              background: actCfg.bg,
                              color: actCfg.color,
                              border: `1px solid ${actCfg.border}`,
                            }}
                          >
                            {log.actorType}
                          </span>
                        </div>
                      </div>

                      {/* Request ID */}
                      <div>
                        <span className="al-reqid">#{log.targetId}</span>
                      </div>

                      {/* Meta / details */}
                      <div title={log.meta}>
                        <p className="al-meta">{log.meta}</p>
                      </div>

                      {/* Timestamp */}
                      <div style={{ textAlign: "right" }}>
                        <span className="al-time-main">
                          {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="al-time-date">
                          {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {!loading && filtered.length > 0 && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 20px",
                borderTop: `1.5px solid ${C.border}`,
                background: "#faf8f6",
              }}>
                <p style={{ fontSize: "11.5px", color: C.muted, fontFamily: "'Sora', sans-serif" }}>
                  Showing{" "}
                  <strong style={{ color: C.inkMid, fontWeight: 700 }}>{filtered.length}</strong>{" "}
                  of{" "}
                  <strong style={{ color: C.inkMid, fontWeight: 700 }}>{logs.length}</strong>{" "}
                  entries
                </p>
                <button
                  className="al-btn export"
                  onClick={() => exportCSV(filtered)}
                  style={{ padding: "7px 14px", fontSize: "11.5px" }}
                >
                  <Download size={12} />
                  Download {filtered.length} rows
                </button>
              </div>
            )}
          </div>

        </div>
      </AdminLayout>
    </>
  );
}
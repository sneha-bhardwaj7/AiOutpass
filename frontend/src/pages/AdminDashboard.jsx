// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import {
  FileText, Clock, CheckCircle, AlertTriangle,
  TrendingUp, RefreshCw, Zap, Eye, ArrowUpRight,
  Shield, Activity, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import StatsCard from "../components/StatsCard";
import OutpassTable from "../components/OutpassTable";
import RiskIndicator from "../components/RiskIndicator";
import { analyticsAPI, outpassAPI } from "../services/api";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const T = {
  crimson:     "#8B1A1A",
  crimsonDeep: "#5c0d1a",
  crimsonSoft: "#C41E3A",
  cream:       "#FFF8F0",
  ink:         "#1a0a0a",
  inkMid:      "#3d0a10",
  slate:       "#64748b",
  surface:     "#ffffff",
  surfaceAlt:  "#fafaf9",
  border:      "rgba(139,26,26,0.10)",
  borderLight: "rgba(139,26,26,0.06)",
  green:       "#059669",
  greenBg:     "#ecfdf5",
  greenBorder: "#a7f3d0",
  amber:       "#d97706",
  amberBg:     "#fffbeb",
  red:         "#dc2626",
  redBg:       "#fef2f2",
  violet:      "#7c3aed",
  violetBg:    "#f5f3ff",
  blue:        "#2563eb",
  blueBg:      "#eff6ff",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root { font-family: 'DM Sans', sans-serif; color: ${T.ink}; }

  /* Stat Cards */
  .stat-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 16px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.25s, transform 0.25s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,26,26,0.10); }
  .stat-card-primary {
    background: ${T.crimsonDeep};
    border-color: transparent;
  }
  .stat-card-primary:hover { box-shadow: 0 8px 28px rgba(92,13,26,0.35); }

  /* Triage */
  .triage-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px; border-radius: 16px;
    text-decoration: none; position: relative; overflow: hidden;
    transition: transform 0.22s, box-shadow 0.22s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .triage-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,0.10); }

  /* Sidebar cards */
  .side-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  /* AI Engine dark card */
  .ai-card {
    background: ${T.crimsonDeep};
    border: 1px solid rgba(196,30,58,0.18);
    border-radius: 16px;
    padding: 18px;
    position: relative; overflow: hidden;
    box-shadow: 0 8px 28px rgba(92,13,26,0.28);
  }

  /* Progress bar */
  .progress-track {
    height: 6px; background: rgba(139,26,26,0.08);
    border-radius: 20px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 20px;
    transition: width 0.9s cubic-bezier(0.16,1,0.3,1);
  }

  /* Topbar buttons */
  .btn-ghost {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 16px; font-size: 12px; font-weight: 600;
    background: ${T.surface}; border: 1.5px solid ${T.border};
    border-radius: 10px; cursor: pointer; color: ${T.inkMid};
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    transition: all 0.18s;
  }
  .btn-ghost:hover { border-color: ${T.crimson}; color: ${T.crimson}; box-shadow: 0 2px 8px rgba(139,26,26,0.12); }

  .btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px; font-size: 12px; font-weight: 700;
    background: ${T.crimsonDeep}; border: none;
    border-radius: 10px; color: ${T.cream}; text-decoration: none;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 4px 14px rgba(92,13,26,0.28);
    transition: all 0.18s;
  }
  .btn-primary:hover { background: ${T.crimson}; box-shadow: 0 6px 20px rgba(92,13,26,0.38); transform: translateY(-1px); }

  /* Section heading */
  .section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 17px; font-weight: 400;
    color: ${T.inkMid}; letter-spacing: -0.01em; line-height: 1;
  }
  .section-sub { font-size: 11px; color: rgba(61,10,16,0.38); margin-top: 3px; }

  /* Status dot pulse */
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .pulse { animation: pulse 2s ease-in-out infinite; }

  /* Refresh spin */
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .spin { animation: spin 0.9s linear infinite; }

  /* Monospace metric */
  .metric {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600; font-size: 11px;
  }

  /* Number display */
  .big-num {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; line-height: 1; letter-spacing: -0.02em;
  }

  /* Tag */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px; font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
  }

  /* Divider */
  .divider { height: 1px; background: rgba(139,26,26,0.06); }

  /* Breadcrumb */
  .breadcrumb { font-size: 11px; font-weight: 500; color: rgba(61,10,16,0.38); }
  .breadcrumb-active { font-weight: 700; color: ${T.inkMid}; }

  /* Label */
  .label {
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(61,10,16,0.38);
  }

  /* Table row action link */
  .view-all-link {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 600; color: rgba(61,10,16,0.40);
    text-decoration: none; transition: color 0.15s;
  }
  .view-all-link:hover { color: ${T.crimson}; }

  /* Insight card */
  .insight-card {
    border-radius: 14px; padding: 14px 16px;
    background: rgba(139,26,26,0.03);
    border: 1.5px solid rgba(139,26,26,0.08);
  }
`;

/* ─── Sub-components ─────────────────────────────────────────────── */

function SectionHeading({ title, sub, action, actionHref }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "14px" }}>
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {action && actionHref && (
        <Link to={actionHref} className="view-all-link">
          {action} <ArrowUpRight size={11} />
        </Link>
      )}
    </div>
  );
}

function StatNumber({ value, loading, color = T.inkMid, size = "42px" }) {
  return (
    <span style={{
      fontFamily: "'DM Serif Display', serif",
      fontSize: size, lineHeight: 1, letterSpacing: "-0.02em",
      color: loading ? "rgba(0,0,0,0.12)" : color,
      display: "block",
    }}>
      {loading ? "—" : value}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAll = async () => {
    try {
      const [statsData, requestsData] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        outpassAPI.getAll(),
      ]);
      setStats(statsData);
      setRecent((requestsData.requests || []).slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchAll(); }, []);
  const handleRefresh = () => { setRefreshing(true); fetchAll(); };

  /* ── Data ── */
  const statCards = [
    {
      title: "Total Requests", value: stats?.total ?? "—",
      icon: <FileText size={16} />, primary: true,
      trendValue: "+12%", subtitle: "All time",
    },
    {
      title: "Pending Review", value: stats?.pending ?? "—",
      icon: <Clock size={16} />, accent: T.amber, accentBg: T.amberBg,
      trendValue: "+3", subtitle: "Awaiting action",
    },
    {
      title: "Approved Today", value: stats?.approvedToday ?? "—",
      icon: <CheckCircle size={16} />, accent: T.green, accentBg: T.greenBg,
      trendValue: "+8%", subtitle: "Last 24 hours",
    },
    {
      title: "High Risk Flags", value: stats?.flagged ?? "—",
      icon: <AlertTriangle size={16} />, accent: T.red, accentBg: T.redBg,
      trendValue: "-2", subtitle: "Needs attention",
    },
  ];

  const triageItems = [
    {
      label: "Flagged", value: stats?.flagged ?? 0,
      link: "/admin/requests?status=flagged",
      accent: T.red, bg: T.redBg, border: "rgba(220,38,38,0.14)",
      desc: "Immediate review", icon: <AlertTriangle size={15} />,
    },
    {
      label: "Awaiting Parent", value: stats?.parentPending ?? 0,
      link: "/admin/requests?status=parent-pending",
      accent: T.amber, bg: T.amberBg, border: "rgba(217,119,6,0.14)",
      desc: "Parent approval", icon: <Clock size={15} />,
    },
    {
      label: "Manual Review", value: stats?.manualReview ?? 0,
      link: "/admin/requests?status=manual-review",
      accent: T.violet, bg: T.violetBg, border: "rgba(124,58,237,0.14)",
      desc: "Admin decision", icon: <Eye size={15} />,
    },
  ];

  const riskData = [
    { level: "low",    pct: stats?.riskLow    ?? 65, color: "#10b981", track: "rgba(16,185,129,0.09)" },
    { level: "medium", pct: stats?.riskMedium ?? 25, color: "#f59e0b", track: "rgba(245,158,11,0.09)" },
    { level: "high",   pct: stats?.riskHigh   ?? 10, color: "#ef4444", track: "rgba(239,68,68,0.09)"  },
  ];

  /* ── Render ── */
  return (
    <>
      <style>{styles}</style>
      <AdminLayout title="Dashboard" subtitle={`Updated: ${lastUpdated.toLocaleTimeString("en-IN")}`}>
        <div className="dash-root">

          {/* ── Top Action Bar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="breadcrumb">Admin</span>
              <span className="breadcrumb" style={{ opacity: 0.4 }}>/</span>
              <span className="breadcrumb breadcrumb-active">Overview</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={handleRefresh} disabled={refreshing}
                className="btn-ghost"
                style={{ opacity: refreshing ? 0.55 : 1 }}
              >
                <RefreshCw size={13} className={refreshing ? "spin" : ""} />
                Refresh
              </button>
              <Link to="/admin/requests" className="btn-primary">
                <Eye size={13} />
                View All Requests
                <ArrowUpRight size={11} style={{ opacity: 0.65 }} />
              </Link>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "14px" }}>
            {statCards.map((s, i) => (
              <div key={i} className={`stat-card ${s.primary ? "stat-card-primary" : ""}`}>
                {/* Subtle corner accent */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "64px", height: "64px", borderRadius: "0 16px 0 64px",
                  background: s.primary ? "rgba(255,255,255,0.05)" : `${s.accent || T.crimson}08`,
                }} />

                <div style={{ position: "relative" }}>
                  {/* Icon + title row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "10px",
                      background: s.primary ? "rgba(255,255,255,0.12)" : (s.accentBg || "rgba(139,26,26,0.06)"),
                      border: `1px solid ${s.primary ? "rgba(255,255,255,0.10)" : (s.accent ? `${s.accent}22` : T.border)}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: s.primary ? T.cream : (s.accent || T.crimson),
                    }}>
                      {s.icon}
                    </div>
                    <span className="tag" style={{
                      background: s.primary ? "rgba(255,255,255,0.10)" : (s.accentBg || "rgba(139,26,26,0.06)"),
                      color: s.primary ? "rgba(255,248,240,0.7)" : (s.accent || T.crimson),
                      border: `1px solid ${s.primary ? "rgba(255,255,255,0.10)" : (s.accent ? `${s.accent}25` : T.border)}`,
                    }}>
                      {s.trendValue}
                    </span>
                  </div>

                  <StatNumber
                    value={s.value} loading={loading}
                    color={s.primary ? T.cream : (s.accent || T.inkMid)}
                  />

                  <p style={{
                    fontSize: "12px", fontWeight: 500, marginTop: "4px",
                    color: s.primary ? "rgba(255,248,240,0.75)" : T.slate,
                  }}>{s.title}</p>

                  <p style={{
                    fontSize: "10.5px", marginTop: "2px",
                    color: s.primary ? "rgba(255,248,240,0.38)" : "rgba(100,116,139,0.65)",
                  }}>{s.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          

          {/* ── Divider ── */}
          <div className="divider" style={{ marginBottom: "24px" }} />

          {/* ── Main + Sidebar ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 288px", gap: "18px" }}>

            {/* Left: Recent Requests */}
            <div>
              <SectionHeading title="Recent Requests" sub="Latest 5 submissions" action="View all" actionHref="/admin/requests" />
              <OutpassTable data={recent} loading={loading} showActions={true} />
            </div>

            {/* Right: Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              

              {/* ── Approval Rate ── */}
              <div className="side-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span className="label">Approval Rate</span>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "3px 9px", background: T.greenBg,
                    border: `1px solid ${T.greenBorder}`, borderRadius: "20px",
                  }}>
                    <TrendingUp size={9} color={T.green} />
                    <span style={{ fontSize: "9.5px", fontWeight: 700, color: T.green, fontFamily: "'DM Sans', sans-serif" }}>+4.2%</span>
                  </div>
                </div>

                <StatNumber value={`${stats?.approvalRate ?? 78}%`} loading={loading} color={T.inkMid} size="40px" />
                <p style={{ fontSize: "11px", color: "rgba(61,10,16,0.35)", margin: "5px 0 12px", fontFamily: "'DM Sans', sans-serif" }}>Rolling 7 days</p>

                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${stats?.approvalRate ?? 78}%`,
                    background: T.crimsonDeep,
                  }} />
                </div>

                {/* Min/Max labels */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span className="metric" style={{ fontSize: "9px", color: "rgba(61,10,16,0.22)" }}>0%</span>
                  <span className="metric" style={{ fontSize: "9px", color: "rgba(61,10,16,0.22)" }}>100%</span>
                </div>
              </div>

              {/* ── Risk Distribution ── */}
              <div className="side-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span className="label">Risk Distribution</span>
                  <Shield size={13} style={{ color: "rgba(61,10,16,0.22)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                  {riskData.map(r => (
                    <div key={r.level}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: r.color }} />
                          <RiskIndicator level={r.level} compact />
                        </div>
                        <span className="metric" style={{ fontSize: "11px", color: r.color }}>{r.pct}%</span>
                      </div>
                      <div className="progress-track" style={{ background: r.track }}>
                        <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── AI Insight ── */}
              <div className="insight-card">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "6px",
                    background: "rgba(139,26,26,0.08)", border: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Sparkles size={10} style={{ color: T.crimson }} />
                  </div>
                  <span className="label">AI Insight</span>
                </div>
                <p style={{
                  fontSize: "12px", color: "rgba(61,10,16,0.58)",
                  lineHeight: "1.70", fontFamily: "'DM Sans', sans-serif",
                }}>
                  Approval rate is{" "}
                  <strong style={{ color: T.inkMid, fontWeight: 700 }}>4.2% higher</strong>{" "}
                  than last week. High-risk flags down by 2. Review{" "}
                  <strong style={{ color: T.inkMid, fontWeight: 700 }}>5 pending manual reviews</strong>.
                </p>
              </div>

            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
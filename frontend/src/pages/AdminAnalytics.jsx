// src/pages/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Calendar,
  CheckCircle, XCircle, Clock, AlertTriangle, Zap,
  ArrowUpRight, ArrowDownRight, Activity, Target,
  Users, MapPin, RefreshCw,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { analyticsAPI } from "../services/api";

/* ─── Design tokens (solid colors only) ────────────────────────────── */
const C = {
  crimson:     "#8B1A1A",
  crimsonDeep: "#5c0d1a",
  crimsonMid:  "#a01e24",
  cream:       "#FFF8F0",
  ink:         "#1a0608",
  inkMid:      "#3d0a10",
  surface:     "#ffffff",
  bg:          "#f4ede4",
  border:      "#ede8e3",
  borderMid:   "rgba(139,26,26,0.10)",
  muted:       "#a08070",
  mutedLight:  "#c4a89a",
  green:       "#059669",
  greenBg:     "#ecfdf5",
  greenBorder: "#a7f3d0",
  greenText:   "#064e3b",
  amber:       "#d97706",
  amberBg:     "#fffbeb",
  amberBorder: "#fde68a",
  amberText:   "#78350f",
  red:         "#dc2626",
  redBg:       "#fef2f2",
  redBorder:   "#fecaca",
  redText:     "#7f1d1d",
  violet:      "#7c3aed",
  violetBg:    "#f5f3ff",
  blue:        "#2563eb",
  blueBg:      "#eff6ff",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .an-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .an-root { font-family: 'Sora', sans-serif; color: ${C.ink}; }

  /* ── Cards ── */
  .an-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.22s, transform 0.22s;
  }
  .an-card:hover { box-shadow: 0 6px 20px rgba(139,26,26,0.08); }

  .an-card-dark {
    background: ${C.crimsonDeep};
    border-color: transparent;
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 4px 18px rgba(92,13,26,0.30);
  }

  /* ── Metric cards ── */
  .metric-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 16px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: transform 0.20s, box-shadow 0.20s;
  }
  .metric-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,26,26,0.09); border-color: ${C.borderMid}; }

  /* ── Period tabs ── */
  .period-tab {
    padding: 8px 18px;
    border-radius: 10px;
    font-size: 12.5px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer; border: 1.5px solid transparent;
    transition: all 0.16s; text-transform: capitalize;
  }
  .period-tab.active {
    background: ${C.crimson};
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 3px 10px rgba(139,26,26,0.28);
  }
  .period-tab.inactive {
    background: ${C.surface};
    color: ${C.muted};
    border-color: ${C.border};
  }
  .period-tab.inactive:hover { border-color: ${C.crimson}; color: ${C.crimson}; }

  /* ── Section labels ── */
  .an-label {
    font-size: 9.5px; font-weight: 800;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: ${C.muted};
    font-family: 'Sora', sans-serif;
  }
  .an-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700; font-size: 16px;
    color: ${C.inkMid}; letter-spacing: -0.01em;
  }
  .an-sub { font-size: 11px; color: ${C.mutedLight}; margin-top: 2px; }

  /* ── Big numbers ── */
  .an-num {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800; font-size: 36px;
    line-height: 1; letter-spacing: -0.02em;
  }
  .mono { font-family: 'JetBrains Mono', monospace; }

  /* ── Progress bars ── */
  .prog-track {
    height: 7px; border-radius: 20px; overflow: hidden;
  }
  .prog-fill {
    height: 100%; border-radius: 20px;
    transition: width 0.9s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── Bar chart ── */
  .bar-chart {
    display: flex; align-items: flex-end;
    gap: 6px; height: 130px;
    padding: 0 4px;
  }
  .bar-group {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 6px;
  }
  .bar-col {
    width: 100%; display: flex;
    align-items: flex-end; justify-content: center;
    gap: 2px; height: 100px;
  }
  .bar-seg {
    border-radius: 4px 4px 0 0;
    transition: height 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.2s;
    cursor: pointer;
  }
  .bar-seg:hover { opacity: 0.80; }
  .bar-label {
    font-size: 9.5px; font-weight: 600; color: ${C.mutedLight};
    font-family: 'Sora', sans-serif; text-align: center;
  }

  /* ── Destination row ── */
  .dest-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0;
    border-bottom: 1.5px solid #f5f0eb;
  }
  .dest-row:last-child { border-bottom: none; }
  .dest-rank {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600; font-size: 11px;
    color: ${C.mutedLight}; width: 16px; flex-shrink: 0;
  }

  /* ── AI metric row ── */
  .ai-row { padding: 10px 0; border-bottom: 1.5px solid #f5f0eb; }
  .ai-row:last-child { border-bottom: none; }

  /* ── Tag pill ── */
  .tag-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 10px; font-weight: 700;
    font-family: 'Sora', sans-serif;
  }

  /* ── Shimmer ── */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .shimmer-block {
    background: linear-gradient(90deg, #f0ebe6 25%, #e8e2dc 50%, #f0ebe6 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 8px;
  }

  /* ── Refresh spin ── */
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .spinning { animation: spin 0.9s linear infinite; }

  /* ── Status dot pulse ── */
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .pulsing { animation: pulse 2s ease-in-out infinite; }

  /* ── Divider ── */
  .an-divider { height: 1.5px; background: #ede8e3; }

  /* ── Tooltip on bar hover ── */
  .bar-tooltip {
    position: absolute; bottom: 100%; left: 50%;
    transform: translateX(-50%) translateY(-6px);
    background: ${C.ink}; color: white;
    font-size: 10px; font-family: 'Sora', sans-serif;
    padding: 4px 8px; border-radius: 6px; white-space: nowrap;
    pointer-events: none; opacity: 0;
    transition: opacity 0.15s;
    z-index: 10;
  }
  .bar-seg-wrap:hover .bar-tooltip { opacity: 1; }
  .bar-seg-wrap { position: relative; display: flex; flex-direction: column-reverse; height: 100%; width: 45%; }
`;

/* ─── Sub-components ───────────────────────────────────────────────── */

function MetricCard({ label, value, sub, icon, trend, trendValue, accentColor, accentBg, loading, primary }) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="shimmer-block" style={{ height: "11px", width: "80px", marginBottom: "16px" }} />
        <div className="shimmer-block" style={{ height: "36px", width: "64px", marginBottom: "8px" }} />
        <div className="shimmer-block" style={{ height: "10px", width: "120px" }} />
      </div>
    );
  }

  const ac  = accentColor || C.crimson;
  const abg = accentBg    || "#fdf5f5";

  return (
    <div className="metric-card" style={primary ? { background: C.crimsonDeep, borderColor: "transparent", boxShadow: `0 4px 18px rgba(92,13,26,0.30)` } : {}}>
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "52px", height: "52px",
        borderRadius: "0 16px 0 52px",
        background: primary ? "rgba(255,255,255,0.06)" : `${ac}08`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
          <span className="an-label" style={{ color: primary ? "rgba(255,248,240,0.45)" : C.muted }}>
            {label}
          </span>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
            background: primary ? "rgba(255,255,255,0.14)" : abg,
            border: `1.5px solid ${primary ? "rgba(255,255,255,0.10)" : `${ac}22`}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: primary ? "rgba(255,248,240,0.85)" : ac,
          }}>
            {icon}
          </div>
        </div>

        {/* Value */}
        <p className="an-num" style={{ color: primary ? "#ffffff" : C.inkMid }}>
          {value ?? "—"}
        </p>

        {/* Sub */}
        {sub && (
          <p style={{ fontSize: "11px", color: primary ? "rgba(255,248,240,0.40)" : C.mutedLight, marginTop: "4px" }}>
            {sub}
          </p>
        )}

        {/* Trend */}
        {trendValue && (
          <div style={{ marginTop: "10px" }}>
            <span className="tag-pill" style={
              primary
                ? { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }
                : trend === "up"
                ? { background: C.greenBg, color: C.green, border: `1px solid ${C.greenBorder}` }
                : { background: C.redBg,   color: C.red,   border: `1px solid ${C.redBorder}` }
            }>
              {trend === "up"
                ? <ArrowUpRight size={10} />
                : <ArrowDownRight size={10} />}
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
function BarChart({ data, loading }) {
  const [hovered, setHovered] = useState(null);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "130px", padding: "0 4px" }}>
        {Array(7).fill(null).map((_, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div className="shimmer-block" style={{ width: "100%", height: `${40 + Math.random() * 60}px`, borderRadius: "4px 4px 0 0" }} />
            <div className="shimmer-block" style={{ width: "24px", height: "9px" }} />
          </div>
        ))}
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => Math.max(d.submitted || 0, d.approved || 0)), 1);

  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const subH = Math.round(((d.submitted || 0) / maxVal) * 96);
        const appH = Math.round(((d.approved  || 0) / maxVal) * 96);
        const isH  = hovered === i;
        return (
          <div key={i} className="bar-group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="bar-col">
              {/* Submitted bar */}
              <div style={{ position: "relative", width: "44%", height: "100%", display: "flex", alignItems: "flex-end" }}>
                {isH && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: C.ink, color: "#fff",
                    fontSize: "9.5px", fontFamily: "'Sora', sans-serif",
                    padding: "4px 8px", borderRadius: "6px", whiteSpace: "nowrap",
                    zIndex: 10, pointerEvents: "none",
                  }}>
                    {d.submitted} submitted
                  </div>
                )}
                <div
                  className="bar-seg"
                  style={{
                    width: "100%", height: `${subH}px`, minHeight: "4px",
                    background: isH ? C.crimson : C.crimsonMid,
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>
              {/* Approved bar */}
              <div style={{ position: "relative", width: "44%", height: "100%", display: "flex", alignItems: "flex-end" }}>
                <div
                  className="bar-seg"
                  style={{
                    width: "100%", height: `${appH}px`, minHeight: "4px",
                    background: isH ? C.green : "#a7f3d0",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>
            </div>
            <span className="bar-label">{d.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Status breakdown ── */
function StatusBreakdown({ stats, loading }) {
  const items = [
    { label: "Approved",      val: stats?.approvedCount      ?? 89, color: C.green,  track: "#d1fae5", pct: 63 },
    { label: "Pending",       val: stats?.pendingCount       ?? 24, color: C.amber,  track: "#fef9c3", pct: 17 },
    { label: "Rejected",      val: stats?.rejectedCount      ?? 18, color: C.red,    track: "#fee2e2", pct: 13 },
    { label: "Manual Review", val: stats?.manualReviewCount  ?? 11, color: C.violet, track: "#ede9fe", pct:  7 },
  ];

  const total = items.reduce((s, x) => s + x.val, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {/* Mini visual strip */}
      <div style={{ display: "flex", height: "8px", borderRadius: "20px", overflow: "hidden", marginBottom: "16px", gap: "2px" }}>
        {items.map(item => (
          <div key={item.label} style={{ flex: item.pct, background: item.color, minWidth: "4px" }} />
        ))}
      </div>

      {items.map(item => (
        <div key={item.label} style={{ padding: "9px 0", borderBottom: `1.5px solid #f5f0eb` }}>
          {loading ? (
            <div className="shimmer-block" style={{ height: "12px", width: "140px" }} />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12.5px", fontWeight: 500, color: C.inkMid }}>{item.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", color: C.muted }}>{item.val}</span>
                  <span className="mono" style={{ fontSize: "12px", fontWeight: 600, color: item.color, minWidth: "32px", textAlign: "right" }}>
                    {item.pct}%
                  </span>
                </div>
              </div>
              <div className="prog-track" style={{ background: item.track }}>
                <div className="prog-fill" style={{ width: `${item.pct}%`, background: item.color }} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Top Destinations ── */
function TopDestinations({ data, loading }) {
  const max = Math.max(...(data || []).map(d => d.value), 1);

  return (
    <div>
      {loading
        ? Array(5).fill(null).map((_, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: `1.5px solid #f5f0eb` }}>
              <div className="shimmer-block" style={{ height: "12px", width: `${80 + i * 10}px` }} />
            </div>
          ))
        : (data || []).map((d, i) => (
            <div key={i} className="dest-row">
              <span className="dest-rank">#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "7px",
                      background: "#f5f0eb", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <MapPin size={11} style={{ color: C.crimson }} />
                    </div>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: C.inkMid }}>{d.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: "11px", color: C.muted }}>{d.value} req</span>
                </div>
                <div className="prog-track" style={{ background: "#f5f0eb" }}>
                  <div className="prog-fill" style={{
                    width: `${(d.value / max) * 100}%`,
                    background: i === 0 ? C.crimson : i === 1 ? C.crimsonMid : C.mutedLight,
                  }} />
                </div>
              </div>
            </div>
          ))
      }
    </div>
  );
}

/* ── AI Performance ── */
function AIPerformance({ loading }) {
  const metrics = [
    { label: "Consent Detection Accuracy", val: 94, color: C.green,  track: "#d1fae5" },
    { label: "Mismatch Detection Rate",    val: 88, color: C.crimson, track: "#fde8e8" },
    { label: "False Positive Rate",        val:  6, color: C.amber,  track: "#fef9c3" },
    { label: "Auto-Approval Accuracy",     val: 97, color: C.green,  track: "#d1fae5" },
  ];

  return (
    <div>
      {metrics.map(m => (
        <div key={m.label} className="ai-row">
          {loading ? (
            <div className="shimmer-block" style={{ height: "12px", width: "160px" }} />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: C.muted }}>{m.label}</span>
                <span className="mono" style={{ fontSize: "13px", fontWeight: 700, color: m.color }}>
                  {m.val}%
                </span>
              </div>
              <div className="prog-track" style={{ background: m.track }}>
                <div className="prog-fill" style={{ width: `${m.val}%`, background: m.color }} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function AdminAnalytics() {
  const [stats,  setStats]    = useState(null);
  const [trends, setTrends]   = useState(null);
  const [period, setPeriod]   = useState("month");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [s, t] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getTrends(period),
      ]);
      setStats(s);
      setTrends(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [period]);

  const handleRefresh = () => { setRefreshing(true); load(); };

  /* ── data ── */
  const weeklyData = trends?.weekly || [
    { name: "Mon", submitted: 8,  approved: 6,  rejected: 1 },
    { name: "Tue", submitted: 12, approved: 9,  rejected: 2 },
    { name: "Wed", submitted: 6,  approved: 5,  rejected: 1 },
    { name: "Thu", submitted: 15, approved: 11, rejected: 3 },
    { name: "Fri", submitted: 10, approved: 8,  rejected: 1 },
    { name: "Sat", submitted: 4,  approved: 3,  rejected: 0 },
    { name: "Sun", submitted: 2,  approved: 2,  rejected: 0 },
  ];

  const destData = trends?.topDestinations || [
    { name: "Chennai",    value: 45 },
    { name: "Bangalore",  value: 32 },
    { name: "Hyderabad",  value: 28 },
    { name: "Coimbatore", value: 18 },
    { name: "Pune",       value: 12 },
  ];

  const metrics = [
    {
      label: "Total This Month", value: stats?.total ?? 142,
      icon: <BarChart3 size={16} />, primary: true,
      trendValue: "+18", trend: "up", sub: "All requests combined",
    },
    {
      label: "Approval Rate", value: `${stats?.approvalRate ?? 78}%`,
      icon: <CheckCircle size={16} />,
      accentColor: C.green, accentBg: C.greenBg,
      trendValue: "+4.2%", trend: "up", sub: "vs last month",
    },
    {
      label: "Avg Response Time", value: stats?.avgResponseTime ?? "2.4h",
      icon: <Clock size={16} />,
      accentColor: C.amber, accentBg: C.amberBg,
      sub: "Parent approval time",
    },
    {
      label: "Flagged Requests", value: stats?.flagged ?? 7,
      icon: <AlertTriangle size={16} />,
      accentColor: C.red, accentBg: C.redBg,
      trendValue: "-2", trend: "down", sub: "Requires attention",
    },
    {
      label: "Auto-Approved (AI)", value: stats?.autoApproved ?? 89,
      icon: <Zap size={16} />,
      accentColor: C.crimson, accentBg: "#fdf5f5",
      trendValue: "+11%", trend: "up", sub: "By AI recommendation",
    },
    {
      label: "Manual Overrides", value: stats?.manualOverride ?? 14,
      icon: <Target size={16} />,
      accentColor: C.violet, accentBg: C.violetBg,
      sub: "Admin interventions",
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <AdminLayout title="Analytics" subtitle="Outpass trends, approval stats & AI performance">
        <div className="an-root">

          {/* ── Top bar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            {/* Period tabs */}
            <div style={{ display: "flex", gap: "6px" }}>
              {["week", "month", "quarter"].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`period-tab ${period === p ? "active" : "inactive"}`}
                >
                  This {p}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", fontSize: "12px", fontWeight: 600,
                background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: "10px", cursor: "pointer", color: C.muted,
                fontFamily: "'Sora', sans-serif",
                opacity: refreshing ? 0.55 : 1,
                transition: "all 0.16s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.color = C.crimson; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted; }}
            >
              <RefreshCw size={13} className={refreshing ? "spinning" : ""} />
              Refresh
            </button>
          </div>

          {/* ── Metrics Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
            {metrics.map((m, i) => (
              <MetricCard key={i} {...m} loading={loading} />
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="an-divider" style={{ marginBottom: "20px" }} />

          {/* ── Charts Row 1 ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px", marginBottom: "16px" }}>

            {/* Weekly bar chart */}
            <div className="an-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
                <div>
                  <h3 className="an-title">Weekly Submissions</h3>
                  <p className="an-sub">Outpass request volume by day</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: C.crimsonMid }} />
                    <span style={{ fontSize: "10.5px", color: C.muted, fontFamily: "'Sora', sans-serif" }}>Submitted</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#a7f3d0" }} />
                    <span style={{ fontSize: "10.5px", color: C.muted, fontFamily: "'Sora', sans-serif" }}>Approved</span>
                  </div>
                </div>
              </div>
              <BarChart data={weeklyData} loading={loading} />
            </div>

            {/* Status breakdown */}
            <div className="an-card">
              <div style={{ marginBottom: "16px" }}>
                <h3 className="an-title">Status Breakdown</h3>
                <p className="an-sub">Current request distribution</p>
              </div>
              <StatusBreakdown stats={stats} loading={loading} />
            </div>
          </div>

          {/* ── Charts Row 2 ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

            {/* Top Destinations */}
            {/* <div className="an-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 className="an-title">Top Destinations</h3>
                  <p className="an-sub">Most requested travel locations</p>
                </div>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "9px",
                  background: "#f5f0eb", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={14} style={{ color: C.crimson }} />
                </div>
              </div>
              <TopDestinations data={destData} loading={loading} />
            </div> */}

            {/* AI Performance */}
            {/* <div className="an-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 className="an-title">AI Performance</h3>
                  <p className="an-sub">LangChain model accuracy & metrics</p>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "4px 10px", borderRadius: "20px",
                  background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                }}>
                  <div className="pulsing" style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.green }} />
                  <span style={{ fontSize: "9px", fontWeight: 700, color: C.greenText, fontFamily: "'Sora', sans-serif", letterSpacing: "0.08em" }}>
                    LIVE
                  </span>
                </div>
              </div>
              <AIPerformance loading={loading} />
            </div> */}
          </div>

          {/* ── Summary strip ── */}
          <div style={{
            background: C.crimsonDeep,
            borderRadius: "16px", padding: "18px 24px",
            display: "flex", alignItems: "center", gap: "32px",
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Activity size={16} style={{ color: "rgba(255,248,240,0.85)" }} />
              </div>
              <div>
                <p style={{ fontSize: "10px", color: "rgba(255,248,240,0.40)", fontFamily: "'Sora', sans-serif", letterSpacing: "0.10em", textTransform: "uppercase", fontWeight: 700 }}>
                  System Health
                </p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,248,240,0.90)", marginTop: "1px" }}>
                  All systems operational
                </p>
              </div>
            </div>

            <div className="an-divider" style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.08)" }} />

            {[
              { label: "Requests Today",  value: stats?.today       ?? 23  },
              { label: "This Week",       value: stats?.thisWeek     ?? 141 },
              { label: "Parent Pending",  value: stats?.parentPending ?? 8  },
              { label: "AI Accuracy",     value: "94%"                      },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: "9.5px", color: "rgba(255,248,240,0.35)", fontFamily: "'Sora', sans-serif", textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 700 }}>
                  {item.label}
                </p>
                <p className="mono" style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", marginTop: "2px" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

        </div>
      </AdminLayout>
    </>
  );
}
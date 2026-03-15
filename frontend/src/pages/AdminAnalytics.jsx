// src/pages/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Calendar,
  CheckCircle, XCircle, Clock, AlertTriangle, Zap,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { analyticsAPI } from "../services/api";

const MetricCard = ({ label, value, sub, icon, color = "burgundy", loading }) => (
  <div className={`bg-white rounded-2xl shadow-card border border-cream-100 p-5 card-hover ${loading ? "" : "animate-slide-up"}`}>
    {loading ? (
      <div className="space-y-3">
        <div className="shimmer h-4 w-20 rounded"></div>
        <div className="shimmer h-8 w-16 rounded"></div>
      </div>
    ) : (
      <>
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-semibold text-burgundy/50 uppercase tracking-wide">{label}</p>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color === "burgundy" ? "bg-burgundy/10 text-burgundy" : color === "green" ? "bg-green-50 text-green-600" : color === "red" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
            {icon}
          </div>
        </div>
        <p className="font-display font-bold text-3xl text-burgundy">{value ?? "—"}</p>
        {sub && <p className="text-xs text-burgundy/40 mt-1">{sub}</p>}
      </>
    )}
  </div>
);

// Simple Bar Chart using pure CSS
function SimpleBarChart({ data = [], label = "value", color = "bg-burgundy" }) {
  const max = Math.max(...data.map((d) => d[label] || 0), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
            <div
              className={`w-full ${color} rounded-t-lg transition-all duration-700 opacity-80 hover:opacity-100`}
              style={{ height: `${((d[label] || 0) / max) * 100}%`, minHeight: "4px" }}
              title={`${d.name}: ${d[label]}`}
            ></div>
          </div>
          <span className="text-[9px] text-burgundy/40 text-center truncate w-full px-0.5">{d.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getDashboardStats(),
      analyticsAPI.getTrends(period),
    ]).then(([s, t]) => {
      setStats(s);
      setTrends(t);
    }).finally(() => setLoading(false));
  }, [period]);

  // Mock trend data if backend not ready
  const weeklyData = trends?.weekly || [
    { name: "Mon", submitted: 8, approved: 6, rejected: 1 },
    { name: "Tue", submitted: 12, approved: 9, rejected: 2 },
    { name: "Wed", submitted: 6, approved: 5, rejected: 1 },
    { name: "Thu", submitted: 15, approved: 11, rejected: 3 },
    { name: "Fri", submitted: 10, approved: 8, rejected: 1 },
    { name: "Sat", submitted: 4, approved: 3, rejected: 0 },
    { name: "Sun", submitted: 2, approved: 2, rejected: 0 },
  ];

  const destData = trends?.topDestinations || [
    { name: "Chennai", value: 45 },
    { name: "Bangalore", value: 32 },
    { name: "Hyderabad", value: 28 },
    { name: "Coimbatore", value: 18 },
    { name: "Pune", value: 12 },
  ];

  const metrics = [
    { label: "Total This Month", value: stats?.total ?? 142, icon: <BarChart3 size={16} />, color: "burgundy" },
    { label: "Approval Rate", value: `${stats?.approvalRate ?? 78}%`, icon: <CheckCircle size={16} />, color: "green", sub: "+4.2% vs last month" },
    { label: "Avg Response Time", value: stats?.avgResponseTime ?? "2.4h", icon: <Clock size={16} />, color: "amber", sub: "Parent approval time" },
    { label: "Flagged Requests", value: stats?.flagged ?? 7, icon: <AlertTriangle size={16} />, color: "red", sub: "Requires attention" },
    { label: "Auto-Approved (AI)", value: stats?.autoApproved ?? 89, icon: <Zap size={16} />, color: "burgundy", sub: "By AI recommendation" },
    { label: "Manual Overrides", value: stats?.manualOverride ?? 14, icon: <TrendingUp size={16} />, color: "amber", sub: "Admin interventions" },
  ];

  return (
    <AdminLayout title="Analytics" subtitle="Outpass trends, approval stats, and AI performance">
      {/* Period selector */}
      <div className="flex items-center gap-2 mb-8">
        {["week", "month", "quarter"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              period === p ? "bg-burgundy text-cream shadow-burgundy" : "bg-white text-burgundy/60 hover:bg-cream-50 border border-cream-200"
            }`}
          >
            This {p}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} loading={loading} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Submissions Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-cream-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg text-burgundy">Weekly Submissions</h3>
              <p className="text-xs text-burgundy/40 mt-0.5">Outpass request volume by day</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-burgundy rounded-sm"></div><span className="text-burgundy/50">Submitted</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-400 rounded-sm"></div><span className="text-burgundy/50">Approved</span></div>
            </div>
          </div>
          <SimpleBarChart data={weeklyData} label="submitted" color="bg-burgundy/80" />
        </div>

        {/* Status Donut */}
        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
          <h3 className="font-display font-semibold text-lg text-burgundy mb-2">Status Breakdown</h3>
          <p className="text-xs text-burgundy/40 mb-6">Current request distribution</p>
          <div className="space-y-3">
            {[
              { label: "Approved", val: stats?.approvedCount ?? 89, color: "bg-green-400", pct: 63 },
              { label: "Pending", val: stats?.pendingCount ?? 24, color: "bg-amber-400", pct: 17 },
              { label: "Rejected", val: stats?.rejectedCount ?? 18, color: "bg-red-400", pct: 13 },
              { label: "Manual Review", val: stats?.manualReviewCount ?? 11, color: "bg-purple-400", pct: 7 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-burgundy/70 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-burgundy/40">{item.val}</span>
                    <span className="font-mono font-semibold text-burgundy">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
          <h3 className="font-display font-semibold text-lg text-burgundy mb-2">Top Destinations</h3>
          <p className="text-xs text-burgundy/40 mb-5">Most requested travel locations</p>
          <div className="space-y-3">
            {destData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-burgundy/30 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-burgundy">{d.name}</span>
                    <span className="text-burgundy/40">{d.value} requests</span>
                  </div>
                  <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-burgundy/60 rounded-full"
                      style={{ width: `${(d.value / destData[0].value) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance */}
        <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-burgundy" />
            <h3 className="font-display font-semibold text-lg text-burgundy">AI Performance</h3>
          </div>
          <p className="text-xs text-burgundy/40 mb-5">LangChain model accuracy & metrics</p>
          <div className="space-y-4">
            {[
              { label: "Consent Detection Accuracy", val: 94, color: "bg-green-400" },
              { label: "Mismatch Detection Rate", val: 88, color: "bg-burgundy" },
              { label: "False Positive Rate", val: 6, color: "bg-amber-400" },
              { label: "Auto-Approval Accuracy", val: 97, color: "bg-green-400" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-burgundy/70">{m.label}</span>
                  <span className="font-mono font-bold text-burgundy">{m.val}%</span>
                </div>
                <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: `${m.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
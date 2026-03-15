// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import {
  FileText, Clock, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, RefreshCw, Zap, Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import StatsCard from "../components/StatsCard";
import OutpassTable from "../components/OutpassTable";
import RiskIndicator from "../components/RiskIndicator";
import { analyticsAPI, outpassAPI } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    try {
      const [statsData, requestsData] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        outpassAPI.getAll({ limit: 10, sort: "-createdAt" }),
      ]);
      setStats(statsData);
      setRecent(requestsData.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchAll(); };

  const statCards = [
    { title: "Total Requests", value: stats?.total ?? "—", icon: <FileText size={18} />, color: "burgundy", trendValue: "+12%", trend: "up" },
    { title: "Pending Review", value: stats?.pending ?? "—", icon: <Clock size={18} />, color: "cream", trendValue: "+3", trend: "up" },
    { title: "Approved Today", value: stats?.approvedToday ?? "—", icon: <CheckCircle size={18} />, color: "cream", trendValue: "+8%", trend: "up" },
    { title: "High Risk Flags", value: stats?.flagged ?? "—", icon: <AlertTriangle size={18} />, color: "cream", trendValue: "-2", trend: "down" },
  ];

  const quickActions = [
    { label: "Flagged Requests", value: stats?.flagged ?? 0, link: "/admin/requests?status=flagged", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    { label: "Awaiting Parent", value: stats?.parentPending ?? 0, link: "/admin/requests?status=parent-pending", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    { label: "Manual Review", value: stats?.manualReview ?? 0, link: "/admin/requests?status=manual-review", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle={`Last updated: ${new Date().toLocaleTimeString("en-IN")}`}>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <div></div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-burgundy/70 hover:text-burgundy border border-cream-200 bg-white rounded-xl hover:bg-cream-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/admin/requests"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-burgundy text-cream rounded-xl hover:bg-burgundy-700 transition-all shadow-burgundy"
          >
            <Eye size={14} /> View All Requests
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => (
          <StatsCard key={i} {...s} loading={loading} />
        ))}
      </div>

      {/* Quick Action Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((q, i) => (
          <Link
            key={i}
            to={q.link}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${q.bg} ${q.border} hover:shadow-md transition-all card-hover group`}
          >
          <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${q.color} opacity-70`}>{q.label}</p>
              <p className={`text-3xl font-display font-bold ${q.color} mt-1`}>{loading ? "—" : q.value}</p>
          </div>
            <div className={`w-10 h-10 rounded-xl ${q.bg} border ${q.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <AlertTriangle size={18} className={q.color} />
            </div>
          </Link>
        ))}
        </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-burgundy">Recent Requests</h2>
            <Link to="/admin/requests" className="text-xs font-semibold text-burgundy/50 hover:text-burgundy transition-colors">
              View all →
            </Link>
          </div>
          <OutpassTable data={recent} loading={loading} showActions={true} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* AI Engine Status */}
          <div className="bg-burgundy rounded-2xl p-5 text-cream relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                  <Zap size={16} className="text-cream" />
                </div>
                <div>
                  <p className="font-semibold text-sm">AI Engine Status</p>
                  <p className="text-[10px] text-cream/50">LangChain + n8n</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Consent Analyzer", status: "Active" },
                  { label: "Risk Detector", status: "Active" },
                  { label: "n8n Workflows", status: "Running" },
                  { label: "Notification Engine", status: "Online" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-cream/60">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full status-pulse"></div>
                      <span className="text-xs text-green-400 font-medium">{item.status}</span>
                    </div>
                  </div>
            ))}
          </div>
            </div>
      </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
            <h3 className="font-display font-semibold text-burgundy mb-4">Risk Distribution</h3>
            <div className="space-y-3">
              {[
                { level: "low", label: "Low Risk", pct: stats?.riskLow ?? 65 },
                { level: "medium", label: "Medium Risk", pct: stats?.riskMedium ?? 25 },
                { level: "high", label: "High Risk", pct: stats?.riskHigh ?? 10 },
              ].map((r) => (
                <div key={r.level}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <RiskIndicator level={r.level} compact />
                    <span className="font-mono font-semibold text-burgundy/60">{r.pct}%</span>
        </div>
                  <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${r.level === "low" ? "bg-green-400" : r.level === "medium" ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${r.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Rate */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-burgundy">Approval Rate</h3>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <p className="font-display font-bold text-4xl text-burgundy">
                {stats?.approvalRate ?? 78}%
              </p>
              <p className="text-xs text-green-500 font-semibold mb-1.5">+4.2% this week</p>
            </div>
            <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-burgundy to-burgundy-400 rounded-full transition-all duration-700"
                style={{ width: `${stats?.approvalRate ?? 78}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
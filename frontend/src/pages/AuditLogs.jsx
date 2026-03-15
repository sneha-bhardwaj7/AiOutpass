// src/pages/AuditLogs.jsx
import { useEffect, useState } from "react";
import { Search, Filter, Download, ChevronDown, Shield, User, Zap, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { analyticsAPI } from "../services/api";

const actionConfig = {
  "request_submitted": { icon: <User size={13} />, color: "text-blue-600", bg: "bg-blue-50", label: "Request Submitted" },
  "parent_notified": { icon: <Zap size={13} />, color: "text-purple-600", bg: "bg-purple-50", label: "Parent Notified" },
  "parent_approved": { icon: <CheckCircle size={13} />, color: "text-green-600", bg: "bg-green-50", label: "Parent Approved" },
  "parent_rejected": { icon: <XCircle size={13} />, color: "text-red-600", bg: "bg-red-50", label: "Parent Rejected" },
  "admin_approved": { icon: <CheckCircle size={13} />, color: "text-green-700", bg: "bg-green-50", label: "Admin Approved" },
  "admin_rejected": { icon: <XCircle size={13} />, color: "text-red-700", bg: "bg-red-50", label: "Admin Rejected" },
  "flagged": { icon: <AlertTriangle size={13} />, color: "text-amber-600", bg: "bg-amber-50", label: "Flagged" },
  "manual_review": { icon: <Eye size={13} />, color: "text-purple-600", bg: "bg-purple-50", label: "Manual Review" },
  "ai_analyzed": { icon: <Zap size={13} />, color: "text-indigo-600", bg: "bg-indigo-50", label: "AI Analyzed" },
};

const sampleLogs = [
  { _id: "1", action: "request_submitted", actorName: "Ravi Kumar", actorType: "student", targetId: "OP001", meta: "Destination: Chennai", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "2", action: "parent_notified", actorName: "System (n8n)", actorType: "system", targetId: "OP001", meta: "WhatsApp + Email + Voice", createdAt: new Date(Date.now() - 3500000).toISOString() },
  { _id: "3", action: "ai_analyzed", actorName: "LangChain AI", actorType: "ai", targetId: "OP001", meta: "Consent: 92% | Risk: Low", createdAt: new Date(Date.now() - 3400000).toISOString() },
  { _id: "4", action: "parent_approved", actorName: "Suresh Kumar (Parent)", actorType: "parent", targetId: "OP001", meta: "OTP verified + Live photo", createdAt: new Date(Date.now() - 3300000).toISOString() },
  { _id: "5", action: "admin_approved", actorName: "Dr. Priya (Admin)", actorType: "admin", targetId: "OP001", meta: "AI recommendation accepted", createdAt: new Date(Date.now() - 3200000).toISOString() },
  { _id: "6", action: "request_submitted", actorName: "Ananya Singh", actorType: "student", targetId: "OP002", meta: "Destination: Bangalore", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: "7", action: "flagged", actorName: "LangChain AI", actorType: "ai", targetId: "OP002", meta: "Date mismatch detected", createdAt: new Date(Date.now() - 7100000).toISOString() },
  { _id: "8", action: "manual_review", actorName: "Dr. Priya (Admin)", actorType: "admin", targetId: "OP002", meta: "Escalated for review", createdAt: new Date(Date.now() - 7000000).toISOString() },
];

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    analyticsAPI
      .getAuditLogs()
      .then((data) => setLogs(data.logs || sampleLogs))
      .catch(() => setLogs(sampleLogs))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      (log.actorName?.toLowerCase().includes(q) || log.targetId?.toLowerCase().includes(q) || log.meta?.toLowerCase().includes(q)) &&
      (actionFilter === "all" || log.action === actionFilter)
    );
  });

  const actorTypeBadge = (type) => {
    const map = {
      student: "bg-blue-50 text-blue-600",
      admin: "bg-burgundy/10 text-burgundy",
      system: "bg-gray-50 text-gray-500",
      ai: "bg-indigo-50 text-indigo-600",
      parent: "bg-green-50 text-green-600",
    };
    return map[type] || "bg-gray-50 text-gray-500";
  };

  return (
    <AdminLayout title="Audit Logs" subtitle="Complete history of all system actions and events">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/30" />
          <input
            type="text"
            placeholder="Search by actor, request ID, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-cream-200 rounded-xl focus:outline-none focus:border-burgundy/30 transition-all input-focus"
          />
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/40 pointer-events-none" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="pl-8 pr-3 py-2.5 text-sm bg-white border border-cream-200 rounded-xl focus:outline-none focus:border-burgundy/30 appearance-none cursor-pointer text-burgundy/70"
          >
            <option value="all">All Actions</option>
            {Object.entries(actionConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-burgundy/60 hover:text-burgundy border border-cream-200 bg-white rounded-xl hover:bg-cream-50 transition-all">
          <Download size={14} /> Export CSV
        </button>
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-burgundy/5 border border-burgundy/10 rounded-xl">
          <Shield size={13} className="text-burgundy/60" />
          <span className="text-xs font-semibold text-burgundy/60">{filtered.length} entries</span>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 text-xs font-semibold text-burgundy/40 uppercase tracking-wide border-b border-cream-100 px-6 py-3 bg-cream-50/50">
          <div className="w-8"></div>
          <div className="px-3">Action / Actor</div>
          <div className="px-3">Request</div>
          <div className="px-3">Details</div>
          <div className="px-3">Time</div>
        </div>

        <div className="divide-y divide-cream-50">
          {loading
            ? Array(8).fill(null).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="shimmer w-7 h-7 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="shimmer h-3.5 w-48 rounded"></div>
                    <div className="shimmer h-3 w-32 rounded"></div>
                  </div>
                  <div className="shimmer h-3 w-16 rounded"></div>
                </div>
              ))
            : filtered.length === 0
            ? (
              <div className="py-16 text-center text-burgundy/30">
                <Shield size={32} className="mx-auto mb-3 opacity-20" />
                <p>No audit logs found</p>
              </div>
            )
            : filtered.map((log, i) => {
                const config = actionConfig[log.action] || { icon: <Shield size={13} />, color: "text-gray-500", bg: "bg-gray-50", label: log.action };
                return (
                  <div
                    key={log._id}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-0 px-6 py-4 hover:bg-cream-50/50 transition-colors group animate-fade-in"
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    {/* Icon */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.bg} ${config.color} flex-shrink-0`}>
                      {config.icon}
                    </div>

                    {/* Action + Actor */}
                    <div className="px-3">
                      <p className={`text-xs font-semibold ${config.color}`}>{config.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-burgundy/50">{log.actorName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${actorTypeBadge(log.actorType)}`}>
                          {log.actorType}
                        </span>
                      </div>
                    </div>

                    {/* Request ID */}
                    <div className="px-3">
                      <span className="text-xs font-mono font-semibold text-burgundy/60 bg-cream-50 px-2 py-1 rounded-lg border border-cream-100">
                        #{log.targetId}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="px-3 max-w-40">
                      <p className="text-xs text-burgundy/40 truncate">{log.meta}</p>
                    </div>

                    {/* Time */}
                    <div className="px-3 text-right">
                      <p className="text-xs font-mono text-burgundy/30">
                        {new Date(log.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-[10px] text-burgundy/20">
                        {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </AdminLayout>
  );
}
// src/pages/AdminRequestDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, MapPin, Calendar, Phone, Mail,
  MessageSquare, CheckCircle, XCircle, Eye, AlertTriangle,
  Clock, Edit3, Download,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import StatusBadge from "../components/StatusBadge";
import AIInsightCard from "../components/AIInsightCard";
import RiskIndicator from "../components/RiskIndicator";
import TimelineStep from "../components/TimelineStep";
import { outpassAPI, aiAPI } from "../services/api";

export default function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      outpassAPI.getRequestById(id),
      aiAPI.getInsights(id).catch(() => null),
    ]).then(([reqData, aiData]) => {
      setRequest(reqData.request || reqData);
      setAiInsight(aiData?.insight || null);
      setAdminNote(reqData?.request?.adminNote || "");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(action);
    try {
      await outpassAPI.adminAction(id, { action, adminNote });
      const updated = await outpassAPI.getRequestById(id);
      setRequest(updated.request || updated);
    } catch (err) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const timeline = request ? [
    { label: "Request Submitted", status: "completed", description: "Student submitted outpass request.", timestamp: request.createdAt },
    { label: "Parent Notified", status: request.notificationsSent ? "completed" : "active", description: "WhatsApp, email & voice call sent." },
    { label: "Parent Response", status: request.parentApproved ? "completed" : request.parentRejected ? "failed" : "pending", description: request.parentApproved ? "Parent approved via OTP." : request.parentRejected ? "Parent rejected." : "Awaiting parent response.", detail: request.parentResponse },
    { label: "AI Analysis", status: request.aiAnalyzed ? "completed" : "pending", description: "LangChain consent & risk analysis." },
    { label: "Admin Action", status: request.status === "approved" || request.status === "rejected" ? "completed" : "active", description: "Manual review by hostel authority." },
  ] : [];

  if (loading) {
    return (
      <AdminLayout title="Request Details">
        <div className="space-y-4">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="shimmer h-24 rounded-2xl"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout title="Request Details">
        <div className="text-center py-16">
          <p className="text-burgundy/50">Request not found.</p>
          <button onClick={() => navigate(-1)} className="text-burgundy text-sm hover:underline mt-2 inline-flex items-center gap-1">
            <ArrowLeft size={12} /> Go Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  const canAct = !["approved", "rejected"].includes(request.status);

  return (
    <AdminLayout title="Request Detail" subtitle={`Request ID: ${request._id}`}>
      {/* Back */}
      <Link to="/admin/requests" className="inline-flex items-center gap-1.5 text-sm text-burgundy/50 hover:text-burgundy mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Requests
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-burgundy/8 rounded-2xl flex items-center justify-center text-burgundy font-bold font-display text-xl">
                  {request.studentName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-burgundy">{request.studentName}</h2>
                  <p className="text-xs font-mono text-burgundy/40 mt-0.5">{request.collegeId} • Room {request.roomNumber} • {request.hostelBlock}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={request.status} size="md" />
                <button className="p-2 hover:bg-cream-50 rounded-xl text-burgundy/40 hover:text-burgundy transition-colors">
                  <Download size={15} />
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { icon: <MapPin size={13} />, label: "Destination", val: request.destination },
                { icon: <Calendar size={13} />, label: "Departure", val: request.outpassDate ? new Date(request.outpassDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
                { icon: <Calendar size={13} />, label: "Return", val: request.returnDate ? new Date(request.returnDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
                { icon: <Clock size={13} />, label: "Submitted", val: request.createdAt ? new Date(request.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—" },
              ].map((info, i) => (
                <div key={i} className="bg-cream-50 rounded-xl p-3 border border-cream-100">
                  <div className="flex items-center gap-1 text-burgundy/40 mb-1">{info.icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{info.label}</span></div>
                  <p className="text-sm font-semibold text-burgundy">{info.val}</p>
                </div>
              ))}
            </div>

            {request.reason && (
              <div className="flex items-start gap-3 bg-cream-50 rounded-xl px-4 py-3 border border-cream-100">
                <MessageSquare size={13} className="text-burgundy/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-burgundy/40 font-semibold uppercase tracking-wide mb-0.5">Reason</p>
                  <p className="text-sm text-burgundy/80">{request.reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Parent Info */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-6">
            <h3 className="font-display font-semibold text-burgundy mb-4 flex items-center gap-2">
              <Phone size={16} className="text-burgundy/60" /> Parent Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <User size={14} />, label: "Parent Name", val: request.parentName },
                { icon: <Phone size={14} />, label: "WhatsApp", val: request.parentWhatsApp },
                { icon: <Mail size={14} />, label: "Email", val: request.parentEmail },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-burgundy/8 rounded-xl flex items-center justify-center text-burgundy/60 flex-shrink-0 mt-0.5">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-burgundy/40 font-semibold uppercase tracking-wide">{info.label}</p>
                    <p className="text-sm font-medium text-burgundy">{info.val || "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            {request.parentResponse && (
              <div className="mt-4 bg-cream-50 rounded-xl p-4 border border-cream-100">
                <p className="text-[10px] text-burgundy/40 font-semibold uppercase tracking-wide mb-1">Parent Response</p>
                <p className="text-sm text-burgundy/80 italic">"{request.parentResponse}"</p>
              </div>
            )}
          </div>

          {/* AI Insight */}
          <AIInsightCard insight={aiInsight} loading={!aiInsight && loading} />

          {/* Risk */}
          {request.riskLevel && (
            <RiskIndicator level={request.riskLevel} score={request.riskScore} reasons={request.riskReasons || []} />
          )}

          {/* Admin Note */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
            <button
              onClick={() => setNoteOpen(!noteOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-burgundy mb-3"
            >
              <Edit3 size={14} /> Admin Note {noteOpen ? "▲" : "▼"}
            </button>
            {noteOpen && (
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Add a note for this request..."
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-burgundy/40 resize-none transition-all"
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Action Buttons */}
          {canAct && (
            <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
              <h3 className="font-display font-semibold text-burgundy mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAction("approve")}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all disabled:opacity-50 shadow-sm"
                >
                  {actionLoading === "approve" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle size={16} />}
                  Approve Request
                </button>
                <button
                  onClick={() => handleAction("manual-review")}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm"
                >
                  {actionLoading === "manual-review" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Eye size={16} />}
                  Flag for Review
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-all disabled:opacity-50 shadow-sm"
                >
                  {actionLoading === "reject" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <XCircle size={16} />}
                  Reject Request
                </button>
              </div>
              <p className="text-[10px] text-burgundy/30 text-center mt-3">
                All actions are logged in the audit trail
              </p>
            </div>
          )}

          {/* Final Status Banner */}
          {!canAct && (
            <div className={`rounded-2xl p-5 ${request.status === "approved" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                {request.status === "approved" ? <CheckCircle size={18} className="text-green-600" /> : <XCircle size={18} className="text-red-500" />}
                <p className={`font-semibold ${request.status === "approved" ? "text-green-700" : "text-red-600"}`}>
                  {request.status === "approved" ? "Request Approved" : "Request Rejected"}
                </p>
              </div>
              {request.adminNote && <p className="text-sm text-gray-600 mt-1">{request.adminNote}</p>}
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-100 p-5">
            <h3 className="font-display font-semibold text-burgundy mb-5">Activity Timeline</h3>
            <TimelineStep steps={timeline} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
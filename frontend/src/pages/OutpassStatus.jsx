// src/pages/OutpassStatus.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiMapPin, FiCalendar, FiUser,
  FiPhone, FiMail, FiRefreshCw, FiHome, FiHash,
  FiCheckCircle, FiXCircle, FiClock, FiFileText, FiArrowRight
} from "react-icons/fi";

import StudentLayout from "../components/StudentLayout";
import StatusBadge from "../components/StatusBadge";
import TimelineStep from "../components/TimelineStep";
import RiskIndicator from "../components/RiskIndicator";
import AIInsightCard from "../components/AIInsightCard";
import OutpassTable from "../components/OutpassTable";

function buildTimeline(req) {
  if (!req) return [];
  return [
    { label: "Request Submitted",  status: "completed", description: "Your outpass request was received.", timestamp: req.createdAt },
    { label: "Notifications Sent", status: "completed", description: "WhatsApp, voice call and email sent to parent" },
    {
      label: "Parent Verification",
      status: req.status === "approved" || req.status === "rejected" ? "completed" : "active",
      description:
        req.status === "approved" ? "Parent approved the request" :
        req.status === "rejected" ? "Parent rejected the request" :
        "Waiting for parent to respond via email",
    },
    {
      label: "Final Decision",
      status: req.status === "approved" ? "completed" : req.status === "rejected" ? "failed" : "pending",
      description:
        req.status === "approved" ? "Outpass Approved ✅" :
        req.status === "rejected" ? "Request Rejected ❌" : "Awaiting decision",
    },
  ];
}

function fmt(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBanner({ status }) {
  const map = {
    pending:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  icon: <FiClock size={18} className="text-amber-500"/>,       msg: "Your request is pending — waiting for parent to respond via email." },
    approved: { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  icon: <FiCheckCircle size={18} className="text-green-500"/>, msg: "Your outpass has been approved! You may proceed with your travel." },
    rejected: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    icon: <FiXCircle size={18} className="text-red-500"/>,        msg: "Your outpass was rejected. Please contact your hostel authority." },
  };
  const cfg = map[status] || map.pending;
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${cfg.bg} ${cfg.border} mb-6`}>
      {cfg.icon}
      <p className={`text-sm font-semibold ${cfg.text}`}>{cfg.msg}</p>
    </div>
  );
}

export default function OutpassStatus() {
  const { id } = useParams();
  const [requests,   setRequests]   = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState("");

  const fetchData = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { setError("Not logged in"); return; }

      if (id) {
        const res  = await fetch(`/api/outpass/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        // backend returns { outpass: {...} }
        setSelected(data.outpass || data);
      } else {
        const res  = await fetch("/api/outpass/my-passes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        // backend returns { outpasses: [...] }
        setRequests(data.outpasses || []);
      }
    } catch (err) {
      console.error("OutpassStatus error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  /* ── LIST VIEW ── */
  if (!id) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#C41E3A] rounded-full"/>
              <span className="text-[#C41E3A] text-sm font-semibold uppercase tracking-widest">Requests</span>
            </div>
            <h1 className="text-3xl font-black text-[#1a0a0a] font-['Playfair_Display']">Outpass History</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-[#e8d5c4] rounded-xl text-sm hover:bg-[#FFF8F0]"
          >
            <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""}/>
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            ⚠ {error}
          </div>
        )}

        <OutpassTable data={requests} loading={loading} showActions={false} />
      </StudentLayout>
    );
  }

  /* ── LOADING ── */
  if (loading) {
    return (
      <StudentLayout>
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"/>)}
        </div>
      </StudentLayout>
    );
  }

  if (!selected) {
    return (
      <StudentLayout>
        <div className="text-center py-16">
          <p className="text-[#5a3a3a]/60 font-semibold">{error || "Request not found"}</p>
          <Link to="/student/status" className="text-[#C41E3A] text-sm mt-2 inline-block">← Back</Link>
        </div>
      </StudentLayout>
    );
  }

  const timeline  = buildTimeline(selected);
  const departure  = selected.leaveDateFrom || selected.outpassDate;
  const returnDate = selected.leaveDateTo   || selected.returnDate;

  return (
    <StudentLayout>
      <Link to="/student/status" className="inline-flex items-center gap-2 text-sm text-[#5a3a3a]/70 hover:text-[#1a0a0a] mb-6">
        <FiArrowLeft size={14}/> Back to Requests
      </Link>

      <StatusBanner status={selected.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero card — same UI as original */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7a1414] via-[#9d1b1b] to-[#C41E3A] p-8 text-white shadow-2xl hover:scale-[1.01] transition">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "18px 18px" }}/>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70 mb-1">Outpass Request</p>
                <h2 className="text-3xl font-black flex items-center gap-2 font-['Playfair_Display']">
                  <FiMapPin/> {selected.destination}
                </h2>
                <p className="text-sm text-white/80 mt-2 max-w-lg">{selected.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleRefresh} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition">
                  <FiRefreshCw size={16} className={refreshing ? "animate-spin" : ""}/>
                </button>
                <StatusBadge status={selected.status} size="md"/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <InfoBox icon={FiCalendar} label="Departure" value={fmt(departure)}/>
              <InfoBox icon={FiCalendar} label="Return"    value={fmt(returnDate)}/>
              <InfoBox icon={FiUser}     label="Submitted" value={fmt(selected.createdAt)}/>
            </div>
          </div>

          {/* Request details card */}
          <div className="bg-white rounded-2xl border border-[#e8d5c4] p-6 shadow-sm">
            <h3 className="font-bold text-[#1a0a0a] mb-4 font-['Playfair_Display']">📋 Request Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailBox icon={FiUser}     label="Student Name" value={selected.studentName}/>
              <DetailBox icon={FiHash}     label="Student ID"   value={selected.studentId}/>
              <DetailBox icon={FiHome}     label="Hostel Room"  value={selected.hostelRoom}/>
              <DetailBox icon={FiMapPin}   label="Destination"  value={selected.destination}/>
              <DetailBox icon={FiCalendar} label="Departure"    value={fmt(departure)}/>
              <DetailBox icon={FiCalendar} label="Return"       value={fmt(returnDate)}/>
            </div>
            {selected.timeFrom && (
              <div className="mt-3 px-4 py-3 bg-[#FFF8F0] rounded-xl border border-[#f0e0d0] text-sm text-[#5a3a3a]">
                🕐 Time: <strong>{selected.timeFrom}</strong> → <strong>{selected.timeTo || "—"}</strong>
              </div>
            )}
          </div>

          {selected.aiInsight && <AIInsightCard insight={selected.aiInsight}/>}
          {selected.riskLevel  && <RiskIndicator level={selected.riskLevel} score={selected.riskScore} reasons={selected.riskReasons || []}/>}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#e8d5c4] p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-[#1a0a0a] mb-4 flex items-center gap-2">
              <FiCalendar className="text-[#C41E3A]"/> Approval Timeline
            </h3>
            <TimelineStep steps={timeline}/>
          </div>

          {/* Parent contact — FIX: use parentContact/parentRelation not parentName/parentWhatsApp */}
          {(selected.parentContact || selected.parentEmail) && (
            <div className="bg-gradient-to-br from-white to-[#FFF8F0] rounded-2xl border border-[#e8d5c4] p-6 shadow-sm">
              <h3 className="font-bold text-[#1a0a0a] mb-4 flex items-center gap-2">
                <FiUser className="text-[#C41E3A]"/> Parent Contact
              </h3>
              <ContactRow icon={FiUser}  label="Relation" value={selected.parentRelation}/>
              <ContactRow icon={FiPhone} label="WhatsApp" value={selected.parentContact}/>
              <ContactRow icon={FiMail}  label="Email"    value={selected.parentEmail}/>
            </div>
          )}

          {selected.adminNote && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-amber-800 mb-2 text-sm">⚠ Admin Note</h3>
              <p className="text-sm text-amber-700">{selected.adminNote}</p>
            </div>
          )}

        </div>
      </div>
    </StudentLayout>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition">
      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-2 shadow-inner">
        <Icon size={15}/>
      </div>
      <p className="text-xs text-white/70 tracking-wide">{label}</p>
      <p className="font-semibold text-sm mt-1">{value}</p>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] flex items-center justify-center">
        <Icon size={14} className="text-[#C41E3A]"/>
      </div>
      <div>
        <p className="text-xs text-[#5a3a3a]/60">{label}</p>
        <p className="text-sm font-semibold text-[#1a0a0a]">{value || "—"}</p>
      </div>
    </div>
  );
}

function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-[#FFF8F0] rounded-xl px-4 py-3 border border-[#f0e0d0]">
      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm border border-[#e8d5c4]">
        <Icon size={13} className="text-[#C41E3A]"/>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[#5a3a3a]/50 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-[#1a0a0a] truncate">{value || "—"}</p>
      </div>
    </div>
  );
}
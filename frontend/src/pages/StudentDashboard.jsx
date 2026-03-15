// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText, FiClock, FiCheckCircle, FiXCircle,
  FiPlus, FiArrowRight, FiMapPin, FiCalendar, FiBell
} from "react-icons/fi";
import StudentLayout from "../components/StudentLayout";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    fetch("/api/outpass/my-passes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // backend returns { outpasses: [...] }
        setRequests(data.outpasses || []);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    requests.length,
    pending:  requests.filter((r) => ["pending", "parent-pending", "processing"].includes(r.status)).length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const recent = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statCards = [
    { label: "Total Requests", value: stats.total,    icon: FiFileText,    color: "text-[#8B1A1A]", bg: "bg-[#8B1A1A]/10" },
    { label: "Pending",        value: stats.pending,  icon: FiClock,       color: "text-amber-600", bg: "bg-amber-100"    },
    { label: "Approved",       value: stats.approved, icon: FiCheckCircle, color: "text-green-600", bg: "bg-green-100"    },
    { label: "Rejected",       value: stats.rejected, icon: FiXCircle,     color: "text-red-600",   bg: "bg-red-100"      },
  ];

  return (
    <StudentLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-[#C41E3A] rounded-full"/>
          <span className="text-[#C41E3A] text-sm font-semibold uppercase tracking-widest">Dashboard</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1a0a0a] font-['Playfair_Display']">
              Welcome back {user?.name?.split(" ")[0] || "Student"}
            </h1>
            <p className="text-[#5a3a3a]/60 text-sm mt-1">
              {user?.collegeId} • {user?.hostel || "Hostel"} • Room {user?.roomNumber || "—"}
            </p>
          </div>
          <Link to="/student/request" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
            <FiPlus size={15}/> New Request
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-[#e8d5c4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#5a3a3a]/70 uppercase tracking-wide">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <Icon size={18} className={s.color}/>
                </div>
              </div>
              {loading
                ? <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"/>
                : <p className="text-3xl font-black text-[#1a0a0a]">{s.value}</p>
              }
            </div>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div className="bg-white border border-[#e8d5c4] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0]">
          <div>
            <h2 className="font-bold text-[#1a0a0a] text-lg font-['Playfair_Display']">Recent Requests</h2>
            <p className="text-xs text-[#5a3a3a]/60">Your latest outpass submissions</p>
          </div>
          <Link to="/student/status" className="flex items-center gap-1 text-sm font-semibold text-[#C41E3A]">
            View All <FiArrowRight size={14}/>
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center">
            <FiFileText size={38} className="mx-auto text-gray-300 mb-3"/>
            <p className="text-[#5a3a3a]/70 font-semibold">No outpass requests yet</p>
            <Link to="/student/request" className="inline-flex items-center gap-2 text-sm text-[#C41E3A] font-semibold mt-3">
              <FiPlus size={14}/> Create your first request
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recent.map((req) => (
              <Link key={req._id} to={`/student/status/${req._id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-[#FFF8F0] transition-all">
                <div className="w-10 h-10 bg-[#8B1A1A]/10 rounded-xl flex items-center justify-center">
                  <FiMapPin size={16} className="text-[#8B1A1A]"/>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1a0a0a] text-sm">{req.destination}</p>
                  <p className="text-xs text-[#5a3a3a]/60 flex items-center gap-1 mt-1">
                    <FiCalendar size={12}/>
                    {/* FIX: leaveDateFrom is the real DB field */}
                    {req.leaveDateFrom
                      ? new Date(req.leaveDateFrom).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <StatusBadge status={req.status}/>
                <FiArrowRight size={16} className="text-gray-300"/>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] rounded-2xl p-5 flex items-center gap-4 text-white shadow-md">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <FiBell size={18}/>
        </div>
        <div>
          <p className="font-semibold text-sm">Stay Informed</p>
          <p className="text-xs text-white/80">Parents receive WhatsApp, voice call and email alerts for every request.</p>
        </div>
      </div>
    </StudentLayout>
  );
}
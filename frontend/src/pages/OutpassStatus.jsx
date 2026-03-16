import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, AlertCircle,
  MapPin, Calendar, User, Home, ArrowLeft, RefreshCw
} from "lucide-react";
import StudentLayout from "../components/StudentLayout";

const StatusBadge = ({ status }) => {
  const map = {
    pending:         { icon: <Clock size={13} />,        bg: "#fef3c7", color: "#92400e", label: "Waiting for Parent" },
    "pending-admin": { icon: <AlertCircle size={13} />,  bg: "#ede9fe", color: "#5b21b6", label: "Under Admin Review" },
    approved:        { icon: <CheckCircle size={13} />,  bg: "#d1fae5", color: "#065f46", label: "Approved" },
    rejected:        { icon: <XCircle size={13} />,      bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
  };
  const s = map[status] || { icon: null, bg: "#f3f4f6", color: "#374151", label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700,
    }}>
      {s.icon} {s.label}
    </span>
  );
};

const Row = ({ label, value }) => (
  <div style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid #f9fafb" }}>
    <span style={{ minWidth: 150, fontSize: 13, color: "#9ca3af" }}>{label}</span>
    <span style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>{value || "—"}</span>
  </div>
);

function SingleOutpass({ id }) {
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetch_ = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`/api/outpass/my-passes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      const found = data.outpasses?.find(o => o._id === id);
      if (found) setOutpass(found);
      else setError("Outpass not found.");
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading…</div>;
  if (error)   return <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{error}</div>;
  if (!outpass) return null;

  const fmt = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <Link to="/student/status" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={14} /> Back to all requests
      </Link>

      {/* Header */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
              {outpass.destination}
            </h2>
            <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: 13 }}>
              Submitted {fmt(outpass.createdAt)}
            </p>
          </div>
          <StatusBadge status={outpass.status} />
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#8B1A1A" }}>Approval Timeline</h3>
        {[
          {
            label: "Request Submitted",
            done: true,
            time: fmt(outpass.createdAt),
            color: "#16a34a",
          },
          {
            label: "Parent Notified (Email + WhatsApp)",
            done: true,
            time: fmt(outpass.createdAt),
            color: "#16a34a",
          },
          {
            label: outpass.parentDecision
              ? `Parent ${outpass.parentDecision === "approved" ? "Approved ✅" : "Rejected ❌"}`
              : "Waiting for Parent Response",
            done: !!outpass.parentDecision,
            time: outpass.verifiedAt ? fmt(outpass.verifiedAt) : "Pending",
            color: outpass.parentDecision === "approved" ? "#16a34a" : outpass.parentDecision === "rejected" ? "#dc2626" : "#f59e0b",
          },
          {
            label: outpass.status === "approved"
              ? "Admin Approved ✅"
              : outpass.status === "rejected"
              ? "Admin Rejected ❌"
              : "Admin Review",
            done: ["approved", "rejected"].includes(outpass.status),
            time: outpass.adminDecidedAt ? fmt(outpass.adminDecidedAt) : "Pending",
            color: outpass.status === "approved" ? "#16a34a" : outpass.status === "rejected" ? "#dc2626" : "#9ca3af",
          },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: step.done ? step.color : "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {step.done
                  ? <CheckCircle size={14} color="#fff" />
                  : <Clock size={14} color="#9ca3af" />}
              </div>
              {i < 3 && <div style={{ width: 2, flex: 1, background: "#f3f4f6", margin: "4px 0" }} />}
            </div>
            <div style={{ paddingTop: 4 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: step.done ? "#111827" : "#9ca3af" }}>
                {step.label}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{step.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Parent Verification Result */}
      {outpass.parentDecision && (
        <div style={{
          background: outpass.parentDecision === "approved" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${outpass.parentDecision === "approved" ? "#bbf7d0" : "#fecaca"}`,
          borderRadius: 16, padding: 20, marginBottom: 16,
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#8B1A1A" }}>
            Parent Verification
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {outpass.parentDecision === "approved"
              ? <CheckCircle size={18} color="#16a34a" />
              : <XCircle size={18} color="#dc2626" />}
            <span style={{ fontWeight: 700, fontSize: 14, color: outpass.parentDecision === "approved" ? "#16a34a" : "#dc2626" }}>
              Your parent has {outpass.parentDecision} this request
            </span>
          </div>
          {outpass.verifiedAt && (
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              Verified on {new Date(outpass.verifiedAt).toLocaleString("en-IN")}
            </p>
          )}
          {/* Show parent photo thumbnail to student */}
          {outpass.parentPhotoPath && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
                Parent selfie captured
              </p>
              <img
                src={outpass.parentPhotoPath}
                alt="Parent verification"
                style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", border: "2px solid #e5e7eb" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Admin Decision */}
      {["approved", "rejected"].includes(outpass.status) && (
        <div style={{
          background: outpass.status === "approved" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${outpass.status === "approved" ? "#bbf7d0" : "#fecaca"}`,
          borderRadius: 16, padding: 20, marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: outpass.status === "approved" ? "#16a34a" : "#dc2626" }}>
            {outpass.status === "approved" ? "✅ Outpass Approved!" : "❌ Outpass Rejected"}
          </p>
          {outpass.adminNote && (
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>Admin note: {outpass.adminNote}</p>
          )}
        </div>
      )}

      {/* Trip details */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#8B1A1A" }}>Trip Details</h3>
        <Row label="Destination"  value={outpass.destination} />
        <Row label="Reason"       value={outpass.reason} />
        <Row label="Departure"    value={fmt(outpass.leaveDateFrom)} />
        <Row label="Return"       value={fmt(outpass.leaveDateTo)} />
        <Row label="Hostel Room"  value={outpass.hostelRoom} />
        <Row label="Parent"       value={`${outpass.parentRelation} · ${outpass.parentContact}`} />
      </div>
    </div>
  );
}

function AllOutpasses() {
  const [outpasses, setOutpasses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("/api/outpass/my-passes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      setOutpasses(data.outpasses || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fmt = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—";

  const statusColor = {
    pending:         "#f59e0b",
    "pending-admin": "#7c3aed",
    approved:        "#16a34a",
    rejected:        "#dc2626",
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>My Outpass Requests</h2>
        <button
          onClick={() => { setRefreshing(true); load(); }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 13, color: "#6b7280" }}
        >
          <RefreshCw size={13} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading…</div>
      ) : outpasses.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 48, textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: 15 }}>No outpass requests yet.</p>
          <Link to="/student/request" style={{ display: "inline-block", marginTop: 12, padding: "10px 20px", background: "#8B1A1A", color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            Apply Now
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {outpasses.map(o => (
            <Link key={o._id} to={`/student/status/${o._id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "box-shadow 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111827" }}>{o.destination}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>
                    {fmt(o.leaveDateFrom)} → {fmt(o.leaveDateTo)} · {o.reason?.slice(0, 40)}
                  </p>
                  {/* Parent decision hint */}
                  {o.parentDecision && (
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: statusColor[o.parentDecision === "approved" ? "approved" : "rejected"], fontWeight: 600 }}>
                      Parent: {o.parentDecision}
                    </p>
                  )}
                </div>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function OutpassStatus() {
  const { id } = useParams();
  return (
    <StudentLayout>
      <div style={{ padding: "8px 0" }}>
        {id ? <SingleOutpass id={id} /> : <AllOutpasses />}
      </div>
    </StudentLayout>
  );
}
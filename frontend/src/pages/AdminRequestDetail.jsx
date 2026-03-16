import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const Badge = ({ status }) => {
  const map = {
    pending:       { bg: "#fef3c7", color: "#92400e", label: "⏳ Pending Parent" },
    "pending-admin": { bg: "#ede9fe", color: "#5b21b6", label: "🔍 Pending Admin" },
    approved:      { bg: "#d1fae5", color: "#065f46", label: "✅ Approved" },
    rejected:      { bg: "#fee2e2", color: "#991b1b", label: "❌ Rejected" },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#374151", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
      {s.label}
    </span>
  );
};

const Row = ({ label, value }) => (
  <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
    <span style={{ minWidth: 160, fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>{value || "—"}</span>
  </div>
);

export default function AdminRequestDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [outpass,  setOutpass]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [deciding, setDeciding] = useState(false);
  const [note,     setNote]     = useState("");
  const [error,    setError]    = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`/api/outpass/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const found = data.outpasses?.find((o) => o._id === id);
        if (found) setOutpass(found);
        else setError("Outpass not found.");
      })
      .catch(() => setError("Failed to load outpass."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecision = async (decision) => {
    setDeciding(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`/api/outpass/admin/decision/${id}`, {
        method:  "PATCH",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({ decision, adminNote: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Decision failed");
      setOutpass(data.outpass);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeciding(false);
    }
  };

  if (loading) return (
    <AdminLayout title="Request Detail">
      <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading…</div>
    </AdminLayout>
  );

  if (error && !outpass) return (
    <AdminLayout title="Request Detail">
      <div style={{ textAlign: "center", padding: 60, color: "#dc2626" }}>{error}</div>
    </AdminLayout>
  );

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <AdminLayout title="Request Detail">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Back */}
        <button
          onClick={() => navigate("/admin/requests")}
          style={{ marginBottom: 24, background: "none", border: "1px solid #e5e7eb", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#6b7280" }}
        >
          ← Back to Requests
        </button>

        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>{outpass.studentName}</h2>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
                {outpass.studentId} · Room {outpass.hostelRoom}
              </p>
            </div>
            <Badge status={outpass.status} />
          </div>
        </div>

        {/* Trip Details */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#8B1A1A" }}>Trip Details</h3>
          <Row label="Destination"   value={outpass.destination} />
          <Row label="Reason"        value={outpass.reason} />
          <Row label="Departure"     value={fmt(outpass.leaveDateFrom)} />
          <Row label="Return"        value={fmt(outpass.leaveDateTo)} />
          <Row label="Time"          value={[outpass.timeFrom, outpass.timeTo].filter(Boolean).join(" → ")} />
          <Row label="Submitted On"  value={fmt(outpass.createdAt)} />
        </div>

        {/* Parent Info */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#8B1A1A" }}>Parent Contact</h3>
          <Row label="Relation"      value={outpass.parentRelation} />
          <Row label="WhatsApp"      value={outpass.parentContact} />
          <Row label="Email"         value={outpass.parentEmail} />
        </div>

        {/* Parent Verification — only shown after parent responds */}
        {outpass.parentDecision && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#8B1A1A" }}>Parent Verification</h3>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{
                background: outpass.parentDecision === "approved" ? "#d1fae5" : "#fee2e2",
                color:      outpass.parentDecision === "approved" ? "#065f46" : "#991b1b",
                padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
              }}>
                Parent {outpass.parentDecision === "approved" ? "✅ Approved" : "❌ Rejected"}
              </span>
              {outpass.verifiedAt && (
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                  {new Date(outpass.verifiedAt).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Photo + Video grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {outpass.parentPhotoPath && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Verification Photo
                    </p>

                    <img
                      src={outpass.parentPhotoPath}
                      alt="Parent photo"
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        objectFit: "cover",
                        maxHeight: 220
                      }}
                    />

                    <a
                      href={outpass.parentPhotoPath}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        marginTop: 6,
                        fontSize: 12,
                        color: "#8B1A1A",
                        textDecoration: "none"
                      }}
                    >
                      🔗 Open full photo
                    </a>
                  </div>
                )}

              {outpass.parentVideoPath && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Video Statement
              </p>

              <video
                src={outpass.parentVideoPath}
                controls
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  maxHeight: 220
                }}
              />

              <a
                href={outpass.parentVideoPath}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  marginTop: 6,
                  fontSize: 12,
                  color: "#8B1A1A",
                  textDecoration: "none"
                }}
              >
                🔗 Open full video
              </a>
            </div>
          )}
            </div>
          </div>
        )}

        {/* Admin Final Decision */}
        {outpass.status === "pending-admin" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#8B1A1A" }}>Admin Decision</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
              Review the parent's photo and video above, then make your final decision.
            </p>

            <textarea
              placeholder="Optional note (e.g. 'Verified — face matches', 'Suspicious response')"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, resize: "vertical", marginBottom: 14, boxSizing: "border-box" }}
            />

            {error && (
              <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleDecision("approved")}
                disabled={deciding}
                style={{ flex: 1, padding: "12px 0", background: deciding ? "#d1d5db" : "#16a34a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: deciding ? "not-allowed" : "pointer" }}
              >
                ✅ Final Approve
              </button>
              <button
                onClick={() => handleDecision("rejected")}
                disabled={deciding}
                style={{ flex: 1, padding: "12px 0", background: deciding ? "#d1d5db" : "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: deciding ? "not-allowed" : "pointer" }}
              >
                ❌ Final Reject
              </button>
            </div>
          </div>
        )}

        {/* Final decision already made */}
        {["approved", "rejected"].includes(outpass.status) && (
          <div style={{
            background: outpass.status === "approved" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${outpass.status === "approved" ? "#bbf7d0" : "#fecaca"}`,
            borderRadius: 16, padding: 20, marginBottom: 20,
          }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: outpass.status === "approved" ? "#16a34a" : "#dc2626" }}>
              {outpass.status === "approved" ? "✅ Final Decision: APPROVED" : "❌ Final Decision: REJECTED"}
            </p>
            {outpass.adminNote && (
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>
                Admin note: {outpass.adminNote}
              </p>
            )}
            {outpass.adminDecidedAt && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>
                {new Date(outpass.adminDecidedAt).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
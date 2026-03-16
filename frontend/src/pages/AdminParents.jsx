import { useEffect, useState } from "react";
import { UserPlus, Trash2, Phone, Mail, User, RefreshCw, Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function AdminParents() {
  const [parents,   setParents]   = useState([]);
  const [students,  setStudents]  = useState([]); // enrolled students
  const [loading,   setLoading]   = useState(true);
  const [adding,    setAdding]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [searchQ,   setSearchQ]   = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    relation: "Father",
    studentName: "", studentId: "",
    linkedStudentId: "", // MongoDB _id of the student
  });

  const token = () => localStorage.getItem("token");

  // Load parents
  const loadParents = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/parents", {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      setParents(data.parents || []);
    } catch {
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load enrolled students (from outpasses or user list)
  const loadStudents = async () => {
    try {
      // Fetch all outpasses to get unique students
      const res  = await fetch("/api/outpass/admin/all", {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      const outpasses = data.outpasses || [];

      // Deduplicate by studentId
      const seen = new Set();
      const unique = [];
      outpasses.forEach(o => {
        if (!seen.has(o.studentId)) {
          seen.add(o.studentId);
          unique.push({
            _id:         o.student?._id || o.student,
            studentName: o.studentName,
            studentId:   o.studentId,
            hostelRoom:  o.hostelRoom,
            email:       o.student?.email || "",
          });
        }
      });
      setStudents(unique);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => {
    loadParents();
    loadStudents();
  }, []);

  // When admin selects a student, auto-fill name and ID
  const handleStudentSelect = (e) => {
    const selectedId = e.target.value;
    const student = students.find(s => s._id === selectedId || s.studentId === selectedId);
    if (student) {
      setForm(f => ({
        ...f,
        linkedStudentId: student._id,
        studentName:     student.studentName,
        studentId:       student.studentId,
      }));
    } else {
      setForm(f => ({ ...f, linkedStudentId: "", studentName: "", studentId: "" }));
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.phone || !form.relation) {
      alert("Please fill all required fields (Name, Email, Phone, Relation)");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/parents", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token()}`,
        },
        body: JSON.stringify({
          name:        form.name,
          email:       form.email,
          phone:       form.phone,
          relation:    form.relation,
          studentName: form.studentName,
          studentId:   form.studentId,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message);
      }
      setForm({ name: "", email: "", phone: "", relation: "Father", studentName: "", studentId: "", linkedStudentId: "" });
      setShowForm(false);
      loadParents();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this parent from the system?")) return;
    try {
      await fetch(`/api/parents/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      setParents(p => p.filter(x => x._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const filtered = parents.filter(p =>
    p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQ.toLowerCase()) ||
    (p.studentName || "").toLowerCase().includes(searchQ.toLowerCase()) ||
    (p.studentId   || "").toLowerCase().includes(searchQ.toLowerCase())
  );

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1px solid #e5e7eb", fontSize: 13,
    background: "#FFF8F0", boxSizing: "border-box",
    outline: "none",
  };

  return (
    <AdminLayout title="Parents" subtitle="Manage parents linked to enrolled students">
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
              Registered Parents
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: "#9ca3af" }}>
                ({parents.length} total)
              </span>
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Add a parent for each enrolled student. Only registered parents can approve outpass requests.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { loadParents(); loadStudents(); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 13 }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={() => setShowForm(s => !s)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#8B1A1A", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}
            >
              <UserPlus size={15} /> Add Parent
            </button>
          </div>
        </div>

        {/* ── Add Parent Form ── */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#8B1A1A" }}>
              Add New Parent
            </h3>
            <p style={{ margin: "0 0 18px", fontSize: 13, color: "#6b7280" }}>
              Link a parent to a specific enrolled student. This parent will receive outpass approval notifications.
            </p>

            {/* Student selector */}
            <div style={{ marginBottom: 16, padding: "14px 16px", background: "#FFF8F0", borderRadius: 12, border: "1px solid #e8d5c4" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8B1A1A", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Select Enrolled Student *
              </label>
              {students.length === 0 ? (
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                  No students found. Students appear here after submitting an outpass request.
                </p>
              ) : (
                <select
                  onChange={handleStudentSelect}
                  defaultValue=""
                  style={{ ...inputStyle, background: "#fff" }}
                >
                  <option value="" disabled>— Choose a student —</option>
                  {students.map(s => (
                    <option key={s.studentId} value={s._id}>
                      {s.studentName} ({s.studentId}) — Room {s.hostelRoom}
                    </option>
                  ))}
                </select>
              )}
              {form.studentName && (
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                  ✓ Selected: {form.studentName} ({form.studentId})
                </p>
              )}
            </div>

            {/* Parent details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>Parent Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>Relation *</label>
                <select
                  value={form.relation}
                  onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}
                  style={inputStyle}
                >
                  {["Father", "Mother", "Guardian", "Sibling"].map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>Email Address *</label>
                <input
                  type="email"
                  placeholder="parent@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>WhatsApp Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  maxLength={10}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: "", email: "", phone: "", relation: "Father", studentName: "", studentId: "", linkedStudentId: "" });
                }}
                style={{ padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={adding || !form.name || !form.email || !form.phone}
                style={{
                  padding: "9px 22px",
                  background: adding || !form.name || !form.email || !form.phone ? "#9ca3af" : "#8B1A1A",
                  color: "#fff", border: "none", borderRadius: 10,
                  cursor: adding || !form.name ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <UserPlus size={14} />
                {adding ? "Adding…" : "Add Parent"}
              </button>
            </div>
          </div>
        )}

        {/* ── Search bar ── */}
        {parents.length > 0 && (
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search by parent name, email, or student..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 36, background: "#fff", border: "1px solid #e5e7eb" }}
            />
          </div>
        )}

        {/* ── Parents list ── */}
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#8B1A1A", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 56, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFF8F0", border: "1px solid #e8d5c4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <User size={24} color="#C41E3A" />
            </div>
            <p style={{ color: "#374151", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>
              {searchQ ? "No parents match your search" : "No parents added yet"}
            </p>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
              {searchQ
                ? "Try a different search term"
                : 'Click "Add Parent" to register a parent for an enrolled student.'}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(p => (
              <div
                key={p._id}
                style={{
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #f3f4f6", padding: "16px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B1A1A, #C41E3A)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "#fff", fontSize: 17, flexShrink: 0,
                  }}>
                    {p.name[0].toUpperCase()}
                  </div>

                  <div>
                    {/* Name + relation */}
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
                      {p.name}
                      <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12, marginLeft: 6 }}>
                        ({p.relation})
                      </span>
                    </p>

                    {/* Contact */}
                    <div style={{ display: "flex", gap: 14, marginTop: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 3 }}>
                        <Mail size={11} /> {p.email}
                      </span>
                      <span style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 3 }}>
                        <Phone size={11} /> {p.phone}
                      </span>
                    </div>

                    {/* Linked student */}
                    {p.studentName && (
                      <div style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5, background: "#FFF8F0", border: "1px solid #e8d5c4", borderRadius: 6, padding: "3px 8px" }}>
                        <User size={10} color="#8B1A1A" />
                        <span style={{ fontSize: 11, color: "#8B1A1A", fontWeight: 600 }}>
                          Student: {p.studentName}
                          {p.studentId && <span style={{ fontWeight: 400, color: "#9ca3af" }}> ({p.studentId})</span>}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(p._id)}
                  title="Remove parent"
                  style={{ padding: "7px 10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}
                >
                  <Trash2 size={14} color="#dc2626" />
                </button>
              </div>
            ))}
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </AdminLayout>
  );
}
// src/pages/AdminParents.jsx
import { useEffect, useState } from "react";
import {
  UserPlus, Trash2, Phone, Mail, User,
  RefreshCw, Search, ChevronDown, ChevronUp,
  Users, GraduationCap, Home,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

/* ─── Design tokens ─────────────────────────────────────────────── */
const C = {
  crimson:     "#8B1A1A",
  crimsonDeep: "#5c0d1a",
  ink:         "#1a0608",
  inkMid:      "#3d0a10",
  surface:     "#ffffff",
  bg:          "#f4ede4",
  border:      "#ede8e3",
  borderMid:   "rgba(139,26,26,0.10)",
  muted:       "#a08070",
  mutedLight:  "#c4a89a",
  green:       "#059669", greenBg: "#ecfdf5", greenBorder: "#a7f3d0",
  red:         "#dc2626", redBg:   "#fef2f2", redBorder:   "#fecaca",
  amber:       "#d97706", amberBg: "#fffbeb", amberBorder: "#fde68a",
};

const relationColors = {
  Father:   { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  Mother:   { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Guardian: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Sibling:  { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
};

const avatarPalette = [
  { bg: "#fdf2f2", color: "#8B1A1A" },
  { bg: "#eff6ff", color: "#1d4ed8" },
  { bg: "#f0fdf4", color: "#15803d" },
  { bg: "#f5f3ff", color: "#7e22ce" },
  { bg: "#fff7ed", color: "#c2410c" },
  { bg: "#ecfeff", color: "#0e7490" },
];

/* ─── Styles ────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .ap-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ap-root { font-family: 'Sora', sans-serif; color: ${C.ink}; }

  /* ── Topbar ── */
  .ap-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px; flex-wrap: wrap; gap: 12px;
  }
  .ap-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800; font-size: 20px;
    color: ${C.inkMid}; letter-spacing: -0.02em; line-height: 1;
  }
  .ap-sub { font-size: 12px; color: ${C.muted}; margin-top: 4px; }

  /* ── Buttons ── */
  .ap-btn-ghost {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 16px; font-size: 12.5px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 10px; cursor: pointer; color: ${C.muted};
    transition: all 0.16s;
  }
  .ap-btn-ghost:hover { border-color: ${C.crimson}; color: ${C.crimson}; }

  .ap-btn-primary {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 18px; font-size: 12.5px; font-weight: 700;
    font-family: 'Sora', sans-serif;
    background: ${C.crimsonDeep}; color: #fff;
    border: none; border-radius: 10px; cursor: pointer;
    box-shadow: 0 3px 10px rgba(92,13,26,0.28);
    transition: all 0.16s;
  }
  .ap-btn-primary:hover { background: ${C.crimson}; box-shadow: 0 5px 16px rgba(92,13,26,0.36); transform: translateY(-1px); }

  /* ── Search ── */
  .ap-search-wrap { position: relative; margin-bottom: 20px; }
  .ap-search-wrap input {
    width: 100%; padding: 10px 16px 10px 40px;
    font-size: 12.5px; font-family: 'Sora', sans-serif;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 11px; outline: none; color: ${C.inkMid};
    transition: border-color 0.16s, box-shadow 0.16s;
  }
  .ap-search-wrap input:focus {
    border-color: ${C.crimson};
    box-shadow: 0 0 0 3px rgba(139,26,26,0.07);
  }
  .ap-search-wrap input::placeholder { color: ${C.mutedLight}; }
  .ap-search-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%); color: ${C.mutedLight}; pointer-events: none;
  }

  /* ── Add Form ── */
  .ap-form-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 18px; padding: 24px;
    margin-bottom: 22px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .ap-form-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800; font-size: 16px; color: ${C.inkMid};
    letter-spacing: -0.01em; margin-bottom: 4px;
  }
  .ap-form-sub { font-size: 12px; color: ${C.muted}; margin-bottom: 20px; }

  .ap-student-select-box {
    padding: 16px; background: #faf8f6;
    border: 1.5px solid ${C.border}; border-radius: 13px; margin-bottom: 18px;
  }
  .ap-field-label {
    display: block; font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: ${C.muted}; margin-bottom: 6px;
    font-family: 'Sora', sans-serif;
  }
  .ap-input {
    width: 100%; padding: 10px 13px;
    font-size: 12.5px; font-family: 'Sora', sans-serif;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 10px; outline: none; color: ${C.inkMid};
    transition: border-color 0.16s, box-shadow 0.16s;
  }
  .ap-input:focus {
    border-color: ${C.crimson};
    box-shadow: 0 0 0 3px rgba(139,26,26,0.07);
  }
  .ap-input::placeholder { color: ${C.mutedLight}; }
  .ap-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .ap-form-actions {
    display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;
  }
  .ap-btn-cancel {
    padding: 9px 18px; font-size: 12.5px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 10px; cursor: pointer; color: ${C.muted};
    transition: all 0.16s;
  }
  .ap-btn-cancel:hover { border-color: ${C.crimson}; color: ${C.crimson}; }

  .ap-btn-submit {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 22px; font-size: 12.5px; font-weight: 700;
    font-family: 'Sora', sans-serif;
    border: none; border-radius: 10px; cursor: pointer;
    transition: all 0.16s;
  }
  .ap-btn-submit.enabled {
    background: ${C.crimsonDeep}; color: #fff;
    box-shadow: 0 3px 10px rgba(92,13,26,0.28);
  }
  .ap-btn-submit.enabled:hover { background: ${C.crimson}; transform: translateY(-1px); }
  .ap-btn-submit.disabled { background: #e4ddd7; color: ${C.mutedLight}; cursor: not-allowed; }

  /* ── Student group card ── */
  .ap-student-group {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 18px; overflow: hidden;
    margin-bottom: 14px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: box-shadow 0.20s;
  }
  .ap-student-group:hover { box-shadow: 0 4px 16px rgba(139,26,26,0.08); }

  .ap-student-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; cursor: pointer;
    border-bottom: 1.5px solid transparent;
    transition: background 0.14s, border-color 0.14s;
    user-select: none;
  }
  .ap-student-header:hover { background: #faf8f6; }
  .ap-student-header.open { border-bottom-color: ${C.border}; background: #faf8f6; }

  .ap-student-avatar {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800; flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ap-student-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700; color: ${C.inkMid};
    line-height: 1;
  }
  .ap-student-meta {
    display: flex; align-items: center; gap: 10px; margin-top: 4px; flex-wrap: wrap;
  }
  .ap-student-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 20px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'Sora', sans-serif;
  }
  .ap-parent-count {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
    font-family: 'Sora', sans-serif;
    background: #f5f0eb; color: ${C.muted};
    border: 1.5px solid ${C.border};
    flex-shrink: 0;
  }
  .ap-chevron { color: ${C.muted}; transition: transform 0.2s; }
  .ap-chevron.open { transform: rotate(180deg); }

  /* ── Parent rows inside group ── */
  .ap-parents-list { padding: 6px 12px 12px; }

  .ap-parent-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 12px; border-radius: 12px;
    transition: background 0.13s;
    gap: 12px;
  }
  .ap-parent-row:hover { background: #fdf9f7; }

  .ap-parent-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ap-parent-name {
    font-size: 13px; font-weight: 600; color: ${C.inkMid};
    line-height: 1; margin-bottom: 4px;
  }
  .ap-contact-row {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  }
  .ap-contact-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 11.5px; color: ${C.muted};
  }

  .ap-relation-tag {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 20px;
    font-size: 10.5px; font-weight: 700;
    font-family: 'Sora', sans-serif;
  }

  .ap-delete-btn {
    width: 32px; height: 32px; border-radius: 9px;
    background: ${C.redBg}; border: 1.5px solid ${C.redBorder};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; color: ${C.red};
    transition: all 0.15s;
  }
  .ap-delete-btn:hover { background: ${C.red}; color: #fff; border-color: ${C.red}; transform: scale(1.05); }

  /* ── Empty / Loading ── */
  .ap-empty {
    background: ${C.surface}; border: 1.5px solid ${C.border};
    border-radius: 18px; padding: 60px 20px;
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .ap-empty-icon {
    width: 56px; height: 56px; border-radius: 18px;
    background: #f5f0eb; border: 1.5px solid ${C.border};
    display: flex; align-items: center; justify-content: center;
    color: ${C.mutedLight};
  }
  .ap-empty-title { font-size: 15px; font-weight: 700; color: ${C.inkMid}; }
  .ap-empty-sub   { font-size: 12px; color: ${C.muted}; max-width: 280px; text-align: center; line-height: 1.6; }

  .ap-loader {
    width: 28px; height: 28px;
    border: 3px solid ${C.border};
    border-top-color: ${C.crimson};
    border-radius: 50%;
    animation: apSpin 0.9s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes apSpin { to { transform: rotate(360deg); } }
  @keyframes apSpin2 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .ap-spin { animation: apSpin2 0.9s linear infinite; }

  /* ── Stats bar ── */
  .ap-stats-bar {
    display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .ap-stat-chip {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 12px;
    background: ${C.surface}; border: 1.5px solid ${C.border};
    font-family: 'Sora', sans-serif;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .ap-stat-val {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px; font-weight: 800; color: ${C.inkMid};
    line-height: 1;
  }
  .ap-stat-label { font-size: 11px; color: ${C.muted}; font-weight: 500; }

  /* selected student confirmed */
  .ap-selected-student {
    display: flex; align-items: center; gap: 6px;
    margin-top: 8px; padding: 6px 10px;
    background: ${C.greenBg}; border: 1.5px solid ${C.greenBorder};
    border-radius: 8px;
    font-size: 11.5px; font-weight: 600; color: ${C.green};
    font-family: 'Sora', sans-serif;
  }
`;

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Group parents by their linked student */
function groupByStudent(parents) {
  const map = {};
  parents.forEach(p => {
    const key = p.studentId || "unlinked";
    if (!map[key]) {
      map[key] = {
        studentId:   p.studentId   || "—",
        studentName: p.studentName || "Unlinked Parents",
        parents: [],
      };
    }
    map[key].parents.push(p);
  });
  // Sort: linked first, unlinked last
  return Object.values(map).sort((a, b) => {
    if (a.studentId === "—") return 1;
    if (b.studentId === "—") return -1;
    return a.studentName.localeCompare(b.studentName);
  });
}

/* ─── Student Group Card ────────────────────────────────────────── */
function StudentGroup({ group, idx, onDelete }) {
  const [open, setOpen] = useState(true);
  const av = avatarPalette[idx % avatarPalette.length];

  return (
    <div className="ap-student-group">
      {/* Header */}
      <div
        className={`ap-student-header ${open ? "open" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
          {/* Student avatar */}
          <div className="ap-student-avatar" style={{ background: av.bg, color: av.color, border: `1.5px solid ${av.color}22` }}>
            {group.studentName[0]?.toUpperCase()}
          </div>

          <div>
            <p className="ap-student-name">{group.studentName}</p>
            <div className="ap-student-meta">
              {group.studentId !== "—" && (
                <span className="ap-student-chip" style={{ background: "#f5f0eb", color: "#7a4a3a", border: "1.5px solid #e4ddd7" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                    {group.studentId}
                  </span>
                </span>
              )}
              <span className="ap-student-chip" style={{ background: "#f0fdf4", color: "#059669", border: "1.5px solid #a7f3d0" }}>
                <Users size={10} />
                {group.parents.length} parent{group.parents.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="ap-parent-count">
            <Users size={11} />
            {group.parents.length}
          </div>
          <ChevronDown size={16} className={`ap-chevron ${open ? "open" : ""}`} />
        </div>
      </div>

      {/* Parents list */}
      {open && (
        <div className="ap-parents-list">
          {group.parents.map((p, pi) => {
            const pav = avatarPalette[(idx * 3 + pi + 1) % avatarPalette.length];
            const relCfg = relationColors[p.relation] || relationColors.Guardian;
            return (
              <div key={p._id} className="ap-parent-row">
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                  {/* Parent avatar */}
                  <div className="ap-parent-avatar" style={{ background: pav.bg, color: pav.color, border: `1.5px solid ${pav.color}22` }}>
                    {p.name[0]?.toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                      <p className="ap-parent-name">{p.name}</p>
                      <span className="ap-relation-tag" style={{ background: relCfg.bg, color: relCfg.color, border: `1.5px solid ${relCfg.border}` }}>
                        {p.relation}
                      </span>
                    </div>
                    <div className="ap-contact-row">
                      <span className="ap-contact-item">
                        <Mail size={11} style={{ color: "#c4a89a" }} />
                        {p.email}
                      </span>
                      <span className="ap-contact-item">
                        <Phone size={11} style={{ color: "#c4a89a" }} />
                        {p.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="ap-delete-btn" title="Remove parent" onClick={() => onDelete(p._id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AdminParents() {
  const [parents,  setParents]  = useState([]);
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [adding,   setAdding]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQ,  setSearchQ]  = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    relation: "Father",
    studentName: "", studentId: "",
    linkedStudentId: "",
  });

  const token = () => localStorage.getItem("token");

  const loadParents = async () => {
    try {
      const res  = await fetch("/api/parents", { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setParents(data.parents || []);
    } catch { setParents([]); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const loadStudents = async () => {
    try {
      const res  = await fetch("/api/outpass/admin/all", { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      const outpasses = data.outpasses || [];
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
    } catch { setStudents([]); }
  };

  useEffect(() => { loadParents(); loadStudents(); }, []);

  const handleRefresh = () => { setRefreshing(true); setLoading(true); loadParents(); loadStudents(); };

  const handleStudentSelect = (e) => {
    const selectedId = e.target.value;
    const student = students.find(s => s._id === selectedId || s.studentId === selectedId);
    if (student) {
      setForm(f => ({ ...f, linkedStudentId: student._id, studentName: student.studentName, studentId: student.studentId }));
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
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, relation: form.relation, studentName: form.studentName, studentId: form.studentId }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
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
      await fetch(`/api/parents/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
      setParents(p => p.filter(x => x._id !== id));
    } catch { alert("Failed to delete"); }
  };

  /* ── derived data ── */
  const filtered = parents.filter(p => {
    const q = searchQ.toLowerCase();
    return (
      p.name.toLowerCase().includes(q)              ||
      p.email.toLowerCase().includes(q)             ||
      (p.studentName || "").toLowerCase().includes(q) ||
      (p.studentId   || "").toLowerCase().includes(q)
    );
  });

  const groups        = groupByStudent(filtered);
  const linkedCount   = parents.filter(p => p.studentId).length;
  const unlinkedCount = parents.filter(p => !p.studentId).length;
  const canSubmit     = form.name && form.email && form.phone && !adding;

  return (
    <>
      <style>{styles}</style>
      <AdminLayout title="Parents" subtitle="Manage parents linked to enrolled students">
        <div className="ap-root" style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* ── Top bar ── */}
          <div className="ap-topbar">
            <div>
              <h2 className="ap-title">
                Registered Parents
                <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: "#c4a89a" }}>
                  ({parents.length} total)
                </span>
              </h2>
              <p className="ap-sub">
                Add parents for enrolled students. Only registered parents can approve outpass requests.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="ap-btn-ghost" onClick={handleRefresh} disabled={refreshing} style={{ opacity: refreshing ? 0.55 : 1 }}>
                <RefreshCw size={13} className={refreshing ? "ap-spin" : ""} />
                Refresh
              </button>
              <button className="ap-btn-primary" onClick={() => setShowForm(s => !s)}>
                <UserPlus size={15} />
                {showForm ? "Cancel" : "Add Parent"}
              </button>
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="ap-stats-bar">
            {[
              { val: parents.length,  label: "Total Parents",    icon: <Users size={14} style={{ color: "#8B1A1A" }} />, bg: "#fdf5f5" },
              { val: students.length, label: "Enrolled Students",icon: <GraduationCap size={14} style={{ color: "#1d4ed8" }} />, bg: "#eff6ff" },
              { val: linkedCount,     label: "Linked",           icon: <User size={14} style={{ color: "#059669" }} />, bg: "#ecfdf5" },
              { val: groups.length,   label: "Student Groups",   icon: <Home size={14} style={{ color: "#d97706" }} />, bg: "#fffbeb" },
            ].map(s => (
              <div key={s.label} className="ap-stat-chip" style={{ background: s.bg }}>
                {s.icon}
                <div>
                  <div className="ap-stat-val">{s.val}</div>
                  <div className="ap-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Add Parent Form ── */}
          {showForm && (
            <div className="ap-form-card">
              <p className="ap-form-title">Add New Parent</p>
              <p className="ap-form-sub">
                Link a parent to a specific enrolled student. They will receive outpass approval notifications.
              </p>

              {/* Student selector */}
              <div className="ap-student-select-box">
                <label className="ap-field-label" style={{ color: C.crimson }}>
                  Select Enrolled Student *
                </label>
                {students.length === 0 ? (
                  <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
                    No students found. Students appear after submitting an outpass request.
                  </p>
                ) : (
                  <select
                    className="ap-input"
                    onChange={handleStudentSelect}
                    defaultValue=""
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
                  <div className="ap-selected-student">
                    <CheckCircleIcon />
                    Selected: {form.studentName} ({form.studentId})
                  </div>
                )}
              </div>

              {/* Parent detail fields */}
              <div className="ap-input-grid">
                <div>
                  <label className="ap-field-label">Parent Full Name *</label>
                  <input className="ap-input" type="text" placeholder="e.g. Rajesh Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="ap-field-label">Relation *</label>
                  <select className="ap-input" value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}>
                    {["Father", "Mother", "Guardian", "Sibling"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ap-field-label">Email Address *</label>
                  <input className="ap-input" type="email" placeholder="parent@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="ap-field-label">WhatsApp Number *</label>
                  <input className="ap-input" type="tel" placeholder="10-digit mobile" value={form.phone} maxLength={10} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>

              <div className="ap-form-actions">
                <button className="ap-btn-cancel" onClick={() => { setShowForm(false); setForm({ name:"",email:"",phone:"",relation:"Father",studentName:"",studentId:"",linkedStudentId:"" }); }}>
                  Cancel
                </button>
                <button className={`ap-btn-submit ${canSubmit ? "enabled" : "disabled"}`} onClick={handleAdd} disabled={!canSubmit}>
                  <UserPlus size={14} />
                  {adding ? "Adding…" : "Add Parent"}
                </button>
              </div>
            </div>
          )}

          {/* ── Search ── */}
          {parents.length > 0 && (
            <div className="ap-search-wrap">
              <Search size={14} className="ap-search-icon" />
              <input
                type="text"
                placeholder="Search by parent name, email, or student…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
            </div>
          )}

          {/* ── Content ── */}
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div className="ap-loader" />
              <p style={{ fontSize: 13, color: C.muted, fontFamily: "'Sora', sans-serif" }}>Loading parents…</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="ap-empty">
              <div className="ap-empty-icon">
                <Users size={24} />
              </div>
              <p className="ap-empty-title">{searchQ ? "No parents match your search" : "No parents added yet"}</p>
              <p className="ap-empty-sub">
                {searchQ
                  ? "Try a different search term"
                  : 'Click "Add Parent" to register a parent for an enrolled student. Each student can have multiple parents linked.'}
              </p>
            </div>
          ) : (
            <div>
              {/* Section label */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, fontFamily: "'Sora', sans-serif" }}>
                  {groups.length} Student Group{groups.length !== 1 ? "s" : ""}
                </p>
                <p style={{ fontSize: "11px", color: C.mutedLight, fontFamily: "'Sora', sans-serif" }}>
                  {filtered.length} parent{filtered.length !== 1 ? "s" : ""} total
                </p>
              </div>

              {groups.map((group, idx) => (
                <StudentGroup
                  key={group.studentId}
                  group={group}
                  idx={idx}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

        </div>
      </AdminLayout>
    </>
  );
}

/* tiny inline icon to avoid import issues */
function CheckCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
// src/pages/AdminParents.jsx
import { useEffect, useState } from "react";
import { UserPlus, Trash2, Phone, Mail, User, RefreshCw, Search, ChevronDown, Users, GraduationCap, Home } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { T, GCSS } from "../components/Pagebackground";

/* ── Relation colour map — purple palette ── */
const relColors = {
  Father:   { color:T.bright,  bg:`rgba(139,123,200,0.12)`, border:`rgba(139,123,200,0.26)` },
  Mother:   { color:T.mid,     bg:`rgba(107,90,176,0.12)`,  border:`rgba(107,90,176,0.26)`  },
  Guardian: { color:'#B07A10', bg:T.wrnBg,                  border:T.wrnBd                  },
  Sibling:  { color:T.ok,      bg:T.okBg,                   border:T.okBd                   },
};

const avPalette = [
  { bg:`rgba(107,90,176,0.14)`, color:T.mid    },
  { bg:`rgba(91,74,155,0.12)`,  color:T.deep   },
  { bg:`rgba(139,123,200,0.18)`,color:T.bright },
  { bg:`rgba(26,155,92,0.12)`,  color:T.ok     },
  { bg:`rgba(176,122,16,0.12)`, color:'#B07A10'},
  { bg:`rgba(176,42,32,0.10)`,  color:T.err    },
];

const CSS = `
  ${GCSS}
  * { box-sizing: border-box; }
  input::placeholder { color: ${T.inkDim} !important; }
  select option { background: #fff; color: ${T.ink}; }
  @keyframes spin2 { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
  .grp-card { background:rgba(255,255,255,0.62); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.86); border-radius:18px; overflow:hidden; margin-bottom:12px; box-shadow:0 6px 24px rgba(91,74,155,0.10); transition:box-shadow 0.22s; animation:fadeIn 0.3s ease both; }
  .grp-card:hover { box-shadow:0 12px 36px rgba(91,74,155,0.18); }
  .grp-hdr { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; transition:background 0.18s; user-select:none; }
  .grp-hdr:hover { background:${T.mist}; }
  .p-row { display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:12px; transition:background 0.15s; }
  .p-row:hover { background:${T.mist}; }
  .del-btn { width:32px; height:32px; border-radius:9px; background:${T.errBg}; border:1px solid ${T.errBd}; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${T.err}; flex-shrink:0; transition:all 0.15s; }
  .del-btn:hover { background:${T.err}; color:#fff; transform:scale(1.06); }
  .stat-chip { display:flex; align-items:center; gap:10px; padding:11px 16px; border-radius:14px; background:rgba(255,255,255,0.62); border:1px solid rgba(255,255,255,0.86); backdrop-filter:blur(18px); box-shadow:0 4px 14px rgba(91,74,155,0.08); transition:all 0.22s; }
  .stat-chip:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(91,74,155,0.16); }
  .form-card { background:rgba(255,255,255,0.70); backdrop-filter:blur(28px); border:1px solid rgba(255,255,255,0.88); border-radius:20px; padding:24px; margin-bottom:22px; box-shadow:0 8px 32px rgba(91,74,155,0.14); position:relative; overflow:hidden; animation:fadeIn 0.3s ease both; }
  .top-btn { transition:all 0.2s; }
  .top-btn:hover { border-color:${T.mid} !important; color:${T.mid} !important; background:${T.mist} !important; }
  .add-btn { transition:all 0.25s; }
  .add-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(91,74,155,0.42) !important; }
`;

function inputSt(focused) {
  return {
    width:'100%', padding:'11px 13px', borderRadius:12,
    border:`1.5px solid ${focused ? T.focusBd : T.inputBd}`,
    background: focused ? T.focusBg : T.inputBg,
    color:T.ink, fontSize:13, outline:'none', transition:'all 0.25s',
    boxShadow: focused ? T.focusSh : 'none',
  };
}

function groupByStudent(parents) {
  const map = {};
  parents.forEach(p => {
    const key = p.studentId || "unlinked";
    if (!map[key]) map[key] = { studentId:p.studentId||"—", studentName:p.studentName||"Unlinked", parents:[] };
    map[key].parents.push(p);
  });
  return Object.values(map).sort((a,b) => {
    if (a.studentId==="—") return 1;
    if (b.studentId==="—") return -1;
    return a.studentName.localeCompare(b.studentName);
  });
}

/* ── Student group accordion ── */
function StudentGroup({ group, idx, onDelete }) {
  const [open, setOpen] = useState(true);
  const av = avPalette[idx % avPalette.length];
  return (
    <div className="grp-card">
      {/* Accent top bar */}
      <div style={{ height:3, background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})` }}/>

      {/* Header */}
      <div className="grp-hdr" onClick={() => setOpen(o => !o)}
        style={{ borderBottom: open ? `1px solid ${T.border}` : 'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:13, background:av.bg, border:`1px solid ${av.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800, color:av.color, flexShrink:0 }}>
            {group.studentName[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:14, color:T.ink, marginBottom:4 }}>{group.studentName}</p>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              {group.studentId !== "—" && (
                <span style={{ fontSize:10, color:T.inkDim, background:`rgba(107,90,176,0.08)`, padding:'2px 9px', borderRadius:6, border:`1px solid ${T.border}` }}>{group.studentId}</span>
              )}
              <span style={{ fontSize:10, color:T.ok, background:T.okBg, padding:'2px 9px', borderRadius:6, border:`1px solid ${T.okBd}` }}>
                {group.parents.length} parent{group.parents.length!==1?"s":""}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown size={16} style={{ color:T.inkDim, transition:'transform 0.2s', transform:open?'rotate(180deg)':'none', flexShrink:0 }}/>
      </div>

      {/* Parents list */}
      {open && (
        <div style={{ padding:'6px 12px 12px', background:'rgba(246,243,253,0.40)' }}>
          {group.parents.map((p, pi) => {
            const pav = avPalette[(idx*3+pi+1) % avPalette.length];
            const rel = relColors[p.relation] || relColors.Guardian;
            return (
              <div key={p._id} className="p-row">
                <div style={{ width:38, height:38, borderRadius:11, background:pav.bg, border:`1px solid ${pav.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:pav.color, flexShrink:0 }}>
                  {p.name[0]?.toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <p style={{ fontSize:13, fontWeight:600, color:T.ink }}>{p.name}</p>
                    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, background:rel.bg, color:rel.color, border:`1px solid ${rel.border}` }}>{p.relation}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:T.inkSoft }}><Mail size={10}/>{p.email}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:T.inkSoft }}><Phone size={10}/>{p.phone}</span>
                  </div>
                </div>
                <button className="del-btn" onClick={() => onDelete(p._id)}><Trash2 size={13}/></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function AdminParents() {
  const [parents,    setParents]    = useState([]);
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [adding,     setAdding]     = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [searchQ,    setSearchQ]    = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [formFocus,  setFormFocus]  = useState({});
  const [searchFocused, setSearchFocused] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", relation:"Father", studentName:"", studentId:"", linkedStudentId:"" });

  const token = () => localStorage.getItem("token");

  const load = async () => {
    try {
      const res  = await fetch("/api/parents", { headers:{ Authorization:`Bearer ${token()}` } });
      const data = await res.json();
      setParents(data.parents || []);
    } catch { setParents([]); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const loadStudents = async () => {
    try {
      const res  = await fetch("/api/outpass/admin/all", { headers:{ Authorization:`Bearer ${token()}` } });
      const data = await res.json();
      const seen = new Set(), unique = [];
      (data.outpasses || []).forEach(o => {
        if (!seen.has(o.studentId)) {
          seen.add(o.studentId);
          unique.push({ _id:o.student?._id||o.student, studentName:o.studentName, studentId:o.studentId, hostelRoom:o.hostelRoom });
        }
      });
      setStudents(unique);
    } catch { setStudents([]); }
  };

  // ── Fetch once on mount ─────────────────────────────────────────────────────
  useEffect(() => { load(); loadStudents(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.phone || !form.relation) {
      alert("Fill all required fields"); return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/parents", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token()}` },
        body:JSON.stringify({ name:form.name, email:form.email, phone:form.phone, relation:form.relation, studentName:form.studentName, studentId:form.studentId }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setForm({ name:"", email:"", phone:"", relation:"Father", studentName:"", studentId:"", linkedStudentId:"" });
      setShowForm(false);
      load();
    } catch(err) { alert("Error: " + err.message); }
    finally { setAdding(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Remove this parent?")) return;
    try {
      await fetch(`/api/parents/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token()}` } });
      setParents(p => p.filter(x => x._id !== id));
    } catch { alert("Failed to delete"); }
  };

  const filtered = parents.filter(p => {
    const q = searchQ.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) ||
      (p.studentName||"").toLowerCase().includes(q) || (p.studentId||"").toLowerCase().includes(q);
  });
  const groups    = groupByStudent(filtered);
  const canSubmit = !!(form.name && form.email && form.phone && !adding);

  const ff  = k => setFormFocus(f => ({ ...f, [k]:true  }));
  const fbl = k => setFormFocus(f => ({ ...f, [k]:false }));

  return (
    <AdminLayout title="Parents" subtitle="Manage parents linked to enrolled students">
      <style>{CSS}</style>

      <div style={{ maxWidth:820, margin:"0 auto" }}>

        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:T.mid, boxShadow:`0 0 8px ${T.glow}` }}/>
              <span style={{ color:T.mid, fontSize:10, fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase' }}>Parents Registry</span>
            </div>
            <h2 style={{ fontWeight:800, fontSize:20, color:T.ink, letterSpacing:-0.5, marginBottom:2 }}>
              Registered Parents <span style={{ fontSize:13, fontWeight:400, color:T.inkSoft }}>({parents.length} total)</span>
            </h2>
            <p style={{ fontSize:12, color:T.inkSoft }}>Only registered parents can approve outpass requests.</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => { setRefreshing(true); setLoading(true); load(); loadStudents(); }} disabled={refreshing} className="top-btn"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', fontSize:13, fontWeight:600, background:'rgba(255,255,255,0.62)', border:`1.5px solid ${T.border}`, borderRadius:12, cursor:'pointer', color:T.inkSoft, opacity:refreshing?0.55:1, backdropFilter:'blur(14px)' }}>
              <RefreshCw size={13} style={{ animation:refreshing?'spin2 0.9s linear infinite':'none' }}/> Refresh
            </button>
            <button onClick={() => setShowForm(s => !s)} className="add-btn"
              style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${T.deep},${T.mid})`, border:'none', borderRadius:12, cursor:'pointer', color:'#fff', boxShadow:`0 4px 16px rgba(91,74,155,0.30)` }}>
              <UserPlus size={15}/>{showForm ? "Cancel" : "Add Parent"}
            </button>
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          {[
            { val:parents.length,                         label:"Total Parents",     icon:<Users size={13}/>,        accent:T.mid     },
            { val:students.length,                        label:"Enrolled Students", icon:<GraduationCap size={13}/>,accent:T.bright  },
            { val:parents.filter(p=>p.studentId).length, label:"Linked",            icon:<User size={13}/>,         accent:T.ok      },
            { val:groups.length,                          label:"Student Groups",    icon:<Home size={13}/>,         accent:'#B07A10' },
          ].map(s => (
            <div key={s.label} className="stat-chip">
              <span style={{ color:s.accent }}>{s.icon}</span>
              <div>
                <p style={{ fontWeight:800, fontSize:20, color:s.accent, lineHeight:1, textShadow:`0 0 10px ${s.accent}55` }}>{s.val}</p>
                <p style={{ fontSize:10, color:T.inkDim, marginTop:1 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Parent Form */}
        {showForm && (
          <div className="form-card">
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})` }}/>
            <p style={{ fontWeight:800, fontSize:17, color:T.ink, marginBottom:4 }}>Add New Parent</p>
            <p style={{ fontSize:12, color:T.inkSoft, marginBottom:20, lineHeight:1.7 }}>Link a parent to a specific enrolled student. They will receive outpass approval notifications.</p>

            {/* Student selector */}
            <div style={{ padding:16, background:`rgba(107,90,176,0.06)`, border:`1px solid ${T.border}`, borderRadius:14, marginBottom:18 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:T.mid, marginBottom:8 }}>Select Enrolled Student *</label>
              {students.length === 0 ? (
                <p style={{ fontSize:13, color:T.inkSoft }}>No students found. Students appear after submitting an outpass request.</p>
              ) : (
                <select
                  onChange={e => {
                    const s = students.find(x => x._id===e.target.value || x.studentId===e.target.value);
                    if (s) setForm(f => ({ ...f, linkedStudentId:s._id, studentName:s.studentName, studentId:s.studentId }));
                    else setForm(f => ({ ...f, linkedStudentId:"", studentName:"", studentId:"" }));
                  }}
                  defaultValue=""
                  style={{ ...inputSt(formFocus.student), appearance:'none' }}
                  onFocus={() => ff('student')} onBlur={() => fbl('student')}>
                  <option value="" disabled>— Choose a student —</option>
                  {students.map(s => <option key={s.studentId} value={s._id}>{s.studentName} ({s.studentId}) — Room {s.hostelRoom}</option>)}
                </select>
              )}
              {form.studentName && (
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8, padding:'6px 11px', background:T.okBg, border:`1px solid ${T.okBd}`, borderRadius:9, fontSize:12, fontWeight:600, color:T.ok }}>
                  ✓ Selected: {form.studentName} ({form.studentId})
                </div>
              )}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { k:'name',  label:'Parent Full Name *', type:'text',  placeholder:'e.g. Rajesh Sharma'  },
                { k:'email', label:'Email Address *',    type:'email', placeholder:'parent@email.com'    },
                { k:'phone', label:'WhatsApp Number *',  type:'tel',   placeholder:'10-digit mobile'     },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:formFocus[f.k]?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>{f.label}</label>
                  <input type={f.type} value={form[f.k]} onChange={e => setForm(x => ({ ...x, [f.k]:e.target.value }))} placeholder={f.placeholder}
                    onFocus={() => ff(f.k)} onBlur={() => fbl(f.k)} style={inputSt(formFocus[f.k])}/>
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:formFocus.relation?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>Relation *</label>
                <select value={form.relation} onChange={e => setForm(f => ({ ...f, relation:e.target.value }))}
                  onFocus={() => ff('relation')} onBlur={() => fbl('relation')}
                  style={{ ...inputSt(formFocus.relation), appearance:'none' }}>
                  {["Father","Mother","Guardian","Sibling"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
              <button onClick={() => { setShowForm(false); setForm({ name:"", email:"", phone:"", relation:"Father", studentName:"", studentId:"", linkedStudentId:"" }); }}
                style={{ padding:'10px 20px', fontSize:13, fontWeight:600, background:'rgba(255,255,255,0.55)', border:`1.5px solid ${T.border}`, borderRadius:11, cursor:'pointer', color:T.inkSoft, transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background=T.mist;e.currentTarget.style.color=T.inkMid;}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.55)';e.currentTarget.style.color=T.inkSoft;}}>
                Cancel
              </button>
              <button onClick={handleAdd} disabled={!canSubmit} className="add-btn"
                style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 22px', fontSize:13, fontWeight:700, border:'none', borderRadius:11, cursor:canSubmit?'pointer':'not-allowed', background:canSubmit?`linear-gradient(135deg,${T.deep},${T.mid})`:`rgba(107,90,176,0.10)`, color:canSubmit?'#fff':T.inkDim, boxShadow:canSubmit?`0 4px 16px rgba(91,74,155,0.30)`:'none' }}>
                <UserPlus size={14}/>{adding ? "Adding…" : "Add Parent"}
              </button>
            </div>
          </div>
        )}

        {/* Search bar */}
        {parents.length > 0 && (
          <div style={{ position:'relative', marginBottom:18 }}>
            <Search size={13} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:T.inkDim, pointerEvents:'none' }}/>
            <input type="text" placeholder="Search by parent name, email, or student…" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              style={{ width:'100%', padding:'11px 16px 11px 38px', fontSize:13, background:'rgba(255,255,255,0.62)', border:`1.5px solid ${searchFocused?T.focusBd:T.border}`, borderRadius:12, outline:'none', color:T.ink, transition:'all 0.18s', backdropFilter:'blur(14px)', boxShadow:searchFocused?T.focusSh:'none' }}/>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ padding:48, textAlign:'center' }}>
            <div style={{ width:28, height:28, border:`3px solid ${T.pale}`, borderTopColor:T.mid, borderRadius:'50%', animation:'spin2 0.9s linear infinite', margin:'0 auto 14px' }}/>
            <p style={{ fontSize:13, color:T.inkSoft }}>Loading parents…</p>
          </div>
        ) : groups.length === 0 ? (
          <div style={{ background:'rgba(255,255,255,0.62)', border:`1px solid rgba(255,255,255,0.86)`, borderRadius:20, padding:'60px 20px', textAlign:'center', backdropFilter:'blur(18px)', boxShadow:'0 6px 24px rgba(91,74,155,0.10)' }}>
            <div style={{ width:58, height:58, background:`rgba(107,90,176,0.10)`, border:`1px solid ${T.border}`, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Users size={24} style={{ color:T.mid }}/>
            </div>
            <p style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:6 }}>
              {searchQ ? "No parents match your search" : "No parents added yet"}
            </p>
            <p style={{ fontSize:13, color:T.inkSoft, maxWidth:280, margin:'0 auto', lineHeight:1.7 }}>
              {searchQ ? "Try a different search term" : 'Click "Add Parent" to register a parent for an enrolled student.'}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:T.inkDim }}>
                {groups.length} Student Group{groups.length!==1?"s":""}
              </p>
              <p style={{ fontSize:11, color:T.inkDim }}>
                {filtered.length} parent{filtered.length!==1?"s":""} total
              </p>
            </div>
            {groups.map((group, idx) => (
              <StudentGroup key={group.studentId} group={group} idx={idx} onDelete={handleDelete}/>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
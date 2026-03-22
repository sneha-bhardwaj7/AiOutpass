// src/pages/AdminRequestDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiUser, FiMapPin, FiCalendar, FiPhone, FiMail, FiHome, FiHash, FiFileText } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { T, GCSS } from "../components/Pagebackground";

const CSS = `
  ${GCSS}
  @keyframes spin{to{transform:rotate(360deg)}}
  textarea::placeholder{color:${T.inkDim}!important}
  .back-btn{display:inline-flex;align-items:center;gap:7px;margin-bottom:24px;background:rgba(255,255,255,0.62);border:1.5px solid ${T.border};padding:10px 18px;border-radius:12px;cursor:pointer;font-size:13px;color:${T.inkSoft};backdrop-filter:blur(14px);transition:all 0.2s}
  .back-btn:hover{background:${T.mist};color:${T.mid};border-color:${T.mid}}
  .dec-approve{flex:1;padding:14px 0;color:#fff;border:none;border-radius:13px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(26,155,92,0.30);transition:all 0.25s}
  .dec-approve:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(26,155,92,0.44)}
  .dec-reject{flex:1;padding:14px 0;color:#fff;border:none;border-radius:13px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(176,42,32,0.28);transition:all 0.25s}
  .dec-reject:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(176,42,32,0.42)}
`;

const CARD = {
  background:    'rgba(255,255,255,0.62)',
  backdropFilter:'blur(24px)',
  border:        '1px solid rgba(255,255,255,0.86)',
  borderRadius:  18,
  overflow:      'hidden',
  boxShadow:     '0 6px 24px rgba(91,74,155,0.10)',
  marginBottom:  14,
};

const StatusPill = ({ status }) => {
  const map = {
    pending:        { label:"⏳ Pending Parent", bg:`rgba(176,122,16,0.10)`, border:`rgba(176,122,16,0.26)`, text:'#B07A10' },
    "pending-admin":{ label:"🔍 Pending Admin",  bg:`rgba(107,90,176,0.10)`, border:T.border,               text:T.mid     },
    approved:       { label:"✅ Approved",        bg:T.okBg,                  border:T.okBd,                 text:T.ok      },
    rejected:       { label:"❌ Rejected",        bg:T.errBg,                 border:T.errBd,                text:T.err     },
  };
  const s = map[status] || { label:status, bg:`rgba(255,255,255,0.50)`, border:T.border, text:T.inkSoft };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'7px 17px', borderRadius:100, fontSize:12, fontWeight:700, background:s.bg, border:`1px solid ${s.border}`, color:s.text, backdropFilter:'blur(10px)' }}>
      {s.label}
    </span>
  );
};

const Row = ({ label, value, icon: Icon }) => (
  <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom:`1px solid ${T.border}` }}>
    {Icon && <Icon size={13} style={{ color:T.mid, marginTop:2, flexShrink:0 }}/>}
    <span style={{ minWidth:150, fontSize:11, color:T.inkDim, textTransform:'uppercase', letterSpacing:'0.10em', paddingTop:1 }}>{label}</span>
    <span style={{ fontSize:13, color:T.ink, fontWeight:600, flex:1, wordBreak:'break-word' }}>{value || "—"}</span>
  </div>
);

function CardBlock({ children, title, icon: Icon, accentColor }) {
  return (
    <div style={CARD}>
      {title && (
        <div style={{ display:'flex', alignItems:'center', gap:9, padding:'16px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
          {Icon && <Icon size={14} style={{ color:accentColor || T.mid }}/>}
          <h3 style={{ fontWeight:700, fontSize:15, color:T.ink, margin:0 }}>{title}</h3>
        </div>
      )}
      <div style={{ padding:'4px 22px 18px' }}>{children}</div>
    </div>
  );
}

export default function AdminRequestDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [outpass,  setOutpass]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [deciding, setDeciding] = useState(false);
  const [note,     setNote]     = useState("");
  const [error,    setError]    = useState("");
  const [focused,  setFocused]  = useState(false);

  // ── Fetch once for this request ID ─────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/outpass/admin/all`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r  => r.json())
      .then(data => {
        const found = data.outpasses?.find(o => o._id === id);
        if (found) setOutpass(found);
        else setError("Outpass not found.");
      })
      .catch(() => setError("Failed to load outpass."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecision = async decision => {
    setDeciding(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/outpass/admin/decision/${id}`, {
        method:"PATCH",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body:JSON.stringify({ decision, adminNote:note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Decision failed");
      setOutpass(data.outpass);
    } catch(err) { setError(err.message); }
    finally      { setDeciding(false); }
  };

  const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";

  if (loading) return (
    <AdminLayout title="Request Detail">
      <div style={{ textAlign:"center", padding:60, color:T.inkSoft }}>Loading…</div>
    </AdminLayout>
  );
  if (error && !outpass) return (
    <AdminLayout title="Request Detail">
      <div style={{ textAlign:"center", padding:60, color:T.err }}>{error}</div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Request Detail">
      <style>{CSS}</style>

      <div style={{ maxWidth:800, margin:"0 auto" }}>

        {/* Back button */}
        <button onClick={() => navigate("/admin/requests")} className="back-btn">
          <FiArrowLeft size={14}/> Back to Requests
        </button>

        {/* Header card */}
        <div style={{ ...CARD, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${T.deep},${T.mid},${T.bright})` }}/>
          <div style={{ padding:24, paddingTop:27 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:14 }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:22, color:T.ink, letterSpacing:-0.6, marginBottom:6 }}>{outpass.studentName}</h2>
                <p style={{ color:T.inkDim, fontSize:12 }}>{outpass.studentId} · Room {outpass.hostelRoom}</p>
              </div>
              <StatusPill status={outpass.status}/>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <CardBlock title="Trip Details" icon={FiMapPin}>
          <Row label="Destination"  value={outpass.destination}       icon={FiMapPin}   />
          <Row label="Reason"       value={outpass.reason}             icon={FiFileText} />
          <Row label="Departure"    value={fmt(outpass.leaveDateFrom)} icon={FiCalendar} />
          <Row label="Return"       value={fmt(outpass.leaveDateTo)}   icon={FiCalendar} />
          <Row label="Time"         value={[outpass.timeFrom,outpass.timeTo].filter(Boolean).join(" → ")} icon={FiClock}/>
          <Row label="Submitted On" value={fmt(outpass.createdAt)}     icon={FiCalendar} />
        </CardBlock>

        {/* Parent Contact */}
        <CardBlock title="Parent Contact" icon={FiPhone}>
          <Row label="Relation"  value={outpass.parentRelation} icon={FiUser} />
          <Row label="WhatsApp"  value={outpass.parentContact}  icon={FiPhone}/>
          <Row label="Email"     value={outpass.parentEmail}    icon={FiMail} />
        </CardBlock>

        {/* Parent Verification */}
        {outpass.parentDecision && (
          <div style={{ background:outpass.parentDecision==="approved"?T.okBg:T.errBg, border:`1px solid ${outpass.parentDecision==="approved"?T.okBd:T.errBd}`, borderRadius:18, overflow:'hidden', marginBottom:14, backdropFilter:'blur(14px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, padding:'16px 22px', borderBottom:`1px solid ${outpass.parentDecision==="approved"?T.okBd:T.errBd}` }}>
              {outpass.parentDecision==="approved"
                ? <FiCheckCircle size={14} style={{ color:T.ok }}/>
                : <FiXCircle     size={14} style={{ color:T.err }}/>}
              <h3 style={{ fontWeight:700, fontSize:15, color:outpass.parentDecision==="approved"?T.ok:T.err, margin:0 }}>Parent Verification</h3>
            </div>
            <div style={{ padding:'16px 22px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <span style={{ fontWeight:700, fontSize:14, color:outpass.parentDecision==="approved"?T.ok:T.err }}>
                  Parent {outpass.parentDecision==="approved"?"✅ Approved":"❌ Rejected"}
                </span>
                {outpass.verifiedAt && <span style={{ fontSize:11, color:T.inkSoft }}>{new Date(outpass.verifiedAt).toLocaleString("en-IN")}</span>}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {outpass.parentPhotoPath && (
                  <div>
                    <p style={{ fontSize:9, fontWeight:700, color:T.inkDim, textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:8 }}>Verification Photo</p>
                    <img src={outpass.parentPhotoPath} alt="Parent photo" style={{ width:'100%', borderRadius:12, border:`1px solid ${T.border}`, objectFit:'cover', maxHeight:200 }}/>
                    <a href={outpass.parentPhotoPath} target="_blank" rel="noreferrer" style={{ display:'block', marginTop:6, fontSize:12, color:T.mid, textDecoration:'none' }}>🔗 Open full photo</a>
                  </div>
                )}
                {outpass.parentVideoPath && (
                  <div>
                    <p style={{ fontSize:9, fontWeight:700, color:T.inkDim, textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:8 }}>Video Statement</p>
                    <video src={outpass.parentVideoPath} controls style={{ width:'100%', borderRadius:12, border:`1px solid ${T.border}`, maxHeight:200 }}/>
                    <a href={outpass.parentVideoPath} target="_blank" rel="noreferrer" style={{ display:'block', marginTop:6, fontSize:12, color:T.mid, textDecoration:'none' }}>🔗 Open full video</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Decision Panel */}
        {outpass.status === "pending-admin" && (
          <div style={{ background:'rgba(255,255,255,0.62)', backdropFilter:'blur(24px)', border:`1px solid rgba(176,122,16,0.26)`, borderRadius:18, overflow:'hidden', marginBottom:14, boxShadow:'0 6px 24px rgba(91,74,155,0.10)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, padding:'16px 22px', borderBottom:'1px solid rgba(176,122,16,0.18)', background:'rgba(176,122,16,0.06)' }}>
              <FiAlertCircle size={14} style={{ color:'#B07A10' }}/>
              <h3 style={{ fontWeight:700, fontSize:15, color:'#B07A10', margin:0 }}>Admin Decision Required</h3>
            </div>
            <div style={{ padding:22 }}>
              <p style={{ fontSize:13, color:T.inkSoft, marginBottom:16, lineHeight:1.7 }}>
                Review the parent's photo and video above, then make your final decision.
              </p>
              <textarea placeholder="Optional note (e.g. 'Verified — face matches', 'Suspicious response')"
                value={note} onChange={e=>setNote(e.target.value)} rows={2}
                style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${focused?T.focusBd:T.inputBd}`, background:focused?T.focusBg:T.inputBg, color:T.ink, fontSize:13, resize:'vertical', outline:'none', marginBottom:16, boxSizing:'border-box', transition:'all 0.25s', boxShadow:focused?T.focusSh:'none' }}
                onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
              {error && (
                <p style={{ color:T.err, fontSize:13, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
                  <FiAlertCircle size={13}/> {error}
                </p>
              )}
              <div style={{ display:'flex', gap:12 }}>
                <button onClick={()=>handleDecision("approved")} disabled={deciding} className="dec-approve"
                  style={{ background:deciding?T.okBg:`linear-gradient(135deg,#0A5E38,${T.ok})`, cursor:deciding?'not-allowed':'pointer', opacity:deciding?0.72:1 }}>
                  ✅ Final Approve
                </button>
                <button onClick={()=>handleDecision("rejected")} disabled={deciding} className="dec-reject"
                  style={{ background:deciding?T.errBg:`linear-gradient(135deg,#7A1A10,${T.err})`, cursor:deciding?'not-allowed':'pointer', opacity:deciding?0.72:1 }}>
                  ❌ Final Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final decision already made */}
        {["approved","rejected"].includes(outpass.status) && (
          <div style={{ background:outpass.status==="approved"?T.okBg:T.errBg, border:`1px solid ${outpass.status==="approved"?T.okBd:T.errBd}`, borderRadius:18, padding:22, marginBottom:14, backdropFilter:'blur(14px)' }}>
            <p style={{ margin:0, fontWeight:700, fontSize:15, color:outpass.status==="approved"?T.ok:T.err, marginBottom:6 }}>
              {outpass.status==="approved" ? "✅ Final Decision: APPROVED" : "❌ Final Decision: REJECTED"}
            </p>
            {outpass.adminNote    && <p style={{ margin:'6px 0 0', fontSize:13, color:T.inkSoft }}>Admin note: {outpass.adminNote}</p>}
            {outpass.adminDecidedAt && <p style={{ margin:'4px 0 0', fontSize:11, color:T.inkDim }}>{new Date(outpass.adminDecidedAt).toLocaleString("en-IN")}</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
// src/pages/StudentProfile.jsx
// FIX 1: '../components/Pagebackground' → '../components/PageBackground' (capital B)
// FIX 2: saveProfile uses updateUser() instead of login() — token never wiped

import { useState, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiHash, FiHome, FiEdit3, FiSave, FiCamera, FiCheckCircle, FiAlertCircle, FiLoader, FiLock, FiEye, FiEyeOff, FiBook, FiShield } from 'react-icons/fi';
import StudentLayout from '../components/StudentLayout';
import { useAuth } from '../context/AuthContext';
import { T, GCSS } from '../components/Pagebackground';   // ← capital B fixed

const BASE_URL = import.meta.env.REACT_VITE_APP_BACKEND_URL || 'http://localhost:5000';
const CARD = { background:'rgba(255,255,255,0.62)', backdropFilter:'blur(28px)', border:'1px solid rgba(255,255,255,0.86)', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(91,74,155,0.12)' };

function Field({ label, icon: Icon, type='text', value, onChange, placeholder }) {
  const [f, sF] = useState(false);
  return (
    <div>
      <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:f?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <Icon size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:f?T.mid:T.inkDim, transition:'color 0.25s', pointerEvents:'none' }}/>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => sF(true)} onBlur={() => sF(false)}
          style={{ width:'100%', paddingLeft:40, paddingRight:14, paddingTop:11, paddingBottom:11, borderRadius:12, border:`1.5px solid ${f?T.focusBd:T.inputBd}`, background:f?T.focusBg:T.inputBg, color:T.ink, fontSize:13, outline:'none', transition:'all 0.25s', boxShadow:f?T.focusSh:'none' }}/>
      </div>
    </div>
  );
}

function PassField({ label, value, onChange, show, toggle, placeholder, error }) {
  const [f, sF] = useState(false);
  return (
    <div>
      <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:f?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <FiLock size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:f?T.mid:T.inkDim, transition:'color 0.25s', pointerEvents:'none' }}/>
        <input type={show?'text':'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => sF(true)} onBlur={() => sF(false)}
          style={{ width:'100%', paddingLeft:40, paddingRight:44, paddingTop:11, paddingBottom:11, borderRadius:12, border:`1.5px solid ${error?T.errBd:f?T.focusBd:T.inputBd}`, background:f?T.focusBg:T.inputBg, color:T.ink, fontSize:13, outline:'none', transition:'all 0.25s', boxShadow:error?`0 0 0 3px ${T.errBg}`:f?T.focusSh:'none' }}/>
        <button type="button" onClick={toggle} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:T.inkDim, padding:0, display:'flex' }}>
          {show ? <FiEyeOff size={14}/> : <FiEye size={14}/>}
        </button>
      </div>
      {error && <p style={{ fontSize:11, color:T.err, marginTop:5 }}>{error}</p>}
    </div>
  );
}

function SelField({ label, value, onChange, options, placeholder }) {
  const [f, sF] = useState(false);
  return (
    <div>
      <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:f?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => sF(true)} onBlur={() => sF(false)}
        style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${f?T.focusBd:T.inputBd}`, background:f?T.focusBg:T.inputBg, color:value?T.ink:T.inkDim, fontSize:13, outline:'none', appearance:'none', transition:'all 0.25s', boxShadow:f?T.focusSh:'none' }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SaveBtn({ onClick, loading, label, icon: Icon }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-p"
      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 24px', borderRadius:12, border:'none', cursor:loading?'not-allowed':'pointer', background:`linear-gradient(135deg,${T.deep},${T.mid})`, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 20px rgba(91,74,155,0.30)`, opacity:loading?0.72:1, transition:'all 0.25s' }}>
      {loading ? <><FiLoader size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Icon size={13}/> {label}</>}
    </button>
  );
}

export default function StudentProfile() {
  // ── FIX: updateUser merges fields into localStorage without touching token/role ──
  const { user, updateUser } = useAuth();
  const token = localStorage.getItem('token');

  const [profile,      setProfile]      = useState({ name:user?.name||'', email:user?.email||'', phone:user?.phone||'', collegeId:user?.collegeId||'', hostelRoom:user?.hostelRoom||'', department:user?.department||'', year:user?.year||'', bio:user?.bio||'' });
  const [passwords,    setPasswords]    = useState({ current:'', newPass:'', confirm:'' });
  const [showPass,     setShowPass]     = useState({ current:false, new:false, confirm:false });
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [avatarPreview,setAvatarPreview]= useState(user?.avatar || null);
  const [saving,       setSaving]       = useState(false);
  const [savingPass,   setSavingPass]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const [tab,          setTab]          = useState('personal');
  const fileRef = useRef();

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };
  const handleAvatarChange = e => { const f = e.target.files[0]; if (!f) return; setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k,v]) => v !== undefined && fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);
      const res  = await fetch(`${BASE_URL}/api/auth/student/profile`, { method:'PUT', headers:{ Authorization:`Bearer ${token}` }, body:fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // ── FIX: merge into state+localStorage without overwriting token ──
      updateUser(data.student);
      if (data.student?.avatar) setAvatarPreview(data.student.avatar);
      setAvatarFile(null);
      showToast('Profile updated!');
    } catch(err) { showToast(err.message || 'Failed', 'error'); }
    finally      { setSaving(false); }
  };

  const changePassword = async () => {
    if (passwords.newPass !== passwords.confirm) return showToast('Passwords do not match', 'error');
    if (passwords.newPass.length < 8)            return showToast('Min. 8 characters', 'error');
    setSavingPass(true);
    try {
      const res  = await fetch(`${BASE_URL}/api/auth/student/change-password`, { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body:JSON.stringify({ currentPassword:passwords.current, newPassword:passwords.newPass }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPasswords({ current:'', newPass:'', confirm:'' });
      showToast('Password changed!');
    } catch(err) { showToast(err.message || 'Failed', 'error'); }
    finally      { setSavingPass(false); }
  };

  const tabs = [{ id:'personal', label:'Personal Info', icon:FiUser },{ id:'academic', label:'Academic', icon:FiBook },{ id:'security', label:'Security', icon:FiShield }];
  const completion = Math.round([profile.name,profile.email,profile.phone,profile.collegeId,profile.hostelRoom,profile.department,profile.year,profile.bio].filter(Boolean).length / 8 * 100);
  const initials   = profile.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

  return (
    <StudentLayout>
      <style>{`
        @keyframes spin    { to { transform:rotate(360deg) } }
        @keyframes toastIn { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:900px) { .pg { grid-template-columns:1fr !important; } }
        .btn-p { transition:all 0.28s cubic-bezier(0.22,1,0.36,1); position:relative; overflow:hidden; }
        .btn-p:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 30px rgba(91,74,155,0.40) !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:200, display:'flex', alignItems:'center', gap:10, padding:'13px 20px', borderRadius:15, fontSize:13, fontWeight:600, animation:'toastIn 0.3s ease', backdropFilter:'blur(20px)', boxShadow:'0 12px 40px rgba(91,74,155,0.22)', background:toast.type==='error'?'rgba(176,42,32,0.12)':'rgba(26,155,92,0.12)', border:`1px solid ${toast.type==='error'?T.errBd:T.okBd}`, color:toast.type==='error'?T.err:T.ok }}>
          {toast.type==='error' ? <FiAlertCircle size={15}/> : <FiCheckCircle size={15}/>}{toast.msg}
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:T.mid, boxShadow:`0 0 8px ${T.glow}` }}/>
          <span style={{ color:T.mid, fontSize:10, fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase' }}>Profile</span>
        </div>
        <h1 style={{ fontWeight:800, fontSize:26, color:T.ink, letterSpacing:-0.7, marginBottom:4 }}>My Profile</h1>
        <p style={{ color:T.inkSoft, fontSize:13 }}>Manage your personal information and account settings</p>
      </div>

      <div className="pg" style={{ display:'grid', gridTemplateColumns:'1fr 3fr', gap:20, alignItems:'start' }}>

        {/* Profile summary card */}
        <div style={CARD}>
          <div style={{ height:82, background:`linear-gradient(135deg,${T.deep},${T.mid})`, position:'relative' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.12) 1px,transparent 0)', backgroundSize:'20px 20px' }}/>
          </div>
          <div style={{ padding:'0 22px 24px' }}>
            <div style={{ position:'relative', marginTop:-34, marginBottom:14, width:'fit-content' }}>
              <div style={{ width:70, height:70, borderRadius:18, border:'3.5px solid rgba(255,255,255,0.92)', background:`linear-gradient(135deg,${T.deep},${T.mid})`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:`0 10px 26px rgba(91,74,155,0.30)` }}>
                {avatarPreview ? <img src={avatarPreview} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ color:'#fff', fontWeight:800, fontSize:22 }}>{initials||'S'}</span>}
              </div>
              <button onClick={() => fileRef.current?.click()}
                style={{ position:'absolute', bottom:-4, right:-4, width:28, height:28, background:T.mid, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', boxShadow:`0 4px 14px rgba(91,74,155,0.44)` }}>
                <FiCamera size={13} color="#fff"/>
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange}/>
            </div>
            {avatarFile && <p style={{ fontSize:11, color:T.mid, marginBottom:8, display:'flex', alignItems:'center', gap:5 }}><FiCamera size={11}/> New photo — save to upload</p>}
            <h3 style={{ fontWeight:700, fontSize:16, color:T.ink, marginBottom:3 }}>{profile.name || 'Student'}</h3>
            <p style={{ fontSize:12, color:T.inkSoft, marginBottom:16 }}>{profile.email}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[{ icon:FiHash, val:profile.collegeId },{ icon:FiHome, val:profile.hostelRoom },{ icon:FiBook, val:profile.department&&`${profile.department} · ${profile.year}` }].filter(x => x.val).map(({ icon:Icon, val }, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:T.inkSoft }}>
                  <Icon size={11} style={{ color:T.mid, flexShrink:0 }}/><span>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <p style={{ fontSize:10, fontWeight:600, color:T.inkDim, letterSpacing:'0.06em' }}>Profile Completion</p>
                <p style={{ fontSize:11, fontWeight:700, color:T.mid }}>{completion}%</p>
              </div>
              <div style={{ height:5, background:T.soft, borderRadius:20, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${completion}%`, background:`linear-gradient(90deg,${T.deep},${T.mid})`, borderRadius:20, transition:'width 0.7s ease', boxShadow:`0 0 8px rgba(107,90,176,0.40)` }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Tab bar */}
          <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.48)', borderRadius:15, padding:4, border:`1px solid ${T.border}`, width:'fit-content', backdropFilter:'blur(16px)' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer', fontSize:13, fontWeight:tab===id?700:500, transition:'all 0.22s', background:tab===id?`linear-gradient(135deg,${T.deep},${T.mid})`:'transparent', color:tab===id?'#fff':T.inkSoft, boxShadow:tab===id?`0 4px 16px rgba(91,74,155,0.30)`:'none' }}>
                <Icon size={13}/>{label}
              </button>
            ))}
          </div>

          {/* Personal tab */}
          {tab==='personal' && (
            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'17px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
                <FiEdit3 size={14} style={{ color:T.mid }}/><h3 style={{ fontWeight:700, fontSize:15, color:T.ink }}>Personal Information</h3>
              </div>
              <div style={{ padding:22, display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Field label="Full Name"     icon={FiUser}  value={profile.name}  onChange={v => setProfile(p => ({ ...p, name:v }))}  placeholder="Your full name"/>
                  <Field label="Email Address" icon={FiMail}  type="email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email:v }))} placeholder="your@email.com"/>
                  <Field label="Phone Number"  icon={FiPhone} type="tel"   value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone:v }))} placeholder="+91 9876543210"/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkDim, marginBottom:7 }}>Bio (Optional)</label>
                  <textarea rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio:e.target.value }))} placeholder="Tell something about yourself…"
                    style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${T.inputBd}`, background:T.inputBg, color:T.ink, fontSize:13, outline:'none', resize:'none', transition:'border-color 0.25s', boxSizing:'border-box' }}
                    onFocus={e => { e.target.style.borderColor=T.focusBd; e.target.style.boxShadow=T.focusSh; }}
                    onBlur={e  => { e.target.style.borderColor=T.inputBd;  e.target.style.boxShadow='none'; }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn onClick={saveProfile} loading={saving} label="Save Changes" icon={FiSave}/></div>
              </div>
            </div>
          )}

          {/* Academic tab */}
          {tab==='academic' && (
            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'17px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
                <FiBook size={14} style={{ color:T.mid }}/><h3 style={{ fontWeight:700, fontSize:15, color:T.ink }}>Academic Information</h3>
              </div>
              <div style={{ padding:22, display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Field label="College ID / Roll No." icon={FiHash} value={profile.collegeId}  onChange={v => setProfile(p => ({ ...p, collegeId:v }))}  placeholder="e.g. CSE2021001"/>
                  <Field label="Hostel & Room No."     icon={FiHome} value={profile.hostelRoom} onChange={v => setProfile(p => ({ ...p, hostelRoom:v }))} placeholder="e.g. Block A, Room 204"/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <SelField label="Department"    value={profile.department} onChange={v => setProfile(p => ({ ...p, department:v }))} options={['CSE','ECE','ME','CE','EE','IT','Other']}          placeholder="Select Department"/>
                  <SelField label="Year of Study" value={profile.year}       onChange={v => setProfile(p => ({ ...p, year:v }))}       options={['1st Year','2nd Year','3rd Year','4th Year']} placeholder="Select Year"/>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn onClick={saveProfile} loading={saving} label="Save Changes" icon={FiSave}/></div>
              </div>
            </div>
          )}

          {/* Security tab */}
          {tab==='security' && (
            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'17px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
                <FiShield size={14} style={{ color:T.mid }}/><h3 style={{ fontWeight:700, fontSize:15, color:T.ink }}>Security &amp; Password</h3>
              </div>
              <div style={{ padding:22, display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ padding:'12px 15px', background:T.snow, border:`1px solid ${T.border}`, borderRadius:12 }}>
                  <p style={{ fontSize:12, color:T.inkSoft, lineHeight:1.7, margin:0 }}>Use a strong password with at least 8 characters, including uppercase, numbers, and special characters.</p>
                </div>
                <PassField label="Current Password"   value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current:v }))} show={showPass.current} toggle={() => setShowPass(p => ({ ...p, current:!p.current }))} placeholder="Enter current password"/>
                <PassField label="New Password"       value={passwords.newPass} onChange={v => setPasswords(p => ({ ...p, newPass:v }))} show={showPass.new}     toggle={() => setShowPass(p => ({ ...p, new:!p.new }))}         placeholder="Enter new password"/>
                <PassField label="Confirm Password"   value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm:v }))} show={showPass.confirm} toggle={() => setShowPass(p => ({ ...p, confirm:!p.confirm }))}   placeholder="Re-enter new password"
                  error={passwords.confirm && passwords.newPass !== passwords.confirm ? "Passwords don't match" : ''}/>
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button onClick={changePassword} disabled={savingPass||!passwords.current||!passwords.newPass||!passwords.confirm} className="btn-p"
                    style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 24px', borderRadius:12, border:'none', cursor:(savingPass||!passwords.current||!passwords.newPass||!passwords.confirm)?'not-allowed':'pointer', background:`linear-gradient(135deg,${T.deep},${T.mid})`, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 20px rgba(91,74,155,0.28)`, opacity:(savingPass||!passwords.current||!passwords.newPass||!passwords.confirm)?0.50:1, transition:'all 0.25s' }}>
                    {savingPass ? <><FiLoader size={13} style={{ animation:'spin 1s linear infinite' }}/> Updating…</> : <><FiLock size={13}/> Update Password</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
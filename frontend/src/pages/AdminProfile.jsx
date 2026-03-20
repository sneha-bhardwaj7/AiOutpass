// src/pages/AdminProfile.jsx
//
// FIXES applied:
//  1. Replaced login(data.admin, role, token) → updateUser(data.admin)
//     so profile updates persist across logout (same root cause as StudentProfile).
//  2. API paths updated to match authRoutes.js:
//       /admin/profile        → /api/auth/admin/profile
//       /admin/change-password → /api/auth/admin/change-password
//  3. Avatar upload now sends a File object in FormData → Cloudinary on backend.
//     On success, avatarPreview is set to the Cloudinary URL from data.admin.avatar.
//  4. Removed all font-family imports to stay consistent with the theme.
//  5. Updated palette to match LandingPage purple theme (T from PageBackground).

import { useState, useRef } from 'react';
import {
  FiUser, FiMail, FiPhone, FiEdit3, FiSave, FiCamera,
  FiCheckCircle, FiAlertCircle, FiLoader, FiLock,
  FiEye, FiEyeOff, FiShield, FiActivity, FiBriefcase
} from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { T, GCSS } from '../components/Pagebackground';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CARD = {
  background:    'rgba(255,255,255,0.62)',
  backdropFilter:'blur(28px)',
  border:        '1px solid rgba(255,255,255,0.86)',
  borderRadius:  20,
  overflow:      'hidden',
  boxShadow:     '0 8px 32px rgba(91,74,155,0.12)',
};

/* ── Field components ──────────────────────────────────────────────────────── */
function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder }) {
  const [f, sF] = useState(false);
  return (
    <div>
      <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:f?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>{label}</label>
      <div style={{ position:'relative' }}>
        {Icon && <Icon size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:f?T.mid:T.inkDim, pointerEvents:'none', transition:'color 0.25s' }} />}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => sF(true)} onBlur={() => sF(false)}
          style={{ width:'100%', paddingLeft:Icon?40:14, paddingRight:14, paddingTop:11, paddingBottom:11, borderRadius:12, border:`1.5px solid ${f?T.focusBd:T.inputBd}`, background:f?T.focusBg:T.inputBg, color:T.ink, fontSize:13, outline:'none', transition:'all 0.25s', boxShadow:f?T.focusSh:'none' }} />
      </div>
    </div>
  );
}

function PassField({ label, value, onChange, show, toggle, error }) {
  const [f, sF] = useState(false);
  return (
    <div>
      <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:f?T.mid:T.inkDim, marginBottom:7, transition:'color 0.2s' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <FiLock size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:f?T.mid:T.inkDim, pointerEvents:'none', transition:'color 0.25s' }} />
        <input type={show?'text':'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="••••••••"
          onFocus={() => sF(true)} onBlur={() => sF(false)}
          style={{ width:'100%', paddingLeft:40, paddingRight:44, paddingTop:11, paddingBottom:11, borderRadius:12, border:`1.5px solid ${error?T.errBd:f?T.focusBd:T.inputBd}`, background:f?T.focusBg:T.inputBg, color:T.ink, fontSize:13, outline:'none', transition:'all 0.25s', boxShadow:error?`0 0 0 3px ${T.errBg}`:f?T.focusSh:'none' }} />
        <button type="button" onClick={toggle} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:T.inkDim, padding:0, display:'flex' }}>
          {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      </div>
      {error && <p style={{ fontSize:11, color:T.err, marginTop:5 }}>{error}</p>}
    </div>
  );
}

function SaveBtn({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-p"
      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 24px', borderRadius:12, border:'none', cursor:loading?'not-allowed':'pointer', background:`linear-gradient(135deg,${T.deep},${T.mid})`, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 20px rgba(91,74,155,0.30)`, opacity:loading?0.72:1, transition:'all 0.25s' }}>
      {loading ? <><FiLoader size={13} style={{ animation:'spin 1s linear infinite' }} /> Saving…</> : <><FiSave size={13} /> Save Changes</>}
    </button>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
const AdminProfile = () => {
  // Use updateUser NOT login — so profile changes don't wipe the token/role
  const { user, updateUser } = useAuth();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({
    name:        user?.name        || '',
    email:       user?.email       || '',
    phone:       user?.phone       || '',
    designation: user?.designation || '',
    department:  user?.department  || '',
    bio:         user?.bio         || '',
  });
  const [passwords,     setPasswords]     = useState({ current:'', newPass:'', confirm:'' });
  const [showPass,      setShowPass]      = useState({ current:false, new:false, confirm:false });
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saving,        setSaving]        = useState(false);
  const [savingPass,    setSavingPass]    = useState(false);
  const [toast,         setToast]         = useState(null);
  const [activeTab,     setActiveTab]     = useState('personal');
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f)); // show local preview immediately
  };

  /* ── Save profile ──────────────────────────────────────────────────────── */
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      // Only attach if user picked a new file
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await fetch(`${BASE_URL}/api/auth/admin/profile`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${token}` }, // NO Content-Type for multipart
        body:    fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      // ── KEY FIX: merge into localStorage so profile persists after logout ───
      updateUser(data.admin);

      // Sync avatar to Cloudinary URL returned by server
      if (data.admin?.avatar) setAvatarPreview(data.admin.avatar);
      setAvatarFile(null); // clear pending file
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Change password ───────────────────────────────────────────────────── */
  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm)
      return showToast('Passwords do not match', 'error');
    if (passwords.newPass.length < 8)
      return showToast('Min. 8 characters required', 'error');
    setSavingPass(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/admin/change-password`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setPasswords({ current:'', newPass:'', confirm:'' });
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.message || 'Failed', 'error');
    } finally {
      setSavingPass(false);
    }
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const tabs = [
    { id:'personal',   label:'Personal',   icon:FiUser      },
    { id:'admin-info', label:'Admin Info',  icon:FiBriefcase },
    { id:'security',   label:'Security',    icon:FiShield    },
  ];

  return (
    <AdminLayout title="Account Settings" subtitle="Manage your admin profile and security">
      <style>{GCSS + `
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes toastIn { from { opacity:0;transform:translateY(-10px) } to { opacity:1;transform:translateY(0) } }
        @media(max-width:900px) { .ap-grid { grid-template-columns: 1fr !important } }
        .btn-p { transition: all 0.28s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden }
        .btn-p:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(91,74,155,0.40) !important }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:200, display:'flex', alignItems:'center', gap:10, padding:'13px 20px', borderRadius:15, fontSize:13, fontWeight:600, animation:'toastIn 0.3s ease', backdropFilter:'blur(20px)', boxShadow:'0 12px 40px rgba(91,74,155,0.22)', background:toast.type==='error'?'rgba(176,42,32,0.12)':'rgba(26,155,92,0.12)', border:`1px solid ${toast.type==='error'?T.errBd:T.okBd}`, color:toast.type==='error'?T.err:T.ok }}>
          {toast.type==='error' ? <FiAlertCircle size={15} /> : <FiCheckCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:T.mid, boxShadow:`0 0 8px ${T.glow}` }} />
          <span style={{ color:T.mid, fontSize:10, fontWeight:700, letterSpacing:'0.26em', textTransform:'uppercase' }}>Admin Profile</span>
        </div>
        <h1 style={{ fontWeight:800, fontSize:26, color:T.ink, letterSpacing:-0.7, marginBottom:4 }}>Account Settings</h1>
        <p style={{ color:T.inkSoft, fontSize:13 }}>Manage your admin profile and account security</p>
      </div>

      <div className="ap-grid" style={{ display:'grid', gridTemplateColumns:'1fr 3fr', gap:20, alignItems:'start' }}>

        {/* ── Left: avatar + summary card ── */}
        <div style={CARD}>
          {/* Banner */}
          <div style={{ height:82, background:`linear-gradient(135deg,${T.deep},${T.mid})`, position:'relative' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.12) 1px,transparent 0)', backgroundSize:'20px 20px' }} />
          </div>
          <div style={{ padding:'0 22px 24px' }}>
            {/* Avatar */}
            <div style={{ position:'relative', marginTop:-34, marginBottom:14, width:'fit-content' }}>
              <div style={{ width:70, height:70, borderRadius:18, border:'3.5px solid rgba(255,255,255,0.92)', background:`linear-gradient(135deg,${T.deep},${T.mid})`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:`0 10px 26px rgba(91,74,155,0.30)` }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span style={{ color:'#fff', fontWeight:800, fontSize:22 }}>{initials || 'A'}</span>}
              </div>
              <button onClick={() => fileRef.current?.click()}
                style={{ position:'absolute', bottom:-4, right:-4, width:28, height:28, background:T.mid, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', boxShadow:`0 4px 14px rgba(91,74,155,0.44)` }}>
                <FiCamera size={13} color="#fff" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
            </div>

            {/* Pending upload indicator */}
            {avatarFile && (
              <p style={{ fontSize:11, color:T.mid, marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
                <FiCamera size={11} /> New photo selected — save to upload
              </p>
            )}

            <h3 style={{ fontWeight:700, fontSize:16, color:T.ink, marginBottom:3 }}>{profile.name || 'Admin'}</h3>
            <p style={{ fontSize:12, color:T.inkSoft, marginBottom:12 }}>{profile.email}</p>

            {/* Role badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`rgba(91,74,155,0.10)`, border:`1px solid ${T.border}`, borderRadius:9, padding:'5px 13px', marginBottom:14 }}>
              <FiShield size={11} style={{ color:T.mid }} />
              <span style={{ color:T.mid, fontSize:11, fontWeight:700, letterSpacing:'0.08em' }}>Administrator</span>
            </div>

            {profile.designation && (
              <p style={{ color:T.inkSoft, fontSize:12, marginBottom:14 }}>{profile.designation}</p>
            )}

            {/* Stats */}
            <div style={{ paddingTop:16, borderTop:`1px solid ${T.border}`, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Reviews', value:user?.totalReviewed || 0 },
                { label:'Approved', value:user?.totalApproved || 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{ background:`rgba(107,90,176,0.08)`, border:`1px solid ${T.border}`, borderRadius:12, padding:'12px', textAlign:'center' }}>
                  <p style={{ color:T.mid, fontSize:22, fontWeight:800, letterSpacing:-0.5, marginBottom:3 }}>{value}</p>
                  <p style={{ color:T.inkDim, fontSize:10, letterSpacing:'0.06em' }}>{label}</p>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:14 }}>
              <FiActivity size={11} style={{ color:T.ok }} />
              <span style={{ color:T.inkDim, fontSize:11 }}>Last active: Today</span>
            </div>

            {/* Institution details */}
            {(user?.institutionCode || user?.createdAt) && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
                {user.institutionCode && (
                  <div style={{ marginBottom:8 }}>
                    <p style={{ fontSize:9.5, color:T.inkDim, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:2 }}>Institution Code</p>
                    <p style={{ fontWeight:700, color:T.inkMid, fontSize:12 }}>{user.institutionCode}</p>
                  </div>
                )}
                {user.createdAt && (
                  <div>
                    <p style={{ fontSize:9.5, color:T.inkDim, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:2 }}>Admin Since</p>
                    <p style={{ fontWeight:700, color:T.inkMid, fontSize:12 }}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: tabs + form panels ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          {/* Tab bar */}
          <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.48)', borderRadius:15, padding:4, border:`1px solid ${T.border}`, width:'fit-content', backdropFilter:'blur(16px)' }}>
            {tabs.map(({ id, label, icon:Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer', fontSize:13, fontWeight:activeTab===id?700:500, transition:'all 0.22s', background:activeTab===id?`linear-gradient(135deg,${T.deep},${T.mid})`:'transparent', color:activeTab===id?'#fff':T.inkSoft, boxShadow:activeTab===id?`0 4px 16px rgba(91,74,155,0.30)`:'none' }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          {/* Personal tab */}
          {activeTab === 'personal' && (
            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'17px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
                <FiEdit3 size={14} style={{ color:T.mid }} />
                <h3 style={{ fontWeight:700, fontSize:15, color:T.ink, margin:0 }}>Personal Details</h3>
              </div>
              <div style={{ padding:22, display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Field label="Full Name"     icon={FiUser}  value={profile.name}  onChange={v => setProfile(p => ({ ...p, name:v }))}  placeholder="Your name" />
                  <Field label="Email Address" icon={FiMail}  type="email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email:v }))} placeholder="admin@institution.edu" />
                  <Field label="Phone Number"  icon={FiPhone} type="tel"   value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone:v }))} placeholder="+91 XXXXXXXXXX" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:9.5, fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:T.inkDim, marginBottom:7 }}>Bio</label>
                  <textarea rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio:e.target.value }))} placeholder="Brief description of your role…"
                    style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${T.inputBd}`, background:T.inputBg, color:T.ink, fontSize:13, outline:'none', resize:'none', transition:'border-color 0.25s', boxSizing:'border-box' }}
                    onFocus={e => { e.target.style.borderColor=T.focusBd; e.target.style.boxShadow=T.focusSh; }}
                    onBlur={e  => { e.target.style.borderColor=T.inputBd;  e.target.style.boxShadow='none'; }} />
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <SaveBtn onClick={handleSaveProfile} loading={saving} />
                </div>
              </div>
            </div>
          )}

          {/* Admin Info tab */}
          {activeTab === 'admin-info' && (
            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'17px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
                <FiBriefcase size={14} style={{ color:T.mid }} />
                <h3 style={{ fontWeight:700, fontSize:15, color:T.ink, margin:0 }}>Admin Information</h3>
              </div>
              <div style={{ padding:22, display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Field label="Designation" icon={FiBriefcase} value={profile.designation} onChange={v => setProfile(p => ({ ...p, designation:v }))} placeholder="e.g. Hostel Warden" />
                  <Field label="Department"  icon={FiUser}      value={profile.department}   onChange={v => setProfile(p => ({ ...p, department:v }))}  placeholder="e.g. Student Affairs" />
                </div>
                {/* Read-only institution info */}
                <div style={{ padding:'14px 16px', background:T.snow, border:`1px solid ${T.border}`, borderRadius:12 }}>
                  <p style={{ fontSize:9.5, fontWeight:700, color:T.inkDim, textTransform:'uppercase', letterSpacing:'0.20em', marginBottom:12 }}>Institution Details (Read-only)</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div>
                      <p style={{ fontSize:10, color:T.inkDim, marginBottom:4 }}>Institution Code</p>
                      <p style={{ fontWeight:700, color:T.inkMid, fontSize:12 }}>{user?.institutionCode || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:10, color:T.inkDim, marginBottom:4 }}>Admin Since</p>
                      <p style={{ fontWeight:700, color:T.inkMid, fontSize:12 }}>
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <SaveBtn onClick={handleSaveProfile} loading={saving} />
                </div>
              </div>
            </div>
          )}

          {/* Security tab */}
          {activeTab === 'security' && (
            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'17px 22px', borderBottom:`1px solid ${T.border}`, background:'rgba(246,243,253,0.70)' }}>
                <FiShield size={14} style={{ color:T.mid }} />
                <h3 style={{ fontWeight:700, fontSize:15, color:T.ink, margin:0 }}>Security Settings</h3>
              </div>
              <div style={{ padding:22, display:'flex', flexDirection:'column', gap:16 }}>
                {/* Warning notice */}
                <div style={{ padding:'12px 15px', background:'rgba(176,122,16,0.08)', border:'1px solid rgba(176,122,16,0.22)', borderRadius:12, display:'flex', gap:10, alignItems:'flex-start' }}>
                  <FiAlertCircle size={14} style={{ color:'#B07A10', flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, color:'rgba(140,96,12,0.88)', lineHeight:1.7, margin:0 }}>
                    Admin passwords must be changed every 90 days. All sessions will be terminated after a password change.
                  </p>
                </div>
                <PassField label="Current Password"    value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current:v }))} show={showPass.current} toggle={() => setShowPass(p => ({ ...p, current:!p.current }))} />
                <PassField label="New Password"        value={passwords.newPass} onChange={v => setPasswords(p => ({ ...p, newPass:v }))} show={showPass.new}     toggle={() => setShowPass(p => ({ ...p, new:!p.new }))} />
                <PassField label="Confirm New Password" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm:v }))} show={showPass.confirm} toggle={() => setShowPass(p => ({ ...p, confirm:!p.confirm }))}
                  error={passwords.confirm && passwords.newPass !== passwords.confirm ? "Passwords don't match" : ''} />
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button onClick={handleChangePassword}
                    disabled={savingPass || !passwords.current || !passwords.newPass || !passwords.confirm}
                    className="btn-p"
                    style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 24px', borderRadius:12, border:'none', cursor:(savingPass||!passwords.current||!passwords.newPass||!passwords.confirm)?'not-allowed':'pointer', background:`linear-gradient(135deg,${T.deep},${T.mid})`, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 20px rgba(91,74,155,0.28)`, opacity:(savingPass||!passwords.current||!passwords.newPass||!passwords.confirm)?0.50:1, transition:'all 0.25s' }}>
                    {savingPass ? <><FiLoader size={13} style={{ animation:'spin 1s linear infinite' }} /> Updating…</> : <><FiLock size={13} /> Change Password</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
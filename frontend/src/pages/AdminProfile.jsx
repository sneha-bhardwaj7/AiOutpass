import { useState, useRef } from 'react';
import {
  FiUser, FiMail, FiPhone, FiEdit3, FiSave, FiCamera,
  FiCheckCircle, FiAlertCircle, FiLoader, FiLock, FiEye,
  FiEyeOff, FiShield, FiActivity, FiBriefcase
} from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const AdminProfile = () => {
  const { user, login, role } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
    department: user?.department || '',
    bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.entries(profile).forEach(([k, v]) => formData.append(k, v));
      if (avatar) formData.append('avatar', avatar);
      const res = await fetch(`${BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.admin, role, token);
      showToast('Profile updated!');
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) return showToast('Passwords do not match', 'error');
    if (passwords.newPass.length < 8) return showToast('Min. 8 characters required', 'error');
    setSavingPass(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/admin/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPasswords({ current: '', newPass: '', confirm: '' });
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSavingPass(false);
    }
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const tabs = [
    { id: 'personal', label: 'Personal', icon: FiUser },
    { id: 'admin-info', label: 'Admin Info', icon: FiBriefcase },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {toast.type === 'error' ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-[#C41E3A] rounded-full" />
          <span className="text-[#C41E3A] text-sm font-semibold uppercase tracking-widest">Admin Profile</span>
        </div>
        <h1 className="text-3xl font-black text-[#1a0a0a] font-['Playfair_Display']">Account Settings</h1>
        <p className="text-[#5a3a3a]/60 mt-1 text-sm">Manage your admin profile and account security</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Admin Card */}
        <div className="xl:col-span-1">
          <div className="bg-[#1a0a0a] rounded-2xl border border-[#8B1A1A]/20 overflow-hidden shadow-xl">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-br from-[#8B1A1A] to-[#C41E3A] relative overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '16px 16px'
              }} />
            </div>

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-10 mb-4 w-fit">
                <div className="w-20 h-20 rounded-2xl border-4 border-[#1a0a0a] shadow-lg overflow-hidden bg-gradient-to-br from-[#8B1A1A] to-[#C41E3A] flex items-center justify-center">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    : <span className="text-white font-black text-2xl font-['Playfair_Display']">{initials || 'A'}</span>
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#C41E3A] rounded-lg flex items-center justify-center shadow-md hover:bg-[#8B1A1A] transition-colors"
                >
                  <FiCamera size={13} className="text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <h3 className="font-black text-[#FFF8F0] text-lg font-['Playfair_Display']">{profile.name || 'Admin'}</h3>
              <p className="text-[#F5E6D3]/50 text-sm">{profile.email}</p>

              <div className="mt-3 inline-flex items-center gap-1.5 bg-[#C41E3A]/15 border border-[#C41E3A]/20 rounded-lg px-2.5 py-1">
                <FiShield size={11} className="text-[#C41E3A]" />
                <span className="text-[#C41E3A] text-xs font-semibold">Administrator</span>
              </div>

              {profile.designation && (
                <p className="text-[#F5E6D3]/40 text-xs mt-3">{profile.designation}</p>
              )}

              {/* Stats */}
              <div className="mt-5 pt-5 border-t border-[#8B1A1A]/20 grid grid-cols-2 gap-3">
                {[
                  { label: 'Requests', value: user?.totalReviewed || 0 },
                  { label: 'Approved', value: user?.totalApproved || 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#8B1A1A]/10 border border-[#8B1A1A]/15 rounded-xl p-3 text-center">
                    <p className="text-[#C41E3A] text-xl font-black font-['Playfair_Display']">{value}</p>
                    <p className="text-[#F5E6D3]/40 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* Activity indicator */}
              <div className="mt-4 flex items-center gap-2">
                <FiActivity size={12} className="text-emerald-500" />
                <span className="text-[#F5E6D3]/40 text-xs">Last active: Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="xl:col-span-3 space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#FFF8F0] rounded-xl p-1 border border-[#e8d5c4] w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white shadow-md'
                    : 'text-[#5a3a3a]/70 hover:text-[#1a0a0a]'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
                <FiEdit3 size={15} className="text-[#C41E3A]" />
                <h3 className="font-bold text-[#1a0a0a] font-['Playfair_Display']">Personal Details</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <LightField label="Full Name" icon={FiUser} type="text" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Your name" />
                  <LightField label="Email Address" icon={FiMail} type="email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} placeholder="admin@institution.edu" />
                  <LightField label="Phone Number" icon={FiPhone} type="tel" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} placeholder="+91 XXXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Brief description of your role..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FFF8F0] border border-[#e8d5c4] text-[#1a0a0a] text-sm focus:outline-none focus:border-[#C41E3A]/50 focus:ring-2 focus:ring-[#C41E3A]/10 transition-all resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <SaveBtn onClick={handleSaveProfile} loading={saving} />
                </div>
              </div>
            </div>
          )}

          {/* Admin Info Tab */}
          {activeTab === 'admin-info' && (
            <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
                <FiBriefcase size={15} className="text-[#C41E3A]" />
                <h3 className="font-bold text-[#1a0a0a] font-['Playfair_Display']">Admin Information</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <LightField label="Designation" icon={FiBriefcase} type="text" value={profile.designation} onChange={v => setProfile(p => ({ ...p, designation: v }))} placeholder="e.g. Hostel Warden" />
                  <LightField label="Department" icon={FiUser} type="text" value={profile.department} onChange={v => setProfile(p => ({ ...p, department: v }))} placeholder="e.g. Student Affairs" />
                </div>

                {/* Read-only fields */}
                <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#e8d5c4]">
                  <p className="text-xs font-semibold text-[#5a3a3a]/60 mb-3 uppercase tracking-wider">Institution Details (Read-only)</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#5a3a3a]/50 text-xs mb-0.5">Institution Code</p>
                      <p className="font-semibold text-[#1a0a0a] font-mono text-xs">{user?.institutionCode || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[#5a3a3a]/50 text-xs mb-0.5">Admin Since</p>
                      <p className="font-semibold text-[#1a0a0a] text-xs">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <SaveBtn onClick={handleSaveProfile} loading={saving} />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
                <FiShield size={15} className="text-[#C41E3A]" />
                <h3 className="font-bold text-[#1a0a0a] font-['Playfair_Display']">Security Settings</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                  <FiAlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Admin passwords must be changed every 90 days. All sessions will be terminated after a password change.
                  </p>
                </div>
                <PwField label="Current Password" value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current: v }))} show={showPass.current} toggle={() => setShowPass(p => ({ ...p, current: !p.current }))} />
                <PwField label="New Password" value={passwords.newPass} onChange={v => setPasswords(p => ({ ...p, newPass: v }))} show={showPass.new} toggle={() => setShowPass(p => ({ ...p, new: !p.new }))} />
                <PwField label="Confirm New Password" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} show={showPass.confirm} toggle={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                  error={passwords.confirm && passwords.newPass !== passwords.confirm ? "Passwords don't match" : ''} />
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={savingPass || !passwords.current || !passwords.newPass || !passwords.confirm}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingPass ? <><FiLoader size={14} className="animate-spin" /> Updating...</> : <><FiLock size={14} /> Change Password</>}
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

const LightField = ({ label, icon: Icon, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">{label}</label>
    <div className="relative">
      <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50" />
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF8F0] border border-[#e8d5c4] text-[#1a0a0a] placeholder:text-[#5a3a3a]/40 focus:outline-none focus:border-[#C41E3A]/50 focus:ring-2 focus:ring-[#C41E3A]/10 transition-all text-sm" />
    </div>
  </div>
);

const PwField = ({ label, value, onChange, show, toggle, error }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">{label}</label>
    <div className="relative">
      <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50" />
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="••••••••"
        className={`w-full pl-10 pr-11 py-3 rounded-xl bg-[#FFF8F0] border text-[#1a0a0a] placeholder:text-[#5a3a3a]/40 focus:outline-none focus:ring-2 transition-all text-sm ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-[#e8d5c4] focus:border-[#C41E3A]/50 focus:ring-[#C41E3A]/10'}`} />
      <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50 hover:text-[#8B1A1A]">
        {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
      </button>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const SaveBtn = ({ onClick, loading }) => (
  <button onClick={onClick} disabled={loading}
    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#C41E3A]/25 hover:scale-[1.02] transition-all disabled:opacity-50">
    {loading ? <><FiLoader size={14} className="animate-spin" /> Saving...</> : <><FiSave size={14} /> Save Changes</>}
  </button>
);

export default AdminProfile;
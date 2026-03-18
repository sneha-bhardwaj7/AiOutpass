import { useState, useRef, useEffect } from 'react';
import {
  FiUser, FiMail, FiPhone, FiHash, FiHome, FiEdit3,
  FiSave, FiCamera, FiCheckCircle, FiAlertCircle, FiLoader,
  FiLock, FiEye, FiEyeOff, FiBook, FiCalendar, FiShield
} from 'react-icons/fi';
import StudentLayout from '../components/StudentLayout';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const StudentProfile = () => {
  const { user, login, role } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    collegeId: user?.collegeId || '',
    hostelRoom: user?.hostelRoom || '',
    department: user?.department || '',
    year: user?.year || '',
    bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [avatar, setAvatar] = useState(user?.avatar || null);
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
      if (avatar && typeof avatar !== 'string') formData.append('avatar', avatar);
      const res = await fetch(`${BASE_URL}/student/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.student, role, token);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) return showToast('Passwords do not match', 'error');
    if (passwords.newPass.length < 8) return showToast('Password must be at least 8 characters', 'error');
    setSavingPass(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/student/change-password`, {
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

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'academic', label: 'Academic', icon: FiBook },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <StudentLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-bounce-once ${
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {toast.type === 'error' ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-[#C41E3A] rounded-full" />
          <span className="text-[#C41E3A] text-sm font-semibold uppercase tracking-widest">Profile</span>
        </div>
        <h1 className="text-3xl font-black text-[#1a0a0a] font-['Playfair_Display']">My Profile</h1>
        <p className="text-[#5a3a3a]/60 mt-1 text-sm">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-br from-[#8B1A1A] to-[#C41E3A] relative">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Avatar */}
            <div className="px-6 pb-6">
              <div className="relative -mt-10 mb-4 w-fit">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#8B1A1A] to-[#C41E3A] flex items-center justify-center">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    : <span className="text-white font-black text-2xl font-['Playfair_Display']">{initials || 'S'}</span>
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

              <h3 className="font-black text-[#1a0a0a] text-lg font-['Playfair_Display']">{profile.name || 'Student'}</h3>
              <p className="text-[#5a3a3a]/60 text-sm">{profile.email}</p>

              <div className="mt-4 space-y-2">
                {profile.collegeId && (
                  <div className="flex items-center gap-2 text-xs text-[#5a3a3a]/70">
                    <FiHash size={12} className="text-[#C41E3A]" />
                    <span>{profile.collegeId}</span>
                  </div>
                )}
                {profile.hostelRoom && (
                  <div className="flex items-center gap-2 text-xs text-[#5a3a3a]/70">
                    <FiHome size={12} className="text-[#C41E3A]" />
                    <span>{profile.hostelRoom}</span>
                  </div>
                )}
                {profile.department && (
                  <div className="flex items-center gap-2 text-xs text-[#5a3a3a]/70">
                    <FiBook size={12} className="text-[#C41E3A]" />
                    <span>{profile.department} · {profile.year}</span>
                  </div>
                )}
              </div>

              {/* Completion meter */}
              <div className="mt-5 pt-5 border-t border-[#f0e0d0]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#5a3a3a]/70">Profile Completion</p>
                  <p className="text-xs font-bold text-[#C41E3A]">
                    {Math.round([profile.name, profile.email, profile.phone, profile.collegeId, profile.hostelRoom, profile.department, profile.year, profile.bio].filter(Boolean).length / 8 * 100)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-[#f0e0d0] rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] rounded-full transition-all duration-700"
                    style={{ width: `${Math.round([profile.name, profile.email, profile.phone, profile.collegeId, profile.hostelRoom, profile.department, profile.year, profile.bio].filter(Boolean).length / 8 * 100)}%` }}
                  />
                </div>
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
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
                <FiEdit3 size={15} className="text-[#C41E3A]" />
                <h3 className="font-bold text-[#1a0a0a] font-['Playfair_Display']">Personal Information</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <LightField label="Full Name" icon={FiUser} type="text" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Your full name" />
                  <LightField label="Email Address" icon={FiMail} type="email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} placeholder="your@email.com" />
                  <LightField label="Phone Number" icon={FiPhone} type="tel" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} placeholder="+91 9876543210" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">Bio (Optional)</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell something about yourself..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FFF8F0] border border-[#e8d5c4] text-[#1a0a0a] text-sm focus:outline-none focus:border-[#C41E3A]/50 focus:ring-2 focus:ring-[#C41E3A]/10 transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#C41E3A]/25 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {saving ? <><FiLoader size={14} className="animate-spin" /> Saving...</> : <><FiSave size={14} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
                <FiBook size={15} className="text-[#C41E3A]" />
                <h3 className="font-bold text-[#1a0a0a] font-['Playfair_Display']">Academic Information</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <LightField label="College ID / Roll No." icon={FiHash} type="text" value={profile.collegeId} onChange={v => setProfile(p => ({ ...p, collegeId: v }))} placeholder="e.g. CSE2021001" />
                  <LightField label="Hostel & Room Number" icon={FiHome} type="text" value={profile.hostelRoom} onChange={v => setProfile(p => ({ ...p, hostelRoom: v }))} placeholder="e.g. Block A, Room 204" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">Department</label>
                    <select
                      value={profile.department}
                      onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-[#FFF8F0] border border-[#e8d5c4] text-[#1a0a0a] focus:outline-none focus:border-[#C41E3A]/50 focus:ring-2 focus:ring-[#C41E3A]/10 transition-all text-sm appearance-none"
                    >
                      <option value="">Select Department</option>
                      {['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Other'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">Year of Study</label>
                    <select
                      value={profile.year}
                      onChange={e => setProfile(p => ({ ...p, year: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-[#FFF8F0] border border-[#e8d5c4] text-[#1a0a0a] focus:outline-none focus:border-[#C41E3A]/50 focus:ring-2 focus:ring-[#C41E3A]/10 transition-all text-sm appearance-none"
                    >
                      <option value="">Select Year</option>
                      {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#C41E3A]/25 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {saving ? <><FiLoader size={14} className="animate-spin" /> Saving...</> : <><FiSave size={14} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
                <FiShield size={15} className="text-[#C41E3A]" />
                <h3 className="font-bold text-[#1a0a0a] font-['Playfair_Display']">Security & Password</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="p-4 bg-[#FFF8F0] rounded-xl border border-[#e8d5c4]">
                  <p className="text-xs text-[#5a3a3a]/60 leading-relaxed">
                    Use a strong, unique password with at least 8 characters, including uppercase, numbers, and special characters.
                  </p>
                </div>

                <PasswordField label="Current Password" value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current: v }))} show={showPass.current} toggle={() => setShowPass(p => ({ ...p, current: !p.current }))} placeholder="Enter current password" />
                <PasswordField label="New Password" value={passwords.newPass} onChange={v => setPasswords(p => ({ ...p, newPass: v }))} show={showPass.new} toggle={() => setShowPass(p => ({ ...p, new: !p.new }))} placeholder="Enter new password" />
                <PasswordField label="Confirm New Password" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} show={showPass.confirm} toggle={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))} placeholder="Re-enter new password"
                  error={passwords.confirm && passwords.newPass !== passwords.confirm ? "Passwords don't match" : ''} />

                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={savingPass || !passwords.current || !passwords.newPass || !passwords.confirm}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingPass ? <><FiLoader size={14} className="animate-spin" /> Updating...</> : <><FiLock size={14} /> Update Password</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

const LightField = ({ label, icon: Icon, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">{label}</label>
    <div className="relative">
      <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50" />
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF8F0] border border-[#e8d5c4] text-[#1a0a0a] placeholder:text-[#5a3a3a]/40 focus:outline-none focus:border-[#C41E3A]/50 focus:ring-2 focus:ring-[#C41E3A]/10 transition-all text-sm"
      />
    </div>
  </div>
);

const PasswordField = ({ label, value, onChange, show, toggle, placeholder, error }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">{label}</label>
    <div className="relative">
      <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-11 py-3 rounded-xl bg-[#FFF8F0] border text-[#1a0a0a] placeholder:text-[#5a3a3a]/40 focus:outline-none focus:ring-2 transition-all text-sm ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-[#e8d5c4] focus:border-[#C41E3A]/50 focus:ring-[#C41E3A]/10'}`}
      />
      <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50 hover:text-[#8B1A1A]">
        {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
      </button>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default StudentProfile;
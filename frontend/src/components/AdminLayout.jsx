import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiList, FiBarChart2, FiFileText, FiLogOut, FiShield, FiSettings, FiUsers
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/admin/requests', label: 'All Requests', icon: FiList },
    { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: FiFileText },
    { to: '/admin/profile', label: 'My Profile', icon: FiUsers },
    { to: '/admin/parents', label: 'Parents', icon: FiUsers },
  ];

  return (
    <aside className="w-64 bg-[#120606] flex flex-col fixed h-full z-30 shadow-2xl border-r border-[#8B1A1A]/10">
      {/* Logo */}
      <div className="p-6 border-b border-[#8B1A1A]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B1A1A] to-[#C41E3A] rounded-xl flex items-center justify-center shadow-lg shadow-[#C41E3A]/30">
            <MdOutlineSchool className="text-[#FFF8F0] text-xl" />
          </div>
          <div>
            <p className="text-[#FFF8F0] font-bold text-lg font-['Playfair_Display'] leading-none">
              Pass<span className="text-[#C41E3A]">With</span>AI
            </p>
            <p className="text-[#F5E6D3]/40 text-xs mt-0.5">Admin Control</p>
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-[#8B1A1A]/30 to-[#C41E3A]/10 border border-[#C41E3A]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#C41E3A] to-[#8B1A1A] rounded-lg flex items-center justify-center">
            <FiShield size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[#F5E6D3] text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
            <p className="text-[#C41E3A] text-xs font-medium">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6 space-y-1">
        <p className="text-[#F5E6D3]/25 text-xs font-semibold uppercase tracking-widest px-4 mb-3">Main Menu</p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white shadow-lg shadow-[#C41E3A]/20'
                  : 'text-[#F5E6D3]/60 hover:bg-[#8B1A1A]/20 hover:text-[#F5E6D3]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-white' : 'text-[#C41E3A] group-hover:scale-110 transition-transform'} />
                <span className="text-sm font-medium">{label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5E6D3]/60 hover:bg-[#8B1A1A]/20 hover:text-[#F5E6D3] transition-all duration-200 group">
          <FiSettings size={17} className="group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5E6D3]/60 hover:bg-[#C41E3A]/20 hover:text-[#C41E3A] transition-all duration-200 group"
        >
          <FiLogOut size={17} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const AdminLayout = ({ children }) => (
  <div className="min-h-screen flex bg-[#FFF8F0]" style={{ fontFamily: "'Crimson Pro', serif" }}>
    <AdminSidebar />
    <main className="flex-1 ml-64 min-h-screen bg-[#f9f3ec]">
      <div className="p-8">{children}</div>
    </main>
  </div>
);

export default AdminLayout;
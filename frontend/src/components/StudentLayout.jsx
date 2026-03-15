import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiClock, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  const links = [
    { to: '/student/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/student/request', label: 'New Request', icon: FiPlusCircle },
    { to: '/student/status', label: 'My Status', icon: FiClock },
    { to: '/student/profile', label: 'My Profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen flex bg-[#FFF8F0]" style={{ fontFamily: "'Crimson Pro', serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0a0a] flex flex-col fixed h-full z-30 shadow-2xl">
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
              <p className="text-[#F5E6D3]/40 text-xs mt-0.5">Student Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-br from-[#8B1A1A]/20 to-[#C41E3A]/10 border border-[#8B1A1A]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#8B1A1A] to-[#C41E3A] rounded-lg flex items-center justify-center">
              <FiUser size={15} className="text-white" />
            </div>
            <div>
              <p className="text-[#F5E6D3] text-sm font-semibold truncate">{user?.name || 'Student'}</p>
              <p className="text-[#F5E6D3]/50 text-xs truncate">{user?.collegeId || 'ID: N/A'}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 mt-6 space-y-1">
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white/70 rounded-full" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5E6D3]/60 hover:bg-[#C41E3A]/20 hover:text-[#C41E3A] transition-all duration-200 group"
          >
            <FiLogOut size={17} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-[#FFF8F0]">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default StudentLayout;
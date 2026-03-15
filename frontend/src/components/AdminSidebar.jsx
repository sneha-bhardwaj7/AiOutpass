// src/components/AdminSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ClipboardList,
  Shield,
  LogOut,
  ChevronRight,
  Zap,
  Bell,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    group: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    ],
  },
  {
    group: "Management",
    items: [
      { to: "/admin/requests", label: "All Requests", icon: <FileText size={18} />, badge: "12" },
      { to: "/admin/audit-logs", label: "Audit Logs", icon: <ClipboardList size={18} /> },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-burgundy flex flex-col z-40 shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur border border-white/20">
            <Shield size={20} className="text-cream" />
          </div>
          <div>
            <p className="font-display font-bold text-cream text-lg leading-none">
              OutpassAI
            </p>
            <p className="text-[10px] text-cream/50 tracking-widest uppercase mt-0.5">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* Admin Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 bg-white/8 rounded-xl">
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cream truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-cream/50 truncate">{user?.email}</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-semibold text-cream/40 uppercase tracking-widest mb-2 px-3">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-white/15 text-cream nav-active shadow-sm"
                        : "text-cream/60 hover:bg-white/8 hover:text-cream"
                    }`}
                  >
                    <span className={`transition-transform group-hover:scale-105 ${isActive ? "text-cream" : "text-cream/50"}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight size={14} className="text-cream/50" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* AI Status Indicator */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-white/8 rounded-xl">
          <div className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-cream">AI Engine</p>
            <p className="text-[10px] text-green-400">Active & Running</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full status-pulse"></div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cream/50 hover:bg-red-500/20 hover:text-red-300 transition-all group"
        >
          <LogOut size={16} className="group-hover:scale-105 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
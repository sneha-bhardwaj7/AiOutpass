// src/components/AdminLayout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  FiGrid, FiList, FiBarChart2, FiFileText, FiLogOut,
  FiShield, FiSettings, FiUsers, FiBell, FiChevronRight,
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard',    icon: FiGrid,      badge: null },
  { to: '/admin/requests',  label: 'All Requests', icon: FiList,      badge: '12' },
  { to: '/admin/analytics', label: 'Analytics',    icon: FiBarChart2, badge: null },
  { to: '/admin/audit-logs',label: 'Audit Logs',   icon: FiFileText,  badge: null },
  { to: '/admin/parents',   label: 'Parents',      icon: FiUsers,     badge: null },
  { to: '/admin/profile',   label: 'My Profile',   icon: FiUsers,     badge: null },
];

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .sidebar-root * { box-sizing: border-box; }
  .sidebar-root {
    width: 256px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    z-index: 30;
    background: #1a0608;
    border-right: 1px solid rgba(255,255,255,0.05);
    font-family: 'Sora', sans-serif;
  }

  /* Logo zone */
  .sb-logo-zone {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 12px;
  }
  .sb-logo-icon {
    width: 40px; height: 40px; flex-shrink: 0;
    background: #8B1A1A;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(139,26,26,0.40);
  }
  .sb-logo-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800; font-size: 17px;
    color: #fdf5f0; line-height: 1; letter-spacing: -0.02em;
  }
  .sb-logo-title em { color: #E8293F; font-style: normal; }
  .sb-logo-sub {
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.20em; text-transform: uppercase;
    color: rgba(255,255,255,0.18); margin-top: 3px;
    font-family: 'Sora', sans-serif;
  }

  /* Admin badge */
  .sb-badge {
    margin: 14px 14px 0;
    padding: 11px 13px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .sb-badge-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    background: #8B1A1A;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(139,26,26,0.35);
  }
  .sb-badge-name {
    color: #f0e4db; font-size: 13px; font-weight: 600;
    line-height: 1; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }
  .sb-badge-role {
    color: #C41E3A; font-size: 9px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    margin-top: 3px; font-family: 'Sora', sans-serif;
  }
  .sb-online-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #34d399; flex-shrink: 0;
    box-shadow: 0 0 0 2.5px rgba(52,211,153,0.18);
    animation: sbPulse 2.2s ease-in-out infinite;
  }
  @keyframes sbPulse { 0%,100%{opacity:1} 50%{opacity:0.45} }

  /* Nav section label */
  .sb-nav-label {
    font-size: 8.5px; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(255,255,255,0.12);
    padding: 0 12px; margin-bottom: 6px;
    font-family: 'Sora', sans-serif;
  }

  /* Nav links */
  .sb-nav { flex: 1; padding: 18px 10px 10px; overflow-y: auto; scrollbar-width: none; }
  .sb-nav::-webkit-scrollbar { display: none; }

  .sb-link {
    position: relative;
    display: flex; align-items: center; gap: 11px;
    padding: 10px 12px;
    border-radius: 11px;
    margin-bottom: 3px;
    text-decoration: none;
    transition: background 0.16s, color 0.16s;
    color: rgba(255,255,255,0.35);
    font-size: 13px; font-weight: 400;
  }
  .sb-link:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.65); }
  .sb-link.active {
    background: #8B1A1A;
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 3px 10px rgba(139,26,26,0.35);
  }
  .sb-link-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    transition: background 0.16s;
  }
  .sb-link.active .sb-link-icon { background: rgba(255,255,255,0.15); }
  .sb-link:hover:not(.active) .sb-link-icon { background: rgba(255,255,255,0.08); }

  .sb-link-label { flex: 1; }

  .sb-badge-count {
    padding: 2px 8px; border-radius: 20px;
    font-size: 9.5px; font-weight: 700;
    font-family: 'Sora', sans-serif;
  }
  .sb-link.active .sb-badge-count {
    background: rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.85);
  }
  .sb-link:not(.active) .sb-badge-count {
    background: rgba(196,30,58,0.18);
    color: #E8293F;
  }

  /* Divider */
  .sb-divider { height: 1px; margin: 0 14px; background: rgba(255,255,255,0.05); }

  /* Bottom buttons */
  .sb-bottom { padding: 10px 10px 14px; }
  .sb-bottom-btn {
    width: 100%; display: flex; align-items: center; gap: 11px;
    padding: 10px 12px; border-radius: 11px;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.28); font-size: 13px;
    font-family: 'Sora', sans-serif;
    transition: all 0.16s; text-align: left;
    margin-bottom: 2px;
  }
  .sb-bottom-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.55); }
  .sb-bottom-btn.logout:hover { background: rgba(220,38,38,0.12); color: #f87171; }
  .sb-bottom-btn-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; background: rgba(255,255,255,0.05);
  }

  /* Layout root */
  .layout-root {
    min-height: 100vh; display: flex;
    background: #fafaf9;
    font-family: 'Sora', sans-serif;
  }
  .layout-main {
    flex: 1; margin-left: 256px; min-height: 100vh;
    display: flex; flex-direction: column;
  }

  /* Topbar */
  .layout-topbar {
    position: sticky; top: 0; z-index: 20;
    background: rgba(250,250,249,0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1.5px solid #e7e5e4;
    padding: 14px 32px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .layout-topbar-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800; font-size: 22px;
    color: #0f172a; line-height: 1; letter-spacing: -0.02em;
  }
  .layout-topbar-sub {
    font-size: 11px; color: #94a3b8;
    margin-top: 3px; font-family: 'Sora', sans-serif;
  }
  .layout-live-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 13px;
    background: #f0fdf4;
    border: 1.5px solid #a7f3d0;
    border-radius: 20px;
  }
  .layout-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #10b981;
    animation: sbPulse 2.2s ease-in-out infinite;
  }
  .layout-live-text {
    font-size: 10px; font-weight: 700;
    color: #065f46; font-family: 'Sora', sans-serif;
    letter-spacing: 0.06em;
  }

  /* Content */
  .layout-content { padding: 28px 32px; flex: 1; }
`;

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <style>{sidebarStyles}</style>
      <aside className="sidebar-root">

        {/* Logo */}
        <div className="sb-logo-zone">
          <div className="sb-logo-icon">
            <MdOutlineSchool style={{ color: '#FFF8F0', fontSize: '20px' }} />
          </div>
          <div>
            <p className="sb-logo-title">
              Pass<em>With</em>AI
            </p>
            <p className="sb-logo-sub">Admin Portal</p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="sb-badge">
          <div className="sb-badge-icon">
            <FiShield size={15} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="sb-badge-name">{user?.name || 'Admin'}</p>
            <p className="sb-badge-role">Administrator</p>
          </div>
          <div className="sb-online-dot" />
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          <p className="sb-nav-label">Navigation</p>

          {navLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span className="sb-link-icon">
                    <Icon size={14} />
                  </span>
                  <span className="sb-link-label">{label}</span>
                  {badge && (
                    <span className="sb-badge-count">{badge}</span>
                  )}
                  {isActive && (
                    <FiChevronRight size={12} style={{ opacity: 0.45 }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="sb-divider" />

        {/* Bottom */}
        <div className="sb-bottom">
          <button className="sb-bottom-btn">
            <span className="sb-bottom-btn-icon"><FiSettings size={14} /></span>
            Settings
          </button>
          <button
            className="sb-bottom-btn logout"
            onClick={() => { logout?.(); navigate('/admin/login'); }}
          >
            <span className="sb-bottom-btn-icon"><FiLogOut size={14} /></span>
            Logout
          </button>
        </div>

      </aside>
    </>
  );
};

const AdminLayout = ({ children, title, subtitle }) => (
  <>
    <style>{sidebarStyles}</style>
    <div className="layout-root">
      <AdminSidebar />
      <main className="layout-main">
        {(title || subtitle) && (
          <div className="layout-topbar">
            <div>
              {title    && <h1 className="layout-topbar-title">{title}</h1>}
              {subtitle && <p className="layout-topbar-sub">{subtitle}</p>}
            </div>
            <div className="layout-live-pill">
              <div className="layout-live-dot" />
              <span className="layout-live-text">LIVE</span>
            </div>
          </div>
        )}
        <div className="layout-content">{children}</div>
      </main>
    </div>
  </>
);

export default AdminLayout;
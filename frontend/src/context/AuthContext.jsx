// src/context/AuthContext.jsx
//
// Key additions vs original:
//  1. updateUser(partialData) — merges changed fields into state + localStorage
//     WITHOUT touching token/role. Use this in profile save handlers so
//     updated data persists across logout.
//  2. On mount: reads localStorage synchronously (no flash), then re-fetches
//     GET /api/auth/profile to pick up latest avatar/fields from DB.
//  3. login() normalises _id vs id so both API shapes work.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {

  // ── Synchronous initialisation — no blank flash on refresh ─────────────────
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const [role,    setRole]    = useState(() => localStorage.getItem("role")  || null);
  const [token,   setToken]   = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ── Re-fetch profile from DB on mount so latest data is always current ──────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) { setLoading(false); return; }

    fetch(`${BASE}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Token invalid");
        return res.json();
      })
      .then(freshUser => {
        const stored = (() => {
          try { return JSON.parse(localStorage.getItem("user") || "{}"); }
          catch { return {}; }
        })();
        const merged = { ...stored, ...freshUser, _id: freshUser._id || freshUser.id };
        setUser(merged);
        setRole(merged.role);
        localStorage.setItem("user", JSON.stringify(merged));
        localStorage.setItem("role", merged.role);
      })
      .catch(_clear)               // expired / invalid token → log out
      .finally(() => setLoading(false));
  }, []);

  // ── _clear: wipe all auth state + storage ──────────────────────────────────
  function _clear() {
    setUser(null); setRole(null); setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  // ── login(): called after signup / login API response ──────────────────────
  const login = (userData, userRole, authToken) => {
    const normalised = { ...userData, _id: userData._id || userData.id };
    const r = userRole  || normalised.role;
    const t = authToken || token;
    setUser(normalised); setRole(r); setToken(t);
    localStorage.setItem("user",  JSON.stringify(normalised));
    localStorage.setItem("role",  r);
    localStorage.setItem("token", t);
  };

  // ── updateUser(): called after a profile save ───────────────────────────────
  // Merges ONLY the provided fields — token and role are never touched.
  // This is what StudentProfile + AdminProfile must use (not login()).
  const updateUser = (partialData) => {
    setUser(prev => {
      const next = {
        ...prev,
        ...partialData,
        _id: partialData._id || partialData.id || prev?._id,
      };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  // ── logout() ────────────────────────────────────────────────────────────────
  const logout = _clear;

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
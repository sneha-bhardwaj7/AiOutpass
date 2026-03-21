// src/context/AuthContext.jsx
//
// ── FIX: Added updateUser() ───────────────────────────────────────────────────
//  ERROR: "updateUser is not a function"
//  CAUSE: AuthContext only exposed { user, role, token, loading, login, logout }
//         — updateUser was missing, so AdminProfile & StudentProfile crashed
//         when clicking Save Changes.
//
//  updateUser(fields) merges only the changed fields into:
//    1. React state        → UI reflects new values instantly
//    2. localStorage "user"→ survives page reload (profile no longer disappears)
//  Token and role are NEVER touched — safe to call after any profile PUT.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);   // 'student' | 'admin'
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Boot: rehydrate from localStorage ────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("user");
    const storedRole  = localStorage.getItem("role");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      } catch {
        // Corrupted JSON — wipe and force re-login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    }
    setLoading(false);
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────────
  const login = useCallback((userData, userRole, authToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("role",  userRole);
  }, []);

  // ── updateUser ────────────────────────────────────────────────────────────────
  // THE FIX: this was the missing function causing "updateUser is not a function"
  // Usage: updateUser(data.admin)  or  updateUser(data.student)
  // Effect: merges new fields into state + localStorage without touching token
  const updateUser = useCallback((updatedFields) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        login,
        logout,
        updateUser,   // ← now exposed, fixes the crash in AdminProfile & StudentProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
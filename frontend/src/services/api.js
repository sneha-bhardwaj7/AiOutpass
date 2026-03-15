// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  studentLogin: (body) =>
    fetch(`${BASE_URL}/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  adminLogin: (body) =>
    fetch(`${BASE_URL}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  logout: () =>
    fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    }).then(handleResponse),
};

// ─── Outpass Requests ────────────────────────────────────────
export const outpassAPI = {
  submit: (body) =>
    fetch(`${BASE_URL}/outpass/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    }).then(handleResponse),

  getMyRequests: () =>
    fetch(`${BASE_URL}/outpass/my-requests`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getRequestById: (id) =>
    fetch(`${BASE_URL}/outpass/${id}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/outpass/all?${query}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse);
  },

  adminAction: (id, body) =>
    fetch(`${BASE_URL}/outpass/${id}/admin-action`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    }).then(handleResponse),

  getStatus: (id) =>
    fetch(`${BASE_URL}/outpass/${id}/status`).then(handleResponse),
};

// ─── Parent Approval ─────────────────────────────────────────
export const parentAPI = {
  getRequestByToken: (token) =>
    fetch(`${BASE_URL}/parent/verify/${token}`).then(handleResponse),

  submitApproval: (token, formData) =>
    fetch(`${BASE_URL}/parent/approve/${token}`, {
      method: "POST",
      body: formData,
    }).then(handleResponse),

  verifyOTP: (token, otp) =>
    fetch(`${BASE_URL}/parent/verify-otp/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    }).then(handleResponse),
};

// ─── Analytics ───────────────────────────────────────────────
export const analyticsAPI = {
  getDashboardStats: () =>
    fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getTrends: (period = "month") =>
    fetch(`${BASE_URL}/analytics/trends?period=${period}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/analytics/audit-logs?${query}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse);
  },
};

// ─── AI Insights ─────────────────────────────────────────────
export const aiAPI = {
  getInsights: (id) =>
    fetch(`${BASE_URL}/ai/insights/${id}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getRiskAnalysis: () =>
    fetch(`${BASE_URL}/ai/risk-summary`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),
};

export default {
  auth: authAPI,
  outpass: outpassAPI,
  parent: parentAPI,
  analytics: analyticsAPI,
  ai: aiAPI,
};
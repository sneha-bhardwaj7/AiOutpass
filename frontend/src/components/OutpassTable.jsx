// src/components/OutpassTable.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye, Search, ChevronDown, ChevronUp, CheckCircle,
  XCircle, Download, ArrowUpDown, SlidersHorizontal, Calendar,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import RiskIndicator from "./RiskIndicator";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .tbl-root * { box-sizing: border-box; }
  .tbl-root { font-family: 'Sora', sans-serif; }

  .tbl-wrap {
    background: #ffffff;
    border-radius: 18px;
    border: 1.5px solid #ede8e3;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 0 transparent;
  }

  /* ── Toolbar ── */
  .tbl-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: #faf8f6;
    border-bottom: 1.5px solid #ede8e3;
  }

  .tbl-search-wrap {
    flex: 1;
    min-width: 200px;
    position: relative;
  }
  .tbl-search-wrap input {
    width: 100%;
    padding: 9px 36px 9px 36px;
    font-size: 12.5px;
    font-family: 'Sora', sans-serif;
    font-weight: 400;
    background: #ffffff;
    border: 1.5px solid #e4ddd7;
    border-radius: 10px;
    outline: none;
    color: #2d1a14;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .tbl-search-wrap input:focus {
    border-color: #8B1A1A;
    box-shadow: 0 0 0 3px rgba(139,26,26,0.08);
  }
  .tbl-search-wrap input::placeholder { color: #b8a99e; }
  .tbl-search-icon {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%);
    color: #c4a89a; pointer-events: none;
  }
  .tbl-clear-btn {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #b8a99e; font-size: 16px; line-height: 1;
    padding: 2px 4px; border-radius: 4px;
    transition: color 0.15s;
  }
  .tbl-clear-btn:hover { color: #8B1A1A; }

  .tbl-select-wrap {
    position: relative;
  }
  .tbl-select-wrap select {
    padding: 9px 32px 9px 36px;
    font-size: 12.5px;
    font-family: 'Sora', sans-serif;
    font-weight: 500;
    background: #ffffff;
    border: 1.5px solid #e4ddd7;
    border-radius: 10px;
    outline: none;
    appearance: none;
    cursor: pointer;
    color: #3d1a10;
    transition: border-color 0.18s;
  }
  .tbl-select-wrap select:focus { border-color: #8B1A1A; }
  .tbl-select-icon-l {
    position: absolute; left: 11px; top: 50%;
    transform: translateY(-50%); pointer-events: none; color: #c4a89a;
  }
  .tbl-select-icon-r {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%); pointer-events: none; color: #c4a89a;
  }

  .tbl-export-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 14px;
    font-size: 12.5px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    background: #ffffff;
    border: 1.5px solid #e4ddd7;
    border-radius: 10px;
    cursor: pointer;
    color: #5a3a2e;
    transition: all 0.18s;
  }
  .tbl-export-btn:hover {
    border-color: #8B1A1A;
    color: #8B1A1A;
    background: #fdf5f5;
  }

  .tbl-count-pill {
    margin-left: auto;
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px;
    background: #f5f0eb;
    border: 1.5px solid #e4ddd7;
    border-radius: 20px;
  }
  .tbl-count-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #8B1A1A; opacity: 0.5;
  }
  .tbl-count-text {
    font-size: 11.5px; font-weight: 600;
    color: #7a4a3a;
    font-family: 'Sora', sans-serif;
  }

  /* ── Table ── */
  .tbl-table { width: 100%; border-collapse: collapse; }

  .tbl-th {
    text-align: left;
    padding: 11px 18px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #a08070;
    cursor: pointer; user-select: none;
    background: #fdf9f7;
    border-bottom: 1.5px solid #ede8e3;
    white-space: nowrap;
    font-family: 'Sora', sans-serif;
    transition: color 0.15s;
  }
  .tbl-th:hover { color: #8B1A1A; }
  .tbl-th-inner { display: flex; align-items: center; gap: 5px; }

  .tbl-tr {
    border-bottom: 1.5px solid #f5f0eb;
    background: #ffffff;
    transition: background 0.14s;
  }
  .tbl-tr:last-child { border-bottom: none; }
  .tbl-tr:hover { background: #fdf8f6; }

  .tbl-td { padding: 13px 18px; vertical-align: middle; }

  /* Avatar */
  .tbl-avatar {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    flex-shrink: 0;
    font-family: 'Sora', sans-serif;
  }

  /* Actions */
  .tbl-actions { display: flex; align-items: center; gap: 2px; }
  .tbl-action-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px;
    border-radius: 8px; border: none;
    background: transparent; cursor: pointer;
    color: #a08070;
    transition: all 0.15s;
    text-decoration: none;
  }
  .tbl-action-btn:hover { background: #f5f0eb; color: #8B1A1A; }
  .tbl-action-btn.approve:hover { background: #ecfdf5; color: #059669; }
  .tbl-action-btn.reject:hover  { background: #fef2f2; color: #dc2626; }

  /* Shimmer */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #f0ebe6 25%, #e8e2dc 50%, #f0ebe6 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 8px;
  }

  /* Empty state */
  .tbl-empty {
    padding: 60px 20px;
    text-align: center;
    display: flex; flex-direction: column;
    align-items: center; gap: 12px;
  }
  .tbl-empty-icon {
    width: 52px; height: 52px; border-radius: 16px;
    background: #f5f0eb;
    display: flex; align-items: center; justify-content: center;
    color: #c4a89a;
  }
  .tbl-empty-title {
    font-size: 14px; font-weight: 600; color: #9a7060;
    font-family: 'Sora', sans-serif;
  }
  .tbl-empty-clear {
    font-size: 12px; color: #8B1A1A;
    background: none; border: none; cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px;
    font-family: 'Sora', sans-serif;
    transition: opacity 0.15s;
  }
  .tbl-empty-clear:hover { opacity: 0.7; }

  /* Pagination */
  .tbl-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 18px;
    border-top: 1.5px solid #ede8e3;
    background: #faf8f6;
  }
  .tbl-footer-info {
    font-size: 11.5px; color: #a08070;
    font-family: 'Sora', sans-serif;
  }
  .tbl-footer-info strong { color: #5a3a2e; font-weight: 600; }
  .tbl-page-btns { display: flex; gap: 4px; }
  .tbl-page-btn {
    width: 30px; height: 30px;
    border-radius: 8px; border: 1.5px solid transparent;
    font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: 'Sora', sans-serif;
    transition: all 0.15s;
  }
  .tbl-page-btn.active {
    background: #8B1A1A; color: #ffffff;
    border-color: #8B1A1A;
    box-shadow: 0 2px 8px rgba(139,26,26,0.28);
  }
  .tbl-page-btn.inactive {
    background: transparent; color: #a08070;
    border-color: #e4ddd7;
  }
  .tbl-page-btn.inactive:hover {
    border-color: #8B1A1A; color: #8B1A1A; background: #fdf5f5;
  }

  /* Mono for IDs and dates */
  .mono { font-family: 'JetBrains Mono', monospace; }
`;

export default function OutpassTable({ data = [], loading = false, showActions = true }) {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField]     = useState("createdAt");
  const [sortDir, setSortDir]         = useState("desc");
  const [hoveredRow, setHoveredRow]   = useState(null);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = (data || [])
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        (r.studentName?.toLowerCase().includes(q) ||
          r.studentId?.toLowerCase().includes(q) ||
          r.destination?.toLowerCase().includes(q)) &&
        (statusFilter === "all" || r.status === statusFilter)
      );
    })
    .sort((a, b) => {
      const val = sortDir === "asc" ? 1 : -1;
      return a[sortField] > b[sortField] ? val : -val;
    });

  const SortIcon = ({ field }) => (
    sortField === field
      ? sortDir === "asc"
        ? <ChevronUp size={11} style={{ color: "#8B1A1A" }} />
        : <ChevronDown size={11} style={{ color: "#8B1A1A" }} />
      : <ArrowUpDown size={10} style={{ opacity: 0.25 }} />
  );

  const avatarPalette = [
    { bg: "#fdf2f2", color: "#8B1A1A" },
    { bg: "#eff6ff", color: "#1d4ed8" },
    { bg: "#f0fdf4", color: "#15803d" },
    { bg: "#fdf4ff", color: "#7e22ce" },
    { bg: "#fff7ed", color: "#c2410c" },
  ];

  const cols = [
    { label: "Student",     field: "studentName"   },
    { label: "Destination", field: "destination"   },
    { label: "Date",        field: "leaveDateFrom"  },
    { label: "Status",      field: "status"        },
    { label: "Risk",        field: "riskLevel"     },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="tbl-root">
        <div className="tbl-wrap">

          {/* ── Toolbar ── */}
          <div className="tbl-toolbar">
            {/* Search */}
            <div className="tbl-search-wrap">
              <Search size={13} className="tbl-search-icon" />
              <input
                type="text"
                placeholder="Search by name, ID or destination…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="tbl-clear-btn" onClick={() => setSearch("")}>×</button>
              )}
            </div>

            {/* Status filter */}
            <div className="tbl-select-wrap">
              <SlidersHorizontal size={12} className="tbl-select-icon-l" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {["all","pending","parent-pending","approved","rejected","manual-review","flagged"].map(v => (
                  <option key={v} value={v}>
                    {v === "all" ? "All Statuses" : v.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
              <ChevronDown size={10} className="tbl-select-icon-r" />
            </div>

            {/* Export */}
            <button className="tbl-export-btn">
              <Download size={13} /> Export
            </button>

            {/* Count */}
            <div className="tbl-count-pill">
              <div className="tbl-count-dot" />
              <span className="tbl-count-text">{filtered.length} results</span>
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table className="tbl-table">
              <thead>
                <tr>
                  {cols.map(col => (
                    <th key={col.field} className="tbl-th" onClick={() => handleSort(col.field)}>
                      <div className="tbl-th-inner">
                        {col.label} <SortIcon field={col.field} />
                      </div>
                    </th>
                  ))}
                  {showActions && (
                    <th className="tbl-th" style={{ cursor: "default" }}>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={i} className="tbl-tr">
                      {Array(showActions ? 6 : 5).fill(null).map((_, j) => (
                        <td key={j} className="tbl-td">
                          <div className="shimmer" style={{ height: "13px", width: j === 0 ? "120px" : "80px" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={showActions ? 6 : 5}>
                      <div className="tbl-empty">
                        <div className="tbl-empty-icon">
                          <Search size={20} />
                        </div>
                        <p className="tbl-empty-title">No requests found</p>
                        {(search || statusFilter !== "all") && (
                          <button className="tbl-empty-clear" onClick={() => { setSearch(""); setStatusFilter("all"); }}>
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, idx) => {
                    const av = avatarPalette[idx % avatarPalette.length];
                    return (
                      <tr
                        key={row._id}
                        className="tbl-tr"
                        onMouseEnter={() => setHoveredRow(row._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* Student */}
                        <td className="tbl-td">
                          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                            <div
                              className="tbl-avatar"
                              style={{ background: av.bg, color: av.color, border: `1.5px solid ${av.color}20` }}
                            >
                              {row.studentName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "#2d1a14", lineHeight: 1, marginBottom: "3px" }}>
                                {row.studentName}
                              </p>
                              <p className="mono" style={{ fontSize: "10px", color: "#a08070" }}>
                                {row.studentId}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Destination */}
                        <td className="tbl-td">
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "#3d2018" }}>
                            {row.destination}
                          </p>
                          <p style={{
                            fontSize: "11px", color: "#a08070", marginTop: "2px",
                            maxWidth: "140px", overflow: "hidden",
                            textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {row.reason}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="tbl-td">
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "8px",
                              background: "#f5f0eb",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              <Calendar size={12} style={{ color: "#8B1A1A" }} />
                            </div>
                            <div>
                              <p className="mono" style={{ fontSize: "11.5px", fontWeight: 500, color: "#3d2018" }}>
                                {(row.leaveDateFrom || row.outpassDate)
                                  ? new Date(row.leaveDateFrom || row.outpassDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                  : "—"}
                              </p>
                              {row.leaveDateTo && (
                                <p className="mono" style={{ fontSize: "10px", color: "#a08070", marginTop: "1px" }}>
                                  → {new Date(row.leaveDateTo).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="tbl-td">
                          <StatusBadge status={row.status} />
                        </td>

                        {/* Risk */}
                        <td className="tbl-td">
                          <RiskIndicator level={row.riskLevel || "low"} compact />
                        </td>

                        {/* Actions */}
                        {showActions && (
                          <td className="tbl-td">
                            <div
                              className="tbl-actions"
                              style={{
                                opacity: hoveredRow === row._id ? 1 : 0,
                                transform: hoveredRow === row._id ? "translateX(0)" : "translateX(-6px)",
                                transition: "opacity 0.15s, transform 0.15s",
                              }}
                            >
                              <Link to={`/admin/requests/${row._id}`} className="tbl-action-btn" title="View">
                                <Eye size={14} />
                              </Link>
                              <button className="tbl-action-btn approve" title="Approve">
                                <CheckCircle size={14} />
                              </button>
                              <button className="tbl-action-btn reject" title="Reject">
                                <XCircle size={14} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer / Pagination ── */}
          <div className="tbl-footer">
            <p className="tbl-footer-info">
              Showing <strong>{Math.min(filtered.length, 10)}</strong> of{" "}
              <strong>{filtered.length}</strong> entries
            </p>
            <div className="tbl-page-btns">
              {[1, 2, 3].map(p => (
                <button key={p} className={`tbl-page-btn ${p === 1 ? "active" : "inactive"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
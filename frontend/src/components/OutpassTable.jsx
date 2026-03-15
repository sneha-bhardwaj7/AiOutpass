// src/components/OutpassTable.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye, Filter, Search, ChevronDown, ChevronUp,
  MoreHorizontal, CheckCircle, XCircle, AlertTriangle, Download,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import RiskIndicator from "./RiskIndicator";

export default function OutpassTable({ data = [], loading = false, showActions = true }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = (data || [])
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        (r.studentName?.toLowerCase().includes(q) ||
          // ✅ FIX 1: was r.collegeId — MongoDB stores studentId
          r.studentId?.toLowerCase().includes(q) ||
          r.destination?.toLowerCase().includes(q)) &&
        (statusFilter === "all" || r.status === statusFilter)
      );
    })
    .sort((a, b) => {
      const val = sortDir === "asc" ? 1 : -1;
      return a[sortField] > b[sortField] ? val : -val;
    });

  const SortIcon = ({ field }) =>
    sortField === field ? (
      sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : (
      <ChevronDown size={13} className="opacity-30" />
    );

  const skeletonRows = Array(5).fill(null);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-cream-100">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/30" />
          <input
            type="text"
            placeholder="Search by name, ID, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:border-burgundy/30 focus:bg-white transition-all input-focus"
          />
        </div>

        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/40 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:border-burgundy/30 appearance-none cursor-pointer font-medium text-burgundy/70"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="parent-pending">Awaiting Parent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="manual-review">Manual Review</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-burgundy/70 hover:text-burgundy hover:bg-cream-50 border border-cream-200 rounded-xl transition-all">
          <Download size={14} /> Export
        </button>

        <p className="text-xs text-burgundy/40 font-medium ml-auto">
          {filtered.length} results
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-100 bg-cream-50/50">
              {[
                { label: "Student",     field: "studentName"   },
                { label: "Destination", field: "destination"   },
                // ✅ FIX 2: sort field updated to leaveDateFrom
                { label: "Date",        field: "leaveDateFrom" },
                { label: "Status",      field: "status"        },
                { label: "Risk",        field: "riskLevel"     },
              ].map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="text-left px-4 py-3 text-xs font-semibold text-burgundy/50 uppercase tracking-wider cursor-pointer hover:text-burgundy transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.field} />
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="text-left px-4 py-3 text-xs font-semibold text-burgundy/50 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-cream-50">
            {loading
              ? skeletonRows.map((_, i) => (
                  <tr key={i}>
                    {Array(showActions ? 6 : 5).fill(null).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="shimmer h-4 rounded w-full max-w-24"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={showActions ? 6 : 5} className="text-center py-16 text-burgundy/30">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p className="font-medium">No requests found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )
              : filtered.map((row) => (
                  <tr key={row._id} className="table-row-hover transition-colors group">

                    {/* Student */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-burgundy/10 rounded-lg flex items-center justify-center text-burgundy font-bold text-xs flex-shrink-0">
                          {row.studentName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-burgundy text-xs leading-tight">
                            {row.studentName}
                          </p>
                          {/* ✅ FIX 1: was row.collegeId */}
                          <p className="text-[11px] text-burgundy/40 font-mono">
                            {row.studentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-burgundy/80">{row.destination}</p>
                      <p className="text-[11px] text-burgundy/40 truncate max-w-32">{row.reason}</p>
                    </td>

                    {/* Date — ✅ FIX 2: was row.outpassDate */}
                    <td className="px-4 py-3.5">
                      <p className="text-burgundy/70 font-medium text-xs">
                        {(row.leaveDateFrom || row.outpassDate)
                          ? new Date(row.leaveDateFrom || row.outpassDate).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </p>
                      {row.leaveDateTo && (
                        <p className="text-[11px] text-burgundy/30">
                          → {new Date(row.leaveDateTo).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Risk */}
                    <td className="px-4 py-3.5">
                      <RiskIndicator level={row.riskLevel || "low"} compact />
                    </td>

                    {/* Actions */}
                    {showActions && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/requests/${row._id}`}
                            className="p-1.5 hover:bg-burgundy/8 rounded-lg text-burgundy/60 hover:text-burgundy transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            className="p-1.5 hover:bg-green-50 rounded-lg text-burgundy/60 hover:text-green-600 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            className="p-1.5 hover:bg-red-50 rounded-lg text-burgundy/60 hover:text-red-500 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-cream-100 bg-cream-50/30">
        <p className="text-xs text-burgundy/40">
          Showing {Math.min(filtered.length, 10)} of {filtered.length} entries
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`w-7 h-7 text-xs rounded-lg transition-all ${
                p === 1
                  ? "bg-burgundy text-cream shadow-sm"
                  : "text-burgundy/60 hover:bg-cream-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
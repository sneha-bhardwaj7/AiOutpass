// src/pages/AdminRequests.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import OutpassTable from "../components/OutpassTable";
import { outpassAPI } from "../services/api";

const STATUS_FILTERS = [
  { key: "all",           label: "All" },
  { key: "pending",       label: "Pending Parent" },
  { key: "pending-admin", label: "Pending Admin" },
  { key: "approved",      label: "Approved" },
  { key: "rejected",      label: "Rejected" },
];

export default function AdminRequests() {
  const [allRequests, setAllRequests] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [activeFilter,setActiveFilter]= useState("all");
  const [searchParams]                = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("status");
    if (s) setActiveFilter(s);
  }, [searchParams]);

  const fetchRequests = async () => {
    try {
      const data = await outpassAPI.getAll();
      setAllRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchRequests(); };

  const filtered = activeFilter === "all"
    ? allRequests
    : allRequests.filter(r => r.status === activeFilter);

  return (
    <AdminLayout title="All Requests" subtitle="Manage and review all outpass submissions">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === key
                  ? "bg-burgundy text-cream shadow-sm"
                  : "bg-white text-burgundy/60 border border-cream-200 hover:bg-cream-50"
              }`}
            >
              {label}
              {key !== "all" && (
                <span className="ml-1.5 opacity-60">
                  ({allRequests.filter(r => r.status === key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-burgundy/60 hover:text-burgundy border border-cream-200 bg-white rounded-xl hover:bg-cream-50 transition-all"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4">
        Showing <strong>{filtered.length}</strong> of <strong>{allRequests.length}</strong> requests
      </p>

      <OutpassTable data={filtered} loading={loading} showActions={true} />
    </AdminLayout>
  );
}
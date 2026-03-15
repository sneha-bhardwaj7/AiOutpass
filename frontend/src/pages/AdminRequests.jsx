// src/pages/AdminRequests.jsx  
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import OutpassTable from "../components/OutpassTable";
import { outpassAPI } from "../services/api";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const fetchRequests = async () => {
    try {
      const data = await outpassAPI.getAll();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchRequests(); };

  return (
    <AdminLayout title="All Requests" subtitle="Manage and review all outpass submissions">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {["all", "pending", "parent-pending", "approved", "rejected", "flagged", "manual-review"].map((s) => (
            <button
              key={s}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                initialStatus === s
                  ? "bg-burgundy text-cream shadow-sm"
                  : "bg-white text-burgundy/60 border border-cream-200 hover:bg-cream-50"
              }`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-burgundy/60 hover:text-burgundy border border-cream-200 bg-white rounded-xl hover:bg-cream-50 transition-all"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <OutpassTable data={requests} loading={loading} showActions={true} />
    </AdminLayout>
  );
}
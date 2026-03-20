// src/components/StatusBadge.jsx
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Loader,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: <Clock size={12} />,
    className: "bg-pink-50 text-pink-700 border-pink-200",
    dot: "bg-pink-400",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle size={12} />,
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle size={12} />,
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
  "manual-review": {
    label: "Manual Review",
    icon: <Eye size={12} />,
    className: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-400",
  },
  flagged: {
    label: "Flagged",
    icon: <AlertTriangle size={12} />,
    className: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
  },
  processing: {
    label: "Processing",
    icon: <Loader size={12} className="animate-spin" />,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  "parent-pending": {
    label: "Awaiting Parent",
    icon: <Clock size={12} />,
    className: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-400",
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = statusConfig[status] || {
    label: status || "Unknown",
    icon: null,
    className: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full transition-all
        ${config.className}
        ${size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5"}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`}></span>
      {config.icon}
      {config.label}
    </span>
  );
}
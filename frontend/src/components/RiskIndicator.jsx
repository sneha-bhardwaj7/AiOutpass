// src/components/RiskIndicator.jsx
import { AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react";

const riskConfig = {
  low: {
    label: "Low Risk",
    icon: <CheckCircle size={14} />,
    bar: "bg-green-400",
    barWidth: "33%",
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    score: 20,
  },
  medium: {
    label: "Medium Risk",
    icon: <AlertCircle size={14} />,
    bar: "bg-amber-400",
    barWidth: "66%",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    score: 55,
  },
  high: {
    label: "High Risk",
    icon: <AlertTriangle size={14} />,
    bar: "bg-red-500",
    barWidth: "100%",
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    score: 85,
  },
};

export default function RiskIndicator({ level = "low", score, reasons = [], compact = false }) {
  const config = riskConfig[level] || riskConfig.low;
  const displayScore = score ?? config.score;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        {config.label}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 font-semibold text-sm ${config.text}`}>
          {config.icon}
          AI Risk Analysis — {config.label}
        </div>
        <span className={`text-lg font-bold font-mono ${config.text}`}>
          {displayScore}
          <span className="text-xs font-normal opacity-60">/100</span>
        </span>
      </div>

      {/* Risk Bar */}
      <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${config.bar} rounded-full transition-all duration-700`}
          style={{ width: config.barWidth }}
        ></div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <ul className="space-y-1">
          {reasons.map((reason, i) => (
            <li key={i} className={`flex items-start gap-1.5 text-xs ${config.text} opacity-80`}>
              <Info size={11} className="mt-0.5 flex-shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
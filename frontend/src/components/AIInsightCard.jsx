// src/components/AIInsightCard.jsx
import { Zap, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";

export default function AIInsightCard({ insight, loading = false }) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-cream-100 shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="shimmer w-8 h-8 rounded-lg"></div>
          <div className="shimmer h-4 w-32 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="shimmer h-3 w-full rounded"></div>
          <div className="shimmer h-3 w-4/5 rounded"></div>
          <div className="shimmer h-3 w-3/5 rounded"></div>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  const recommendations = {
    "auto-approve": {
      label: "Auto Approve",
      icon: <CheckCircle size={14} />,
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    "manual-review": {
      label: "Manual Review",
      icon: <AlertTriangle size={14} />,
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    reject: {
      label: "Reject",
      icon: <XCircle size={14} />,
      cls: "bg-red-50 text-red-600 border-red-200",
    },
  };

  const rec = recommendations[insight.recommendation] || recommendations["manual-review"];

  return (
    <div className="bg-white rounded-2xl border border-cream-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cream-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-burgundy to-burgundy-700 rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-cream" />
          </div>
          <div>
            <p className="font-semibold text-burgundy text-sm">AI Analysis</p>
            <p className="text-[10px] text-burgundy/40">Powered by LangChain</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${rec.cls}`}>
          {rec.icon}
          {rec.label}
        </span>
      </div>

      {/* Summary */}
      <div className="p-4">
        <p className="text-sm text-burgundy/80 leading-relaxed">
          {insight.summary || "AI analysis in progress..."}
        </p>

        {/* Consent Score */}
        {insight.consentScore !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-burgundy/60 uppercase tracking-wide">
                Consent Confidence
              </p>
              <p className="text-sm font-bold font-mono text-burgundy">
                {insight.consentScore}%
              </p>
            </div>
            <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  insight.consentScore >= 80
                    ? "bg-green-400"
                    : insight.consentScore >= 50
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${insight.consentScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Key Extractions */}
        {insight.extractedData && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(insight.extractedData).map(([key, val]) => (
              <div key={key} className="bg-cream-50 rounded-xl px-3 py-2">
                <p className="text-[10px] font-semibold text-burgundy/40 uppercase tracking-wide">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-xs font-medium text-burgundy mt-0.5">{val || "—"}</p>
              </div>
            ))}
          </div>
        )}

        {/* Flags */}
        {insight.flags && insight.flags.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <AlertTriangle size={13} />
              {insight.flags.length} Flag{insight.flags.length > 1 ? "s" : ""} Detected
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {expanded && (
              <ul className="mt-2 space-y-1.5 animate-slide-up">
                {insight.flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                    <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
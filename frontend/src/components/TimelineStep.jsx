// src/components/TimelineStep.jsx
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const stepStatus = {
  completed: {
    icon: <CheckCircle size={16} />,
    ring: "bg-green-500 shadow-green-200",
    line: "bg-green-300",
    text: "text-green-600",
  },
  active: {
    icon: <Clock size={16} className="animate-pulse" />,
    ring: "bg-burgundy shadow-burgundy/30",
    line: "bg-cream-200",
    text: "text-burgundy",
  },
  pending: {
    icon: <Clock size={16} />,
    ring: "bg-cream-300",
    line: "bg-cream-200",
    text: "text-burgundy/30",
  },
  failed: {
    icon: <XCircle size={16} />,
    ring: "bg-red-500 shadow-red-200",
    line: "bg-red-200",
    text: "text-red-600",
  },
  flagged: {
    icon: <AlertCircle size={16} />,
    ring: "bg-amber-500 shadow-amber-200",
    line: "bg-amber-200",
    text: "text-amber-600",
  },
};

export default function TimelineStep({ steps = [] }) {
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const config = stepStatus[step.status] || stepStatus.pending;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex gap-4 pb-6 last:pb-0">
            {/* Left: icon + line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md transition-all ${config.ring}`}
              >
                {config.icon}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-2 ${config.line} rounded-full`}></div>
              )}
            </div>

            {/* Right: content */}
            <div className="flex-1 pt-0.5 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-semibold ${config.text}`}>{step.label}</p>
                  {step.description && (
                    <p className="text-xs text-burgundy/50 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                  {step.detail && (
                    <p className="text-xs text-burgundy/70 mt-1.5 bg-cream-50 rounded-lg px-2.5 py-1.5 border border-cream-100">
                      {step.detail}
                    </p>
                  )}
                </div>
                {step.timestamp && (
                  <span className="text-[10px] text-burgundy/30 font-mono flex-shrink-0 ml-2 mt-0.5">
                    {new Date(step.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
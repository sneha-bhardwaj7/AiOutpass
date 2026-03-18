// src/components/RiskIndicator.jsx
import { AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react";

const riskConfig = {
  low: {
    label: "Low Risk",
    icon: <CheckCircle size={12} />,
    barColor: '#10b981',
    barWidth: "33%",
    textColor: '#065f46',
    bgColor: '#ecfdf5',
    dotColor: '#10b981',
    score: 20,
    pillBorder: 'rgba(16,185,129,0.25)',
  },
  medium: {
    label: "Med Risk",
    icon: <AlertCircle size={12} />,
    barColor: '#f59e0b',
    barWidth: "66%",
    textColor: '#78350f',
    bgColor: '#fffbeb',
    dotColor: '#f59e0b',
    score: 55,
    pillBorder: 'rgba(245,158,11,0.25)',
  },
  high: {
    label: "High Risk",
    icon: <AlertTriangle size={12} />,
    barColor: '#ef4444',
    barWidth: "100%",
    textColor: '#7f1d1d',
    bgColor: '#fef2f2',
    dotColor: '#ef4444',
    score: 85,
    pillBorder: 'rgba(239,68,68,0.25)',
  },
};

export default function RiskIndicator({ level = "low", score, reasons = [], compact = false }) {
  const config = riskConfig[level] || riskConfig.low;
  const displayScore = score ?? config.score;

  if (compact) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '10px', fontWeight: 700, padding: '3px 8px',
        borderRadius: '20px', fontFamily: 'sans-serif',
        background: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.pillBorder}`,
        letterSpacing: '0.02em',
      }}>
        <span style={{ color: config.dotColor, display: 'flex', alignItems: 'center' }}>
          {config.icon}
        </span>
        {config.label}
      </span>
    );
  }

  return (
    <div style={{
      borderRadius: '16px', padding: '16px',
      background: config.bgColor,
      border: `1px solid ${config.pillBorder}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontWeight: 700, fontSize: '13px', color: config.textColor, fontFamily: 'sans-serif',
        }}>
          <span style={{ color: config.barColor }}>{config.icon}</span>
          AI Risk Analysis — {config.label}
        </div>
        <span style={{
          fontSize: '20px', fontWeight: 700, fontFamily: 'monospace',
          color: config.textColor,
        }}>
          {displayScore}
          <span style={{ fontSize: '11px', opacity: 0.5, fontWeight: 400 }}>/100</span>
        </span>
      </div>

      {/* Segmented risk bar */}
      <div style={{
        height: '6px', background: 'rgba(255,255,255,0.6)',
        borderRadius: '20px', overflow: 'hidden', marginBottom: '12px',
      }}>
        <div style={{
          height: '100%', width: config.barWidth,
          background: config.barColor,
          borderRadius: '20px',
          transition: 'width 0.7s ease',
        }} />
      </div>

      {reasons.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {reasons.map((reason, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '5px',
              fontSize: '11px', color: config.textColor, opacity: 0.75,
              fontFamily: 'sans-serif',
            }}>
              <Info size={10} style={{ marginTop: '2px', flexShrink: 0 }} />
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
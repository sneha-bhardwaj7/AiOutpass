// src/components/StatsCard.jsx
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "burgundy",
  loading = false,
}) {
  const colorMap = {
    burgundy: {
      bg: "bg-burgundy",
      iconBg: "bg-white/20",
      text: "text-cream",
      sub: "text-cream/70",
      card: "bg-burgundy shadow-burgundy",
    },
    cream: {
      bg: "bg-white",
      iconBg: "bg-burgundy/10",
      text: "text-burgundy",
      sub: "text-burgundy/60",
      card: "bg-white shadow-card",
    },
    gold: {
      bg: "bg-gold",
      iconBg: "bg-white/20",
      text: "text-white",
      sub: "text-white/70",
      card: "bg-gold",
    },
  };

  const c = colorMap[color] || colorMap.cream;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <div className="shimmer h-4 w-24 rounded mb-4"></div>
        <div className="shimmer h-8 w-16 rounded mb-2"></div>
        <div className="shimmer h-3 w-32 rounded"></div>
      </div>
    );
  }

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div
      className={`${c.card} rounded-2xl p-5 card-hover border border-transparent hover:border-burgundy/10 transition-all duration-300 animate-slide-up`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${color === "cream" ? "text-burgundy/50" : "text-cream/60"}`}>
            {title}
          </p>
        </div>
        {icon && (
          <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <span className={color === "cream" ? "text-burgundy" : "text-cream"}>
              {icon}
            </span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className={`text-3xl font-display font-bold ${c.text} leading-none`}>
          {value}
        </p>
        {subtitle && (
          <p className={`text-xs mt-1.5 ${c.sub}`}>{subtitle}</p>
        )}
      </div>

      {trendValue && (
        <div className="flex items-center gap-1.5">
          <TrendIcon size={13} className={trendColor} />
          <span className={`text-xs font-medium ${trendColor}`}>
            {trendValue}
          </span>
          <span className={`text-xs ${color === "cream" ? "text-burgundy/40" : "text-cream/40"}`}>
            vs last week
          </span>
        </div>
      )}
    </div>
  );
}
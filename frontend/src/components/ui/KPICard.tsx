import React from "react";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "green" | "blue" | "amber" | "red" | "purple";
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "blue",
  trend,
  onClick,
}) => {
  const badgeClasses = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <GlassCard
      hoverEffect={!!onClick}
      onClick={onClick}
      className={clsx("cursor-pointer select-none group", onClick && "hover:border-blue-500/40")}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        {badge && (
          <span
            className={clsx(
              "text-xs px-2.5 py-0.5 rounded-full border font-semibold",
              badgeClasses[badgeColor]
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span
              className={clsx(
                "font-semibold flex items-center gap-0.5",
                trend.isPositive ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};

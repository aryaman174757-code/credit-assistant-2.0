import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Calculator,
  Target,
  BadgePercent,
  Receipt,
  FileSearch,
  AlertTriangle,
  Coins,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { clsx } from "clsx";

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { to: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/ai-advisor", label: t("aiAdvisor"), icon: Sparkles, badge: "AI" },
    { to: "/credit-prediction", label: t("creditAnalytics"), icon: TrendingUp },
    { to: "/emi-calculator", label: t("emiCalculator"), icon: Calculator },
    { to: "/savings-planner", label: t("savingsPlanner"), icon: Target },
    { to: "/loan-eligibility", label: t("loanEligibility"), icon: BadgePercent },
    { to: "/expenses", label: t("expenseIntelligence"), icon: Receipt },
    { to: "/ocr-center", label: t("ocrCenter"), icon: FileSearch, badge: "OCR" },
    { to: "/fraud-monitor", label: t("fraudMonitor"), icon: AlertTriangle, badge: "Alert" },
    { to: "/investment-readiness", label: t("investmentReadiness"), icon: Coins },
    { to: "/family", label: t("familyDashboard"), icon: Users },
    { to: "/security", label: t("securityCenter"), icon: ShieldCheck, badge: "256-bit" },
    { to: "/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          FinTech Navigation
        </p>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-blue-600 text-white shadow-glow-blue"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-300 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/90 font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
        <div className="flex items-center gap-2 font-bold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>SecureShield Active</span>
        </div>
        <p className="text-[10px] text-emerald-300/80">AES-256 Encrypted Profile and Bureau Guard</p>
      </div>
    </aside>
  );
};

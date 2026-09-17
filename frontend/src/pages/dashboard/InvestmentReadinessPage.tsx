import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Coins, CheckCircle2, ShieldAlert, Sparkles, PieChart as PieIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { api } from "../../services/api";

export const InvestmentReadinessPage: React.FC = () => {
  const [readiness, setReadiness] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/investment/readiness");
        setReadiness(res.data);
      } catch (err) {
        console.error("Investment error:", err);
      }
    };
    load();
  }, []);

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"];
  const allocationData = readiness?.recommended_allocation
    ? Object.entries(readiness.recommended_allocation).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-400" />
          <span>Investment Readiness Index (0-100)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate emergency fund adequacy, DTI health, and free cashflow before capital allocation into equity markets.
        </p>
      </div>

      {readiness && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-8 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Readiness Score</span>
              <div className="text-6xl font-black text-emerald-400">{readiness.readiness_score}/100</div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {readiness.readiness_level}
              </span>
              <p className="text-xs text-slate-300 pt-2">
                Emergency coverage: <strong>{readiness.emergency_fund_months} Months</strong> of living burn.
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Action Steps Before Investing</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {readiness.actionable_steps?.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Recommended Asset Allocation Framework</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {allocationData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0A1128", borderColor: "#1E293B", borderRadius: "12px", fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 text-[11px] text-slate-400 italic">
                * {readiness.disclaimer}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

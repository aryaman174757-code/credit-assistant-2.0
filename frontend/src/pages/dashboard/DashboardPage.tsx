import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFinancial } from "../../contexts/FinancialContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { GlassCard } from "../../components/ui/GlassCard";
import { KPICard } from "../../components/ui/KPICard";
import { CreditGauge } from "../../components/ui/CreditGauge";
import {
  Sparkles,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Wallet,
  Activity,
  ArrowUpRight,
  FileSearch,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { api } from "../../services/api";

export const DashboardPage: React.FC = () => {
  const { profile } = useFinancial();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [creditHistory, setCreditHistory] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [histRes, expRes] = await Promise.all([
          api.get("/credit/history"),
          api.get("/expenses/intelligence"),
        ]);
        setCreditHistory(histRes.data);
        setExpenseData(expRes.data);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    };
    loadDashboardData();
  }, []);

  const historyChartData = creditHistory.map((h) => ({
    date: new Date(h.recorded_at).toLocaleDateString("en-IN", { month: "short" }),
    score: h.score,
  }));

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#6366F1"];
  const pieData = expenseData?.category_breakdown?.slice(0, 5) || [
    { category: "Housing & Rent", total_amount: 18000 },
    { category: "Food & Dining", total_amount: 8500 },
    { category: "Shopping", total_amount: 6200 },
    { category: "Utilities", total_amount: 3400 },
    { category: "Commute", total_amount: 2100 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">
              Namaste, {user?.full_name?.split(" ")[0] || "Financial Master"}! 👋
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
              Prime Tier
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Your real-time CIBIL health index, DTI analysis, and explainable AI insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate("/ai-advisor")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-blue transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("runAIDiagnosis")}</span>
          </button>
          <button
            onClick={() => navigate("/ocr-center")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <FileSearch className="w-4 h-4 text-blue-400" />
            <span>{t("uploadStatement")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Credit Score"
          value={profile?.credit_score || 758}
          badge="Prime"
          badgeColor="green"
          subtitle="CIBIL / Experian"
          icon={Activity}
          onClick={() => navigate("/credit-prediction")}
        />
        <KPICard
          title="DTI Ratio"
          value={`${profile?.dti_ratio || 34.8}%`}
          badge={Number(profile?.dti_ratio || 35) <= 35 ? "Healthy" : "Moderate"}
          badgeColor="blue"
          subtitle="Debt-to-Income"
          icon={CreditCard}
          onClick={() => navigate("/emi-calculator")}
        />
        <KPICard
          title="Credit Used"
          value={`${profile?.credit_utilization || 21.6}%`}
          badge="Ideal <30%"
          badgeColor="green"
          subtitle={`INR ${(profile?.used_credit || 54000).toLocaleString()}`}
          icon={Wallet}
          onClick={() => navigate("/expenses")}
        />
        <KPICard
          title="Monthly Savings"
          value={`INR ${Math.round(profile?.disposable_income || 44500).toLocaleString()}`}
          badge="Disposable"
          badgeColor="green"
          subtitle="After EMIs and Bills"
          icon={PiggyBank}
          onClick={() => navigate("/savings-planner")}
        />
        <KPICard
          title="Active EMIs"
          value={`INR ${(profile?.existing_emi || 16500).toLocaleString()}`}
          badge="3 Accounts"
          badgeColor="purple"
          subtitle="Monthly Outflow"
          icon={TrendingUp}
          onClick={() => navigate("/emi-calculator")}
        />
        <KPICard
          title="Health Score"
          value={`${profile?.financial_health_index || 84.2}/100`}
          badge="Strong"
          badgeColor="green"
          subtitle="Composite Index"
          icon={Sparkles}
          onClick={() => navigate("/ai-advisor")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Credit Score Trend & Bureau History</span>
                </h3>
                <p className="text-xs text-slate-400">6-Month historical reporting trend</p>
              </div>
              <Link to="/credit-prediction" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <span>What-If Simulator</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyChartData.length > 0 ? historyChartData : [
                  { date: "Apr", score: 715 },
                  { date: "May", score: 725 },
                  { date: "Jun", score: 735 },
                  { date: "Jul", score: 742 },
                  { date: "Aug", score: 750 },
                  { date: "Sep", score: 758 },
                ]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[650, 850]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0A1128", borderColor: "#1E293B", borderRadius: "12px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Monthly Cashflow Dynamic</h3>
                <p className="text-xs text-slate-400">Income vs Living Expenses vs Debt Obligations</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Net Positive Surplus
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Monthly Income", amount: profile?.monthly_income || 95000, fill: "#10B981" },
                  { name: "Living Expenses", amount: profile?.monthly_expenses || 34000, fill: "#3B82F6" },
                  { name: "Existing EMIs", amount: profile?.existing_emi || 16500, fill: "#F59E0B" },
                  { name: "Net Savings", amount: profile?.disposable_income || 44500, fill: "#8B5CF6" },
                ]}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0A1128", borderColor: "#1E293B", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 text-center">
            <h3 className="text-base font-bold text-white mb-2">Live Bureau Standing</h3>
            <CreditGauge score={profile?.credit_score || 758} size={220} />
            <p className="text-xs text-slate-300 mt-2">
              You qualify for <strong>Prime Home Loan APR (8.5%)</strong> with minimal processing charges.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-2">Expense Intelligence</h3>
            <p className="text-xs text-slate-400 mb-4">Auto-categorized merchant breakdown</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="total_amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                  >
                    {pieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0A1128", borderColor: "#1E293B", borderRadius: "12px", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 text-xs">
              {pieData.slice(0, 3).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span>{item.category}</span>
                  </span>
                  <span className="font-semibold text-white">INR {Math.round(item.total_amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

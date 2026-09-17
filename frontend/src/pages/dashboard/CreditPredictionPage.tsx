import React, { useState, useEffect } from "react";
import { useFinancial } from "../../contexts/FinancialContext";
import { GlassCard } from "../../components/ui/GlassCard";
import {
  TrendingUp,
  Sliders,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { api } from "../../services/api";

export const CreditPredictionPage: React.FC = () => {
  const { profile } = useFinancial();
  const [paymentDiscipline, setPaymentDiscipline] = useState(100);
  const [debtPaydown, setDebtPaydown] = useState(25000);
  const [targetUtil, setTargetUtil] = useState(20);
  const [inquiries, setInquiries] = useState(0);
  const [prediction, setPrediction] = useState<any>(null);

  const runPrediction = async () => {
    try {
      const res = await api.post("/credit/predict", {
        months_ahead: 6,
        simulated_payment_discipline: paymentDiscipline,
        simulated_debt_paydown: debtPaydown,
        simulated_utilization_target: targetUtil,
        new_inquiries: inquiries,
      });
      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [paymentDiscipline, debtPaydown, targetUtil, inquiries]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <span>Credit Score Prediction Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate what-if debt paydown and utilization decisions to forecast your 3-6 month CIBIL trajectory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>What-If Simulation Levers</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Payment Consistency:</span>
                <span className="text-emerald-400 font-bold">{paymentDiscipline}% On-Time</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={paymentDiscipline}
                onChange={(e) => setPaymentDiscipline(Number(e.target.value))}
                aria-label="Payment Consistency slider"
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Revolving Utilization Target:</span>
                <span className="text-blue-400 font-bold">{targetUtil}% Limit</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={targetUtil}
                onChange={(e) => setTargetUtil(Number(e.target.value))}
                aria-label="Revolving Utilization Target slider"
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Extra Debt Paydown:</span>
                <span className="text-purple-400 font-bold">INR {debtPaydown.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={debtPaydown}
                onChange={(e) => setDebtPaydown(Number(e.target.value))}
                aria-label="Extra Debt Paydown slider"
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>New Hard Inquiries (Cards/Loans):</span>
                <span className="text-amber-400 font-bold">{inquiries} inquiries</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={inquiries}
                onChange={(e) => setInquiries(Number(e.target.value))}
                aria-label="New Hard Inquiries slider"
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </GlassCard>

          {prediction && (
            <GlassCard className="p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Factor Sensitivity</h4>
              <div className="space-y-2">
                {prediction.key_drivers?.map((kd: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-300">
                    <span>{kd.factor}</span>
                    <span className="font-bold text-emerald-400">{kd.impact}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">6-Month Projected Score Trajectory</h3>
                <p className="text-xs text-slate-400">AI confidence score: 94%</p>
              </div>

              {prediction && (
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">
                    +{prediction.improvement_points} Pts
                  </span>
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    ({prediction.improvement_percentage}% Growth)
                  </span>
                </div>
              )}
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prediction?.trajectory || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month_name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[680, 840]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0A1128", borderColor: "#1E293B", borderRadius: "12px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="projected_score" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: "#10B981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <span className="text-xs text-slate-400 block">3-Month Forecast</span>
                <span className="text-2xl font-black text-white">{prediction?.projected_3_month || 772}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-xs text-emerald-400 block font-semibold">6-Month Target</span>
                <span className="text-2xl font-black text-emerald-300">{prediction?.projected_6_month || 795}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Predictive Score Drivers</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {prediction?.recommendations?.map((r: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

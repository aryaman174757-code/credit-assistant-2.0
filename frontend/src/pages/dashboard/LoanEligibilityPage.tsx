import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { BadgePercent, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

export const LoanEligibilityPage: React.FC = () => {
  const [loanType, setLoanType] = useState("Home Loan");
  const [tenureYears, setTenureYears] = useState(20);
  const [eligibility, setEligibility] = useState<any>(null);

  const checkEligibility = async () => {
    try {
      const res = await api.post("/calculator/loan-eligibility", {
        loan_type: loanType,
        tenure_years: tenureYears,
      });
      setEligibility(res.data);
    } catch (err) {
      console.error("Eligibility error:", err);
    }
  };

  useEffect(() => {
    checkEligibility();
  }, [loanType, tenureYears]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BadgePercent className="w-6 h-6 text-emerald-400" />
          <span>Loan Pre-Qualification & Sanction Estimator</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Estimate your borrowing headroom and maximum sanction amount based on Indian banking FOIR criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select Loan Product</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500 font-semibold"
              >
                <option value="Home Loan" className="bg-navy-900">Home Loan (Prime Sanction)</option>
                <option value="Personal Loan" className="bg-navy-900">Personal Loan (Unsecured)</option>
                <option value="Auto Loan" className="bg-navy-900">Vehicle / Car Loan</option>
                <option value="Education Loan" className="bg-navy-900">Higher Education Loan</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Requested Repayment Tenure:</span>
                <span className="text-blue-400 font-bold">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                aria-label="Requested Repayment Tenure slider"
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {eligibility && (
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Sanction Ceiling</span>
                  <span className="text-3xl font-black text-emerald-400">
                    INR {Math.round(eligibility.max_eligible_loan).toLocaleString()}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  {eligibility.eligibility_status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 block">Safe Borrowing Limit (80%)</span>
                  <span className="text-base font-bold text-white">
                    INR {Math.round(eligibility.safe_borrowing_limit).toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 block">Max Affordable Monthly EMI</span>
                  <span className="text-base font-bold text-blue-400">
                    INR {Math.round(eligibility.max_affordable_emi).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">Underwriting Insights</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {eligibility.insights?.map((ins: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Calculator, CheckCircle2, AlertTriangle, ArrowRight, Shield } from "lucide-react";
import { api } from "../../services/api";

export const EMICalculatorPage: React.FC = () => {
  const [loanType, setLoanType] = useState("Home Loan");
  const [amount, setAmount] = useState(3500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(240); // 20 years
  const [emiData, setEmiData] = useState<any>(null);

  const calculate = async () => {
    try {
      const res = await api.post("/calculator/emi", {
        loan_type: loanType,
        loan_amount: amount,
        interest_rate: rate,
        tenure_months: tenure,
      });
      setEmiData(res.data);
    } catch (err) {
      console.error("EMI error:", err);
    }
  };

  useEffect(() => {
    calculate();
  }, [loanType, amount, rate, tenure]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-400" />
          <span>EMI Affordability & Amortization Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate monthly repayment liabilities, interest proportions, and evaluate FOIR safety thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Loan Category</label>
              <select
                value={loanType}
                onChange={(e) => {
                  const t = e.target.value;
                  setLoanType(t);
                  if (t === "Home Loan") { setRate(8.5); setTenure(240); }
                  else if (t === "Personal Loan") { setRate(11.5); setTenure(36); }
                  else if (t === "Auto Loan") { setRate(9.2); setTenure(60); }
                  else if (t === "Education Loan") { setRate(9.5); setTenure(84); }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500 font-semibold"
              >
                <option value="Home Loan" className="bg-navy-900">Home Loan (Avg 8.5% APR)</option>
                <option value="Personal Loan" className="bg-navy-900">Personal Loan (Avg 11.5% APR)</option>
                <option value="Auto Loan" className="bg-navy-900">Vehicle / Auto Loan (Avg 9.2% APR)</option>
                <option value="Education Loan" className="bg-navy-900">Education Loan (Avg 9.5% APR)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Principal Loan Amount:</span>
                <span className="text-blue-400 font-bold">INR {amount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="15000000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                aria-label="Principal Loan Amount slider"
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Annual Interest Rate:</span>
                <span className="text-emerald-400 font-bold">{rate}% p.a.</span>
              </div>
              <input
                type="range"
                min="5"
                max="24"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Annual Interest Rate slider"
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Loan Tenure:</span>
                <span className="text-purple-400 font-bold">
                  {tenure} Months ({Math.round(tenure / 12)} Years)
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="360"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                aria-label="Loan Tenure slider"
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {emiData && (
            <GlassCard className="p-6 space-y-6">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-tr from-blue-900/30 to-emerald-900/20 border border-blue-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Monthly Repayment (EMI)
                </span>
                <span className="text-4xl font-black text-white">
                  INR {Math.round(emiData.monthly_emi).toLocaleString()}
                </span>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-3 border ${
                  emiData.is_affordable ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}>
                  {emiData.risk_level}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 block">Total Interest Payable</span>
                  <span className="text-base font-bold text-amber-400">
                    INR {Math.round(emiData.total_interest).toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 block">Total Repayment Amount</span>
                  <span className="text-base font-bold text-white">
                    INR {Math.round(emiData.total_payment).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Projected FOIR Load:</span>
                  <span className="font-bold text-white">{emiData.foir_percentage}% of Income</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Max Recommended Safe EMI:</span>
                  <span className="font-bold text-emerald-400">INR {Math.round(emiData.max_recommended_emi).toLocaleString()}</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {emiData?.amortization_schedule && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Amortization Schedule (First 12 Months)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">EMI</th>
                  <th className="py-2.5 px-3">Principal</th>
                  <th className="py-2.5 px-3">Interest</th>
                  <th className="py-2.5 px-3">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {emiData.amortization_schedule.slice(0, 12).map((row: any) => (
                  <tr key={row.month} className="hover:bg-white/5">
                    <td className="py-2 px-3 font-semibold text-white">Month {row.month}</td>
                    <td className="py-2 px-3">INR {Math.round(row.emi).toLocaleString()}</td>
                    <td className="py-2 px-3 text-emerald-400">INR {Math.round(row.principal).toLocaleString()}</td>
                    <td className="py-2 px-3 text-amber-400">INR {Math.round(row.interest).toLocaleString()}</td>
                    <td className="py-2 px-3 font-mono text-slate-200">INR {Math.round(row.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

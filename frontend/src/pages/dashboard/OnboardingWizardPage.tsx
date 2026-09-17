import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinancial } from "../../contexts/FinancialContext";
import { GlassCard } from "../../components/ui/GlassCard";
import { CheckCircle2, ArrowRight, ArrowLeft, User, DollarSign, Wallet, Target } from "lucide-react";

export const OnboardingWizardPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { updateProfile } = useFinancial();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: 29,
    occupation: "Senior Product Engineer",
    monthly_income: 95000,
    monthly_expenses: 34000,
    existing_emi: 16500,
    total_debt: 280000,
    credit_score: 758,
    credit_limit: 250000,
    used_credit: 54000,
    emergency_fund: 210000,
    savings_goal: 600000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "occupation" ? value : Number(value),
    }));
  };

  const handleFinish = async () => {
    await updateProfile(formData);
    navigate("/dashboard");
  };

  const dti = Math.round(((formData.existing_emi + formData.used_credit * 0.05) / Math.max(1, formData.monthly_income)) * 100);
  const util = Math.round((formData.used_credit / Math.max(1, formData.credit_limit)) * 100);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step {step} of 4</span>
        <h1 className="text-3xl font-extrabold text-white">Financial Profile Calibration</h1>
        <p className="text-xs text-slate-400">Personalize your parameters for explainable AI intelligence</p>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <GlassCard className="p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Personal & Employment Profile</span>
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Occupation / Profession</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Monthly Inflow & Living Expenses</span>
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly In-Hand Income (INR)</label>
              <input type="number" name="monthly_income" value={formData.monthly_income} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Living Expenses (Rent, Food, Utilities)</label>
              <input type="number" name="monthly_expenses" value={formData.monthly_expenses} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <span>Debts, EMIs & Credit Card Limits</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Current Total EMIs (INR)</label>
                <input type="number" name="existing_emi" value={formData.existing_emi} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Total Outstanding Debt</label>
                <input type="number" name="total_debt" value={formData.total_debt} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Credit Card Limit</label>
                <input type="number" name="credit_limit" value={formData.credit_limit} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Used Credit Card Balance</label>
                <input type="number" name="used_credit" value={formData.used_credit} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span>Credit Score Baseline & Savings Goals</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Current CIBIL Score</label>
                <input type="number" min={300} max={900} name="credit_score" value={formData.credit_score} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Emergency Fund Reserve</label>
                <input type="number" name="emergency_fund" value={formData.emergency_fund} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-xs text-slate-400">Real-time Calculated DTI</span>
                <span className="text-base font-bold text-white block">{dti}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-400">Credit Card Utilization</span>
                <span className="text-base font-bold text-emerald-400 block">{util}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow-blue"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow-emerald"
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Launch Dashboard
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

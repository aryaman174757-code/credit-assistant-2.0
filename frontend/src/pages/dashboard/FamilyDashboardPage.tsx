import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Users, PlusCircle, Trash2, Shield } from "lucide-react";
import { api } from "../../services/api";

export const FamilyDashboardPage: React.FC = () => {
  const [household, setHousehold] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Spouse");
  const [income, setIncome] = useState(65000);
  const [expense, setExpense] = useState(25000);
  const [creditScore, setCreditScore] = useState(760);
  const [savings, setSavings] = useState(20000);

  const loadData = async () => {
    try {
      const res = await api.get("/family/household");
      setHousehold(res.data);
    } catch (err) {
      console.error("Family error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/family/members", {
        name,
        relation,
        monthly_income: Number(income),
        monthly_expense: Number(expense),
        credit_score: Number(creditScore),
        contribution_to_savings: Number(savings),
      });
      setShowAdd(false);
      setName("");
      loadData();
    } catch (err) {
      alert("Failed to add family member");
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/family/members/${id}`);
    loadData();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Family Financial Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated household cashflow, shared emergency funds, and member credit baselines.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Family Member
        </button>
      </div>

      {household && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Total Household Income</span>
            <span className="text-2xl font-black text-emerald-400">INR {Math.round(household.total_household_income).toLocaleString()}</span>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Total Household Expenses</span>
            <span className="text-2xl font-black text-white">INR {Math.round(household.total_household_expenses).toLocaleString()}</span>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Monthly Net Savings</span>
            <span className="text-2xl font-black text-blue-400">INR {Math.round(household.total_household_savings).toLocaleString()}</span>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Average Household Score</span>
            <span className="text-2xl font-black text-amber-400">{household.average_credit_score}</span>
          </GlassCard>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {household?.members?.map((m: any) => (
          <GlassCard key={m.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">{m.relation}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{m.name}</h3>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Income:</span>
                <span className="font-semibold text-white">INR {Math.round(m.monthly_income).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Expenses:</span>
                <span className="font-semibold text-slate-400">INR {Math.round(m.monthly_expense).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Credit Score:</span>
                <span className="font-bold text-emerald-400">{m.credit_score > 0 ? m.credit_score : "N/A (Minor)"}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Add Family Member</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Pooja Sharma" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Relation</label>
                <select value={relation} onChange={(e) => setRelation(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500">
                  <option value="Spouse" className="bg-navy-900">Spouse</option>
                  <option value="Parent" className="bg-navy-900">Parent</option>
                  <option value="Child" className="bg-navy-900">Child / Dependent</option>
                  <option value="Sibling" className="bg-navy-900">Sibling</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Income</label>
                  <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Expense</label>
                  <input type="number" value={expense} onChange={(e) => setExpense(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-slate-400 text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

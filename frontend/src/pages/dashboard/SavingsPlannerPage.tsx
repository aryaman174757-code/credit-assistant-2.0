import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { Target, PlusCircle, CheckCircle2, Calendar, Sparkles } from "lucide-react";
import { api } from "../../services/api";

export const SavingsPlannerPage: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Emergency Fund");
  const [newTarget, setNewTarget] = useState(150000);
  const [newDate, setNewDate] = useState("2027-03-31");

  const loadGoals = async () => {
    try {
      const res = await api.get("/savings/");
      setGoals(res.data);
    } catch (err) {
      console.error("Goals error:", err);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/savings/", {
        title: newTitle,
        category: newCat,
        target_amount: Number(newTarget),
        target_date: new Date(newDate).toISOString(),
      });
      setShowModal(false);
      loadGoals();
    } catch (err) {
      alert("Failed to create goal");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            <span>Smart Savings Planner & Milestone Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate your wealth velocity with dynamically calculated daily, weekly, and monthly targets.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-blue"
        >
          <PlusCircle className="w-4 h-4" /> Add Savings Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GlassCard key={goal.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {goal.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{goal.title}</h3>
              </div>
              <ProgressRing percentage={goal.progress_percentage} size={65} color="#10B981" />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Current Accumulated:</span>
                <span className="font-bold text-emerald-400">INR {Math.round(goal.current_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Goal:</span>
                <span className="font-bold text-white">INR {Math.round(goal.target_amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Daily</span>
                <span className="font-bold text-white">INR {Math.round(goal.daily_target)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Weekly</span>
                <span className="font-bold text-white">INR {Math.round(goal.weekly_target)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Monthly</span>
                <span className="font-bold text-emerald-400">INR {Math.round(goal.monthly_target)}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Create New Savings Milestone</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Goal Title</label>
                <input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="House Downpayment" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500">
                  <option value="Emergency Fund" className="bg-navy-900">Emergency Fund</option>
                  <option value="Vehicle" className="bg-navy-900">Vehicle / Car</option>
                  <option value="House" className="bg-navy-900">House Downpayment</option>
                  <option value="Vacation" className="bg-navy-900">Vacation / Travel</option>
                  <option value="Gadget" className="bg-navy-900">Gadget / Tech</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Amount (INR)</label>
                <input type="number" required value={newTarget} onChange={(e) => setNewTarget(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Date</label>
                <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-slate-400 text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

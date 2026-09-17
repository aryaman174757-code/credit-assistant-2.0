import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Receipt, PlusCircle, AlertTriangle, ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import { api } from "../../services/api";

export const ExpenseIntelligencePage: React.FC = () => {
  const [txns, setTxns] = useState<any[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState(450);
  const [paymentMode, setPaymentMode] = useState("UPI");

  const loadData = async () => {
    try {
      const [tRes, iRes] = await Promise.all([
        api.get("/expenses/"),
        api.get("/expenses/intelligence"),
      ]);
      setTxns(tRes.data);
      setIntelligence(iRes.data);
    } catch (err) {
      console.error("Expense error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/expenses/", {
        merchant,
        amount: Number(amount),
        type: "debit",
        payment_mode: paymentMode,
      });
      setShowAdd(false);
      setMerchant("");
      loadData();
    } catch (err) {
      alert("Failed to add transaction");
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/expenses/${id}`);
    loadData();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-400" />
            <span>Expense Intelligence & Transaction Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated Indian merchant categorization with real-time fraud checks.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-blue"
        >
          <PlusCircle className="w-4 h-4" /> Add Manual Expense
        </button>
      </div>

      {intelligence && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Total Monthly Spend</span>
            <span className="text-2xl font-black text-white">INR {Math.round(intelligence.total_monthly_spend).toLocaleString()}</span>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Highest Category</span>
            <span className="text-2xl font-black text-amber-400">{intelligence.highest_expense_category}</span>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-slate-400 block">Net Savings Rate</span>
            <span className="text-2xl font-black text-emerald-400">{intelligence.savings_rate_percentage}%</span>
          </GlassCard>
        </div>
      )}

      {/* Transactions Table */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-white/5 text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Merchant</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {txns.map((t) => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-semibold text-white">{t.merchant}</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-white/5">{t.category}</span></td>
                  <td className="py-2.5 px-3">{t.payment_mode}</td>
                  <td className={`py-2.5 px-3 font-bold ${t.type === "credit" ? "text-emerald-400" : "text-white"}`}>
                    {t.type === "credit" ? "+" : "-"}INR {Math.round(t.amount).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => handleDelete(t.id)} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Record Transaction</h3>
            <form onSubmit={handleAddTxn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Merchant / Recipient</label>
                <input required value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Swiggy, Amazon, Uber" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (INR)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Method</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500">
                  <option value="UPI" className="bg-navy-900">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Credit Card" className="bg-navy-900">Credit Card</option>
                  <option value="NetBanking" className="bg-navy-900">NetBanking / NEFT</option>
                  <option value="Debit Card" className="bg-navy-900">Debit Card</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-slate-400 text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-blue">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

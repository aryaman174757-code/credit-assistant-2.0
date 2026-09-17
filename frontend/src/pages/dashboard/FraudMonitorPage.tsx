import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

export const FraudMonitorPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  const loadAlerts = async () => {
    try {
      const res = await api.get("/fraud/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error("Alerts error:", err);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (id: number) => {
    const note = prompt("Enter resolution note (e.g., 'Verified transaction was authorized'):");
    if (!note) return;
    try {
      await api.post(`/fraud/alerts/${id}/resolve`, { resolution_note: note });
      loadAlerts();
    } catch (err) {
      alert("Failed to resolve alert");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <span>Fraud Detection & Anomaly Monitor</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time heuristics inspecting spending spikes, duplicate charges, and suspicious location access.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <GlassCard
            key={alert.id}
            className={`p-6 border-l-4 ${
              alert.is_resolved
                ? "border-l-slate-600 opacity-60"
                : alert.severity === "High"
                ? "border-l-red-500 bg-red-950/10"
                : "border-l-amber-500 bg-amber-950/10"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    alert.severity === "High" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {alert.severity} Risk
                  </span>
                  <h4 className="text-base font-bold text-white">{alert.alert_type}</h4>
                </div>
                <p className="text-xs text-slate-300">{alert.description}</p>
                <p className="text-xs text-emerald-400 font-semibold">Suggested Action: {alert.suggested_action}</p>
              </div>

              {!alert.is_resolved ? (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs self-start sm:self-auto"
                >
                  Mark Verified / Resolved
                </button>
              ) : (
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resolved
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

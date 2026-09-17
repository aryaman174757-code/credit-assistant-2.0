import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { ShieldCheck, Lock, Smartphone, LogOut, KeyRound } from "lucide-react";
import { api } from "../../services/api";

export const SecurityCenterPage: React.FC = () => {
  const [securityData, setSecurityData] = useState<any>(null);

  const loadSecurity = async () => {
    try {
      const res = await api.get("/security/center");
      setSecurityData(res.data);
    } catch (err) {
      console.error("Security error:", err);
    }
  };

  useEffect(() => {
    loadSecurity();
  }, []);

  const handleLogoutAll = async () => {
    if (!confirm("Are you sure you want to terminate all active sessions across all devices?")) return;
    try {
      await api.post("/security/logout-all");
      loadSecurity();
      alert("All sessions terminated.");
    } catch (err) {
      alert("Failed to logout all");
    }
  };

  const handleToggleMFA = async () => {
    try {
      await api.post("/security/toggle-mfa");
      loadSecurity();
    } catch (err) {
      alert("Failed to toggle MFA");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>SecureShield Security Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional cyber defense, active sessions, and immutable audit trails.
          </p>
        </div>

        <button
          onClick={handleLogoutAll}
          className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout All Devices
        </button>
      </div>

      {securityData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Score</span>
            <div className="text-5xl font-black text-emerald-400">{securityData.security_score}/100</div>
            <span className="text-xs font-bold text-slate-300">{securityData.threat_level}</span>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Two-Factor Auth (MFA)</span>
              <button
                onClick={handleToggleMFA}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  securityData.mfa_enabled
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-white/10 text-slate-400 border-white/20"
                }`}
              >
                {securityData.mfa_enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enforce OTP verification for high-risk actions such as password resets and loan calculations.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase block">Active Device Sessions</span>
            <div className="text-2xl font-black text-white">{securityData.active_sessions_count} Devices</div>
            <p className="text-xs text-slate-400">All connections protected by AES-256 tokens.</p>
          </GlassCard>
        </div>
      )}

      {/* Immutable Audit Logs */}
      {securityData?.recent_audit_logs && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Immutable Audit Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {securityData.recent_audit_logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/5">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 font-bold text-blue-400">{log.action}</td>
                    <td className="py-2 px-3 font-mono">{log.ip_address}</td>
                    <td className="py-2 px-3 text-slate-300">{log.details || "-"}</td>
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

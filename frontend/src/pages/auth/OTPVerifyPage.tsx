import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/ui/GlassCard";
import { CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

export const OTPVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email] = useState(searchParams.get("email") || "demo@creditassistant.ai");
  const [otp, setOtp] = useState("742918");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      alert("Failed to reset password. Please check OTP code.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8 border-white/20 shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-2">Verify OTP & Reset</h2>
        <p className="text-xs text-slate-400 mb-6">Enter 6-digit OTP code for {email}</p>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Password Reset Successfully!</h3>
            <p className="text-xs text-slate-400">Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center tracking-widest font-mono text-base font-bold outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald">
              Update Password
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
};

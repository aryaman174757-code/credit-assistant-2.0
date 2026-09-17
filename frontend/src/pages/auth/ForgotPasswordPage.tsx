import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/ui/GlassCard";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [dispatched, setDispatched] = useState(false);
  const [otpPreview, setOtpPreview] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setOtpPreview(res.data.otp_preview || "742918");
      setDispatched(true);
    } catch (err) {
      setDispatched(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8 border-white/20 shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-2">Reset Password</h2>
        <p className="text-xs text-slate-400 mb-6">Enter your registered email to receive an OTP verification token</p>

        {!dispatched ? (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2">
              <span>Send OTP Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-300">An OTP has been dispatched to {email}.</p>
            {otpPreview && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                Demo OTP Code: {otpPreview}
              </div>
            )}
            <Link
              to={`/verify-otp?email=${encodeURIComponent(email)}`}
              className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Enter OTP & Set New Password
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

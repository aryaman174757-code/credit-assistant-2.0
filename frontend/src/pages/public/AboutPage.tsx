import React from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Shield, Brain } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Architectural Mission</span>
        <h1 className="text-4xl font-extrabold text-white">About Credit Assistant 2.0</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          A high-performance AI FinTech platform bridging the gap between BFSI bureau metrics and human-centric actionable advisory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-4 p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Explainable AI (XAI)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike generic chatbots, Credit Assistant 2.0 uses Google Gemini paired with structured reasoning engines to guarantee every recommendation contains Problem, Benchmark, Action, and Projected Impact.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4 p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">SecureShield Cyber Defense</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Financial data deserves institutional protection. Our backend uses AES-256 encryption, immutable audit trails, device anomaly fingerprinting, rate limiting, and prompt injection filters.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

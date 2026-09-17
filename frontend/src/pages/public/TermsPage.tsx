import React from "react";
import { GlassCard } from "../../components/ui/GlassCard";

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
      <p className="text-xs text-slate-400">Effective Date: September 2026</p>
      <GlassCard className="space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white">1. Educational and Advisory Purpose</h3>
        <p>Credit Assistant 2.0 provides AI-assisted financial modeling and educational diagnostics. It does not constitute formal lending sanction.</p>
      </GlassCard>
    </div>
  );
};

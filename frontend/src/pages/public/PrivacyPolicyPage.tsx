import React from "react";
import { GlassCard } from "../../components/ui/GlassCard";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Effective Date: September 2026</p>
      <GlassCard className="space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white">1. Data Protection and Encryption</h3>
        <p>Credit Assistant 2.0 employs AES-256 bank-grade encryption for all user profile metrics, financial records, and uploaded bank statements.</p>
        <h3 className="text-sm font-bold text-white">2. Bureau Data Isolation</h3>
        <p>All credit simulations and calculations run locally within private isolated databases or sandbox simulations.</p>
      </GlassCard>
    </div>
  );
};

import React from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Sparkles, TrendingUp, Calculator, FileSearch, ShieldCheck, Coins, Users, MessageSquare } from "lucide-react";

export const FeaturesPage: React.FC = () => {
  const allFeatures = [
    { title: "Gemini AI Financial Advisor", icon: Sparkles, desc: "Personalized 5-step roadmap formatted in English, Hindi, or Marathi." },
    { title: "Predictive Score Trajectory", icon: TrendingUp, desc: "3 and 6-month simulation models with factor sensitivity analysis." },
    { title: "EMI & Amortization", icon: Calculator, desc: "Dynamic sliders for personal, home, and auto loan affordability." },
    { title: "OCR Statement Ingestion", icon: FileSearch, desc: "Automatic table extraction from PDF and image bank statements." },
    { title: "SecureShield Anomaly Engine", icon: ShieldCheck, desc: "Spike alerts, duplicate detection, and login location audits." },
    { title: "Investment Readiness 0-100", icon: Coins, desc: "Evaluates emergency fund, DTI, and free cashflow before investing." },
    { title: "Family Finance Ledger", icon: Users, desc: "Aggregated household budgets and shared savings milestones." },
    { title: "WhatsApp Alert System", icon: MessageSquare, desc: "Meta Cloud API ready notifications for upcoming EMIs and reports." },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Complete SaaS Capabilities</span>
        <h1 className="text-4xl font-extrabold text-white">Enterprise FinTech Feature Matrix</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allFeatures.map((f, i) => {
          const Icon = f.icon;
          return (
            <GlassCard key={i} hoverEffect className="space-y-3 p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { GlassCard } from "../../components/ui/GlassCard";
import { CreditGauge } from "../../components/ui/CreditGauge";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  FileSearch,
  Calculator,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Star,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [simScore, setSimScore] = useState(742);

  const handleDemoClick = async () => {
    await loginAsDemo();
    navigate("/dashboard");
  };

  const features = [
    {
      icon: Sparkles,
      title: "Explainable AI Financial Advisor",
      desc: "Structured 5-step roadmap with transparent Problem-Reason-Action-Impact explainability for Indian banking standards.",
    },
    {
      icon: TrendingUp,
      title: "Credit Prediction Engine",
      desc: "Simulate what-if financial decisions (pay down debt, reduce utilization) and forecast your 3-6 month CIBIL trajectory.",
    },
    {
      icon: FileSearch,
      title: "OCR Document Intelligence",
      desc: "Instant parsing of PDF bank statements (HDFC, SBI, ICICI) with automatic debit/credit expense categorization.",
    },
    {
      icon: ShieldCheck,
      title: "SecureShield & Fraud Monitor",
      desc: "Real-time detection of spending spikes, duplicate charges, and suspicious logins with AES-256 encrypted storage.",
    },
    {
      icon: Calculator,
      title: "EMI & Loan Sanction Estimator",
      desc: "Calculate precise amortization schedules and safe borrowing ceilings based on your FOIR and income limits.",
    },
    {
      icon: Users,
      title: "Family Financial Dashboard",
      desc: "Aggregate household cashflow, shared emergency reserves, and track children education funds with role permissions.",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Active Indian Users" },
    { value: "+42 Pts", label: "Average Credit Growth" },
    { value: "INR 120 Cr+", label: "Safe Borrowing Evaluated" },
    { value: "99.98%", label: "SecureShield Uptime" },
  ];

  const testimonials = [
    {
      name: "Aditya Kulkarni",
      role: "Senior Software Engineer, Pune",
      content: "Credit Assistant 2.0 gave me exact rupee targets to compress my credit card utilization from 58% to 22%. My CIBIL score jumped from 718 to 768 in 4 months!",
      score: "768 CIBIL",
    },
    {
      name: "Sneha Mukherjee",
      role: "Product Lead, Bengaluru",
      content: "The OCR bank statement parser and Explainable AI roadmap saved me hours. It explained exactly why lenders care about DTI and how to qualify for prime home loan rates.",
      score: "790 CIBIL",
    },
    {
      name: "Vikram Malhotra",
      role: "FinTech Consultant, Mumbai",
      content: "A genuine enterprise-grade SaaS. The multi-factor security center, WhatsApp reminder architecture, and family dashboard make it unmatched.",
      score: "810 CIBIL",
    },
  ];

  return (
    <div className="space-y-24 py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Next-Gen BFSI Financial Intelligence 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Master Your Credit Score with <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Explainable AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            The intelligent financial health platform designed for India. Predict your credit score, calculate affordable EMIs, extract bank statements via OCR, and receive transparent AI action plans.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-glow-blue flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t("getStarted")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDemoClick}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{t("demoLogin")}</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Hard Bureau Inquiry</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-400" /> AES-256 Encrypted</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CIBIL/Experian Scaled</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <GlassCard className="p-8 border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Simulator</span>
                <h3 className="text-lg font-bold text-white">Credit Health Gauge</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                CIBIL Prime Tier
              </span>
            </div>

            <CreditGauge score={simScore} size={250} />

            <div className="mt-6 space-y-4 pt-4 border-t border-white/10">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Interactive Score Test:</span>
                  <span className="text-blue-400">{simScore} Points</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="900"
                  value={simScore}
                  onChange={(e) => setSimScore(Number(e.target.value))}
                  aria-label="Interactive Credit Score Test slider"
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">DTI Ratio</span>
                  <span className="text-sm font-bold text-white">34.8% (Safe)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Utilization</span>
                  <span className="text-sm font-bold text-emerald-400">21.6% (Ideal)</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <GlassCard key={idx} className="text-center p-6 border-white/10">
            <div className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {s.value}
            </div>
            <div className="text-xs font-medium text-slate-400">{s.label}</div>
          </GlassCard>
        ))}
      </section>

      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Built For Indian BFSI</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Six Pillars of Complete Financial Health
          </h2>
          <p className="text-sm text-slate-400">
            Every feature is interconnected: OCR feeds Expense Intelligence, which computes DTI, powering Gemini Explainable AI roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <GlassCard key={idx} hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Real Stories</span>
          <h2 className="text-3xl font-extrabold text-white">Trusted by Working Professionals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <GlassCard key={idx} className="space-y-4 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{t.content}"</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {t.score}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <GlassCard className="p-12 text-center relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-navy-900/80 to-emerald-900/40 border-blue-500/30">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Upgrade Your Financial Future?
            </h2>
            <p className="text-sm text-slate-300">
              Join thousands of individuals taking control of their credit score, loan approvals, and long-term wealth growth today.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-glow-blue transition-all"
              >
                Create Free Account
              </Link>
              <button
                onClick={handleDemoClick}
                className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all"
              >
                Launch Demo Sandbox
              </button>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

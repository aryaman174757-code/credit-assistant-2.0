import React, { useState, useEffect } from "react";
import { useFinancial } from "../../contexts/FinancialContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { GlassCard } from "../../components/ui/GlassCard";
import { AIInsightCard } from "../../components/ui/AIInsightCard";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Printer,
  Globe,
  Layers,
} from "lucide-react";
import { api } from "../../services/api";

export const AIAdvisorPage: React.FC = () => {
  const { profile } = useFinancial();
  const { language } = useLanguage();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState(language);

  const fetchAIReport = async (lang: string) => {
    setLoading(true);
    try {
      const res = await api.post("/ai/analyze", { language: lang });
      setReport(res.data);
    } catch (err) {
      console.error("AI report error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIReport(activeLang);
  }, [activeLang]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span>AI Financial Health Advisor</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              Explainable XAI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gemini structured reasoning engine with benchmark evidence and expected impact timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Globe className="w-4 h-4 text-blue-400" />
            <select
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value as 'en' | 'hi' | 'mr')}
              aria-label="Select report language"
              className="bg-transparent text-white outline-none cursor-pointer font-semibold"
            >
              <option value="en" className="bg-navy-900">English (EN)</option>
              <option value="hi" className="bg-navy-900">हिंदी (HI)</option>
              <option value="mr" className="bg-navy-900">मराठी (MR)</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {loading ? (
        <GlassCard className="p-12 text-center space-y-4">
          <Sparkles className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white">Synthesizing Explainable Financial Plan...</h3>
          <p className="text-xs text-slate-400">Evaluating CIBIL scale, utilization limits, and DTI stress thresholds.</p>
        </GlassCard>
      ) : (
        report && (
          <div className="space-y-6">
            <GlassCard className="p-6 border-blue-500/30 bg-blue-900/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-2">Executive AI Diagnosis</h3>
              <p className="text-sm text-slate-200 leading-relaxed">{report.summary}</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> Target Timeline: <strong>{report.timeline}</strong></span>
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Bureau Grade: <strong>CIBIL Prime Eligible</strong></span>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6 space-y-3 border-emerald-500/20 bg-emerald-950/10">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Profile Strengths
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.strengths?.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 space-y-3 border-amber-500/20 bg-amber-950/10">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Vulnerabilities & Optimization Drivers
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.weaknesses?.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <span>Five-Step Strategic Optimization Roadmap</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">Sequential Milestones</span>
              </div>

              <div className="space-y-3">
                {report.roadmap?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                        {step.step || idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">{step.action}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">
                        {step.timeline}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                        {step.priority || "High"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Explainable AI Logic & Reasoning Breakdown</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.explainable_reasoning?.map((item: any, idx: number) => (
                  <AIInsightCard key={idx} item={item} index={idx} />
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

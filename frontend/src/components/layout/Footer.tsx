import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/10 pt-12 pb-8 mt-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white">Credit Assistant 2.0</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise AI-Powered Financial Health, Credit Prediction, Loan Affordability and Explainable Advisory Platform.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Bank-Grade 256-bit Encryption</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">AI Intelligence</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/ai-advisor" className="hover:text-white transition-colors">Gemini XAI Advisor</Link></li>
            <li><Link to="/credit-prediction" className="hover:text-white transition-colors">Credit Score Trajectory</Link></li>
            <li><Link to="/ocr-center" className="hover:text-white transition-colors">OCR Statement Parsing</Link></li>
            <li><Link to="/fraud-monitor" className="hover:text-white transition-colors">Anomaly and Fraud Engine</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Calculators and Tools</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/emi-calculator" className="hover:text-white transition-colors">Amortization and EMI</Link></li>
            <li><Link to="/loan-eligibility" className="hover:text-white transition-colors">Loan Pre-Sanction Ceiling</Link></li>
            <li><Link to="/savings-planner" className="hover:text-white transition-colors">Smart Savings Milestones</Link></li>
            <li><Link to="/investment-readiness" className="hover:text-white transition-colors">Investment Readiness Index</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Legal and Security</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/security" className="hover:text-white transition-colors">SecureShield Architecture</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">BFSI Enterprise Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>(c) 2026 Credit Assistant 2.0. Built for Indian BFSI FinTech Ecosystem.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-red-500" /> for AI and FinTech Engineering.
        </p>
      </div>
    </footer>
  );
};

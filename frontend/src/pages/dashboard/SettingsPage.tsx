import React, { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Settings as SettingsIcon, MessageSquare, Send, CheckCircle2, Globe, Sun, Moon, Palette } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { api } from "../../services/api";

export const SettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [phone, setPhone] = useState("+91 98765 43210");
  const [reminderType, setReminderType] = useState("MONTHLY_REPORT");
  const [reminderStatus, setReminderStatus] = useState<any>(null);

  const handleTestWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/whatsapp/send-reminder", {
        phone_number: phone,
        reminder_type: reminderType,
        custom_note: "User initiated sandbox trigger",
      });
      setReminderStatus(res.data);
    } catch (err) {
      alert("Failed to dispatch WhatsApp reminder sandbox payload");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          <span>Platform Settings & Meta Cloud WhatsApp</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure theme appearance, language preferences, and test WhatsApp alert webhooks.</p>
      </div>

      <GlassCard className="p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold mb-2 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Appearance & Theme Mode
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                theme === "dark"
                  ? "bg-blue-600 text-white border-blue-500 shadow-glow-blue"
                  : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
              }`}
            >
              <Moon className="w-4 h-4 text-blue-400" /> Dark Mode (Signature Deep Navy)
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                theme === "light"
                  ? "bg-blue-600 text-white border-blue-500 shadow-glow-blue"
                  : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" /> Light Mode (Clean Slate)
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="text-base font-bold mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> Interface Language
          </h3>
          <div className="flex gap-3">
            <button onClick={() => setLanguage("en")} className={`px-4 py-2 rounded-xl text-xs font-bold border ${language === "en" ? "bg-blue-600 text-white border-blue-500" : "bg-white/5 text-slate-400 border-white/10"}`}>English (EN)</button>
            <button onClick={() => setLanguage("hi")} className={`px-4 py-2 rounded-xl text-xs font-bold border ${language === "hi" ? "bg-blue-600 text-white border-blue-500" : "bg-white/5 text-slate-400 border-white/10"}`}>हिंदी (HI)</button>
            <button onClick={() => setLanguage("mr")} className={`px-4 py-2 rounded-xl text-xs font-bold border ${language === "mr" ? "bg-blue-600 text-white border-blue-500" : "bg-white/5 text-slate-400 border-white/10"}`}>मराठी (MR)</button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Meta Cloud WhatsApp Reminder Sandbox
          </h3>
          <form onSubmit={handleTestWhatsApp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient Mobile (India)</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Notification Template Type</label>
              <select value={reminderType} onChange={(e) => setReminderType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500">
                <option value="MONTHLY_REPORT" className="bg-navy-900">Monthly Health Digest Alert</option>
                <option value="EMI_DUE" className="bg-navy-900">Upcoming EMI Due Reminder</option>
                <option value="CREDIT_CARD_DUE" className="bg-navy-900">Credit Card Utilization Warning</option>
                <option value="FRAUD_ALERT" className="bg-navy-900">SecureShield Fraud Alert Trigger</option>
                <option value="SAVINGS_NUDGE" className="bg-navy-900">Daily Savings Milestone Nudge</option>
              </select>
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-emerald">
              <Send className="w-4 h-4" /> Dispatch Simulated WhatsApp Payload
            </button>
          </form>

          {reminderStatus && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-2 mt-4">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Message Dispatched (Status: {reminderStatus.status})</span>
              </div>
              <p className="bg-navy-900/80 p-3 rounded-lg text-slate-200 font-mono text-[11px]">
                "{reminderStatus.rendered_message}"
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

import React, { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Get In Touch</span>
        <h1 className="text-4xl font-extrabold text-white">Contact Our BFSI AI Team</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <GlassCard className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs text-slate-400 block">Email Us</span>
                <span className="text-sm font-semibold text-white">contact@creditassistant.ai</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs text-slate-400 block">Helpline</span>
                <span className="text-sm font-semibold text-white">+91 (080) 4567-8900</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs text-slate-400 block">Headquarters</span>
                <span className="text-sm font-semibold text-white">Indiranagar, Bengaluru, India</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="md:col-span-7">
          <GlassCard className="p-6">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Message Received!</h3>
                <p className="text-xs text-slate-300">Our engineering and BFSI support team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                  <input required placeholder="Rajesh Sharma" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
                  <input type="email" required placeholder="rajesh@fintech.com" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
                  <textarea rows={4} required placeholder="Tell us about your requirements..." className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-blue transition-all">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

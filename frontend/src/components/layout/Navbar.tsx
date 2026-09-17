import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage, Language } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Shield, LogOut, Globe, Menu, X, Sparkles, Sun, Moon } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDemoClick = async () => {
    await loginAsDemo();
    navigate("/dashboard");
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-emerald-500 flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">Credit Assistant</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">2.0</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">AI Financial Health Advisor</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/features" className="hover:text-white transition-colors">Features</Link>
          <Link to="/about" className="hover:text-white transition-colors">About BFSI</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> {t("dashboard")}
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select interface language"
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium"
            >
              <option value="en" className="bg-navy-900 text-white">English (EN)</option>
              <option value="hi" className="bg-navy-900 text-white">हिंदी (HI)</option>
              <option value="mr" className="bg-navy-900 text-white">मराठी (MR)</option>
            </select>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-blue-400 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <span>{user?.full_name?.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDemoClick}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-glow-emerald"
              >
                {t("demoLogin")}
              </button>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-glow-blue"
              >
                {t("login")}
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-400" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-medium text-slate-300">Home</Link>
          <Link to="/features" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-medium text-slate-300">Features</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-medium text-slate-300">About BFSI</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-medium text-slate-300">Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-bold text-blue-400">Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left py-1 text-sm font-medium text-red-400">Sign Out</button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={handleDemoClick} className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">One-Click Demo Access</button>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">Sign In</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

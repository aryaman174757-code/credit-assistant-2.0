import React from "react";
import { motion } from "framer-motion";

interface CreditGaugeProps {
  score: number;
  size?: number;
}

export const CreditGauge: React.FC<CreditGaugeProps> = ({ score, size = 220 }) => {
  const minScore = 300;
  const maxScore = 900;
  const clamped = Math.max(minScore, Math.min(maxScore, score));
  const percentage = (clamped - minScore) / (maxScore - minScore);
  const angle = -120 + percentage * 240;

  const getTier = (s: number) => {
    if (s >= 780) return { label: "Excellent (Prime)", color: "#10B981" };
    if (s >= 720) return { label: "Good Tier", color: "#3B82F6" };
    if (s >= 650) return { label: "Fair / Average", color: "#F59E0B" };
    return { label: "Needs Attention", color: "#EF4444" };
  };

  const tier = getTier(clamped);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size * 0.75} viewBox="0 0 200 150">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        <path
          d="M 30 130 A 70 70 0 1 1 170 130"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        <path
          d="M 30 130 A 70 70 0 1 1 170 130"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="14"
          strokeDasharray="300"
          strokeDashoffset={300 - percentage * 240}
          strokeLinecap="round"
        />

        <circle cx="100" cy="130" r="7" fill="#FFFFFF" />
      </svg>

      <div className="absolute top-[38%] text-center flex flex-col items-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black text-white tracking-tight"
        >
          {clamped}
        </motion.span>
        <span className="text-xs uppercase font-bold tracking-wider mt-0.5" style={{ color: tier.color }}>
          {tier.label}
        </span>
      </div>

      <div className="flex justify-between w-full max-w-[200px] text-[11px] font-semibold text-slate-500 mt-1 px-3">
        <span>300</span>
        <span>600</span>
        <span>900</span>
      </div>
    </div>
  );
};

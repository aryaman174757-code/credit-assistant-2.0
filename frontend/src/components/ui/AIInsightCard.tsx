import React from "react";
import { GlassCard } from "./GlassCard";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { XAIItem } from "../../types";

interface AIInsightCardProps {
  item: XAIItem;
  index: number;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ item, index }) => {
  return (
    <GlassCard className="border-l-4 border-l-blue-500 hover:border-l-emerald-400 group">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
              {item.problem}
            </h4>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Insight #{index + 1}
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="font-semibold text-slate-400 min-w-[70px]">Reason:</span>
              <span>{item.reason}</span>
            </div>

            <div className="flex items-start gap-2 text-emerald-300 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
              <span className="font-semibold text-emerald-400 min-w-[70px]">Action:</span>
              <span className="font-medium">{item.action}</span>
            </div>

            <div className="flex items-start gap-2 text-blue-300 text-xs font-medium">
              <ArrowUpRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Expected Impact:</strong> {item.expected_impact}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

import React from "react";
import { clsx } from "clsx";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "glass-panel rounded-2xl p-6 shadow-glass relative overflow-hidden transition-all duration-300",
        hoverEffect && "glass-panel-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

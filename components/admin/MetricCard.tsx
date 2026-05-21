import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  valueSize?: "sm" | "md" | "lg";
}

export function MetricCard({
  title,
  value,
  icon,
  description,
  valueSize = "lg",
}: MetricCardProps) {
  const sizesMap = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
              {title}
            </p>
            <p className={`${sizesMap[valueSize]} font-bold text-slate-900 mb-2`}>
              {value}
            </p>
            {description && (
              <p className="text-xs text-slate-500 font-medium">{description}</p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

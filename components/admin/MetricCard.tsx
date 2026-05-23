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
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="bg-white rounded-lg border border-slate-100 p-6 hover:border-slate-200 transition-colors duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 mb-2 tracking-wide">
            {title}
          </p>
          <p className={`${sizesMap[valueSize]} font-semibold text-slate-900 mb-1`}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-slate-400 mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-3 text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

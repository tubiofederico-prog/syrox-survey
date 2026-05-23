"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type SurveyData = {
  q5_improvement?: string;
  [key: string]: any;
};

export function BarMejoras({ surveys }: { surveys: SurveyData[] }) {
  const counts: Record<string, number> = {};
  surveys.forEach((s) => {
    const val = s.q5_improvement;
    if (val) counts[val] = (counts[val] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-900">
          Mejoras sugeridas
        </h3>
        <p className="text-xs text-slate-400 mt-1">Retroalimentación del cliente</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ bottom: 50, top: 10 }}>
          <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }} />
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

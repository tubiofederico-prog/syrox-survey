"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

type SurveyData = {
  q2_confidence?: string;
  [key: string]: any;
};

const COLORS = [
  "#6366f1",
  "#818cf8",
  "#a5b4fc",
  "#c7d2fe",
  "#e0e7ff",
];

export function DonutConfianza({ surveys }: { surveys: SurveyData[] }) {
  const counts: Record<string, number> = {};
  surveys.forEach((s) => {
    const val = s.q2_confidence;
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
          Factores de confianza
        </h3>
        <p className="text-xs text-slate-400 mt-1">Análisis de respuestas</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type SurveyData = {
  q4_doubt?: string;
  [key: string]: any;
};

export function BarHorizontalDudas({ surveys }: { surveys: SurveyData[] }) {
  const counts: Record<string, number> = {};
  surveys.forEach((s) => {
    const val = s.q4_doubt;
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
          Dudas principales
        </h3>
        <p className="text-xs text-slate-400 mt-1">Objeciones antes de decidir</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 180, top: 10 }}
        >
          <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={true} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
          <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }} />
          <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

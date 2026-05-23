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
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900">
          Dudas principales
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Objeciones antes de decidir</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 160, top: 5 }}
        >
          <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={true} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} width={30} />
          <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", fontSize: 12 }} />
          <Bar dataKey="value" fill="#6366f1" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Reunión comercial",
    value: 15,
  },
  {
    name: "Claridad de propuesta",
    value: 12,
  },
  {
    name: "Entendieron mi negocio",
    value: 11,
  },
  {
    name: "Comunicación del equipo",
    value: 6,
  },
  {
    name: "Otros",
    value: 4,
  },
];

const COLORS = [
  "#7C3AED",
  "#8B5CF6",
  "#A78BFA",
  "#C4B5FD",
  "#E9D5FF",
];

export function DonutConfianza() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Factores que generaron confianza
        </h3>
        <p className="text-sm text-slate-500 mt-1">Análisis de respuestas</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

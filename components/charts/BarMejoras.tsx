"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Más ejemplos/casos",
    value: 12,
  },
  {
    name: "Más rapidez",
    value: 11,
  },
  {
    name: "Mayor claridad técnica",
    value: 10,
  },
  {
    name: "Más seguimiento",
    value: 8,
  },
  {
    name: "No mejoraría nada",
    value: 7,
  },
];

export function BarMejoras() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Aspectos a mejorar del proceso
        </h3>
        <p className="text-sm text-slate-500 mt-1">Retroalimentación para optimizar</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

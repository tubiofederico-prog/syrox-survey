"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Si se iban a cumplir plazos",
    value: 14,
  },
  {
    name: "Si desarrollo iba bien",
    value: 12,
  },
  {
    name: "Si inversión valía la pena",
    value: 10,
  },
  {
    name: "Si entenderían mi negocio",
    value: 8,
  },
  {
    name: "Si buen soporte",
    value: 4,
  },
];

export function BarHorizontalDudas() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Principales dudas antes de decidir
        </h3>
        <p className="text-sm text-slate-500 mt-1">Objeciones y preocupaciones</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 200 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={200} />
          <Tooltip />
          <Bar dataKey="value" fill="#7C3AED" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Velocidad de entrega",
    value: 17,
    percentage: 35,
  },
  {
    name: "Confianza del equipo",
    value: 13,
    percentage: 27,
  },
  {
    name: "Propuesta/prototipo",
    value: 10,
    percentage: 21,
  },
  {
    name: "Precio y condiciones",
    value: 5,
    percentage: 10,
  },
  {
    name: "Otros",
    value: 3,
    percentage: 7,
  },
];

export function BarChartMotivos() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Motivos por los que eligieron SyroxTech
        </h3>
        <p className="text-sm text-slate-500 mt-1">Distribución de respuestas</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }} />
          <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

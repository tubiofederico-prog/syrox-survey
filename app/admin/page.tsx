"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Star, Zap } from "lucide-react";
import { Header } from "@/components/admin/Header";
import { MetricCard } from "@/components/admin/MetricCard";

type SurveyData = {
  id: string;
  created_at: string;
  survey_id?: number;
  name?: string;
  company?: string;
  industry?: string;
  email?: string;
  comment?: string;
  answers?: Record<string, string>;
};

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.from("survey_responses").select("*");
        setSurveys(data || []);
      } catch (e) {
        console.error("Error al cargar las respuestas:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const getTopItem = (field: string) => {
    if (surveys.length === 0) return { value: "—", percentage: "0%" };

    const counts: Record<string, number> = {};
    surveys.forEach((s: any) => {
      const val = s[field];
      if (val) counts[val] = (counts[val] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { value: "—", percentage: "0%" };

    const [topValue, topCount] = sorted[0];
    const percentage = Math.round((topCount / surveys.length) * 100);
    return { value: topValue, percentage: `${percentage}%` };
  };

  const getMostCommonAnswer = () => {
    if (surveys.length === 0) return { value: "—", percentage: "0%" };

    const allAnswers: Record<string, number> = {};
    surveys.forEach((s) => {
      if (s.answers && Object.keys(s.answers).length > 0) {
        Object.values(s.answers).forEach((answer) => {
          if (answer) {
            allAnswers[answer] = (allAnswers[answer] || 0) + 1;
          }
        });
      }
    });

    const sorted = Object.entries(allAnswers).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { value: "—", percentage: "0%" };

    const [topValue, topCount] = sorted[0];
    const percentage = Math.round((topCount / surveys.length) * 100);
    return { value: topValue.substring(0, 15), percentage: `${percentage}%` };
  };

  const q1Top = getMostCommonAnswer();

  if (loading) {
    return (
      <>
        <Header title="Panel de Control" />
        <div className="p-8 text-center text-gray-600">Cargando datos...</div>
      </>
    );
  }

  return (
    <>
      <Header title="Panel de Control" />

      <div className="p-6 bg-white">
        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          <MetricCard
            title="Total de respuestas"
            value={surveys.length.toString()}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Respuesta más común"
            value={q1Top.value.length > 15 ? q1Top.value.substring(0, 12) + "..." : q1Top.value}
            description={`${q1Top.percentage} de las respuestas`}
            valueSize="sm"
            icon={<Zap size={24} />}
          />
          <MetricCard
            title="Rubros respondidos"
            value={new Set(surveys.map(s => s.industry).filter(Boolean)).size.toString()}
            icon={<Star size={24} />}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-slate-100 p-5 hover:border-slate-200 transition-colors">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Respuestas por rubro</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribución de respondentes</p>
            </div>
            <div className="space-y-2">
              {Object.entries(
                surveys.reduce((acc, s) => {
                  acc[s.industry || "Sin especificar"] = (acc[s.industry || "Sin especificar"] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([industry, count]) => (
                <div key={industry} className="flex justify-between items-center text-xs">
                  <span className="text-slate-700">{industry}</span>
                  <span className="font-medium text-indigo-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-100 p-5 hover:border-slate-200 transition-colors">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Información de respuestas</h3>
              <p className="text-xs text-slate-500 mt-0.5">Resumen de datos recopilados</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Con nombre</p>
                <p className="text-sm font-semibold text-slate-900">{surveys.filter(s => s.name).length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Con correo electrónico</p>
                <p className="text-sm font-semibold text-slate-900">{surveys.filter(s => s.email).length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Con comentario adicional</p>
                <p className="text-sm font-semibold text-slate-900">{surveys.filter(s => s.comment).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

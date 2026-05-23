"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Star, Zap, AlertCircle, Lightbulb } from "lucide-react";
import { Header } from "@/components/admin/Header";
import { MetricCard } from "@/components/admin/MetricCard";
import { BarChartMotivos } from "@/components/charts/BarChartMotivos";
import { DonutConfianza } from "@/components/charts/DonutConfianza";
import { BarHorizontalDudas } from "@/components/charts/BarHorizontalDudas";
import { BarMejoras } from "@/components/charts/BarMejoras";

type SurveyData = {
  id: string;
  created_at: string;
  q1_reason?: string;
  q2_confidence?: string;
  q3_decision?: string;
  q4_doubt?: string;
  q5_improvement?: string;
  [key: string]: any;
};

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.from("surveys").select("*");
        setSurveys(data || []);
      } catch (e) {
        console.error("Error fetching surveys:", e);
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

  const q1Top = getTopItem("q1_reason");
  const q2Top = getTopItem("q2_confidence");
  const q3Top = getTopItem("q3_decision");
  const q4Top = getTopItem("q4_doubt");
  const q5Top = getTopItem("q5_improvement");

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="p-8 text-center text-gray-600">Cargando datos...</div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" />

      <div className="p-6 bg-white">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <MetricCard
            title="Total de respuestas"
            value={surveys.length.toString()}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Motivo principal"
            value={q1Top.value.length > 15 ? q1Top.value.substring(0, 12) + "..." : q1Top.value}
            description={`${q1Top.percentage} de respuestas`}
            valueSize="sm"
            icon={<Zap size={24} />}
          />
          <MetricCard
            title="Factor de confianza"
            value={q2Top.value.length > 15 ? q2Top.value.substring(0, 12) + "..." : q2Top.value}
            description={`${q2Top.percentage} de respuestas`}
            valueSize="sm"
            icon={<Star size={24} />}
          />
          <MetricCard
            title="Principal duda"
            value={q4Top.value.length > 15 ? q4Top.value.substring(0, 12) + "..." : q4Top.value}
            description={`${q4Top.percentage} de respuestas`}
            valueSize="sm"
            icon={<AlertCircle size={24} />}
          />
          <MetricCard
            title="Mejora sugerida"
            value={q5Top.value.length > 15 ? q5Top.value.substring(0, 12) + "..." : q5Top.value}
            description={`${q5Top.percentage} de respuestas`}
            valueSize="sm"
            icon={<Lightbulb size={24} />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-slate-100 p-5 hover:border-slate-200 transition-colors">
            <BarChartMotivos surveys={surveys} />
          </div>
          <div className="bg-white rounded-lg border border-slate-100 p-5 hover:border-slate-200 transition-colors">
            <DonutConfianza surveys={surveys} />
          </div>
          <div className="bg-white rounded-lg border border-slate-100 p-5 hover:border-slate-200 transition-colors">
            <BarHorizontalDudas surveys={surveys} />
          </div>
          <div className="bg-white rounded-lg border border-slate-100 p-5 hover:border-slate-200 transition-colors">
            <BarMejoras surveys={surveys} />
          </div>
        </div>
      </div>
    </>
  );
}

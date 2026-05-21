import { TrendingUp, Star, Zap, AlertCircle, Lightbulb } from "lucide-react";
import { Header } from "@/components/admin/Header";
import { MetricCard } from "@/components/admin/MetricCard";
import { BarChartMotivos } from "@/components/charts/BarChartMotivos";
import { DonutConfianza } from "@/components/charts/DonutConfianza";
import { BarHorizontalDudas } from "@/components/charts/BarHorizontalDudas";
import { BarMejoras } from "@/components/charts/BarMejoras";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />

      <div className="p-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <MetricCard
            title="Total de respuestas"
            value="48"
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Motivo principal"
            value="Velocidad"
            description="35% de respuestas"
            valueSize="sm"
            icon={<Zap size={24} />}
          />
          <MetricCard
            title="Factor de confianza"
            value="Reunión"
            description="31% de respuestas"
            valueSize="sm"
            icon={<Star size={24} />}
          />
          <MetricCard
            title="Principal duda"
            value="Plazos"
            description="29% de respuestas"
            valueSize="sm"
            icon={<AlertCircle size={24} />}
          />
          <MetricCard
            title="Mejora sugerida"
            value="Casos"
            description="25% de respuestas"
            valueSize="sm"
            icon={<Lightbulb size={24} />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <BarChartMotivos />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <DonutConfianza />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <BarHorizontalDudas />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <BarMejoras />
          </div>
        </div>
      </div>
    </>
  );
}

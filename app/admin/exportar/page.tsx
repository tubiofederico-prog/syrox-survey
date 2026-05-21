"use client";

import { useState } from "react";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/admin/MetricCard";
import { FileText, Download } from "lucide-react";

export default function ExportarPage() {
  const [exportedDate, setExportedDate] = useState("Nunca");

  const handleExportCSV = () => {
    const now = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setExportedDate(`Hoy ${now}`);
  };

  const handleExportExcel = () => {
    const now = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setExportedDate(`Hoy ${now}`);
  };

  return (
    <>
      <Header title="Exportar Datos" />

      <div className="p-8">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            Descarga los datos de todas las respuestas en formato CSV o Excel para
            análisis comercial y reportes internos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            title="Total de respuestas"
            value="48"
            icon={<FileText size={24} />}
          />
          <MetricCard
            title="Última exportación"
            value={exportedDate}
            description={exportedDate === "Nunca" ? "" : "Descarga realizada"}
            valueSize="sm"
            icon={<Download size={24} />}
          />
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-semibold text-lg">
                CSV
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Exportar como CSV
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Formato compatible con Excel, Google Sheets y herramientas de análisis.
                </p>
                <Button
                  onClick={handleExportCSV}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Descargar CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Excel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-semibold text-lg">
                XLS
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Exportar como Excel
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Formato .xlsx con múltiples hojas y estilos formateados.
                </p>
                <Button
                  onClick={handleExportExcel}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Descargar Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            ¿Qué incluyen los reportes?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Datos de cliente (nombre, empresa, rubro, email)
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Respuestas a todas las preguntas de la encuesta
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Comentarios adicionales de los clientes
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">✓</span>
              Fecha y hora de envío de cada respuesta
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

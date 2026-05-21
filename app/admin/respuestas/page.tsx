"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { mockResponses } from "@/data/mockResponses";
import { industries } from "@/data/surveyQuestions";
import { formatDate } from "@/lib/utils";
import { Eye, X } from "lucide-react";

type SortField = "date" | "name" | "company";

export default function RespuestasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedMotivo, setSelectedMotivo] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");

  const motivos = Array.from(
    new Set(mockResponses.map((r) => r.q1_reason))
  ).sort();

  const filteredResponses = useMemo(() => {
    let filtered = mockResponses;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.company.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term)
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter((r) => r.industry === selectedIndustry);
    }

    if (selectedMotivo) {
      filtered = filtered.filter((r) => r.q1_reason === selectedMotivo);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortField === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortField === "company") {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedIndustry, selectedMotivo, sortField]);

  const selectedDetailData = selectedDetail
    ? mockResponses.find((r) => r.id === selectedDetail)
    : null;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("");
    setSelectedMotivo("");
  };

  return (
    <>
      <Header title="Respuestas" />

      <div className="p-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar por nombre o empresa
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escribe aquí..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filtrar por rubro
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
              >
                <option value="">Todos</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Motivo Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filtrar por motivo principal
              </label>
              <select
                value={selectedMotivo}
                onChange={(e) => setSelectedMotivo(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
              >
                <option value="">Todos</option>
                {motivos.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
              >
                <option value="date">Fecha (más reciente)</option>
                <option value="name">Nombre</option>
                <option value="company">Empresa</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {filteredResponses.length} de {mockResponses.length} respuestas
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-900">Fecha</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-900">Nombre</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-900">Empresa</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-900">Rubro</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-900">Motivo principal</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((response) => (
                  <tr
                    key={response.id}
                    className="border-b border-slate-100 hover:bg-violet-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {formatDate(response.date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {response.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {response.company || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {response.industry}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-3 py-1.5 rounded-full font-medium">
                        {response.q1_reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedDetail(response.id)}
                        className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold hover:bg-violet-50 px-3 py-1 rounded-lg transition-all"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={selectedDetail !== null}
        onClose={() => setSelectedDetail(null)}
        title="Detalle de respuesta"
      >
        {selectedDetailData && (
          <div className="space-y-6">
            {/* Client Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Información del cliente
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Nombre</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDetailData.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDetailData.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Empresa</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDetailData.company || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Rubro</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDetailData.industry}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Answers */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Respuestas de la encuesta
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    ¿Qué te hizo elegir SyroxTech?
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedDetailData.q1_reason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    ¿Qué generó más confianza?
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedDetailData.q2_confidence}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Factor más importante para decidir
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedDetailData.q3_decision}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Principal duda antes de decidir
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedDetailData.q4_doubt}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Qué mejoraría del proceso
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedDetailData.q5_improvement}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment */}
            {selectedDetailData.comment && (
              <>
                <div className="border-t border-gray-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Comentario adicional
                  </h3>
                  <p className="text-sm text-gray-700 italic">
                    "{selectedDetailData.comment}"
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

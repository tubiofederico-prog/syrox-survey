"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { industries } from "@/data/surveyQuestions";
import { formatDate } from "@/lib/utils";
import { Eye, X, Trash2 } from "lucide-react";

type SortField = "date" | "name" | "company";
type SurveyResponse = {
  id: string;
  created_at: string;
  q1_reason?: string;
  q2_confidence?: string;
  q3_decision?: string;
  q4_doubt?: string;
  q5_improvement?: string;
  industry?: string;
  [key: string]: any;
};

export default function RespuestasPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedMotivo, setSelectedMotivo] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/surveys`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setResponses(Array.isArray(data.data) ? data.data : []);
      })
      .catch((e) => console.error("Error fetching surveys:", e))
      .finally(() => setLoading(false));
  }, []);

  const motivos = Array.from(
    new Set(responses.map((r) => r.q1_reason).filter(Boolean))
  ).sort();

  const filteredResponses = useMemo(() => {
    let filtered = responses;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          String(r.name || "").toLowerCase().includes(term) ||
          String(r.company || "").toLowerCase().includes(term) ||
          String(r.email || "").toLowerCase().includes(term)
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter((r) => r.industry === selectedIndustry);
    }

    if (selectedMotivo) {
      filtered = filtered.filter((r) => r.q1_reason === selectedMotivo);
    }

    filtered.sort((a, b) => {
      if (sortField === "date") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      } else if (sortField === "name") {
        return String(a.name || "").localeCompare(String(b.name || ""));
      } else if (sortField === "company") {
        return String(a.company || "").localeCompare(String(b.company || ""));
      }
      return 0;
    });

    return filtered;
  }, [responses, searchTerm, selectedIndustry, selectedMotivo, sortField]);

  const selectedDetailData = selectedDetail
    ? responses.find((r) => r.id === selectedDetail)
    : null;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("");
    setSelectedMotivo("");
  };

  const handleDeleteAll = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/surveys/delete-all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponses([]);
      setShowDeleteConfirm(false);
    } catch (e) {
      console.error("Error deleting surveys:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Respuestas" />
        <div className="p-8 text-center">
          <p className="text-gray-600">Cargando respuestas...</p>
        </div>
      </>
    );
  }

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

          {/* Clear Filters and Delete All */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando {filteredResponses.length} de {responses.length} respuestas
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Limpiar filtros
              </Button>
              {responses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAll}
                  className={showDeleteConfirm ? "bg-red-50 border-red-300" : ""}
                >
                  <Trash2 size={16} className="mr-2" />
                  {showDeleteConfirm ? "¿Estás seguro?" : "Borrar todos"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {filteredResponses.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No hay respuestas para mostrar</p>
            </div>
          ) : (
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
                        {formatDate(response.created_at || new Date().toISOString())}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {response.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {response.company || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {response.industry || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-3 py-1.5 rounded-full font-medium">
                          {response.q1_reason || "—"}
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
          )}
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

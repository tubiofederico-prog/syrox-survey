import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { surveyQuestions } from "@/data/surveyQuestions";
import { Eye, Edit2 } from "lucide-react";

export default function EncuestaPage() {
  return (
    <>
      <Header title="Gestión de Encuesta" />

      <div className="p-8">
        {/* Estado */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Estado de la encuesta
              </h2>
              <p className="text-gray-600 mt-1">
                La encuesta está disponible para que los clientes la completen
              </p>
            </div>
            <Badge variant="success">Activa</Badge>
          </div>
        </div>

        {/* Preguntas */}
        <div className="space-y-4">
          {surveyQuestions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Pregunta {index + 1}: {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                <Badge>{question.options.length} opciones</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link href="/encuesta">
            <Button variant="secondary" size="lg" className="flex items-center gap-2">
              <Eye size={18} />
              Vista previa
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Edit2 size={18} />
            Editar encuesta
          </Button>
        </div>
      </div>
    </>
  );
}

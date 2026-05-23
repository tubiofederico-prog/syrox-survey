"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  question_text: string;
  order_index: number;
};

type SurveyConfig = {
  id: number;
  title: string;
  description?: string;
};

export function SurveyForm() {
  const router = useRouter();
  const [survey, setSurvey] = useState<SurveyConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    industry: "",
    email: "",
    comment: "",
    answers: {} as Record<number, string>,
  });

  const industries = [
    "Tecnología",
    "E-commerce",
    "Finanzas",
    "Retail",
    "Manufactura",
    "Servicios",
    "Salud",
    "Educación",
  ];

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        // Get the first active survey
        const { data: surveys } = await supabase
          .from("surveys_config")
          .select("*")
          .eq("is_active", true)
          .limit(1);

        if (!surveys || surveys.length === 0) {
          setIsLoading(false);
          return;
        }

        const activeSurvey = surveys[0];
        setSurvey(activeSurvey);

        // Get questions for this survey
        const { data: questionsData } = await supabase
          .from("questions")
          .select("*")
          .eq("survey_id", activeSurvey.id)
          .order("order_index");

        setQuestions(questionsData || []);
      } catch (error) {
        console.error("Error al cargar la encuesta:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  };

  const isFormValid =
    Object.keys(formData.answers).length === questions.length &&
    questions.length > 0 &&
    Object.values(formData.answers).every((v) => v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !survey) return;

    setIsSubmitting(true);
    try {
      const surveyData: Record<string, any> = {
        name: formData.name,
        company: formData.company,
        industry: formData.industry,
        email: formData.email,
        comment: formData.comment,
        survey_id: survey.id,
      };

      // Add answers dynamically
      questions.forEach((q, idx) => {
        surveyData[`answer_${q.id}`] = formData.answers[q.id];
      });

      await supabase.from("surveys").insert([surveyData]);
      router.push("/gracias");
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      alert("Hubo un error al enviar tu respuesta. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-slate-600">Cargando encuesta...</div>;
  }

  if (!survey || questions.length === 0) {
    return <div className="text-center text-slate-600">No hay encuestas disponibles</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Información opcional */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-5">
          Información opcional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <input
            type="text"
            name="company"
            placeholder="Empresa"
            value={formData.company}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-700"
          >
            <option value="">Selecciona un rubro</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preguntas dinámicas */}
      <div className="mb-8">
        {questions.map((question, idx) => (
          <div key={question.id} className="mb-8">
            <label className="block mb-4">
              <span className="text-base font-bold text-slate-900">
                Pregunta {idx + 1}: {question.question_text}
              </span>
            </label>
            <textarea
              value={formData.answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Tu respuesta..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400"
            />
          </div>
        ))}
      </div>

      {/* Comentario adicional */}
      <div className="mb-8">
        <label className="block mb-3">
          <span className="text-base font-bold text-slate-900">
            Comentario adicional (opcional)
          </span>
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Si querés dejarnos algún comentario extra..."
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? "Enviando..." : "Enviar encuesta"}
      </Button>
    </form>
  );
}

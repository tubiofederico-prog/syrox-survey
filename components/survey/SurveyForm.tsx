"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  question_text: string;
  question_type: "text" | "multiple_choice" | "single_choice";
  order_index: number;
};

type QuestionOption = {
  id: number;
  question_id: number;
  option_text: string;
  order_index: number;
};

type SurveyConfig = {
  id: number;
  title: string;
  description?: string;
};

interface SurveyFormProps {
  surveyId?: number;
}

export function SurveyForm({ surveyId }: SurveyFormProps) {
  const router = useRouter();
  const [survey, setSurvey] = useState<SurveyConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOptions, setQuestionOptions] = useState<Record<number, QuestionOption[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const fetchSurvey = async (attempt = 1) => {
      try {
        setError(null);
        let activeSurvey;

        // Si surveyId está definido, cargar esa encuesta específica
        if (surveyId) {
          console.log(`📋 Buscando encuesta ID ${surveyId}... (intento ${attempt})`);
          const { data: surveys, error: fetchError } = await supabase
            .from("surveys_config")
            .select("*")
            .eq("id", surveyId);

          if (fetchError) {
            console.error("Error al buscar encuesta:", fetchError);
            setError(`Error: ${fetchError.message}`);
            setIsLoading(false);
            return;
          }

          if (!surveys || surveys.length === 0) {
            if (attempt < 3) {
              // Reintentar después de 1 segundo (para esperar replicación de Supabase)
              console.log("⏳ Encuesta no encontrada. Reintentando en 1 segundo...");
              setTimeout(() => fetchSurvey(attempt + 1), 1000);
              return;
            } else {
              console.error("Encuesta no encontrada después de 3 intentos");
              setError(`❌ Encuesta con ID ${surveyId} no encontrada`);
              setIsLoading(false);
              return;
            }
          }
          console.log("✅ Encuesta encontrada:", surveys[0].title);
          activeSurvey = surveys[0];
        } else {
          // Si no, buscar la primera encuesta activa
          const { data: surveys } = await supabase
            .from("surveys_config")
            .select("*")
            .eq("is_active", true)
            .limit(1);

          if (!surveys || surveys.length === 0) {
            setError("No hay encuestas disponibles");
            setIsLoading(false);
            return;
          }
          activeSurvey = surveys[0];
        }

        setSurvey(activeSurvey);

        // Get questions for this survey
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .eq("survey_id", activeSurvey.id)
          .order("order_index");

        if (questionsError) {
          console.error("Error al cargar preguntas:", questionsError);
          setError(`Error al cargar preguntas: ${questionsError.message}`);
          return;
        }

        console.log(`✅ ${questionsData?.length || 0} preguntas cargadas`);
        setQuestions(questionsData || []);

        // Get options for each question
        if (questionsData && questionsData.length > 0) {
          const optionsMap: Record<number, QuestionOption[]> = {};
          for (const q of questionsData) {
            if (q.question_type === "single_choice" || q.question_type === "multiple_choice") {
              const { data: optionsData } = await supabase
                .from("question_options")
                .select("*")
                .eq("question_id", q.id)
                .order("order_index");
              optionsMap[q.id] = optionsData || [];
            }
          }
          setQuestionOptions(optionsMap);
          console.log("✅ Opciones cargadas");
        }
      } catch (error) {
        console.error("Error al cargar la encuesta:", error);
        setError(`Error: ${String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

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
    return (
      <div className="text-center">
        <div className="text-slate-600 mb-4">⏳ Cargando encuesta...</div>
        <div className="text-xs text-slate-500">Esto puede tomar unos segundos la primera vez</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 font-semibold mb-4">{error}</div>
        <div className="text-xs text-slate-500 mb-4">Verifica en la consola (F12) para más detalles</div>
        {typeof surveyId !== "undefined" && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            Reintentar
          </button>
        )}
      </div>
    );
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

            {question.question_type === "text" && (
              <textarea
                value={formData.answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Tu respuesta..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400"
              />
            )}

            {question.question_type === "single_choice" && (
              <div className="space-y-3">
                {(questionOptions[question.id] || []).map((option) => (
                  <label key={option.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={option.option_text}
                      checked={formData.answers[question.id] === option.option_text}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-4 h-4 text-indigo-500 cursor-pointer"
                    />
                    <span className="text-slate-900 text-sm">{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}

            {question.question_type === "multiple_choice" && (
              <div className="space-y-3">
                {(questionOptions[question.id] || []).map((option) => (
                  <label key={option.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      value={option.option_text}
                      checked={(formData.answers[question.id] || "").includes(option.option_text)}
                      onChange={(e) => {
                        const current = (formData.answers[question.id] || "").split(";").filter(Boolean);
                        if (e.target.checked) {
                          handleAnswerChange(question.id, [...current, e.target.value].join(";"));
                        } else {
                          handleAnswerChange(question.id, current.filter(v => v !== e.target.value).join(";"));
                        }
                      }}
                      className="w-4 h-4 text-indigo-500 cursor-pointer rounded"
                    />
                    <span className="text-slate-900 text-sm">{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}
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

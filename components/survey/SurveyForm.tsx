"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { surveyQuestions, industries } from "@/data/surveyQuestions";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/Button";

export function SurveyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    industry: "",
    email: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    comment: "",
  });

  const handleQuestionChange = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.q1 && formData.q2 && formData.q3 && formData.q4 && formData.q5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("surveys").insert([{
        name: formData.name,
        company: formData.company,
        industry: formData.industry,
        email: formData.email,
        q1_reason: formData.q1,
        q2_confidence: formData.q2,
        q3_decision: formData.q3,
        q4_doubt: formData.q4,
        q5_improvement: formData.q5,
        comment: formData.comment,
      }]);
      router.push("/gracias");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error sending survey. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos opcionales */}
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
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <input
            type="text"
            name="company"
            placeholder="Empresa"
            value={formData.company}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-slate-700"
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

      {/* Preguntas */}
      <div className="mb-8">
        {surveyQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selected={formData[question.id as keyof typeof formData] as string}
            onSelect={(value) => handleQuestionChange(question.id, value)}
          />
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
          placeholder="Si querés dejarnos algún comentario extra o feedback adicional, te leemos."
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Botón de envío */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          size="lg"
          className="flex-1"
        >
          {isLoading ? "Enviando..." : "Enviar respuesta"}
        </Button>
      </div>

      {!isFormValid && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm font-medium text-red-700">
            Por favor, responde todas las preguntas obligatorias para continuar.
          </p>
        </div>
      )}
    </form>
  );
}

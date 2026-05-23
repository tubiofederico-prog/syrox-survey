"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SurveyConfig = {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
};

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

export function SurveyManager() {
  const [surveys, setSurveys] = useState<SurveyConfig[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [newSurveyDesc, setNewSurveyDesc] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [questionType, setQuestionType] = useState<"text" | "multiple_choice" | "single_choice">("text");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newOption, setNewOption] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchQuestions(selectedSurvey.id);
    }
  }, [selectedSurvey]);

  useEffect(() => {
    if (selectedQuestion) {
      fetchOptions(selectedQuestion.id);
    }
  }, [selectedQuestion]);

  const fetchSurveys = async () => {
    try {
      const { data } = await supabase
        .from("surveys_config")
        .select("*")
        .order("created_at", { ascending: false });
      setSurveys(data || []);
    } catch (e) {
      console.error("Error fetching surveys:", e);
    }
  };

  const fetchQuestions = async (surveyId: number) => {
    try {
      const { data } = await supabase
        .from("questions")
        .select("*")
        .eq("survey_id", surveyId)
        .order("order_index");
      setQuestions(data || []);
      setSelectedQuestion(null);
      setOptions([]);
    } catch (e) {
      console.error("Error al cargar las preguntas:", e);
    }
  };

  const fetchOptions = async (questionId: number) => {
    try {
      const { data } = await supabase
        .from("question_options")
        .select("*")
        .eq("question_id", questionId)
        .order("order_index");
      setOptions(data || []);
    } catch (e) {
      console.error("Error al cargar las opciones:", e);
    }
  };

  const createSurvey = async () => {
    if (!newSurveyTitle.trim()) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("surveys_config")
        .insert([{ title: newSurveyTitle, description: newSurveyDesc }])
        .select();

      if (data) {
        setSurveys([...surveys, data[0]]);
        setNewSurveyTitle("");
        setNewSurveyDesc("");
        setSelectedSurvey(data[0]);
      }
    } catch (e) {
      console.error("Error creating survey:", e);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    if (!selectedSurvey || !newQuestion.trim()) return;
    setLoading(true);
    try {
      const orderIndex = Math.max(...questions.map(q => q.order_index || 0), 0) + 1;
      const { data } = await supabase
        .from("questions")
        .insert([{
          survey_id: selectedSurvey.id,
          question_text: newQuestion,
          question_type: questionType,
          order_index: orderIndex
        }])
        .select();

      if (data) {
        setQuestions([...questions, data[0]]);
        setNewQuestion("");
        setQuestionType("text");
      }
    } catch (e) {
      console.error("Error al agregar pregunta:", e);
    } finally {
      setLoading(false);
    }
  };

  const addOption = async () => {
    if (!selectedQuestion || !newOption.trim()) return;
    setLoading(true);
    try {
      const orderIndex = Math.max(...options.map(o => o.order_index || 0), 0) + 1;
      const { data } = await supabase
        .from("question_options")
        .insert([{
          question_id: selectedQuestion.id,
          option_text: newOption,
          order_index: orderIndex
        }])
        .select();

      if (data) {
        setOptions([...options, data[0]]);
        setNewOption("");
      }
    } catch (e) {
      console.error("Error al agregar opción:", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteOption = async (optionId: number) => {
    if (!confirm("¿Eliminar esta opción?")) return;
    try {
      await supabase.from("question_options").delete().eq("id", optionId);
      setOptions(options.filter(o => o.id !== optionId));
    } catch (e) {
      console.error("Error al eliminar la opción:", e);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) return;
    try {
      await supabase.from("questions").delete().eq("id", questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (e) {
      console.error("Error deleting question:", e);
    }
  };

  const deleteSurvey = async (surveyId: number) => {
    if (!confirm("¿Estás seguro? Se eliminarán la encuesta y todas sus preguntas. Esta acción no se puede deshacer.")) return;
    try {
      await supabase.from("surveys_config").delete().eq("id", surveyId);
      setSurveys(surveys.filter(s => s.id !== surveyId));
      setSelectedSurvey(null);
      setQuestions([]);
    } catch (e) {
      console.error("Error deleting survey:", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Surveys List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Encuestas</h3>

          {/* Crear Encuesta */}
          <div className="mb-6 space-y-2">
            <input
              type="text"
              placeholder="Título de la encuesta..."
              value={newSurveyTitle}
              onChange={(e) => setNewSurveyTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Descripción (opcional)..."
              value={newSurveyDesc}
              onChange={(e) => setNewSurveyDesc(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createSurvey}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              <Plus size={14} /> Nueva encuesta
            </button>
          </div>

          {/* Surveys List */}
          <div className="space-y-2">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className={`p-3 rounded-md border cursor-pointer transition-colors text-xs ${
                  selectedSurvey?.id === survey.id
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div onClick={() => setSelectedSurvey(survey)} className="mb-2">
                  <p className="font-medium text-slate-900">{survey.title}</p>
                  {survey.description && (
                    <p className="text-slate-500 text-xs mt-1">{survey.description}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteSurvey(survey.id)}
                  className="w-full text-red-600 hover:text-red-700 text-xs py-1"
                >
                  <Trash2 size={13} className="inline mr-1" /> Eliminar encuesta
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Questions */}
      <div className="lg:col-span-2">
        {selectedSurvey ? (
          <div className="space-y-5">
            {/* Panel de crear pregunta */}
            <div className="bg-white rounded-lg border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Agregar Nueva Pregunta</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Pregunta</label>
                  <input
                    type="text"
                    placeholder="Escribe la pregunta..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Tipo de respuesta</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="text">Respuesta de texto libre</option>
                    <option value="single_choice">Opción única (radio buttons)</option>
                    <option value="multiple_choice">Opciones múltiples (checkboxes)</option>
                  </select>
                </div>

                <button
                  onClick={addQuestion}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Plus size={14} /> Agregar pregunta
                </button>
              </div>
            </div>

            {/* Panel de preguntas existentes */}
            <div className="bg-white rounded-lg border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Preguntas: {selectedSurvey.title}
              </h3>

              {/* Lista de Preguntas */}
              <div className="space-y-3">
                {questions.length === 0 ? (
                  <p className="text-xs text-slate-500">Sin preguntas aún. Crea una arriba.</p>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            {idx + 1}. {q.question_text}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {q.question_type === "text" && "Respuesta de texto"}
                            {q.question_type === "single_choice" && "Opción única"}
                            {q.question_type === "multiple_choice" && "Opciones múltiples"}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="ml-3 text-red-600 hover:text-red-700"
                          title="Eliminar pregunta"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Botón para editar opciones */}
                      {(q.question_type === "single_choice" || q.question_type === "multiple_choice") && (
                        <button
                          onClick={() => {
                            setSelectedQuestion(q);
                            fetchOptions(q.id);
                          }}
                          className={`text-xs px-2 py-1 rounded border mt-2 transition-colors ${
                            selectedQuestion?.id === q.id
                              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {selectedQuestion?.id === q.id ? "✓ Editando opciones" : "Agregar opciones"}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panel para editar opciones */}
            {selectedQuestion && (selectedQuestion.question_type === "single_choice" || selectedQuestion.question_type === "multiple_choice") && (
              <div className="bg-white rounded-lg border border-indigo-200 p-5 bg-indigo-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Opciones para: {selectedQuestion.question_text}
                </h3>

                {/* Agregar opción */}
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Nueva opción..."
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addOption()}
                    className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addOption}
                    disabled={loading}
                    className="px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Lista de opciones */}
                <div className="space-y-2">
                  {options.length === 0 ? (
                    <p className="text-xs text-slate-500">Sin opciones aún.</p>
                  ) : (
                    options.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-900">{idx + 1}. {opt.option_text}</p>
                        <button
                          onClick={() => deleteOption(opt.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-100 p-8 text-center">
            <p className="text-sm text-slate-500">Selecciona una encuesta para ver y gestionar sus preguntas</p>
          </div>
        )}
      </div>
    </div>
  );
}

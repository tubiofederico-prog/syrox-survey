"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SurveyConfig = {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
};

type LocalQuestion = {
  id: string; // temporal, generado localmente
  question_text: string;
  question_type: "text" | "multiple_choice" | "single_choice";
  options: LocalOption[];
};

type LocalOption = {
  id: string;
  option_text: string;
};

type DBQuestion = {
  id: number;
  question_text: string;
  question_type: "text" | "multiple_choice" | "single_choice";
  order_index: number;
};

type DBOption = {
  id: number;
  question_id: number;
  option_text: string;
  order_index: number;
};

export function SurveyManager() {
  // Estado para encuestas existentes
  const [surveys, setSurveys] = useState<SurveyConfig[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyConfig | null>(null);
  const [dbQuestions, setDbQuestions] = useState<DBQuestion[]>([]);
  const [dbOptions, setDbOptions] = useState<Record<number, DBOption[]>>({});

  // Estado para crear nueva encuesta localmente
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [newSurveyDesc, setNewSurveyDesc] = useState("");
  const [localQuestions, setLocalQuestions] = useState<LocalQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<"text" | "multiple_choice" | "single_choice">("text");
  const [newOptionText, setNewOptionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSurveyId, setCopiedSurveyId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchQuestions(selectedSurvey.id);
    }
  }, [selectedSurvey]);

  // ===== FUNCIONES PARA ENCUESTAS EXISTENTES =====

  const copySurveyLink = (surveyId: number) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/encuesta/${surveyId}`;
    navigator.clipboard.writeText(url);
    setCopiedSurveyId(surveyId);
    setTimeout(() => setCopiedSurveyId(null), 2000);
  };

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from("surveys_config")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar encuestas:", error);
        return;
      }

      setSurveys(data || []);
    } catch (e) {
      console.error("Error al cargar encuestas:", e);
    }
  };

  const fetchQuestions = async (surveyId: number) => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("survey_id", surveyId)
        .order("order_index");

      if (error) {
        console.error("Error al cargar preguntas:", error);
        return;
      }

      setDbQuestions(data || []);

      // Cargar opciones para cada pregunta
      if (data && data.length > 0) {
        const optionsMap: Record<number, DBOption[]> = {};
        for (const q of data) {
          const { data: optionsData } = await supabase
            .from("question_options")
            .select("*")
            .eq("question_id", q.id)
            .order("order_index");
          optionsMap[q.id] = optionsData || [];
        }
        setDbOptions(optionsMap);
      }
    } catch (e) {
      console.error("Error al cargar preguntas:", e);
    }
  };

  const deleteSurvey = async (surveyId: number) => {
    if (!confirm("¿Estás seguro? Se eliminarán la encuesta, preguntas y opciones.")) return;
    try {
      console.log("🗑️ Iniciando eliminación de encuesta:", surveyId);

      // Primero obtener los IDs de las preguntas
      const { data: questionsData, error: fetchError } = await supabase
        .from("questions")
        .select("id")
        .eq("survey_id", surveyId);

      if (fetchError) {
        console.error("Error obteniendo preguntas:", fetchError);
        throw fetchError;
      }

      const questionIds = questionsData?.map((q: any) => q.id) || [];
      console.log("Preguntas encontradas:", questionIds);

      // Eliminar en cascada: opciones -> preguntas -> encuesta
      if (questionIds.length > 0) {
        console.log("Eliminando opciones de preguntas...");
        const { error: optionsError, count: optionsCount } = await supabase
          .from("question_options")
          .delete()
          .in("question_id", questionIds);

        if (optionsError) {
          console.error("❌ Error eliminando opciones:", optionsError);
          alert("Error eliminando opciones: " + optionsError.message);
          throw optionsError;
        }
        console.log("✅ Opciones eliminadas:", optionsCount);
      }

      console.log("Eliminando preguntas...");
      const { error: questionsError, count: questionsCount } = await supabase
        .from("questions")
        .delete()
        .eq("survey_id", surveyId);

      if (questionsError) {
        console.error("❌ Error eliminando preguntas:", questionsError);
        alert("Error eliminando preguntas: " + questionsError.message);
        throw questionsError;
      }
      console.log("✅ Preguntas eliminadas:", questionsCount);

      console.log("Eliminando encuesta...");
      const { error: surveyError, count: surveyCount } = await supabase
        .from("surveys_config")
        .delete()
        .eq("id", surveyId);

      if (surveyError) {
        console.error("❌ Error eliminando encuesta:", surveyError);
        alert("Error eliminando encuesta: " + surveyError.message);
        throw surveyError;
      }
      console.log("✅ Encuesta eliminada:", surveyCount);

      // Actualizar estado local
      setSurveys(surveys.filter(s => s.id !== surveyId));
      setSelectedSurvey(null);
      setDbQuestions([]);
      setDbOptions({});
      alert("✅ Encuesta eliminada exitosamente");
    } catch (e) {
      console.error("❌ Error al eliminar encuesta:", e);
      alert("❌ Error al eliminar: " + String(e));
    }
  };

  const deleteQuestion = async (questionId: number) => {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    try {
      const { error } = await supabase.from("questions").delete().eq("id", questionId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
      setDbQuestions(dbQuestions.filter(q => q.id !== questionId));
      alert("✅ Pregunta eliminada");
    } catch (e) {
      console.error("Error:", e);
    }
  };

  // ===== FUNCIONES PARA CREAR NUEVA ENCUESTA LOCALMENTE =====

  const addLocalQuestion = () => {
    if (!newQuestionText.trim()) {
      alert("Escribe una pregunta");
      return;
    }

    const newQuestion: LocalQuestion = {
      id: Date.now().toString(),
      question_text: newQuestionText,
      question_type: newQuestionType,
      options: [],
    };

    setLocalQuestions([...localQuestions, newQuestion]);
    setNewQuestionText("");
    setNewQuestionType("text");
    setEditingQuestion(newQuestion.id);
  };

  const addOptionToQuestion = (questionId: string) => {
    if (!newOptionText.trim()) {
      alert("Escribe una opción");
      return;
    }

    setLocalQuestions(
      localQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...q.options, { id: Date.now().toString(), option_text: newOptionText }],
            }
          : q
      )
    );
    setNewOptionText("");
  };

  const deleteLocalQuestion = (questionId: string) => {
    setLocalQuestions(localQuestions.filter(q => q.id !== questionId));
    if (editingQuestion === questionId) {
      setEditingQuestion(null);
    }
  };

  const deleteLocalOption = (questionId: string, optionId: string) => {
    setLocalQuestions(
      localQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter(o => o.id !== optionId) }
          : q
      )
    );
  };

  const saveNewSurvey = async () => {
    if (!newSurveyTitle.trim()) {
      setSaveMessage({ type: "error", text: "❌ Ingresa un título para la encuesta" });
      return;
    }

    if (localQuestions.length === 0) {
      setSaveMessage({ type: "error", text: "❌ Agrega al menos una pregunta" });
      return;
    }

    setLoading(true);
    setSaveMessage(null);
    try {
      console.log("1️⃣ Creando encuesta:", newSurveyTitle);

      // 1. Crear la encuesta
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys_config")
        .insert([{
          title: newSurveyTitle,
          description: newSurveyDesc,
          is_active: true,
        }])
        .select();

      if (surveyError) {
        console.error("Error al crear encuesta:", surveyError);
        setSaveMessage({ type: "error", text: `❌ Error al crear encuesta: ${surveyError.message}` });
        return;
      }

      if (!surveyData || surveyData.length === 0) {
        setSaveMessage({ type: "error", text: "❌ No se creó la encuesta" });
        return;
      }

      const newSurveyId = surveyData[0].id;
      console.log("✅ Encuesta creada con ID:", newSurveyId);

      // 2. Insertar preguntas
      console.log("2️⃣ Insertando", localQuestions.length, "preguntas...");
      const questionsToInsert = localQuestions.map((q, idx) => ({
        survey_id: newSurveyId,
        question_text: q.question_text,
        question_type: q.question_type,
        order_index: idx,
      }));

      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .insert(questionsToInsert)
        .select();

      if (questionsError) {
        console.error("Error al crear preguntas:", questionsError);
        setSaveMessage({ type: "error", text: `❌ Error al crear preguntas: ${questionsError.message}` });
        return;
      }

      console.log("✅ Preguntas creadas:", questionsData?.length);

      // 3. Insertar opciones para cada pregunta
      console.log("3️⃣ Insertando opciones...");
      const optionsToInsert: any[] = [];
      questionsData?.forEach((question, idx) => {
        const localQuestion = localQuestions[idx];
        localQuestion.options.forEach((opt, optIdx) => {
          optionsToInsert.push({
            question_id: question.id,
            option_text: opt.option_text,
            order_index: optIdx,
          });
        });
      });

      if (optionsToInsert.length > 0) {
        const { error: optionsError } = await supabase
          .from("question_options")
          .insert(optionsToInsert);

        if (optionsError) {
          console.error("Error al crear opciones:", optionsError);
          setSaveMessage({ type: "error", text: `❌ Error al crear opciones: ${optionsError.message}` });
          return;
        }
        console.log("✅ Opciones creadas:", optionsToInsert.length);
      }

      // 4. Limpiar estado y recargar
      console.log("✅ ¡Encuesta completamente creada!");
      setSaveMessage({
        type: "success",
        text: `✅ ¡Encuesta creada! Link: /encuesta/${newSurveyId}`
      });

      setTimeout(() => {
        setIsCreatingNew(false);
        setNewSurveyTitle("");
        setNewSurveyDesc("");
        setLocalQuestions([]);
        setEditingQuestion(null);
        setSaveMessage(null);
        fetchSurveys();
      }, 2000);
    } catch (e) {
      console.error("Error:", e);
      setSaveMessage({ type: "error", text: `❌ Error: ${String(e)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Surveys List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Encuestas</h3>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 mb-6"
          >
            <Plus size={14} /> Nueva encuesta
          </button>

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
                  <Trash2 size={13} className="inline mr-1" /> Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Questions */}
      <div className="lg:col-span-2">
        {isCreatingNew ? (
          // Vista de crear nueva encuesta
          <div className="space-y-5">
            {/* Información de la encuesta */}
            <div className="bg-white rounded-lg border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Nueva Encuesta</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Título</label>
                  <input
                    type="text"
                    placeholder="Ej: Encuesta de Satisfacción"
                    value={newSurveyTitle}
                    onChange={(e) => setNewSurveyTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Descripción (opcional)</label>
                  <input
                    type="text"
                    placeholder="Descripción de la encuesta..."
                    value={newSurveyDesc}
                    onChange={(e) => setNewSurveyDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Agregar preguntas */}
            <div className="bg-white rounded-lg border border-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Preguntas ({localQuestions.length})</h3>

              {/* Formulario para agregar pregunta */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Pregunta</label>
                    <input
                      type="text"
                      placeholder="Escribe la pregunta..."
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Tipo</label>
                    <select
                      value={newQuestionType}
                      onChange={(e) => setNewQuestionType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="text">Respuesta de texto</option>
                      <option value="single_choice">Opción única</option>
                      <option value="multiple_choice">Opciones múltiples</option>
                    </select>
                  </div>

                  <button
                    onClick={addLocalQuestion}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700"
                  >
                    <Plus size={14} /> Agregar pregunta
                  </button>
                </div>
              </div>

              {/* Lista de preguntas agregadas */}
              <div className="space-y-3">
                {localQuestions.length === 0 ? (
                  <p className="text-xs text-slate-500">Sin preguntas aún</p>
                ) : (
                  localQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-md border border-slate-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">{idx + 1}. {q.question_text}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {q.question_type === "text" && "Respuesta de texto"}
                            {q.question_type === "single_choice" && "Opción única"}
                            {q.question_type === "multiple_choice" && "Opciones múltiples"}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteLocalQuestion(q.id)}
                          className="ml-3 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {(q.question_type === "single_choice" || q.question_type === "multiple_choice") && (
                        <button
                          onClick={() => setEditingQuestion(editingQuestion === q.id ? null : q.id)}
                          className={`text-xs px-2 py-1 rounded border mt-2 transition-colors ${
                            editingQuestion === q.id
                              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {editingQuestion === q.id ? "✓ Editando opciones" : "Agregar opciones"}
                        </button>
                      )}

                      {editingQuestion === q.id && (
                        <div className="mt-3 p-3 bg-indigo-50 rounded border border-indigo-200">
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              placeholder="Nueva opción..."
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => addOptionToQuestion(q.id)}
                              className="px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={opt.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                                <p className="text-xs text-slate-900">{optIdx + 1}. {opt.option_text}</p>
                                <button
                                  onClick={() => deleteLocalOption(q.id, opt.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mensaje de estado */}
            {saveMessage && (
              <div className={`p-4 rounded-lg text-sm font-medium ${
                saveMessage.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {saveMessage.text}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={saveNewSurvey}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} /> Guardar Encuesta
              </button>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setNewSurveyTitle("");
                  setNewSurveyDesc("");
                  setLocalQuestions([]);
                  setEditingQuestion(null);
                }}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : selectedSurvey ? (
          // Vista de encuesta existente
          <div className="space-y-5">
            <div className="bg-white rounded-lg border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Preguntas: {selectedSurvey.title}</h3>
                <button
                  onClick={() => copySurveyLink(selectedSurvey.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  {copiedSurveyId === selectedSurvey.id ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-700">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
              {dbQuestions.length === 0 ? (
                <p className="text-xs text-slate-500">Sin preguntas</p>
              ) : (
                dbQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-slate-50 rounded-md border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-900">
                          {idx + 1}. {q.question_text}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {q.question_type === "text" && "Respuesta de texto"}
                          {q.question_type === "single_choice" && "Opción única"}
                          {q.question_type === "multiple_choice" && "Opciones múltiples"}
                        </p>
                        {dbOptions[q.id] && dbOptions[q.id].length > 0 && (
                          <div className="mt-2 ml-4 space-y-1">
                            {dbOptions[q.id].map((opt) => (
                              <p key={opt.id} className="text-xs text-slate-600">• {opt.option_text}</p>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="ml-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-100 p-8 text-center">
            <p className="text-sm text-slate-500">Selecciona una encuesta o crea una nueva</p>
          </div>
        )}
      </div>
    </div>
  );
}

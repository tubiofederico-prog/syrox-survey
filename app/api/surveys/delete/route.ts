import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { surveyId } = body;

    if (!surveyId) {
      return NextResponse.json(
        { error: "surveyId requerido" },
        { status: 400 }
      );
    }

    console.log(`[DELETE] Eliminando encuesta ${surveyId}...`);

    // 1. Obtener todas las preguntas de la encuesta
    const { data: questions, error: fetchQError } = await supabase
      .from("questions")
      .select("id")
      .eq("survey_id", surveyId);

    if (fetchQError) {
      console.error("[DELETE] Error obteniendo preguntas:", fetchQError);
      throw fetchQError;
    }

    const questionIds = questions?.map((q: any) => q.id) || [];
    console.log(`[DELETE] Preguntas encontradas: ${questionIds.length}`);

    // 2. Eliminar opciones
    if (questionIds.length > 0) {
      console.log("[DELETE] Eliminando opciones...");
      const { error: deleteOError } = await supabase
        .from("question_options")
        .delete()
        .in("question_id", questionIds);

      if (deleteOError) {
        console.error("[DELETE] Error eliminando opciones:", deleteOError);
        throw deleteOError;
      }
      console.log("[DELETE] ✅ Opciones eliminadas");
    }

    // 3. Eliminar preguntas
    console.log("[DELETE] Eliminando preguntas...");
    const { error: deleteQError } = await supabase
      .from("questions")
      .delete()
      .eq("survey_id", surveyId);

    if (deleteQError) {
      console.error("[DELETE] Error eliminando preguntas:", deleteQError);
      throw deleteQError;
    }
    console.log("[DELETE] ✅ Preguntas eliminadas");

    // 4. Eliminar encuesta
    console.log("[DELETE] Eliminando encuesta...");
    const { error: deleteSError } = await supabase
      .from("surveys_config")
      .delete()
      .eq("id", surveyId);

    if (deleteSError) {
      console.error("[DELETE] Error eliminando encuesta:", deleteSError);
      throw deleteSError;
    }
    console.log("[DELETE] ✅ Encuesta eliminada");

    return NextResponse.json(
      { message: "Encuesta eliminada exitosamente" },
      { status: 200 }
    );
  } catch (e) {
    console.error("[DELETE] Error:", e);
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}

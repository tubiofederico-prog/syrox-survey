import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todas las preguntas (opcional filtrar por survey_id)
export async function GET(req: NextRequest) {
  try {
    const surveyId = req.nextUrl.searchParams.get("survey_id");
    let query = supabase.from("questions").select("*");

    if (surveyId) {
      query = query.eq("survey_id", parseInt(surveyId));
    }

    const { data, error } = await query.order("order_index");

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST - Crear nueva pregunta
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { survey_id, question_text, question_type, order_index } = body;

    if (!survey_id || !question_text) {
      return NextResponse.json(
        { error: "survey_id y question_text requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          survey_id,
          question_text,
          question_type: question_type || "text",
          order_index: order_index || 0,
        },
      ])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

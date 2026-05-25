import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todas las opciones (opcional filtrar por question_id)
export async function GET(req: NextRequest) {
  try {
    const questionId = req.nextUrl.searchParams.get("question_id");
    let query = supabase.from("question_options").select("*");

    if (questionId) {
      query = query.eq("question_id", parseInt(questionId));
    }

    const { data, error } = await query.order("order_index");

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST - Crear nueva opción
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question_id, option_text, order_index } = body;

    if (!question_id || !option_text) {
      return NextResponse.json(
        { error: "question_id y option_text requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("question_options")
      .insert([
        {
          question_id,
          option_text,
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

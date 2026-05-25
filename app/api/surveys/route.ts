import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener todas las encuestas
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("surveys_config")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST - Crear nueva encuesta
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, is_active } = body;

    if (!title) {
      return NextResponse.json({ error: "Título requerido" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("surveys_config")
      .insert([{ title, description, is_active: is_active ?? true }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

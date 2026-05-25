import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener una opción específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("question_options")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// PUT - Actualizar opción
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("question_options")
      .update(body)
      .eq("id", parseInt(id))
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE - Eliminar opción
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("question_options")
      .delete()
      .eq("id", parseInt(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: "Opción eliminada" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

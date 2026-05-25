import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - Obtener una pregunta específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// PUT - Actualizar pregunta
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("questions")
      .update(body)
      .eq("id", parseInt(id))
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE - Eliminar pregunta
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", parseInt(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: "Pregunta eliminada" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

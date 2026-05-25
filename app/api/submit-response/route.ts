import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, industry, email, comment, survey_id, answers } = body;

    if (!survey_id) {
      return NextResponse.json(
        { error: "survey_id requerido" },
        { status: 400 }
      );
    }

    // Create response record for survey_responses table
    const responseData: Record<string, any> = {
      survey_id,
      name: name || null,
      company: company || null,
      email: email || null,
      industry: industry || null,
      comment: comment || null,
      answers: answers || {},
    };

    const { data, error } = await supabase
      .from("survey_responses")
      .insert([responseData])
      .select();

    if (error) {
      console.error("Error al guardar respuesta:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

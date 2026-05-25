import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Obtener todas las tablas y su contenido
    const [surveys, questions, options, responses] = await Promise.all([
      supabase.from("surveys_config").select("*"),
      supabase.from("questions").select("*"),
      supabase.from("question_options").select("*"),
      supabase.from("surveys").select("*"),
    ]);

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        data: {
          surveys_config: {
            count: surveys.data?.length || 0,
            data: surveys.data || [],
            error: surveys.error,
          },
          questions: {
            count: questions.data?.length || 0,
            data: questions.data || [],
            error: questions.error,
          },
          question_options: {
            count: options.data?.length || 0,
            data: options.data || [],
            error: options.error,
          },
          surveys_responses: {
            count: responses.data?.length || 0,
            data: responses.data || [],
            error: responses.error,
          },
        },
        summary: {
          total_surveys: surveys.data?.length || 0,
          total_questions: questions.data?.length || 0,
          total_options: options.data?.length || 0,
          total_responses: responses.data?.length || 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

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

    // Create response record with all info
    const responseData: Record<string, any> = {
      name: name || "Sin nombre",
      company: company || "",
      industry: industry || "",
      email: email || "",
      comment: comment || "",
      // Add default values for all required columns
      q1_reason: "",
      q2_confidence: "",
      q3_decision: "",
      q4_doubt: "",
      q5_improvement: "",
    };

    // Map answers to the expected schema
    if (answers && Object.keys(answers).length > 0) {
      const answerArray = Object.entries(answers);

      // Map answers to q columns
      const qColumns = ["q1_reason", "q2_confidence", "q3_decision"];
      answerArray.forEach(([qId, answer], idx) => {
        if (idx < qColumns.length) {
          responseData[qColumns[idx]] = String(answer);
        }
      });

      // Store all answers for reference if comment not provided
      if (!comment) {
        const answersStr = Object.entries(answers)
          .map(([qId, answer]) => `Q${qId}: ${answer}`)
          .join("; ");
        responseData.comment = answersStr;
      }
    }

    const { data, error } = await supabase
      .from("surveys")
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

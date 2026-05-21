export interface Question {
  id: string;
  question: string;
  options: string[];
  type: "multiple_choice" | "text";
}

export interface SurveyResponse {
  id: string;
  date: Date;
  name: string;
  company: string;
  industry: string;
  email: string;
  q1_reason: string; // Motivo principal
  q2_confidence: string; // Factor de confianza
  q3_decision: string; // Factor más importante
  q4_doubt: string; // Principal duda
  q5_improvement: string; // Mejora sugerida
  comment: string; // Comentario adicional
}

export interface MetricData {
  label: string;
  value: number;
  percentage?: number;
}

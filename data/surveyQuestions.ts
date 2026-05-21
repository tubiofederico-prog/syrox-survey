import { Question } from "@/types/survey";

export const surveyQuestions: Question[] = [
  {
    id: "q1",
    question:
      "¿Qué fue lo principal que te hizo elegir trabajar con SyroxTech?",
    options: [
      "La velocidad de entrega",
      "La confianza que transmitió el equipo",
      "La propuesta/prototipo presentado",
      "El precio y condiciones de pago",
      "La experiencia o casos mostrados",
      "El enfoque estratégico y consultivo",
      "El enfoque AI-First",
      "Otro",
    ],
    type: "multiple_choice",
  },
  {
    id: "q2",
    question:
      "¿Qué fue lo que más confianza te generó antes de avanzar?",
    options: [
      "La reunión comercial",
      "La claridad de la propuesta",
      "La forma en que entendieron mi negocio",
      "La comunicación del equipo",
      "La presencia en web/redes sociales",
      "La rapidez en las respuestas",
      "Recomendación de otra persona",
      "Otro",
    ],
    type: "multiple_choice",
  },
  {
    id: "q3",
    question: "¿Cuál fue el factor más importante para tomar la decisión final?",
    options: [
      "Resolver un problema urgente",
      "Ver una solución clara y concreta",
      "Sentir que SyroxTech podía ejecutar rápido",
      "La relación precio/calidad",
      "La flexibilidad del equipo",
      "La garantía y acompañamiento",
      "La confianza generada durante el proceso",
      "Otro",
    ],
    type: "multiple_choice",
  },
  {
    id: "q4",
    question: "Antes de decidir, ¿cuál era tu principal duda?",
    options: [
      "Si iban a entender bien mi negocio",
      "Si el desarrollo iba a quedar bien",
      "Si se iban a cumplir los plazos",
      "Si la inversión valía la pena",
      "Si el sistema iba a ser fácil de usar",
      "Si iba a haber buen soporte y acompañamiento",
      "No tenía dudas importantes",
      "Otro",
    ],
    type: "multiple_choice",
  },
  {
    id: "q5",
    question:
      "¿Qué mejorarías de nuestro proceso comercial o de onboarding?",
    options: [
      "Mayor claridad técnica desde el inicio",
      "Más rapidez en las respuestas",
      "Más ejemplos o casos de éxito",
      "Mejor explicación de tiempos y etapas",
      "Más detalle en la propuesta",
      "Más seguimiento durante la decisión",
      "No mejoraría nada",
      "Otro",
    ],
    type: "multiple_choice",
  },
];

export const industries = [
  "Tecnología",
  "E-commerce",
  "Finanzas",
  "Retail",
  "Manufactura",
  "Servicios",
  "Salud",
  "Educación",
  "Otros",
];

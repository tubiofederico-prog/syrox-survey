import { SurveyResponse } from "@/types/survey";

const companies = [
  "Tech Solutions Inc",
  "Digital Ventures",
  "StartUp XYZ",
  "Enterprise Corp",
  "Innovation Labs",
  "Commerce Plus",
  "Data Systems",
  "Cloud Services Ltd",
  "Mobile First",
  "Web Dynamics",
  "Smart Analytics",
  "Digital Transformation Co",
  "NextGen Tech",
  "Cloud Native",
  "API Systems",
];

const names = [
  "Juan Pérez",
  "María García",
  "Carlos López",
  "Ana Martínez",
  "Roberto Silva",
  "Laura Díaz",
  "Felipe Torres",
  "Gabriela Rodríguez",
  "Javier Sánchez",
  "Sofía Ramírez",
  "David Morales",
  "Martina Rojas",
  "Andrés Gutiérrez",
  "Catalina Vargas",
  "Emilio Castro",
  "Camila Acosta",
  "Víctor Flores",
  "Daniela Ruiz",
  "Manuel Varela",
  "Valentina Soto",
];

const industries = [
  "Tecnología",
  "E-commerce",
  "Finanzas",
  "Retail",
  "Manufactura",
  "Servicios",
  "Salud",
  "Educación",
];

const q1_options = [
  "La velocidad de entrega",
  "La confianza que transmitió el equipo",
  "La propuesta/prototipo presentado",
  "El precio y condiciones de pago",
  "La experiencia o casos mostrados",
  "El enfoque estratégico y consultivo",
  "El enfoque AI-First",
];

const q2_options = [
  "La reunión comercial",
  "La claridad de la propuesta",
  "La forma en que entendieron mi negocio",
  "La comunicación del equipo",
  "La presencia en web/redes sociales",
  "La rapidez en las respuestas",
  "Recomendación de otra persona",
];

const q3_options = [
  "Resolver un problema urgente",
  "Ver una solución clara y concreta",
  "Sentir que SyroxTech podía ejecutar rápido",
  "La relación precio/calidad",
  "La flexibilidad del equipo",
  "La garantía y acompañamiento",
  "La confianza generada durante el proceso",
];

const q4_options = [
  "Si iban a entender bien mi negocio",
  "Si el desarrollo iba a quedar bien",
  "Si se iban a cumplir los plazos",
  "Si la inversión valía la pena",
  "Si el sistema iba a ser fácil de usar",
  "Si iba a haber buen soporte y acompañamiento",
  "No tenía dudas importantes",
];

const q5_options = [
  "Mayor claridad técnica desde el inicio",
  "Más rapidez en las respuestas",
  "Más ejemplos o casos de éxito",
  "Mejor explicación de tiempos y etapas",
  "Más detalle en la propuesta",
  "Más seguimiento durante la decisión",
  "No mejoraría nada",
];

const comments = [
  "Excelente equipo, muy profesionales",
  "Superaron mis expectativas",
  "Buen acompañamiento durante el proceso",
  "Rápidos y eficientes",
  "Me encantó el enfoque estratégico",
  "Muy atentos a nuestras necesidades",
  "La mejor decisión que tomamos este año",
  "Recomendaría sus servicios 100%",
  "",
  "",
  "El equipo tiene mucho potencial",
  "Buena propuesta técnica",
  "Valores alineados con nuestros objetivos",
  "",
  "Relación precio-calidad correcta",
];

function getRandomDate(daysAgo: number = 60): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

export const mockResponses: SurveyResponse[] = [
  // Distribution for q1 (motivo principal):
  // 35% velocidad (17), 27% confianza (13), 21% propuesta (10), 10% precio (5), 7% otros (3)

  // Velocidad de entrega (17)
  ...Array.from({ length: 17 }, (_, i) => ({
    id: `resp_${i + 1}`,
    date: getRandomDate(),
    name: names[Math.floor(Math.random() * names.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    email: `contact${i + 1}@company.com`,
    q1_reason: "La velocidad de entrega",
    q2_confidence:
      q2_options[Math.floor(Math.random() * q2_options.length)],
    q3_decision:
      q3_options[Math.floor(Math.random() * q3_options.length)],
    q4_doubt: q4_options[Math.floor(Math.random() * q4_options.length)],
    q5_improvement:
      q5_options[Math.floor(Math.random() * q5_options.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
  })),

  // Confianza del equipo (13)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `resp_${i + 18}`,
    date: getRandomDate(),
    name: names[Math.floor(Math.random() * names.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    email: `contact${i + 18}@company.com`,
    q1_reason: "La confianza que transmitió el equipo",
    q2_confidence:
      q2_options[Math.floor(Math.random() * q2_options.length)],
    q3_decision:
      q3_options[Math.floor(Math.random() * q3_options.length)],
    q4_doubt: q4_options[Math.floor(Math.random() * q4_options.length)],
    q5_improvement:
      q5_options[Math.floor(Math.random() * q5_options.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
  })),

  // Propuesta/prototipo (10)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `resp_${i + 31}`,
    date: getRandomDate(),
    name: names[Math.floor(Math.random() * names.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    email: `contact${i + 31}@company.com`,
    q1_reason: "La propuesta/prototipo presentado",
    q2_confidence:
      q2_options[Math.floor(Math.random() * q2_options.length)],
    q3_decision:
      q3_options[Math.floor(Math.random() * q3_options.length)],
    q4_doubt: q4_options[Math.floor(Math.random() * q4_options.length)],
    q5_improvement:
      q5_options[Math.floor(Math.random() * q5_options.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
  })),

  // Precio y condiciones (5)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `resp_${i + 41}`,
    date: getRandomDate(),
    name: names[Math.floor(Math.random() * names.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    email: `contact${i + 41}@company.com`,
    q1_reason: "El precio y condiciones de pago",
    q2_confidence:
      q2_options[Math.floor(Math.random() * q2_options.length)],
    q3_decision:
      q3_options[Math.floor(Math.random() * q3_options.length)],
    q4_doubt: q4_options[Math.floor(Math.random() * q4_options.length)],
    q5_improvement:
      q5_options[Math.floor(Math.random() * q5_options.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
  })),

  // Otros (3)
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `resp_${i + 46}`,
    date: getRandomDate(),
    name: names[Math.floor(Math.random() * names.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    email: `contact${i + 46}@company.com`,
    q1_reason: "El enfoque AI-First",
    q2_confidence:
      q2_options[Math.floor(Math.random() * q2_options.length)],
    q3_decision:
      q3_options[Math.floor(Math.random() * q3_options.length)],
    q4_doubt: q4_options[Math.floor(Math.random() * q4_options.length)],
    q5_improvement:
      q5_options[Math.floor(Math.random() * q5_options.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
  })),
];

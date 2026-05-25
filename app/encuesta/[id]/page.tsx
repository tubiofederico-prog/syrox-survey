import { SurveyForm } from "@/components/survey/SurveyForm";
import { Sparkles } from "lucide-react";

export default function EncuestaPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-violet-50 py-16 px-4">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full">
              <Sparkles className="w-8 h-8 text-violet-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Syrox Survey
          </h1>

          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Queremos entender mejor qué te hizo elegir trabajar con SyroxTech.
            Esta encuesta toma menos de <span className="font-semibold text-violet-600">1 minuto</span> y nos ayuda a mejorar nuestro proceso.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-10">
          <SurveyForm surveyId={parseInt(params.id)} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Tu privacidad es importante para nosotros • Encuesta confidencial</p>
        </div>
      </div>
    </div>
  );
}

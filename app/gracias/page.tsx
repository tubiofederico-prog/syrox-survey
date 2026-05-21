import Link from "next/link";
import { Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />

      <div className="text-center relative z-10 max-w-md">
        {/* Check Icon with animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-300 to-purple-300 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <Check className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6">
          ¡Gracias!
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-xl text-slate-700 font-semibold leading-relaxed">
            Tu feedback es valioso para nosotros
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            Tu respuesta nos ayuda a mejorar nuestro proceso y ofrecerte un
            mejor servicio.
          </p>
        </div>

        {/* Heart decoration */}
        <div className="flex justify-center gap-2 mb-8 text-2xl">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>
            💜
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
            🚀
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
            ⭐
          </span>
        </div>

        <p className="text-sm text-slate-500 mb-8">
          Nos vemos pronto en <span className="font-bold text-violet-600">SyroxTech</span>
        </p>

        {/* Button */}
        <Link href="/encuesta" className="inline-block">
          <Button size="lg" className="shadow-lg">
            Volver a la encuesta
          </Button>
        </Link>
      </div>
    </div>
  );
}

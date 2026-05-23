import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import { SurveyManager } from "@/components/admin/SurveyManager";

export default function EncuestaPage() {
  return (
    <>
      <Header title="Gestión de Encuestas" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Crea y administra tus encuestas</p>
          </div>
          <Link href="/encuesta">
            <Button size="sm" className="flex items-center gap-2 text-xs">
              <Eye size={14} />
              Vista previa
            </Button>
          </Link>
        </div>

        <SurveyManager />
      </div>
    </>
  );
}

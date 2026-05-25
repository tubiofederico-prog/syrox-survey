"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LogOut, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const surveyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/encuesta`;

  // Función para copiar link de encuestas
  const handleCopySurveyLink = (surveyId?: number) => {
    const url = surveyId
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/encuesta/${surveyId}`
      : surveyUrl;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <header className="ml-56 bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Copy Survey Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors border border-slate-200"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-700">Copiado</span>
              </>
            ) : (
              <>
                <Link2 size={14} />
                <span>Copiar link</span>
              </>
            )}
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-900">Administrador</p>
              <p className="text-xs text-slate-500">admin@syrox.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

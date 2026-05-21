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
    <header className="ml-64 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-5">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Copy Survey Link Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-white/50"
          >
            {copied ? (
              <>
                <Check size={18} className="text-emerald-600" />
                <span className="text-emerald-700 font-medium">Copiado</span>
              </>
            ) : (
              <>
                <Link2 size={18} className="text-violet-600" />
                <span className="text-slate-700">Copiar link</span>
              </>
            )}
          </Button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Administrador</p>
              <p className="text-xs text-slate-500">admin@syrox.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

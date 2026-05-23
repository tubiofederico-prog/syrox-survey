"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ListIcon,
  Settings,
  FileText,
  Download,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    exact: true,
  },
  {
    label: "Respuestas",
    href: "/admin/respuestas",
    icon: ListIcon,
  },
  {
    label: "Encuesta",
    href: "/admin/encuesta",
    icon: FileText,
  },
  {
    label: "Exportar",
    href: "/admin/exportar",
    icon: Download,
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-slate-100 text-slate-900 h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Syrox</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

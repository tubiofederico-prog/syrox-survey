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
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 text-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Syrox
          </h2>
        </div>
        <p className="text-xs text-slate-400 ml-11">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
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
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <Icon size={20} className={cn("transition-transform", isActive && "group-hover:scale-110")} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600 to-transparent opacity-50" />
    </aside>
  );
}

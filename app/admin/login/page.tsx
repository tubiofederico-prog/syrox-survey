"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@syrox.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { loginAdmin } = await import("@/lib/api");
      const response = await loginAdmin(email, password);

      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminToken", response.token);
      router.push("/admin");
    } catch (error) {
      setError("Credenciales inválidas. Intenta con admin@syrox.com / admin123");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Syrox Survey
            </h1>
            <p className="text-slate-400 text-sm font-medium">Panel Administrativo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder:text-slate-400 transition-all"
                  placeholder="admin@syrox.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder:text-slate-400 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-600" />
            <span className="text-slate-500 text-xs">Credenciales demo</span>
            <div className="flex-1 h-px bg-slate-600" />
          </div>

          {/* Hint */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              <span className="font-semibold text-violet-400">Email:</span> admin@syrox.com
            </p>
            <p className="text-slate-300 text-sm">
              <span className="font-semibold text-violet-400">Contraseña:</span> admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Sistema seguro de administración de encuestas
        </p>
      </div>
    </div>
  );
}

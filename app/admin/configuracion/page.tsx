import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ConfiguracionPage() {
  return (
    <>
      <Header title="Configuración" />

      <div className="p-8">
        {/* Configuración general */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configuración General
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Nombre de la encuesta</p>
                <p className="text-sm text-gray-600">Syrox Survey</p>
              </div>
              <Badge>Syrox Survey</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Descripción</p>
                <p className="text-sm text-gray-600">Feedback de clientes</p>
              </div>
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Estado</p>
                <p className="text-sm text-gray-600">La encuesta está activa y disponible</p>
              </div>
              <Badge variant="success">Activa</Badge>
            </div>
          </div>
        </div>

        {/* Configuración visual */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configuración Visual
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de acento
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-lg"></div>
                <p className="text-sm text-gray-600">#7C3AED</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <p className="text-sm text-gray-600">Logo de SyroxTech (por defecto)</p>
            </div>
          </div>
        </div>

        {/* Integraciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Integraciones
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Conecta esta encuesta con otras herramientas
          </p>
          <Button variant="outline">
            Añadir integración
          </Button>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Login } from "../types/login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { LogOut, Calendar, BarChart3, Clock } from "lucide-react";
import { DisponibilidadMedicos } from "./gerente/DisponibilidadMedicos";
import { ReportesGerente } from "./gerente/ReportesGerente";
import {
  mockDisponibilidad,
  mockCitas,
  DisponibilidadMedico,
} from "../lib/mockData";

interface GerenteDashboardProps {
  user: Login;
  onLogout: () => void;
}

export function GerenteDashboard({ user, onLogout }: GerenteDashboardProps) {
  const [disponibilidad, setDisponibilidad] =
    useState<DisponibilidadMedico[]>(mockDisponibilidad);

  const handleNuevaDisponibilidad = (nueva: DisponibilidadMedico) => {
    setDisponibilidad([...disponibilidad, nueva]);
  };

  const handleEliminarDisponibilidad = (id: string) => {
    setDisponibilidad(disponibilidad.filter((d) => d.id_disponibilidad !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-clinica.svg"
                alt="Logo Clínica"
                className="h-10 w-auto"
              />
              <div className="border-l border-blue-300 pl-3">
                <h1 className="text-xl font-bold text-blue-900">
                  Panel de Gerencia
                </h1>
                <p className="text-sm text-gray-600">{user.nombre_completo}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="disponibilidad" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger
              value="disponibilidad"
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Disponibilidad
            </TabsTrigger>
            <TabsTrigger value="reportes" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disponibilidad">
            <DisponibilidadMedicos
              disponibilidad={disponibilidad}
              onNuevaDisponibilidad={handleNuevaDisponibilidad}
              onEliminarDisponibilidad={handleEliminarDisponibilidad}
            />
          </TabsContent>

          <TabsContent value="reportes">
            <ReportesGerente
              citas={mockCitas}
              disponibilidad={disponibilidad}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

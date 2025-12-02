import { useState, useEffect } from "react";
import { Login } from "../types/login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { LogOut, Calendar, BarChart3, Clock } from "lucide-react";
import { DisponibilidadMedicos } from "./gerente/DisponibilidadMedicos";
import { ReportesGerente } from "./gerente/ReportesGerente";
import { Disponibilidad, CrearDisponibilidad } from "../types/disponibilidad";
import { DiaSemana } from "../types/disponibilidad";
import { CitaDetalle } from "../types/cita";
import {
  getDisponibilidad,
  createDisponibilidad,
  deleteDisponibilidad,
} from "../services/disponibilidad";
import { getCitas } from "../services/citas";
import { toast } from "sonner";

interface GerenteDashboardProps {
  user: Login;
  onLogout: () => void;
}

export function GerenteDashboard({ user, onLogout }: GerenteDashboardProps) {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [dispData, citasData] = await Promise.all([
        getDisponibilidad(),
        getCitas(),
      ]);

      // Normalizar dia_semana a minúsculas y sin tildes
      const normalizarDia = (dia: string): string => {
        return dia
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""); // Eliminar tildes
      };

      const dispNormalizada = dispData.map((d) => ({
        ...d,
        dia_semana: normalizarDia(d.dia_semana) as DiaSemana,
        id_medico: String(d.id_medico),
        id_disponibilidad: String(d.id_disponibilidad),
      }));
      setDisponibilidad(dispNormalizada);
      setCitas(citasData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos del sistema");
    } finally {
      setCargando(false);
    }
  };

  const handleNuevaDisponibilidad = async (nueva: CrearDisponibilidad) => {
    try {
      // Capitalizar dia_semana para enviarlo a la BD (Lunes, Martes, etc.)
      const diaNormalizado =
        nueva.dia_semana.charAt(0).toUpperCase() + nueva.dia_semana.slice(1);
      const nuevaNormalizada: any = {
        ...nueva,
        dia_semana: diaNormalizado,
      };

      const creada = await createDisponibilidad(nuevaNormalizada);
      setDisponibilidad([...disponibilidad, creada]);
      toast.success("Disponibilidad creada exitosamente");
      await cargarDatos(); // Recargar para sincronizar
    } catch (error) {
      console.error("Error al crear disponibilidad:", error);
      toast.error("Error al crear disponibilidad");
    }
  };

  const handleEliminarDisponibilidad = async (id: string) => {
    try {
      await deleteDisponibilidad(id);
      setDisponibilidad(
        disponibilidad.filter((d) => d.id_disponibilidad !== id)
      );
      toast.success("Disponibilidad eliminada");
    } catch (error) {
      console.error("Error al eliminar disponibilidad:", error);
      toast.error("Error al eliminar disponibilidad");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

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
            <ReportesGerente citas={citas} disponibilidad={disponibilidad} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

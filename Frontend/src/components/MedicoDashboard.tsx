import { useState, useEffect } from "react";
import { Login } from "../types/login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { LogOut, Calendar, ClipboardList, Clock } from "lucide-react";
import { AgendaMedico } from "./medico/AgendaMedico";
import { HistorialPacientes } from "./medico/HistorialPacientes";
import { obtenerCitasPorMedico } from "../services/citas";
import { CitaDetalle, HistorialConsulta } from "../types/cita";
import { getHistoriales } from "../services/historial";
import { toast } from "sonner";

interface MedicoDashboardProps {
  user: Login;
  onLogout: () => void;
}

export function MedicoDashboard({ user, onLogout }: MedicoDashboardProps) {
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [historial, setHistorial] = useState<HistorialConsulta[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("ID del médico recibido:", user.id_medico);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar citas del médico
        const dataCitas: CitaDetalle[] = await obtenerCitasPorMedico(
          user.id_medico
        );
        setCitas(dataCitas);
        console.log("Citas del médico cargadas:", dataCitas);

        // Cargar historiales
        const dataHistorial: HistorialConsulta[] = await getHistoriales();
        setHistorial(dataHistorial);
        console.log("Historiales cargados:", dataHistorial);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("No se pudieron cargar los datos del médico");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user.id_medico]);
  const handleActualizarCita = (citaActualizada: CitaDetalle) => {
    setCitas((prev) =>
      prev.map((c) =>
        c.id_cita === citaActualizada.id_cita ? citaActualizada : c
      )
    );
  };

  const handleNuevoHistorial = (nuevoHistorial: HistorialConsulta) => {
    setHistorial((prev) => [...prev, nuevoHistorial]);
  };

  const handleActualizarHistorial = (
    historialActualizado: HistorialConsulta
  ) => {
    setHistorial((prev) =>
      prev.map((h) =>
        h.id_consulta === historialActualizado.id_consulta
          ? historialActualizado
          : h
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Clock className="w-12 h-12 mr-3 text-gray-400" />
        <p>Cargando agenda del médico...</p>
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
                  Panel Médico
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
        <Tabs defaultValue="agenda" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Mi Agenda
            </TabsTrigger>
            <TabsTrigger value="historial" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agenda">
            <AgendaMedico
              citas={citas}
              onActualizarCita={handleActualizarCita}
            />
          </TabsContent>

          <TabsContent value="historial">
            <HistorialPacientes
              citas={citas}
              historial={historial}
              onNuevoHistorial={handleNuevoHistorial}
              onActualizarHistorial={handleActualizarHistorial}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

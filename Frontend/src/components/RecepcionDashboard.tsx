import { useState, useEffect } from "react";
import { Usuario } from "../types/login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  LogOut,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import { CrearCitaForm } from "./recepcion/CrearCitaForm";
import { RegistrarPacienteForm } from "./recepcion/RegistrarPacienteForm";
import { CitasDelDia } from "./recepcion/CitasDelDia";
import { TodasLasCitas } from "./recepcion/TodasLasCitas";
import { CitasPendientes } from "./recepcion/CitasPendientes";

import { CitaDetalle } from "../types/cita";
import { Paciente } from "../types/paciente";
import { getCitas } from "../services/citas";
import { getPacientes } from "../services/pacientes";
import { getMedicos, getEspecialidades } from "../services/medicos";
import { Medico, Especialidad } from "../types/medico";

interface RecepcionDashboardProps {
  user: Usuario;
  onLogout: () => void;
}

export function RecepcionDashboard({
  user,
  onLogout,
}: RecepcionDashboardProps) {
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [citasData, pacientesData, medicosData, especialidadesData] =
          await Promise.all([
            getCitas(),
            getPacientes(),
            getMedicos(),
            getEspecialidades(),
          ]);

        setCitas(citasData);
        setPacientes(pacientesData);
        setMedicos(medicosData);
        setEspecialidades(especialidadesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const handleNuevaCita = (nuevaCita: CitaDetalle) => {
    setCitas([...citas, nuevaCita]);
  };

  const handleNuevoPaciente = (nuevoPaciente: Paciente) => {
    setPacientes([...pacientes, nuevoPaciente]);
  };

  const handleActualizarCita = (citaActualizada: CitaDetalle) => {
    setCitas(
      citas.map((c) =>
        c.numero_seguimiento === citaActualizada.numero_seguimiento
          ? citaActualizada
          : c
      )
    );
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
                  Panel de Recepción
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
        <Tabs defaultValue="citas-dia" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
            <TabsTrigger value="citas-dia" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Citas del Día
            </TabsTrigger>
            <TabsTrigger value="crear-cita" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Nueva Cita
            </TabsTrigger>
            <TabsTrigger
              value="registrar-paciente"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Nuevo Paciente
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="todas" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Todas las Citas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citas-dia">
            <CitasDelDia citas={citas} />
          </TabsContent>

          <TabsContent value="crear-cita">
            <CrearCitaForm
              pacientes={pacientes}
              medicos={medicos}
              especialidades={especialidades}
              citasExistentes={citas}
              onNuevaCita={handleNuevaCita}
            />
          </TabsContent>

          <TabsContent value="registrar-paciente">
            <RegistrarPacienteForm onNuevoPaciente={handleNuevoPaciente} />
          </TabsContent>

          <TabsContent value="pendientes">
            <CitasPendientes
              citas={citas}
              onActualizarCita={handleActualizarCita}
            />
          </TabsContent>

          <TabsContent value="todas">
            <TodasLasCitas
              citas={citas}
              onActualizarCita={handleActualizarCita}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

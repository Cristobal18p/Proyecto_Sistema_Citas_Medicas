import { useState } from "react";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { Paciente } from "../types/paciente";
import { Cita, CitaDetalle } from "../types/cita";
import { validarPaciente } from "../services/pacientes";
import {
  createCitaRecepcion as createCita,
  getCitaPorSeguimiento,
  cancelarCita,
} from "../services/citas";

import { ValidacionIdentidad } from "./portal-paciente/ValidacionIdentidad";
import {
  SolicitudCita,
  SolicitudCitaData,
} from "./portal-paciente/SolicitudCita";
import { ConfirmacionCita } from "./portal-paciente/ConfirmacionCita";
import { ConsultaEstado } from "./portal-paciente/ConsultaEstado";

interface PortalPacienteProps {
  onAccessClinica: () => void;
}

type View = "validacion" | "solicitud" | "confirmacion" | "consulta";

export function PortalPaciente({ onAccessClinica }: PortalPacienteProps) {
  const [currentView, setCurrentView] = useState<View>("validacion");
  const [pacienteActual, setPacienteActual] = useState<Paciente | null>(null);
  const [citaCreada, setCitaCreada] = useState<string | null>(null);

  const handleValidacionExitosa = async (
    cedula: string,
    fecha_nacimiento: string
  ) => {
    try {
      const respuesta = await validarPaciente({ cedula, fecha_nacimiento });
      if (respuesta.existe && respuesta.paciente) {
        setPacienteActual(respuesta.paciente);
        setCurrentView("solicitud");
      } else {
        // aquí podrías mostrar formulario de registro de paciente
      }
    } catch (err) {
      console.error("Error al validar paciente", err);
    }
  };

  const handleSolicitarCita = async (data: SolicitudCitaData) => {
    if (!pacienteActual) return;

    const citaData = {
      id_paciente: pacienteActual.id_paciente,
      id_medico: data.medicoSeleccionado,
      fecha_solicitud: new Date().toISOString().split("T")[0],
      preferencia_turno: data.preferenciaTurno,
      tipo_cita: data.tipoCita,
      tipo_solicitud: "web",
      creado_por: "paciente",
    };

    try {
      const nuevaCita = await createCita(citaData);
      setCitaCreada(nuevaCita.numero_seguimiento);
      setCurrentView("confirmacion");
    } catch (err) {
      console.error("Error al crear cita", err);
    }
  };

  const handleCancelarCita = async (numero_seguimiento: string) => {
    await cancelarCita(numero_seguimiento, "paciente");
  };

  const handleBuscarCita = async (
    numeroSeguimiento: string
  ): Promise<CitaDetalle | null> => {
    try {
      return await getCitaPorSeguimiento(numeroSeguimiento);
    } catch {
      return null;
    }
  };
  const resetForm = () => {
    setCitaCreada(null);
  };

  const handleVolverAValidacion = () => {
    setCurrentView("validacion");
    resetForm();
    setPacienteActual(null);
  };

  const handleAceptarConfirmacion = () => {
    setCurrentView("validacion");
    resetForm();
  };

  return (
    <div className="min-h-screen p-4 relative overflow-x-hidden portal-paciente-bg">
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-sm pointer-events-none"></div>

      {/* Botón de acceso fuera del panel */}
      <div className="relative z-10 mb-4 flex justify-end px-4">
        <Button
          variant="default"
          onClick={onAccessClinica}
          className="bg-white hover:bg-gray-50 text-blue-700 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-600"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Acceso de Personal
        </Button>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
              <img
                src="/logo-clinica.svg"
                alt="Logo Clínica San Carlos Osorio"
                className="h-12 w-12"
              />
            </div>
            <h2 className="text-xl font-bold text-blue-900">Clínica Santana</h2>
            <p className="text-sm text-gray-600">
              Portal de Pacientes / Solicitud de citas
            </p>
          </div>

          {/* Tabs de navegación */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            <button
              onClick={handleVolverAValidacion}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                currentView === "validacion" ||
                currentView === "solicitud" ||
                currentView === "confirmacion"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Solicitar Cita
            </button>
            <button
              onClick={() => {
                setCurrentView("consulta");
                resetForm();
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                currentView === "consulta"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Consultar Estado
            </button>
          </div>

          {/* Vista de Validación */}
          {currentView === "validacion" && (
            <ValidacionIdentidad
              onValidacionExitosa={handleValidacionExitosa}
            />
          )}

          {/* Vista de Solicitud de Cita */}
          {currentView === "solicitud" && pacienteActual && (
            <SolicitudCita
              paciente={pacienteActual}
              onSolicitar={handleSolicitarCita}
              onCancelar={handleVolverAValidacion}
            />
          )}

          {/* Vista de Confirmación */}
          {currentView === "confirmacion" && citaCreada && (
            <ConfirmacionCita
              numeroSeguimiento={citaCreada}
              onAceptar={handleAceptarConfirmacion}
            />
          )}

          {/* Vista de Consulta de Estado */}
          {currentView === "consulta" && (
            <ConsultaEstado
              onBuscar={handleBuscarCita}
              onCancelar={handleCancelarCita}
            />
          )}
        </div>
      </div>
    </div>
  );
}

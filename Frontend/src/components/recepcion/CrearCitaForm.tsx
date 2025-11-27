import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { CitaDetalle } from "../../types/cita";
import { Paciente } from "../../types/paciente";
import { Medico, Especialidad, DisponibilidadMedico } from "../../types/medico";
import {
  getMedicos,
  getDisponibilidadMedico,
  getEspecialidades,
} from "../../services/medicos";
import { getCitas, createCitaRecepcion } from "../../services/citas";

import { BuscadorPaciente } from "./crear-cita/BuscadorPaciente";
import { SelectorEspecialidad } from "./crear-cita/SelectorEspecialidad";
import { SelectorMedico } from "./crear-cita/SelectorMedico";
import { SelectorFecha } from "./crear-cita/SelectorFecha";
import { SelectorHora } from "./crear-cita/SelectorHora";
import { SelectorTipoCita } from "./crear-cita/SelectorTipoCita";
import { useDisponibilidadHoraria } from "./crear-cita/useDisponibilidadHoraria";

interface CrearCitaFormProps {
  pacientes: Paciente[];
  medicos: Medico[];
  especialidades: Especialidad[];
  citasExistentes: CitaDetalle[];
  onNuevaCita: (cita: CitaDetalle) => void;
}

function obtenerTurno(hora: string): "AM" | "PM" {
  const [hh] = hora.split(":").map(Number);
  return hh < 12 ? "AM" : "PM";
}

function formatearHora(hora: string): string {
  const [hh, mm] = hora.split(":").map(Number);
  const periodo = hh < 12 ? "AM" : "PM";
  const hora12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${hora12}:${mm.toString().padStart(2, "0")} ${periodo}`;
}

function formatearNombreMedico(nombreCompleto: string | undefined): string {
  if (!nombreCompleto) return "Dr./Dra.";
  return `Dr/a. ${nombreCompleto}`;
}

export function CrearCitaForm({
  pacientes,
  medicos,
  especialidades,
  citasExistentes,
  onNuevaCita,
}: CrearCitaFormProps) {
  const [disponibilidadMedico, setDisponibilidadMedico] = useState<
    DisponibilidadMedico[]
  >([]);

  const [formData, setFormData] = useState({
    id_paciente: "",
    id_especialidad: "",
    id_medico: "",
    fecha_cita: "",
    hora_cita: "",
    tipo_cita: "nueva" as "nueva" | "control",
  });

  const [searchPaciente, setSearchPaciente] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(
    undefined
  );
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [citaCreada, setCitaCreada] = useState<CitaDetalle | null>(null);
  const [datosConfirmacion, setDatosConfirmacion] = useState<{
    paciente: Paciente;
    medico: Medico;
    especialidad: Especialidad;
    fecha_cita: string;
    hora_cita: string;
    tipo_cita: "nueva" | "control";
  } | null>(null);

  // Cargar disponibilidad del médico
  useEffect(() => {
    const cargarDisponibilidad = async () => {
      if (!formData.id_medico) return;
      try {
        const disponibilidad = await getDisponibilidadMedico(
          String(formData.id_medico)
        );
        setDisponibilidadMedico(disponibilidad);
      } catch (error) {
        toast.error("Error al cargar disponibilidad del médico");
        console.error(error);
      }
    };
    cargarDisponibilidad();
  }, [formData.id_medico]);

  // Resetear fecha y hora cuando cambia el médico
  useEffect(() => {
    setFechaSeleccionada(undefined);
    setFormData((prev) => ({ ...prev, fecha_cita: "", hora_cita: "" }));
  }, [formData.id_medico]);

  // Hook personalizado para calcular horas disponibles
  const horasDisponibles = useDisponibilidadHoraria({
    fechaSeleccionada,
    medicoId: formData.id_medico,
    disponibilidad: disponibilidadMedico,
    citasExistentes,
  });

  const handleSelectPaciente = (paciente: Paciente) => {
    setFormData({ ...formData, id_paciente: paciente.id_paciente });
    setSearchPaciente(
      `${paciente.nombre} ${paciente.apellido} - ${paciente.cedula}`
    );
  };

  const handleFechaChange = (date: Date | undefined) => {
    setFechaSeleccionada(date);
    if (date) {
      setFormData({
        ...formData,
        fecha_cita: date.toISOString().split("T")[0],
        hora_cita: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Iniciamos el envento en boton de crear cita");

    if (!formData.fecha_cita || !formData.hora_cita) {
      console.log("Fecha:", formData.fecha_cita);
      console.log("Hora:", formData.hora_cita);

      toast.error("Debe seleccionar fecha y hora");
      return;
    }

    const paciente = pacientes.find(
      (p) => String(p.id_paciente) === String(formData.id_paciente)
    );
    const medico = medicos.find(
      (m) => String(m.id_medico) === String(formData.id_medico)
    );
    const especialidad = especialidades.find(
      (e) => String(e.id_especialidad) === String(formData.id_especialidad)
    );

    if (!paciente || !medico || !especialidad) {
      toast.error("Error al crear la cita");
      return;
    }

    const nuevaCita = {
      id_paciente: formData.id_paciente,
      fecha_solicitud: new Date().toISOString().split("T")[0],
      id_medico: formData.id_medico,
      tipo_cita: formData.tipo_cita,
      preferencia_turno: obtenerTurno(formData.hora_cita),
      tipo_solicitud: "presencial" as const,
      fecha_cita: formData.fecha_cita,
      hora_cita: formData.hora_cita,
      creado_por: "recepcion" as const,
    };

    try {
      const citaCreada = await createCitaRecepcion(nuevaCita);
      onNuevaCita(citaCreada);

      // Guardar datos para el diálogo de confirmación
      setCitaCreada(citaCreada);
      setDatosConfirmacion({
        paciente,
        medico,
        especialidad,
        fecha_cita: formData.fecha_cita,
        hora_cita: formData.hora_cita,
        tipo_cita: formData.tipo_cita,
      });
      setMostrarConfirmacion(true);

      // Reset form
      setFormData({
        id_paciente: "",
        id_especialidad: "",
        id_medico: "",
        fecha_cita: "",
        hora_cita: "",
        tipo_cita: "nueva",
      });
      setSearchPaciente("");
      setFechaSeleccionada(undefined);
    } catch (error) {
      console.error("Error al crear cita:", error);
      toast.error("No se pudo crear la cita. Intente nuevamente.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Crear Nueva Cita
          </CardTitle>
          <CardDescription>
            Complete el formulario para registrar una nueva cita médica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BuscadorPaciente
                pacientes={pacientes}
                onSelectPaciente={handleSelectPaciente}
                searchValue={searchPaciente}
                onSearchChange={setSearchPaciente}
              />

              <SelectorEspecialidad
                especialidades={especialidades}
                value={String(formData.id_especialidad)}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    id_especialidad: value,
                    id_medico: "",
                  });
                }}
              />

              <SelectorMedico
                medicos={medicos}
                value={String(formData.id_medico)}
                onChange={(value) => {
                  setFormData({ ...formData, id_medico: value });
                }}
                especialidadId={formData.id_especialidad}
              />

              <SelectorFecha
                value={fechaSeleccionada}
                onChange={handleFechaChange}
                medicoId={formData.id_medico}
                disponibilidad={disponibilidadMedico}
              />

              <SelectorHora
                value={formData.hora_cita}
                onChange={(value) =>
                  setFormData({ ...formData, hora_cita: value })
                }
                horasDisponibles={horasDisponibles}
                fechaSeleccionada={fechaSeleccionada}
              />

              <SelectorTipoCita
                value={formData.tipo_cita}
                onChange={(value) =>
                  setFormData({ ...formData, tipo_cita: value })
                }
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Cita
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog
        open={mostrarConfirmacion}
        onOpenChange={setMostrarConfirmacion}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              ¡Cita Creada Exitosamente!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-4">
              {citaCreada && datosConfirmacion && (
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-700">
                      Número de Seguimiento:
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {citaCreada.numero_seguimiento}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Paciente:
                      </span>
                      <span className="text-gray-900">
                        {datosConfirmacion.paciente.nombre}{" "}
                        {datosConfirmacion.paciente.apellido}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Especialidad:
                      </span>
                      <span className="text-gray-900">
                        {datosConfirmacion.especialidad.nombre_especialidad}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Médico:</span>
                      <span className="text-gray-900">
                        {formatearNombreMedico(
                          datosConfirmacion.medico.nombre_completo
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Fecha:</span>
                      <span className="text-gray-900">
                        {datosConfirmacion.fecha_cita}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Hora:</span>
                      <span className="text-gray-900">
                        {formatearHora(datosConfirmacion.hora_cita)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Tipo:</span>
                      <span className="text-gray-900 capitalize">
                        {datosConfirmacion.tipo_cita}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setMostrarConfirmacion(false)}
              className="w-full"
            >
              Aceptar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { DisponibilidadMedico } from "../../types/medico";
import { CitaDetalle } from "../../types/cita";
import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { es } from "date-fns/locale";
import { getDisponibilidadMedico } from "../../services/medicos";
import { confirmarCita } from "../../services/citas";

interface ConfirmarCitaDialogProps {
  cita: CitaDetalle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (cita: CitaDetalle) => void;
  // disponibilidadMedico: DisponibilidadMedico[];
  citasExistentes: CitaDetalle[];
}

export function ConfirmarCitaDialog({
  cita,
  open,
  onOpenChange,
  onConfirmar,
  citasExistentes,
}: ConfirmarCitaDialogProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(
    undefined
  );
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("");
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [confirmando, setConfirmando] = useState(false);

  const [disponibilidadMedico, setDisponibilidadMedico] = useState<
    DisponibilidadMedico[]
  >([]);
  const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState<string | null>(
    null
  );

  // Cargar disponibilidad al abrir el diálogo
  useEffect(() => {
    if (!open || !cita) {
      setDisponibilidadMedico([]);
      setErrorDisponibilidad(null);
      return;
    }

    if (!cita.id_medico) {
      console.warn("No se encontró id_medico en la cita:", cita);
      setErrorDisponibilidad("No se encontró el id del médico en la cita");
      setDisponibilidadMedico([]);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setCargandoDisponibilidad(true);
        setErrorDisponibilidad(null);
        console.log("Cargando disponibilidad para médico:", cita.id_medico);
        const data = await getDisponibilidadMedico(cita.id_medico);
        console.log("Disponibilidad recibida:", data);
        setDisponibilidadMedico(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        console.error("Error cargando disponibilidad:", e);
        setErrorDisponibilidad(
          "No se pudo cargar la disponibilidad del médico"
        );
        setDisponibilidadMedico([]);
      } finally {
        setCargandoDisponibilidad(false);
      }
    })();
    return () => ac.abort();
  }, [open, cita]);

  // Resetear estados cuando cambia la cita o se abre el diálogo
  useEffect(() => {
    if (open && cita) {
      setFechaSeleccionada(undefined);
      setHoraSeleccionada("");
      setHorasDisponibles([]);
    }
  }, [open, cita]);

  // Obtener el día de la semana en español
  const getDiaSemana = (fecha: Date): DisponibilidadMedico["dia_semana"] => {
    const dias: DisponibilidadMedico["dia_semana"][] = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return dias[fecha.getDay()];
  };

  // Generar franjas horarias de 1 hora
  const generarFranjasHorarias = (
    horaInicio: string,
    horaFin: string
  ): string[] => {
    const franjas: string[] = [];
    const [horaInicioH, horaInicioM] = horaInicio.split(":").map(Number);
    const [horaFinH, horaFinM] = horaFin.split(":").map(Number);

    let horaActual = horaInicioH * 60 + horaInicioM;
    const horaLimite = horaFinH * 60 + horaFinM;

    while (horaActual < horaLimite) {
      const h = Math.floor(horaActual / 60);
      const m = horaActual % 60;
      franjas.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
      horaActual += 60; // Incremento de 1 hora
    }

    return franjas;
  };

  // Verificar si una hora ya está ocupada
  const horaOcupada = (fecha: Date, hora: string): boolean => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return citasExistentes.some(
      (c) =>
        c.id_medico === cita?.id_medico &&
        c.fecha_cita === fechaStr &&
        c.hora_cita === hora &&
        c.estado_cita !== "cancelada"
    );
  };

  // Calcular horas disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (fechaSeleccionada && cita) {
      const diaSemana = getDiaSemana(fechaSeleccionada);

      // Filtrar disponibilidad del médico para ese día
      const disponibilidadDia = disponibilidadMedico.filter(
        (d) => d.dia_semana === diaSemana
      );

      if (disponibilidadDia.length === 0) {
        setHorasDisponibles([]);
        return;
      }

      // Generar todas las franjas horarias disponibles
      let todasLasFranjas: string[] = [];
      disponibilidadDia.forEach((disponibilidad) => {
        const franjas = generarFranjasHorarias(
          disponibilidad.hora_inicio,
          disponibilidad.hora_fin
        );
        todasLasFranjas = [...todasLasFranjas, ...franjas];
      });

      // Filtrar las horas que no están ocupadas
      const franjasLibres = todasLasFranjas.filter(
        (hora) => !horaOcupada(fechaSeleccionada, hora)
      );

      setHorasDisponibles(franjasLibres);
    }
  }, [fechaSeleccionada, cita, disponibilidadMedico, citasExistentes]);

  // Verificar si una fecha tiene disponibilidad
  const fechaTieneDisponibilidad = (fecha: Date): boolean => {
    if (!cita || !cita.id_medico) return false;

    const diaSemana = getDiaSemana(fecha);
    // La disponibilidad ya viene filtrada por médico desde el API
    return disponibilidadMedico.some((d) => d.dia_semana === diaSemana);
  };

  // Formatear hora a 12 horas
  const formatHora12 = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    const periodo = h < 12 ? "AM" : "PM";
    const hora12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hora12}:${m.toString().padStart(2, "0")} ${periodo}`;
  };

  const handleConfirmar = async () => {
    console.log("handleConfirmar llamado");
    console.log("Cita completa:", cita);
    console.log("id_cita:", cita?.id_cita);
    console.log("fechaSeleccionada:", fechaSeleccionada);
    console.log("horaSeleccionada:", horaSeleccionada);
    
    if (!cita || !fechaSeleccionada || !horaSeleccionada) {
      toast.error("Debe seleccionar fecha y hora");
      return;
    }

    if (!cita.id_cita) {
      console.error("Cita sin id_cita:", cita);
      toast.error("No se encontró el ID de la cita");
      return;
    }

    try {
      setConfirmando(true);
      const fechaFormateada = fechaSeleccionada.toISOString().split("T")[0];
      
      console.log("Llamando API confirmarCita con:", {
        id_cita: cita.id_cita,
        fecha_cita: fechaFormateada,
        hora_cita: horaSeleccionada,
      });
      
      const citaConfirmada = await confirmarCita(
        cita.id_cita,
        fechaFormateada,
        horaSeleccionada
      );

      console.log("Cita confirmada:", citaConfirmada);
      onConfirmar(citaConfirmada);
      toast.success("Cita confirmada exitosamente");
      onOpenChange(false);
    } catch (error) {
      console.error("Error al confirmar cita:", error);
      toast.error("No se pudo confirmar la cita");
    } finally {
      setConfirmando(false);
    }
  };

  if (!cita) return null;

  // Obtener disponibilidad del médico para mostrar información
  const diasDisponibles = disponibilidadMedico.map((d) => d.dia_semana);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[92vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Confirmar Cita - {cita.numero_seguimiento}
          </DialogTitle>
          <DialogDescription>
            Seleccione fecha y hora disponible del médico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la Cita */}
          <Card className="p-4 bg-blue-50/50 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Paciente</p>
                <p className="font-semibold">{cita.paciente_nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Médico</p>
                <p className="font-semibold">{cita.medico_nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Especialidad</p>
                <p className="font-semibold">{cita.especialidad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Cita</p>
                <Badge variant="outline">
                  {cita.tipo_cita === "nueva" ? "Nueva" : "Control"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Preferencia de Turno (Referencial)
                </p>
                <Badge
                  variant="outline"
                  className={
                    cita.preferencia_turno === "AM"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-purple-100 text-purple-800"
                  }
                >
                  {cita.preferencia_turno === "AM"
                    ? "Mañana (AM)"
                    : "Tarde (PM)"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Disponibilidad del Médico */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Disponibilidad del Médico</h3>
            {cargandoDisponibilidad && (
              <p className="text-sm text-blue-600">
                Cargando disponibilidad...
              </p>
            )}
            {errorDisponibilidad && (
              <p className="text-sm text-red-600">{errorDisponibilidad}</p>
            )}
            {!cargandoDisponibilidad &&
              !errorDisponibilidad &&
              disponibilidadMedico.length === 0 && (
                <p className="text-sm text-gray-500">
                  No hay bloques de disponibilidad configurados.
                </p>
              )}
            {!cargandoDisponibilidad && disponibilidadMedico.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    disponibilidadMedico
                      .filter((d) => d.id_medico === cita.id_medico)
                      .map((d) => d.dia_semana)
                  )
                ).map((dia) => (
                  <Badge key={dia} variant="outline" className="bg-blue-50">
                    {dia}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Selección de Fecha y Hora */}
          <div className="space-y-6">
            {/* Calendario */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                1. Seleccione una Fecha
              </h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <Calendar
                  mode="single"
                  selected={fechaSeleccionada}
                  onSelect={setFechaSeleccionada}
                  locale={es}
                  disabled={(date: Date) => {
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    return date < hoy || !fechaTieneDisponibilidad(date);
                  }}
                  modifiers={{
                    disponible: (date: Date) => {
                      const hoy = new Date();
                      hoy.setHours(0, 0, 0, 0);
                      return date >= hoy && fechaTieneDisponibilidad(date);
                    },
                  }}
                  modifiersClassNames={{
                    disponible:
                      "ring-2 ring-green-400 ring-offset-2 ring-offset-white rounded-md",
                  }}
                  className="rounded-md mx-auto"
                />
              </div>
              {fechaSeleccionada && horasDisponibles.length === 0 && (
                <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    No hay horarios disponibles para esta fecha. Todos los
                    espacios están ocupados. Intente con otra fecha.
                  </p>
                </div>
              )}
            </div>

            {/* Horas Disponibles */}
            {fechaSeleccionada && horasDisponibles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  2. Seleccione una Hora
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    ({horasDisponibles.length} disponibles)
                  </span>
                </h3>
                <div className="border rounded-md p-4 bg-white max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {horasDisponibles.map((hora) => (
                      <Button
                        key={hora}
                        size="lg"
                        variant={
                          horaSeleccionada === hora ? "default" : "outline"
                        }
                        className={`justify-center h-14 text-base font-semibold ${
                          horaSeleccionada === hora
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "hover:bg-blue-50 hover:border-blue-400"
                        }`}
                        onClick={() => setHoraSeleccionada(hora)}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Clock className="w-5 h-5" />
                          <span>{formatHora12(hora)}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumen de la Confirmación */}
          {fechaSeleccionada && horaSeleccionada && (
            <Card className="p-4 bg-green-50/50 border-green-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">
                    Resumen de Confirmación
                  </h4>
                  <p className="text-sm text-green-700">
                    La cita se confirmará para el{" "}
                    <strong>
                      {fechaSeleccionada.toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </strong>{" "}
                    a las <strong>{formatHora12(horaSeleccionada)}</strong>
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={confirmando}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!fechaSeleccionada || !horaSeleccionada || confirmando}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {confirmando ? "Confirmando..." : "Confirmar Cita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

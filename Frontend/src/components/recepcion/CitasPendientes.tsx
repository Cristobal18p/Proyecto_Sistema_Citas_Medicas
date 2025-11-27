import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ConfirmarCitaDialog } from "./ConfirmarCitaDialog";

import { CitaDetalle } from "../../types/cita";
import { cancelarCita as cancelarCitaAPI } from "../../services/citas"; // ajusta la ruta si es diferente

interface CitasPendientesProps {
  citas: CitaDetalle[];
  onActualizarCita: (cita: CitaDetalle) => void;
}

export function CitasPendientes({
  citas,
  onActualizarCita,
}: CitasPendientesProps) {
  const [citasLocales, setCitasLocales] = useState<CitaDetalle[]>(citas);

  useEffect(() => {
    setCitasLocales(citas);
  }, [citas]);

  const citasPendientes = citasLocales.filter(
    (c) =>
      c.estado_cita === "pendiente" &&
      !c.fecha_cita &&
      !c.hora_cita &&
      !c.fecha_confirmacion
  );

  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDetalle | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const abrirDialogoConfirmacion = (cita: CitaDetalle) => {
    setCitaSeleccionada(cita);
    setDialogOpen(true);
  };

  const handleConfirmarCita = (citaActualizada: CitaDetalle) => {
    onActualizarCita(citaActualizada);
  };

  const cancelarCita = async (cita: CitaDetalle) => {
    try {
      console.log("Cancelando cita:", cita.numero_seguimiento);

      await cancelarCitaAPI(cita.numero_seguimiento, "recepcion");

      // Actualizar el estado local inmediatamente
      const citasActualizadas = citasLocales.map((c) =>
        c.numero_seguimiento === cita.numero_seguimiento
          ? { ...c, estado_cita: "cancelada" as const }
          : c
      );

      setCitasLocales(citasActualizadas);

      // Notificar al componente padre
      onActualizarCita({ ...cita, estado_cita: "cancelada" });

      toast.success("Cita cancelada correctamente");
    } catch (error) {
      console.error("Error completo al cancelar la cita:", error);
      toast.error("No se pudo cancelar la cita");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          Citas Pendientes de Confirmación
        </CardTitle>
        <CardDescription>
          {citasPendientes.length} cita(s) esperando confirmación
        </CardDescription>
      </CardHeader>
      <CardContent>
        {citasPendientes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay citas pendientes por confirmar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {citasPendientes.map((cita) => (
              <div
                key={cita.id_cita}
                className="p-4 border border-yellow-200 bg-yellow-50/50 rounded-lg"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-700 border-yellow-300"
                      >
                        Pendiente
                      </Badge>
                      <Badge variant="outline">{cita.numero_seguimiento}</Badge>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <span className="text-gray-600">
                          Fecha de Solicitud:
                        </span>{" "}
                        {cita.fecha_solicitud}
                      </p>
                      <p>
                        <span className="text-gray-600">Paciente:</span>{" "}
                        {cita.paciente_nombre}
                      </p>
                      <p>
                        <span className="text-gray-600">Médico:</span>{" "}
                        {cita.medico_nombre}
                      </p>
                      <p>
                        <span className="text-gray-600">Especialidad:</span>{" "}
                        {cita.especialidad}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tipo de Cita :{" "}
                        {cita.tipo_cita === "nueva" ? "Nueva" : "Control"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => abrirDialogoConfirmacion(cita)}
                    >
                      <Calendar className="w-4 h-4" />
                      Ver Disponibilidad
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-red-600 hover:text-red-700"
                      onClick={() => cancelarCita(cita)}
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Diálogo de Confirmación con Disponibilidad */}
      <ConfirmarCitaDialog
        cita={citaSeleccionada}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirmar={handleConfirmarCita}
       // disponibilidadMedico={[]}
        citasExistentes={citas}
      />
    </Card>
  );
}

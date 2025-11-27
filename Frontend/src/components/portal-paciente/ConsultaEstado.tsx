import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Search } from "lucide-react";
import { CitaDetalle } from "../../types/cita";

interface ConsultaEstadoProps {
  onBuscar: (numeroSeguimiento: string) => Promise<CitaDetalle | null>;
  onCancelar: (numeroSeguimiento: string) => Promise<void>;
}

export function ConsultaEstado({ onBuscar, onCancelar }: ConsultaEstadoProps) {
  const [numeroSeguimiento, setNumeroSeguimiento] = useState("");
  const [citaConsultada, setCitaConsultada] = useState<CitaDetalle | null>(
    null
  );
  const [mostrarDialogoCancelar, setMostrarDialogoCancelar] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const handleConsultarCita = async () => {
    setBusquedaRealizada(true);
    setCitaConsultada(null);

    if (!numeroSeguimiento.trim()) return;

    const cita = await onBuscar(numeroSeguimiento.trim());
    setCitaConsultada(cita);
  };

  const handleCancelarCita = async () => {
    if (!citaConsultada) return;

    if (citaConsultada.estado_cita === "pendiente") {
      await onCancelar(citaConsultada.numero_seguimiento);

      setCitaConsultada({
        ...citaConsultada,
        estado_cita: "cancelada",
        cancelado_por: "paciente", // reflejar también en el estado local
      });

      setMostrarDialogoCancelar(false);
    }
  };

  return (
    <div className="space-y-4 mt-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Consultar Estado de Cita
        </h3>
        <p className="text-sm text-gray-600">
          Ingrese su número de seguimiento
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="seguimiento">Número de Seguimiento</Label>
          <div className="flex gap-2">
            <Input
              id="seguimiento"
              placeholder="Ej: SEG-2025-001"
              value={numeroSeguimiento}
              onChange={(e) => setNumeroSeguimiento(e.target.value)}
            />
            <Button onClick={handleConsultarCita}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {citaConsultada && (
          <Card className="border-2">
            <CardHeader className="bg-gray-50 py-3">
              <CardTitle className="text-base">
                Información de Cita {citaConsultada.numero_seguimiento}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="space-y-2">
                {/* Estado */}
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600 font-medium">
                    Estado:
                  </span>
                  <span
                    className="font-bold text-base"
                    style={{
                      color:
                        citaConsultada.estado_cita === "confirmada"
                          ? "#16a34a"
                          : citaConsultada.estado_cita === "pendiente"
                          ? "#ca8a04"
                          : citaConsultada.estado_cita === "atendido"
                          ? "#2563eb"
                          : "#dc2626",
                    }}
                  >
                    {citaConsultada.estado_cita.toUpperCase()}
                  </span>
                </div>

                {/* Fecha de solicitud */}
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600 font-medium">
                    Fecha de Solicitud:
                  </span>
                  <span className="text-sm font-semibold">
                    {citaConsultada.fecha_solicitud || "N/A"}
                  </span>
                </div>

                {/* Tipo de cita */}
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600 font-medium">
                    Tipo de Cita:
                  </span>
                  <span className="text-sm font-semibold">
                    {citaConsultada.tipo_cita === "nueva" ? "Nueva" : "Control"}
                  </span>
                </div>

                {/* Especialidad */}
                {citaConsultada.especialidad && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600 font-medium">
                      Especialidad:
                    </span>
                    <span className="text-sm font-semibold">
                      {citaConsultada.especialidad}
                    </span>
                  </div>
                )}

                {/* Confirmada o Atendida */}
                {["confirmada", "atendido"].includes(
                  citaConsultada.estado_cita.toLowerCase()
                ) && (
                  <>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-gray-600 font-medium">
                        Fecha Asignada:
                      </span>
                      <span className="text-sm font-semibold">
                        {citaConsultada.fecha_cita || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-gray-600 font-medium">
                        Hora y Turno:
                      </span>
                      <span className="text-sm font-semibold">
                        {citaConsultada.hora_cita
                          ? `${citaConsultada.hora_cita} ${citaConsultada.preferencia_turno}`
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm text-gray-600 font-medium">
                        Médico:
                      </span>
                      <span className="text-sm font-semibold">
                        {"Dr/a " + citaConsultada.medico_nombre ||
                          "Por asignar"}
                      </span>
                    </div>

                    {citaConsultada.fecha_confirmacion && (
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm text-gray-600 font-medium">
                          Confirmada el:
                        </span>
                        <span className="text-sm font-semibold">
                          {citaConsultada.fecha_confirmacion}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Pendiente */}
                {citaConsultada.estado_cita.toLowerCase() === "pendiente" && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-sm text-yellow-800">
                      Su cita está en proceso de revisión. La fecha, hora y
                      médico serán asignados próximamente. Recibirá una
                      notificación cuando su cita sea confirmada.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Cancelada */}
                {citaConsultada.estado_cita.toLowerCase() === "cancelada" && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-sm text-red-800">
                      Esta cita ha sido cancelada y no será procesada por la
                      clínica.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Botón de cancelar si está pendiente */}
              {citaConsultada.estado_cita.toLowerCase() === "pendiente" && (
                <div className="pt-4 border-t">
                  <AlertDialog
                    open={mostrarDialogoCancelar}
                    onOpenChange={setMostrarDialogoCancelar}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Cancelar Cita
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Está seguro de cancelar esta cita?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La cita{" "}
                          {citaConsultada.numero_seguimiento} será cancelada y
                          ya no podrá ser procesada por el personal de la
                          clínica.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, mantener cita</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelarCita}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sí, cancelar cita
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {busquedaRealizada && numeroSeguimiento && !citaConsultada && (
          <Alert variant="destructive">
            <AlertDescription>
              No se encontró una cita con el número de seguimiento{" "}
              <strong>{numeroSeguimiento}</strong>. Verifique que esté escrito
              correctamente.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

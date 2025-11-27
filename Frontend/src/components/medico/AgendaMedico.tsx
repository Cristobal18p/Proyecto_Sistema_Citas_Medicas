import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CitaDetalle } from "../../types/cita";
import { Calendar, Clock, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { actualizarEstadoCita } from "../../services/citas";

interface AgendaMedicoProps {
  citas: CitaDetalle[];
  onActualizarCita: (cita: CitaDetalle) => void;
}

export function AgendaMedico({ citas, onActualizarCita }: AgendaMedicoProps) {
  const hoy = new Date().toLocaleDateString("sv-SE");

  const citasHoy = citas.filter(
    (c) => c.fecha_cita === hoy && c.estado_cita === "confirmada"
  );

  const citasProximas = citas.filter(
    (c) =>
      new Date(c.fecha_cita!) > new Date(hoy) && c.estado_cita === "confirmada"
  );

  const citasAtendidas = citas.filter(
    (c) =>
      new Date(c.fecha_cita!) >= new Date(hoy) && c.estado_cita === "atendida"
  );

  const marcarComoAtendido = async (cita: CitaDetalle) => {
    try {
      const actualizado = await actualizarEstadoCita(cita.id_cita, "atendida");
      onActualizarCita({ ...cita, estado_cita: actualizado.estado_cita });
      toast.success("Paciente marcado como atendido");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("No se pudo marcar la cita como atendida");
    }
  };

  function agruparPorFecha(citas: CitaDetalle[]) {
    return citas.reduce((acc, cita) => {
      if (!acc[cita.fecha_cita!]) {
        acc[cita.fecha_cita!] = [];
      }
      acc[cita.fecha_cita!].push(cita);
      return acc;
    }, {} as Record<string, CitaDetalle[]>);
  }

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pendiente
        </Badge>
      ),
      confirmada: (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Confirmada
        </Badge>
      ),
      atendida: (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Atendida
        </Badge>
      ),
      cancelada: (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Cancelada
        </Badge>
      ),
    };
    return badges[estado as keyof typeof badges];
  };

  const formatHora = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toLocalDate = (fechaString: string) => {
    const [year, month, day] = fechaString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const citasProximasAgrupadas = agruparPorFecha(citasProximas);

  const CitaCard = ({
    cita,
    mostrarBoton,
  }: {
    cita: CitaDetalle;
    mostrarBoton: boolean;
  }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">
              {formatHora(cita.hora_cita!)}
            </span>
            {getEstadoBadge(cita.estado_cita)}
            <Badge variant="outline" className="text-xs">
              {cita.tipo_cita === "nueva" ? "Nueva" : "Control"}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="font-medium">{cita.paciente_nombre}</p>
            <p className="text-sm text-gray-600">
              Número de seguimiento: {cita.numero_seguimiento}
            </p>
          </div>
        </div>

        {mostrarBoton && cita.estado_cita !== "atendida" && (
          <Button
            size="sm"
            className="gap-2"
            onClick={() => marcarComoAtendido(cita)}
          >
            <CheckCircle className="w-4 h-4" />
            Marcar Atendida
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Mi Agenda de Pacientes
        </CardTitle>
        <CardDescription>
          Visualice y gestione sus citas programadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hoy">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="hoy">Hoy ({citasHoy.length})</TabsTrigger>
            <TabsTrigger value="proximas">
              Próximas ({citasProximas.length})
            </TabsTrigger>
            <TabsTrigger value="atendidas">
              Atendidas ({citasAtendidas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hoy" className="space-y-3">
            {citasHoy.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No tiene citas programadas para hoy</p>
              </div>
            ) : (
              citasHoy
                .sort((a, b) => a.hora_cita!.localeCompare(b.hora_cita!))
                .map((cita) => (
                  <CitaCard
                    key={cita.id_cita}
                    cita={cita}
                    mostrarBoton={true}
                  />
                ))
            )}
          </TabsContent>

          <TabsContent value="proximas" className="space-y-3">
            {Object.entries(citasProximasAgrupadas).map(
              ([fecha, citasDelDia]) => (
                <div key={fecha} className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {toLocalDate(fecha).toLocaleDateString("es-PA", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "America/Panama",
                    })}
                  </p>
                  {citasDelDia
                    .sort((a, b) => a.hora_cita!.localeCompare(b.hora_cita!))
                    .map((cita) => (
                      <CitaCard
                        key={cita.id_cita}
                        cita={cita}
                        mostrarBoton={false}
                      />
                    ))}
                </div>
              )
            )}
          </TabsContent>

          <TabsContent value="atendidas" className="space-y-3">
            {citasAtendidas.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No hay pacientes atendidas</p>
              </div>
            ) : (
              citasAtendidas
                .sort(
                  (a, b) =>
                    new Date(b.fecha_cita!).getTime() -
                    new Date(a.fecha_cita!).getTime()
                )
                .map((cita) => (
                  <CitaCard
                    key={cita.id_cita}
                    cita={cita}
                    mostrarBoton={false}
                  />
                ))
            )}
          </TabsContent>
        </Tabs>

        {/* Resumen */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Total del día */}
            <div>
              <p className="text-2xl text-blue-600">
                {citas.filter((c) => c.fecha_cita === hoy).length}
              </p>
              <p className="text-sm text-gray-600">Total Hoy</p>
            </div>

            {/* Pendientes (confirmadas para hoy) */}
            <div>
              <p className="text-2xl text-green-600">
                {
                  citas.filter(
                    (c) =>
                      c.fecha_cita === hoy && c.estado_cita === "confirmada"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>

            {/* Atendidos (estado atendido hoy) */}
            <div>
              <p className="text-2xl text-yellow-600">
                {
                  citas.filter(
                    (c) => c.fecha_cita === hoy && c.estado_cita === "atendida"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">Atendidas</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

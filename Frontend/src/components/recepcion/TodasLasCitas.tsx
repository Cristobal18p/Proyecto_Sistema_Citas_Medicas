import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileText, Search } from "lucide-react";
import { CitaDetalle } from "../../types/cita";

interface TodasLasCitasProps {
  citas: CitaDetalle[];
  onActualizarCita: (cita: CitaDetalle) => void;
}

export function TodasLasCitas({ citas }: TodasLasCitasProps) {
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState("");

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
      atendido: (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Atendido
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
    return badges[estado as keyof typeof badges] ?? null;
  };

  const citasFiltradas = citas
    .filter((cita) => {
      const coincideEstado =
        filtroEstado === "todas" || cita.estado_cita === filtroEstado;
      const coincideBusqueda =
        busqueda === "" ||
        cita.paciente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        cita.numero_seguimiento
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        cita.medico_nombre?.toLowerCase().includes(busqueda.toLowerCase());

      return coincideEstado && coincideBusqueda;
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha_solicitud).getTime();
      const fechaB = new Date(b.fecha_solicitud).getTime();
      const numA = parseInt(a.numero_seguimiento.replace(/\D/g, ""), 10);
      const numB = parseInt(b.numero_seguimiento.replace(/\D/g, ""), 10);

      // Ordenar primero por fecha_solicitud descendente, luego por número de seguimiento descendente
      if (fechaB !== fechaA) return fechaB - fechaA;
      return numB - numA;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Todas las Citas
        </CardTitle>
        <CardDescription>
          Visualice y gestione todas las citas del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por paciente, número de seguimiento o médico..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos los Estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="atendido">Atendido</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de citas */}
        <div className="space-y-3">
          {citasFiltradas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No se encontraron citas con los filtros aplicados</p>
            </div>
          ) : (
            citasFiltradas.map((cita) => (
              <div
                key={cita.numero_seguimiento}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getEstadoBadge(cita.estado_cita)}
                    <Badge variant="outline">{cita.numero_seguimiento}</Badge>
                    <span className="text-sm text-gray-500">
                      {cita.fecha_cita && cita.hora_cita
                        ? `${cita.fecha_cita
                            .split("-")
                            .reverse()
                            .join("/")} - ${cita.hora_cita}`
                        : "Sin fecha/ hora asignada"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p>
                        <span className="text-gray-600">Paciente:</span>{" "}
                        {cita.paciente_nombre}
                      </p>
                      <p>
                        <span className="text-gray-600">Médico:</span>{" "}
                        {cita.medico_nombre}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="text-gray-600">Especialidad:</span>{" "}
                        {cita.especialidad}
                      </p>
                      <p>
                        <span className="text-gray-600">Tipo de cita:</span>{" "}
                        {cita.tipo_cita === "nueva" ? "Nueva" : "Control"}
                      </p>
                    </div>
                  </div>

                  {cita.fecha_confirmacion && (
                    <p className="text-xs text-gray-500">
                      Confirmada el:{" "}
                      {cita.fecha_confirmacion.split("-").reverse().join("/")}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estadísticas */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl text-blue-600">{citas.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl text-yellow-600">
                {citas.filter((c) => c.estado_cita === "pendiente").length}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
            <div>
              <p className="text-2xl text-green-600">
                {citas.filter((c) => c.estado_cita === "confirmada").length}
              </p>
              <p className="text-sm text-gray-600">Confirmadas</p>
            </div>
            <div>
              <p className="text-2xl text-gray-600">
                {citas.filter((c) => c.estado_cita === "atendido").length}
              </p>
              <p className="text-sm text-gray-600">Atendidas</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, Calendar } from "lucide-react";
import { CitaDetalle } from "../../types/cita";

interface CitasDelDiaProps {
  citas: CitaDetalle[];
}

export function CitasDelDia({ citas }: CitasDelDiaProps) {
  const hoy = new Date().toLocaleDateString("sv-SE"); // formato YYYY-MM-DD

  // Solo citas confirmadas del día
  const citasDelDia = citas.filter(
    (c) => c.fecha_cita === hoy && c.estado_cita === "confirmada" && c.hora_cita
  );

  const timeToMinutes = (t?: string | null) => {
    if (!t) return Number.POSITIVE_INFINITY;
    // Soporta 'HH:mm' (24h) y 'HH:MM AM/PM'
    const ampm = /am|pm/i;
    if (ampm.test(t)) {
      const [time, suffixRaw] = t.split(/\s+/);
      const [hh, mm] = (time || "").split(":").map(Number);
      const suffix = (suffixRaw || "").toUpperCase();
      let h = hh || 0;
      if (suffix === "PM" && h < 12) h += 12;
      if (suffix === "AM" && h === 12) h = 0;
      return h * 60 + (mm || 0);
    }
    const [hh, mm] = t.split(":").map(Number);
    return (hh || 0) * 60 + (mm || 0);
  };

  const to12h = (t?: string | null) => {
    if (!t) return "";
    // Si ya viene con AM/PM, respétalo
    if (/am|pm/i.test(t)) return t;
    const [hh, mm] = t.split(":").map(Number);
    const h = hh ?? 0;
    const m = mm ?? 0;
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const mmStr = String(m).padStart(2, "0");
    const hhStr = String(h12).padStart(2, "0");
    return `${hhStr}:${mmStr} ${period}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Citas del Día -{" "}
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardTitle>
        <CardDescription>
          {citasDelDia.length} cita(s) confirmada(s) para hoy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {citasDelDia.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay citas confirmadas para hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {citasDelDia
              .sort(
                (a, b) =>
                  timeToMinutes(a.hora_cita) - timeToMinutes(b.hora_cita)
              )
              .map((cita) => (
                <div
                  key={cita.id_cita}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">
                          {to12h(cita.hora_cita)}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Confirmada
                        </Badge>
                        <Badge variant="outline">
                          {cita.numero_seguimiento}
                        </Badge>
                      </div>

                      <div className="space-y-1">
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
                          Tipo:{" "}
                          {cita.tipo_cita === "nueva" ? "Nueva" : "Control"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { CitaDetalle } from '../../types/cita';

interface CitasDelDiaProps {
  citas: CitaDetalle[];
}

export function CitasDelDia({ citas }: CitasDelDiaProps) {
  const hoy = new Date().toLocaleDateString("sv-SE"); // formato YYYY-MM-DD

  // Solo citas confirmadas del día
  const citasDelDia = citas.filter(
  (c) => c.fecha_cita === hoy && c.estado_cita === "confirmada" && c.hora_cita
   );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Citas del Día -{' '}
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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
              .sort((a, b) => (a.hora_cita ?? "").localeCompare(b.hora_cita ?? ""))
              .map((cita) => (
                <div
                  key={cita.id_cita}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">
                          {cita.hora_cita}
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
                          <span className="text-gray-600">Paciente:</span>{' '}
                          {cita.paciente_nombre}
                        </p>
                        <p>
                          <span className="text-gray-600">Médico:</span>{' '}
                          {cita.medico_nombre}
                        </p>
                        <p>
                          <span className="text-gray-600">Especialidad:</span>{' '}
                          {cita.especialidad}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tipo:{' '}
                          {cita.tipo_cita === 'nueva' ? 'Nueva' : 'Control'}
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

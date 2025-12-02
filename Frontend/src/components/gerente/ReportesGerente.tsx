import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CitaDetalle } from "../../types/cita";
import { Disponibilidad } from "../../types/disponibilidad";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  generarReporteHTML,
  imprimirReportePDF,
} from "../../utils/generarReportePDF";

interface ReportesGerenteProps {
  citas: CitaDetalle[];
  disponibilidad: Disponibilidad[];
}

export function ReportesGerente({
  citas,
  disponibilidad,
}: ReportesGerenteProps) {
  // Estadísticas generales
  const totalCitas = citas.length;
  const citasPendientes = citas.filter(
    (c) => c.estado_cita === "pendiente"
  ).length;
  const citasConfirmadas = citas.filter(
    (c) => c.estado_cita === "confirmada"
  ).length;
  const citasAtendidas = citas.filter(
    (c) => c.estado_cita === "atendida"
  ).length;
  const citasCanceladas = citas.filter(
    (c) => c.estado_cita === "cancelada"
  ).length;

  // Citas por médico
  // Agrupar citas por médico
  const citasPorMedico = Array.from(
    new Set(citas.map((c) => c.id_medico || c.medico_nombre))
  ).map((medicoId) => {
    const citasDelMedico = citas.filter(
      (c) => c.id_medico === medicoId || c.medico_nombre === medicoId
    );
    const nombreMedico = citasDelMedico[0]?.medico_nombre || String(medicoId);
    const especialidad = citasDelMedico[0]?.especialidad || "";

    return {
      medico: nombreMedico,
      especialidad: especialidad,
      total: citasDelMedico.length,
      atendidas: citasDelMedico.filter((c) => c.estado_cita === "atendida")
        .length,
      pendientes: citasDelMedico.filter((c) => c.estado_cita === "pendiente")
        .length,
    };
  });

  // Citas por tipo
  const citasNuevas = citas.filter((c) => c.tipo_cita === "nueva").length;
  const citasControl = citas.filter((c) => c.tipo_cita === "control").length;

  // Disponibilidad por médico
  const horasPorMedico = Array.from(
    new Set(disponibilidad.map((d) => d.id_medico))
  ).map((medicoId) => {
    const horariosDelMedico = disponibilidad.filter(
      (d) => d.id_medico === medicoId
    );
    const totalHoras = horariosDelMedico.reduce((acc, h) => {
      const inicio = parseInt(h.hora_inicio.split(":")[0]);
      const fin = parseInt(h.hora_fin.split(":")[0]);
      return acc + (fin - inicio);
    }, 0);

    return {
      medico: horariosDelMedico[0]?.nombre_medico || String(medicoId),
      especialidad: horariosDelMedico[0]?.especialidad || "",
      diasDisponibles: [...new Set(horariosDelMedico.map((h) => h.dia_semana))]
        .length,
      horasSemanales: totalHoras,
    };
  });

  const handleGenerarPDF = () => {
    const html = generarReporteHTML({
      citas,
      disponibilidad,
      citasPorMedico,
      horasPorMedico,
    });
    imprimirReportePDF(html);
  };

  return (
    <div className="space-y-6">
      {/* Botón Generar PDF */}
      <div className="flex justify-end">
        <Button onClick={handleGenerarPDF} className="gap-2">
          <FileText className="w-4 h-4" />
          Generar Reporte PDF
        </Button>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Citas</p>
                <p className="text-3xl mt-2">{totalCitas}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atendidas</p>
                <p className="text-3xl mt-2 text-green-600">{citasAtendidas}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl mt-2 text-yellow-600">
                  {citasPendientes}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes</p>
                <p className="text-3xl mt-2">
                  {
                    new Set(
                      citas.map((c) => c.id_paciente || c.paciente_nombre)
                    ).size
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Estados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Distribución de Citas por Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Confirmadas</span>
                <span className="text-sm font-medium">
                  {citasConfirmadas} (
                  {((citasConfirmadas / totalCitas) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(citasConfirmadas / totalCitas) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Pendientes</span>
                <span className="text-sm font-medium">
                  {citasPendientes} (
                  {((citasPendientes / totalCitas) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${(citasPendientes / totalCitas) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Atendidas</span>
                <span className="text-sm font-medium">
                  {citasAtendidas} (
                  {((citasAtendidas / totalCitas) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(citasAtendidas / totalCitas) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Canceladas</span>
                <span className="text-sm font-medium">
                  {citasCanceladas} (
                  {((citasCanceladas / totalCitas) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(citasCanceladas / totalCitas) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl text-blue-600">{citasNuevas}</p>
              <p className="text-sm text-gray-600">Citas Nuevas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-purple-600">{citasControl}</p>
              <p className="text-sm text-gray-600">Citas de Control</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rendimiento por Médico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Rendimiento por Médico
          </CardTitle>
          <CardDescription>
            Cantidad de citas por médico y especialidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="Grid Grid-colus-4 space-y-4">
            {citasPorMedico.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{item.medico}</p>
                    <p className="text-sm text-gray-500">{item.especialidad}</p>
                  </div>
                  <Badge variant="outline">{item.total} citas</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-blue-600">{item.atendidas}</p>
                    <p className="text-xs text-gray-600">Atendidas</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="text-yellow-600">{item.pendientes}</p>
                    <p className="text-xs text-gray-600">Pendientes</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-green-600">
                      {item.total > 0
                        ? ((item.atendidas / item.total) * 100).toFixed(0)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-gray-600">Completado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidad por Médico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Resumen de Disponibilidad
          </CardTitle>
          <CardDescription>Horas y días disponibles por médico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {horasPorMedico.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.medico}</p>
                  <p className="text-sm text-gray-500">{item.especialidad}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-lg text-blue-600">
                      {item.diasDisponibles}
                    </p>
                    <p className="text-xs text-gray-600">Días</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-purple-600">
                      {item.horasSemanales}h
                    </p>
                    <p className="text-xs text-gray-600">Semanales</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

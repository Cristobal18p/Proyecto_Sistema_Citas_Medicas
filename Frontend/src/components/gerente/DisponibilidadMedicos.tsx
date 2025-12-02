import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Disponibilidad,
  CrearDisponibilidad,
  DIAS_SEMANA,
  DIAS_SEMANA_LABELS,
  DiaSemana,
} from "../../types/disponibilidad";
import { Medico, Especialidad } from "../../types/medico";
import { getMedicos } from "../../services/medicos";
import { getEspecialidades } from "../../services/especialidad";
import { Clock, Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface DisponibilidadMedicosProps {
  disponibilidad: Disponibilidad[];
  onNuevaDisponibilidad: (disponibilidad: CrearDisponibilidad) => void;
  onEliminarDisponibilidad: (id: string) => void;
}

export function DisponibilidadMedicos({
  disponibilidad,
  onNuevaDisponibilidad,
  onEliminarDisponibilidad,
}: DisponibilidadMedicosProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState<string>("todas");
  const [especialidadFiltroSemanal, setEspecialidadFiltroSemanal] =
    useState<string>("todas");
  const [formData, setFormData] = useState({
    id_medico: "",
    dia_semana: "lunes" as DiaSemana,
    hora_inicio: "",
    hora_fin: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [medicosData, especialidadesData] = await Promise.all([
        getMedicos(),
        getEspecialidades(),
      ]);
      setMedicos(medicosData);
      setEspecialidades(especialidadesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar médicos y especialidades");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!formData.id_medico || !formData.hora_inicio || !formData.hora_fin) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    // Verificar si ya existe disponibilidad para ese médico en ese día
    const existeDisponibilidad = disponibilidad.find(
      (d) =>
        d.id_medico === formData.id_medico &&
        d.dia_semana === formData.dia_semana
    );

    if (existeDisponibilidad) {
      toast.error(
        `Ya existe disponibilidad configurada para ${
          DIAS_SEMANA_LABELS[formData.dia_semana]
        }`
      );
      return;
    }

    const nueva: CrearDisponibilidad = {
      id_medico: formData.id_medico,
      dia_semana: formData.dia_semana,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
    };

    onNuevaDisponibilidad(nueva);
    setDialogOpen(false);
    setFormData({
      id_medico: "",
      dia_semana: "lunes",
      hora_inicio: "",
      hora_fin: "",
    });
  };

  const eliminar = (id: string) => {
    onEliminarDisponibilidad(id);
  };

  // Helper para formatear hora a formato 12 horas
  const formatearHora = (hora: string): string => {
    // Si viene en formato HH:MM:SS, tomar solo HH:MM
    const tiempo = hora.substring(0, 5);
    const [horas, minutos] = tiempo.split(":");
    const h = parseInt(horas, 10);

    // Convertir a formato 12 horas
    const periodo = h >= 12 ? "PM" : "AM";
    const hora12 = h === 0 ? 12 : h > 12 ? h - 12 : h;

    return `${hora12}:${minutos} ${periodo}`;
  };

  // Filtrar médicos por especialidad para panel de configuración
  const medicosFiltrados =
    especialidadFiltro === "todas"
      ? medicos
      : medicos.filter(
          (m: Medico) => String(m.id_especialidad) === especialidadFiltro
        );

  // Filtrar médicos por especialidad para vista semanal
  const medicosFiltradosSemanal =
    especialidadFiltroSemanal === "todas"
      ? medicos
      : medicos.filter(
          (m: Medico) => String(m.id_especialidad) === especialidadFiltroSemanal
        );

  // Agrupar por médico (solo de la especialidad seleccionada)
  const disponibilidadPorMedico = medicosFiltrados.map((medico: Medico) => ({
    medico,
    horarios: disponibilidad.filter(
      (d: Disponibilidad) => String(d.id_medico) === String(medico.id_medico)
    ),
  }));

  return (
    <div className="grid gap-6">
      {/* Panel de Configuración - Izquierda */}
      <Card className="h-[800px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Gestión de Disponibilidad Médica
          </CardTitle>
          <CardDescription>
            Configure los horarios de atención de los médicos
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Especialidad:</Label>
              <Select
                value={especialidadFiltro}
                onValueChange={(value: string) => setEspecialidadFiltro(value)}
              >
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">
                    Todas las especialidades
                  </SelectItem>
                  {especialidades.map((esp) => (
                    <SelectItem
                      key={esp.id_especialidad}
                      value={String(esp.id_especialidad)}
                    >
                      {esp.nombre_especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Horario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Disponibilidad</DialogTitle>
                  <DialogDescription>
                    Configure el horario de atención del médico
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Médico */}
                  <div className="space-y-2">
                    <Label htmlFor="medico">Médico *</Label>
                    <Select
                      value={formData.id_medico}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, id_medico: value })
                      }
                      required
                    >
                      <SelectTrigger id="medico">
                        <SelectValue placeholder="Seleccione un médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicos.map((m) => (
                          <SelectItem
                            key={m.id_medico}
                            value={String(m.id_medico)}
                          >
                            {m.nombre_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Día de la semana */}
                  <div className="space-y-2">
                    <Label htmlFor="dia">Día de la Semana *</Label>
                    <Select
                      value={formData.dia_semana}
                      onValueChange={(value: DiaSemana) =>
                        setFormData({ ...formData, dia_semana: value })
                      }
                      required
                    >
                      <SelectTrigger id="dia">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAS_SEMANA.map((dia) => (
                          <SelectItem key={dia} value={dia}>
                            {DIAS_SEMANA_LABELS[dia]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inicio">Hora Inicio *</Label>
                      <Input
                        id="inicio"
                        type="time"
                        value={formData.hora_inicio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hora_inicio: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fin">Hora Fin *</Label>
                      <Input
                        id="fin"
                        type="time"
                        value={formData.hora_fin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hora_fin: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Guardar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardContent className="space-y-3 overflow-y-auto flex-1">
          {disponibilidadPorMedico.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Clock className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                No hay médicos en esta especialidad
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Seleccione otra especialidad para configurar horarios
              </p>
            </div>
          ) : (
            disponibilidadPorMedico.map(({ medico, horarios }) => (
              <div
                key={medico.id_medico}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="mb-2">
                  <h3 className="text-sm font-medium">
                    {medico.nombre_completo}
                  </h3>
                </div>

                {horarios.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No hay horarios configurados
                  </p>
                ) : (
                  <div className="space-y-1">
                    {DIAS_SEMANA.map((dia) => {
                      const horariosDelDia = horarios.filter(
                        (h) => h.dia_semana === dia
                      );
                      if (horariosDelDia.length === 0) return null;

                      return (
                        <div
                          key={dia}
                          className="flex items-center justify-between gap-2 p-1.5 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Badge
                              variant="outline"
                              className="min-w-20 text-xs font-semibold"
                            >
                              {DIAS_SEMANA_LABELS[dia]}
                            </Badge>
                            <div className="flex flex-wrap gap-2">
                              {horariosDelDia.map((h) => (
                                <span
                                  key={h.id_disponibilidad}
                                  className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded"
                                >
                                  {formatearHora(h.hora_inicio)} -{" "}
                                  {formatearHora(h.hora_fin)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {horariosDelDia.map((h) => (
                              <Button
                                key={h.id_disponibilidad}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => eliminar(h.id_disponibilidad)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Vista Semanal - Derecha */}
      <Card className="h-[800px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Vista Semanal de Disponibilidad
            </CardTitle>
            <Select
              value={especialidadFiltroSemanal}
              onValueChange={(value: string) =>
                setEspecialidadFiltroSemanal(value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las especialidades</SelectItem>
                {especialidades.map((esp) => (
                  <SelectItem
                    key={esp.id_especialidad}
                    value={String(esp.id_especialidad)}
                  >
                    {esp.nombre_especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto flex-1">
          {medicosFiltradosSemanal.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Calendar className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                No hay médicos en esta especialidad
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Seleccione otra especialidad para ver disponibilidad
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Médico</th>
                    {DIAS_SEMANA.map((dia) => (
                      <th
                        key={dia}
                        className="text-left p-2 font-medium text-sm"
                      >
                        {DIAS_SEMANA_LABELS[dia]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicosFiltradosSemanal.map((medico) => {
                    const horariosDelMedico = disponibilidad.filter(
                      (d) => String(d.id_medico) === String(medico.id_medico)
                    );

                    return (
                      <tr
                        key={medico.id_medico}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2">
                          <div>
                            <p className="text-sm font-medium">
                              {medico.nombre_completo}
                            </p>
                            <p className="text-xs text-gray-500">
                              {medico.especialidad_nombre}
                            </p>
                          </div>
                        </td>
                        {DIAS_SEMANA.map((dia) => {
                          const horariosDelDia = horariosDelMedico.filter(
                            (h) => h.dia_semana === dia
                          );

                          return (
                            <td key={dia} className="p-2">
                              {horariosDelDia.length > 0 ? (
                                <div className="space-y-1">
                                  {horariosDelDia.map((h) => (
                                    <div
                                      key={h.id_disponibilidad}
                                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium whitespace-nowrap"
                                    >
                                      {formatearHora(h.hora_inicio)} -{" "}
                                      {formatearHora(h.hora_fin)}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

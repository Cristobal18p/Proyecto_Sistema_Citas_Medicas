import { useState } from "react";
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
  DisponibilidadMedico,
  mockMedicos,
  mockEspecialidades,
} from "../../lib/mockData";
import { Clock, Plus, Trash2, Calendar, Edit } from "lucide-react";
import { toast } from "sonner";

interface DisponibilidadMedicosProps {
  disponibilidad: DisponibilidadMedico[];
  onNuevaDisponibilidad: (disponibilidad: DisponibilidadMedico) => void;
  onEliminarDisponibilidad: (id: string) => void;
}

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export function DisponibilidadMedicos({
  disponibilidad,
  onNuevaDisponibilidad,
  onEliminarDisponibilidad,
}: DisponibilidadMedicosProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [especialidadFiltro, setEspecialidadFiltro] = useState<string>(
    mockEspecialidades[0]?.id_especialidad || "todas"
  );
  const [especialidadFiltroSemanal, setEspecialidadFiltroSemanal] =
    useState<string>(mockEspecialidades[0]?.id_especialidad || "todas");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id_especialidad: "",
    id_medico: "",
    dia_semana: "Lunes" as (typeof diasSemana)[number],
    hora_inicio: "",
    hora_fin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const medico = mockMedicos.find((m) => m.id_medico === formData.id_medico);
    if (!medico) return;

    // Verificar si ya existe disponibilidad para ese médico en ese día
    const existeDisponibilidad = disponibilidad.find(
      (d) =>
        d.id_medico === formData.id_medico &&
        d.dia_semana === formData.dia_semana &&
        (!editMode || d.id_disponibilidad !== editingId)
    );

    if (existeDisponibilidad) {
      toast.error(
        `Ya existe disponibilidad configurada para ${formData.dia_semana}. Por favor, edite el horario existente.`
      );
      return;
    }

    if (editMode && editingId) {
      // Modo edición: eliminar el anterior y agregar el nuevo
      onEliminarDisponibilidad(editingId);
    }

    const nueva: DisponibilidadMedico = {
      id_disponibilidad:
        editMode && editingId ? editingId : `disp_${Date.now()}`,
      id_medico: formData.id_medico,
      dia_semana: formData.dia_semana,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
    };

    onNuevaDisponibilidad(nueva);
    toast.success(
      editMode
        ? "Disponibilidad actualizada exitosamente"
        : "Disponibilidad agregada exitosamente"
    );
    setDialogOpen(false);
    setEditMode(false);
    setEditingId(null);
    setFormData({
      id_especialidad: "",
      id_medico: "",
      dia_semana: "Lunes",
      hora_inicio: "",
      hora_fin: "",
    });
  };

  const eliminar = (id: string) => {
    onEliminarDisponibilidad(id);
    toast.info("Disponibilidad eliminada");
  };

  const editar = (disp: DisponibilidadMedico) => {
    const medico = mockMedicos.find((m) => m.id_medico === disp.id_medico);
    setFormData({
      id_especialidad: medico?.id_especialidad || "",
      id_medico: disp.id_medico,
      dia_semana: disp.dia_semana,
      hora_inicio: disp.hora_inicio,
      hora_fin: disp.hora_fin,
    });
    setEditMode(true);
    setEditingId(disp.id_disponibilidad);
    setDialogOpen(true);
  };

  // Filtrar médicos por especialidad para panel de configuración
  const medicosFiltrados =
    especialidadFiltro === "todas"
      ? mockMedicos
      : mockMedicos.filter((m) => m.id_especialidad === especialidadFiltro);

  // Filtrar médicos por especialidad para vista semanal
  const medicosFiltradosSemanal =
    especialidadFiltroSemanal === "todas"
      ? mockMedicos
      : mockMedicos.filter(
          (m) => m.id_especialidad === especialidadFiltroSemanal
        );

  // Agrupar por médico (solo de la especialidad seleccionada)
  const disponibilidadPorMedico = medicosFiltrados.map((medico) => ({
    medico,
    horarios: disponibilidad.filter((d) => d.id_medico === medico.id_medico),
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
                  {mockEspecialidades.map((esp) => (
                    <SelectItem
                      key={esp.id_especialidad}
                      value={esp.id_especialidad}
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
                  <DialogTitle>
                    {editMode ? "Editar" : "Agregar"} Disponibilidad
                  </DialogTitle>
                  <DialogDescription>
                    {editMode ? "Modifique" : "Configure"} el horario de
                    atención del médico
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Especialidad */}
                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad *</Label>
                    <Select
                      value={formData.id_especialidad}
                      onValueChange={(value: string) => {
                        setFormData({
                          ...formData,
                          id_especialidad: value,
                          id_medico: "",
                        });
                      }}
                      required
                    >
                      <SelectTrigger id="especialidad">
                        <SelectValue placeholder="Seleccione especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockEspecialidades.map((esp) => (
                          <SelectItem
                            key={esp.id_especialidad}
                            value={esp.id_especialidad}
                          >
                            {esp.nombre_especialidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medico">Médico *</Label>
                    <Select
                      value={formData.id_medico}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, id_medico: value })
                      }
                      required
                      disabled={editMode || !formData.id_especialidad}
                    >
                      <SelectTrigger id="medico">
                        <SelectValue placeholder="Seleccione un médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockMedicos
                          .filter(
                            (m) =>
                              !formData.id_especialidad ||
                              m.id_especialidad === formData.id_especialidad
                          )
                          .map((m) => (
                            <SelectItem key={m.id_medico} value={m.id_medico}>
                              {m.nombre_completo}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dia">Día de la Semana *</Label>
                    <Select
                      value={formData.dia_semana}
                      onValueChange={(value: (typeof diasSemana)[number]) =>
                        setFormData({ ...formData, dia_semana: value })
                      }
                      disabled={editMode}
                    >
                      <SelectTrigger id="dia">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map((dia) => (
                          <SelectItem key={dia} value={dia}>
                            {dia}
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
                      onClick={() => {
                        setDialogOpen(false);
                        setEditMode(false);
                        setEditingId(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editMode ? "Actualizar" : "Guardar"}
                    </Button>
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
                    {diasSemana.map((dia) => {
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
                              className="min-w-20 text-xs"
                            >
                              {dia}
                            </Badge>
                            <div className="flex flex-wrap gap-2">
                              {horariosDelDia.map((h) => (
                                <span
                                  key={h.id_disponibilidad}
                                  className="text-sm"
                                >
                                  {h.hora_inicio} - {h.hora_fin}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {horariosDelDia.map((h) => (
                              <div
                                key={h.id_disponibilidad}
                                className="flex gap-1"
                              >
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => editar(h)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => eliminar(h.id_disponibilidad)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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
                {mockEspecialidades.map((esp) => (
                  <SelectItem
                    key={esp.id_especialidad}
                    value={esp.id_especialidad}
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
                    {diasSemana.map((dia) => (
                      <th
                        key={dia}
                        className="text-left p-2 font-medium text-sm"
                      >
                        {dia}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medicosFiltradosSemanal.map((medico) => {
                    const horariosDelMedico = disponibilidad.filter(
                      (d) => d.id_medico === medico.id_medico
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
                        {diasSemana.map((dia) => {
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
                                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                                    >
                                      {h.hora_inicio}-{h.hora_fin}
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

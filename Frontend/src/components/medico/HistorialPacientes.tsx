import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CitaDetalle, HistorialConsulta } from "../../types/cita";
import { Edit, FileText, Plus, ClipboardList, Inbox } from "lucide-react";
import { toast } from "sonner";
import { crearHistorial, actualizarHistorial } from "../../services/historial";

interface HistorialPacientesProps {
  citas: CitaDetalle[];
  historial: HistorialConsulta[];
  onNuevoHistorial: (historial: HistorialConsulta) => void;
  onActualizarHistorial: (historial: HistorialConsulta) => void;
}

export function HistorialPacientes({
  citas,
  historial,
  onNuevoHistorial,
  onActualizarHistorial,
}: HistorialPacientesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDetalle | null>(
    null
  );
  const [formData, setFormData] = useState({
    sintomas: "",
    diagnostico: "",
    tratamiento: "",
  });
  const [editando, setEditando] = useState(false);
  const [historialEditando, setHistorialEditando] =
    useState<HistorialConsulta | null>(null);

  const hoy = new Date().toISOString().split("T")[0];
  const citasAtendidas = citas.filter((c) => c.estado_cita === "atendida");

  // Mostrar botón solo si la cita fue atendida hoy o ya tiene historial
  const puedeGestionarHistorial = (
    cita: CitaDetalle,
    tieneHistorial: boolean
  ) => {
    return tieneHistorial || cita.fecha_cita === hoy;
  };

  const abrirDialogo = (cita: CitaDetalle) => {
    setCitaSeleccionada(cita);
    const existente = historial.find((h) => h.id_cita === cita.id_cita) || null;
    if (existente) {
      setEditando(true);
      setHistorialEditando(existente);
      setFormData({
        sintomas: existente.sintomas,
        diagnostico: existente.diagnostico,
        tratamiento: existente.tratamiento,
      });
    } else {
      setEditando(false);
      setHistorialEditando(null);
      setFormData({ sintomas: "", diagnostico: "", tratamiento: "" });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citaSeleccionada) return;
    try {
      if (editando && historialEditando?.id_consulta) {
        const actualizado = await actualizarHistorial(
          historialEditando.id_consulta,
          {
            sintomas: formData.sintomas,
            diagnostico: formData.diagnostico,
            tratamiento: formData.tratamiento,
          }
        );
        onActualizarHistorial(actualizado);
        toast.success("Historial actualizado exitosamente");
      } else {
        const creado = await crearHistorial({
          id_cita: citaSeleccionada.id_cita,
          sintomas: formData.sintomas,
          diagnostico: formData.diagnostico,
          tratamiento: formData.tratamiento,
        });
        onNuevoHistorial(creado);
        toast.success("Historial creado exitosamente");
      }
      setDialogOpen(false);
      setFormData({ sintomas: "", diagnostico: "", tratamiento: "" });
    } catch (error) {
      console.error("Error en historial:", error);
      toast.error("No se pudo guardar el historial");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" /> Historial de Pacientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {citasAtendidas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg bg-gray-50">
            <Inbox className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              Sin citas atendidas
            </h3>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              Cuando haya citas marcadas como atendidas hoy, podrás registrar o
              editar su historial clínico aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {citasAtendidas.map((cita) => {
              const tieneHistorial = historial.some(
                (h) => h.id_cita === cita.id_cita
              );
              return (
                <div key={cita.id_cita} className="p-4 border rounded-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Atendida
                        </Badge>
                        {tieneHistorial && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <FileText className="w-3 h-3 mr-1" /> Con Historial
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{cita.paciente_nombre}</p>
                        <p className="text-sm text-gray-600">
                          Fecha:{" "}
                          {cita.fecha_cita?.split("-").reverse().join("/")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cita.numero_seguimiento} |{" "}
                          {cita.tipo_cita === "nueva" ? "Nueva" : "Control"}
                        </p>
                      </div>
                    </div>

                    {puedeGestionarHistorial(cita, tieneHistorial) && (
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant={tieneHistorial ? "outline" : "default"}
                            className="gap-2"
                            onClick={() => abrirDialogo(cita)}
                          >
                            {tieneHistorial ? (
                              <>
                                <Edit className="w-4 h-4" /> Editar Historial
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" /> Registrar Historial
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editando ? "Editar" : "Registrar"} Historial de
                              Consulta
                            </DialogTitle>
                            <DialogDescription>
                              Paciente: {citaSeleccionada?.paciente_nombre} |{" "}
                              {citaSeleccionada?.numero_seguimiento}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="sintomas">Síntomas</Label>
                              <Textarea
                                id="sintomas"
                                placeholder="Describa los síntomas del paciente..."
                                value={formData.sintomas}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    sintomas: e.target.value,
                                  })
                                }
                                rows={3}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="diagnostico">Diagnóstico</Label>
                              <Textarea
                                id="diagnostico"
                                placeholder="Ingrese el diagnóstico..."
                                value={formData.diagnostico}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    diagnostico: e.target.value,
                                  })
                                }
                                rows={3}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tratamiento">Tratamiento</Label>
                              <Textarea
                                id="tratamiento"
                                placeholder="Indique el tratamiento recomendado..."
                                value={formData.tratamiento}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    tratamiento: e.target.value,
                                  })
                                }
                                rows={3}
                                required
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit">
                                {editando ? "Actualizar" : "Guardar"} Historial
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Cita, HistorialConsulta } from '../../lib/mockData';
import { ClipboardList, Edit, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface HistorialPacientesProps {
  citas: Cita[];
  historial: HistorialConsulta[];
  onNuevoHistorial: (historial: HistorialConsulta) => void;
  onActualizarHistorial: (historial: HistorialConsulta) => void;
}

export function HistorialPacientes({ 
  citas, 
  historial, 
  onNuevoHistorial,
  onActualizarHistorial 
}: HistorialPacientesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [formData, setFormData] = useState({
    sintomas: '',
    diagnostico: '',
    tratamiento: ''
  });
  const [editando, setEditando] = useState(false);
  const [historialEditando, setHistorialEditando] = useState<HistorialConsulta | null>(null);

  const citasAtendidas = citas.filter(c => c.estado === 'atendido');

  const abrirDialogo = (cita: Cita) => {
    setCitaSeleccionada(cita);
    const historialExistente = historial.find(h => h.id_cita === cita.id_cita);
    
    if (historialExistente) {
      setEditando(true);
      setHistorialEditando(historialExistente);
      setFormData({
        sintomas: historialExistente.sintomas,
        diagnostico: historialExistente.diagnostico,
        tratamiento: historialExistente.tratamiento
      });
    } else {
      setEditando(false);
      setHistorialEditando(null);
      setFormData({
        sintomas: '',
        diagnostico: '',
        tratamiento: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!citaSeleccionada) return;

    if (editando && historialEditando) {
      const historialActualizado: HistorialConsulta = {
        ...historialEditando,
        sintomas: formData.sintomas,
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento
      };
      onActualizarHistorial(historialActualizado);
      toast.success('Historial actualizado exitosamente');
    } else {
      const nuevoHistorial: HistorialConsulta = {
        id_consulta: `cons_${Date.now()}`,
        id_cita: citaSeleccionada.id_cita,
        sintomas: formData.sintomas,
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento
      };
      onNuevoHistorial(nuevoHistorial);
      toast.success('Historial creado exitosamente');
    }

    setDialogOpen(false);
    setFormData({ sintomas: '', diagnostico: '', tratamiento: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Historial de Consultas
        </CardTitle>
        <CardDescription>
          Registre y actualice el historial médico de sus pacientes atendidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {citasAtendidas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay pacientes atendidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {citasAtendidas
              .sort((a, b) => new Date(b.fecha_cita).getTime() - new Date(a.fecha_cita).getTime())
              .map((cita) => {
                const tieneHistorial = historial.some(h => h.id_cita === cita.id_cita);
                
                return (
                  <div
                    key={cita.id_cita}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Atendido
                          </Badge>
                          {tieneHistorial && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <FileText className="w-3 h-3 mr-1" />
                              Con Historial
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-medium">{cita.paciente_nombre}</p>
                          <p className="text-sm text-gray-600">
                            Fecha: {" "}
                        {cita.fecha_cita.split("-").reverse().join("/")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {cita.numero_seguimiento} | {cita.tipo_cita === 'nueva' ? 'Nueva' : 'Control'}
                          </p>
                        </div>
                      </div>

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
                                <Edit className="w-4 h-4" />
                                Editar Historial
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Agregar Historial
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editando ? 'Editar' : 'Registrar'} Historial de Consulta
                            </DialogTitle>
                            <DialogDescription>
                              Paciente: {citaSeleccionada?.paciente_nombre} | {citaSeleccionada?.numero_seguimiento}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="sintomas">Síntomas</Label>
                              <Textarea
                                id="sintomas"
                                placeholder="Describa los síntomas del paciente..."
                                value={formData.sintomas}
                                onChange={(e) => setFormData({ ...formData, sintomas: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
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
                                {editando ? 'Actualizar' : 'Guardar'} Historial
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
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

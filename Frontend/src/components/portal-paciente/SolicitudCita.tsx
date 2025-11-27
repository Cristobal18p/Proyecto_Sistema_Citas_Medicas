import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CheckCircle, Calendar } from "lucide-react";
import { Paciente } from "../../types/paciente";
import { Especialidad, Medico } from "../../types/medico";
import { getEspecialidades, getMedicos } from "../../services/medicos";

interface SolicitudCitaProps {
  paciente: Paciente;
  onSolicitar: (data: SolicitudCitaData) => void;
  onCancelar: () => void;
}

export interface SolicitudCitaData {
  especialidadSeleccionada: string;
  medicoSeleccionado: string;
  tipoCita: "nueva" | "control";
  preferenciaTurno: "AM" | "PM";
}

export function SolicitudCita({
  paciente,
  onSolicitar,
  onCancelar,
}: SolicitudCitaProps) {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [tipoCita, setTipoCita] = useState<"nueva" | "control">("nueva");
  const [medicoSeleccionado, setMedicoSeleccionado] = useState("");
  const [preferenciaTurno, setPreferenciaTurno] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    getEspecialidades().then(setEspecialidades).catch(console.error);
    getMedicos().then(setMedicos).catch(console.error);
  }, []);

  const medicosDisponibles = especialidadSeleccionada
    ? medicos.filter((m) => m.id_especialidad === especialidadSeleccionada)
    : [];

  const handleSolicitar = () => {
    if (!especialidadSeleccionada || !medicoSeleccionado) return;
    onSolicitar({
      especialidadSeleccionada,
      medicoSeleccionado,
      tipoCita,
      preferenciaTurno,
    });
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Información del Paciente */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Paciente</p>
              <p className="text-sm text-gray-600">
                {paciente.nombre} {paciente.apellido} - Cédula:{" "}
                {paciente.cedula}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Solicitud */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Solicitar Nueva Cita
          </CardTitle>
          <CardDescription>
            Complete la información para solicitar su cita médica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Especialidad */}
            <div className="space-y-2">
              <Label htmlFor="especialidad">Especialidad *</Label>
              <Select
                value={especialidadSeleccionada}
                onValueChange={(value: string) => {
                  setEspecialidadSeleccionada(value);
                  setMedicoSeleccionado("");
                }}
              >
                <SelectTrigger id="especialidad">
                  <SelectValue placeholder="Seleccione una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
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

            {/* Médico */}
            <div className="space-y-2">
              <Label htmlFor="medico">Médico *</Label>
              <Select
                value={medicoSeleccionado}
                onValueChange={setMedicoSeleccionado}
                disabled={!especialidadSeleccionada}
              >
                <SelectTrigger id="medico">
                  <SelectValue
                    placeholder={
                      especialidadSeleccionada
                        ? "Seleccione un médico"
                        : "Primero seleccione una especialidad"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {medicosDisponibles.length === 0 &&
                  especialidadSeleccionada ? (
                    <div className="p-2 text-sm text-gray-500">
                      No hay médicos disponibles para esta especialidad
                    </div>
                  ) : (
                    medicosDisponibles.map((medico) => (
                      <SelectItem
                        key={medico.id_medico}
                        value={medico.id_medico}
                      >
                        {"Dr/a. " + medico.nombre_completo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Cita */}
              <div className="space-y-2">
                <Label htmlFor="tipoCita">Tipo de Cita *</Label>
                <Select
                  value={tipoCita}
                  onValueChange={(value: "nueva" | "control") =>
                    setTipoCita(value)
                  }
                >
                  <SelectTrigger id="tipoCita">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nueva">
                      <span className="text-sm">Nuevo</span>
                    </SelectItem>
                    <SelectItem value="control">
                      <span className="text-sm">Control</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preferencia de Turno */}
              <div className="space-y-2">
                <Label htmlFor="turno">Preferencia de Turno *</Label>
                <Select
                  value={preferenciaTurno}
                  onValueChange={(value: "AM" | "PM") =>
                    setPreferenciaTurno(value)
                  }
                >
                  <SelectTrigger id="turno">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">
                      <span>Mañana</span>
                    </SelectItem>
                    <SelectItem value="PM">
                      <span>Tarde</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onCancelar} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleSolicitar}
                className="flex-1"
                disabled={!especialidadSeleccionada}
              >
                Solicitar Cita
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

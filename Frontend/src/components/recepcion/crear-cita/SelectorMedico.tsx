import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Medico } from "../../../types/medico";

interface SelectorMedicoProps {
  medicos: Medico[];
  value: string;
  onChange: (value: string) => void;
  especialidadId: string;
}

export function SelectorMedico({
  medicos,
  value,
  onChange,
  especialidadId,
}: SelectorMedicoProps) {
  const medicosFiltrados = medicos.filter(
    (m) => String(m.id_especialidad) === String(especialidadId)
  );

  /*const medicoSeleccionado = medicosFiltrados.find(
    (m) => m.id_medico === value
  );*/

  return (
    <div className="space-y-2">
      <Label htmlFor="medico">Médico *</Label>
      <Select value={value} onValueChange={onChange} disabled={!especialidadId}>
        <SelectTrigger id="medico">
          <SelectValue
            placeholder="Seleccione un médico"
            //children={medicoSeleccionado?.nombre_completo}
          />
        </SelectTrigger>
        <SelectContent>
          {medicosFiltrados.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No hay médicos disponibles para esta especialidad
            </div>
          ) : (
            medicosFiltrados.map((m) => (
              <SelectItem key={m.id_medico} value={String(m.id_medico)}>
                {"Dr/a " + m.nombre_completo}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

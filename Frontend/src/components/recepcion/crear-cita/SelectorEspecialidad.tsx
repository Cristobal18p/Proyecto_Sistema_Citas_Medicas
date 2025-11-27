import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Especialidad } from "../../../types/medico";

interface SelectorEspecialidadProps {
  especialidades: Especialidad[];
  value: string;
  onChange: (value: string) => void;
}

export function SelectorEspecialidad({
  especialidades,
  value,
  onChange,
}: SelectorEspecialidadProps) {

  /*const especialidadSeleccionada = especialidades.find(
    (e) => e.id_especialidad === value
  );*/

  return (
    <div className="space-y-2">
      <Label htmlFor="especialidad">Especialidad *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="especialidad">
          <SelectValue
            placeholder="Seleccione especialidad"
            // children={especialidadSeleccionada?.nombre_especialidad}
          />
        </SelectTrigger>
        <SelectContent>
          {especialidades
            .filter((e) => e.id_especialidad && e.nombre_especialidad)
            .map((e) => (
              <SelectItem
                key={e.id_especialidad}
                value={String(e.id_especialidad)}
              >
                {e.nombre_especialidad}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

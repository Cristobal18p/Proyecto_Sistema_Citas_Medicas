import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Clock, AlertCircle } from "lucide-react";

interface SelectorHoraProps {
  value: string;
  onChange: (value: string) => void;
  horasDisponibles: string[];
  fechaSeleccionada: Date | undefined;
}

export function SelectorHora({
  value,
  onChange,
  horasDisponibles,
  fechaSeleccionada,
}: SelectorHoraProps) {
  const formatHora12 = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    const periodo = h < 12 ? "AM" : "PM";
    const hora12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hora12}:${m.toString().padStart(2, "0")} ${periodo}`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="hora">Hora de la Cita *</Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={!fechaSeleccionada || horasDisponibles.length === 0}
      >
        <SelectTrigger id="hora">
          <SelectValue
            placeholder={
              !fechaSeleccionada
                ? "Primero seleccione una fecha"
                : horasDisponibles.length === 0
                ? "No hay horas disponibles"
                : "Seleccione una hora"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {horasDisponibles.map((hora) => (
            <SelectItem key={hora} value={hora}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatHora12(hora)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fechaSeleccionada && horasDisponibles.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {horasDisponibles.length} hora
          {horasDisponibles.length > 1 ? "s" : ""} disponible
          {horasDisponibles.length > 1 ? "s" : ""}
        </p>
      )}
      {fechaSeleccionada && horasDisponibles.length === 0 && (
        <p className="text-sm text-orange-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          No hay horas disponibles para esta fecha
        </p>
      )}
    </div>
  );
}

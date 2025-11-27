import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../ui/utils";
import { DisponibilidadMedico } from "../../../types/medico";

interface SelectorFechaProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  medicoId: string;
  disponibilidad: DisponibilidadMedico[];
}

export function SelectorFecha({
  value,
  onChange,
  medicoId,
  disponibilidad,
}: SelectorFechaProps) {
  const getDiaSemana = (fecha: Date): DisponibilidadMedico["dia_semana"] => {
    
    const dias: DisponibilidadMedico["dia_semana"][] = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return dias[fecha.getDay()];
  };

  const fechaTieneDisponibilidad = (fecha: Date): boolean => {
    if (!medicoId) return false;
    const diaSemana = getDiaSemana(fecha);
    return disponibilidad.some((d) => d.dia_semana === diaSemana);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fecha">Fecha de la Cita *</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={!medicoId}
          >
            <CalendarIcon className="mr-1 h-2 w-2" />
            {value ? (
              format(value, "PPP", { locale: es })
            ) : (
              <span>Seleccione una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today) return true;
              return !fechaTieneDisponibilidad(date);
            }}
            locale={es}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {medicoId && !value && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Seleccione una fecha con disponibilidad
        </p>
      )}
    </div>
  );
}

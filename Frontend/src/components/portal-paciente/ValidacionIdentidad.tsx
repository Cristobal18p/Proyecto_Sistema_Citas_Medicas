import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { validarPaciente } from "../../services/pacientes";

interface ValidacionIdentidadProps {
  onValidacionExitosa: (cedula: string, fecha_nacimiento: string) => void;
}

export function ValidacionIdentidad({
  onValidacionExitosa,
}: ValidacionIdentidadProps) {
  const [cedula, setCedula] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  const handleValidacion = async () => {
    setErrorValidacion("");

    if (!cedula || !dia || !mes || !anio) {
      setErrorValidacion("Por favor complete todos los campos");
      return;
    }

    const fecha_nacimiento = `${anio}-${mes}-${dia}`; // formato YYYY-MM-DD

    try {
      const respuesta = await validarPaciente({ cedula, fecha_nacimiento });
      if (respuesta.existe) {
        // Paciente encontrado → notificar al padre
        onValidacionExitosa(cedula, fecha_nacimiento);
      } else {
        setErrorValidacion("Paciente no encontrado");
      }
    } catch (err) {
      setErrorValidacion("Error al validar paciente");
    }
  };
  return (
    <div className="space-y-4 mt-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Validación de Identidad
        </h3>
        <p className="text-sm text-gray-600">
          Ingrese sus datos para solicitar una cita
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="cedula">Cédula de Identidad</Label>
          <Input
            className="mt-2"
            id="cedula"
            placeholder="10-1112-1243"
            value={cedula}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9-]*$/.test(value)) {
                setCedula(value);
              }
            }}
          />
        </div>

        <div>
          <Label>Fecha de Nacimiento</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Select value={dia} onValueChange={setDia}>
              <SelectTrigger>
                <SelectValue placeholder="Día" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <SelectItem key={d} value={String(d).padStart(2, "0")}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger>
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">Enero</SelectItem>
                <SelectItem value="02">Febrero</SelectItem>
                <SelectItem value="03">Marzo</SelectItem>
                <SelectItem value="04">Abril</SelectItem>
                <SelectItem value="05">Mayo</SelectItem>
                <SelectItem value="06">Junio</SelectItem>
                <SelectItem value="07">Julio</SelectItem>
                <SelectItem value="08">Agosto</SelectItem>
                <SelectItem value="09">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger>
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i
                ).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {errorValidacion && (
          <Alert variant="destructive">
            <AlertDescription>{errorValidacion}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleValidacion} className="w-full">
          Validar y Continuar
        </Button>
      </div>
    </div>
  );
}

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckCircle } from "lucide-react";

interface ConfirmacionCitaProps {
  numeroSeguimiento: string;
  onAceptar: () => void;
}

export function ConfirmacionCita({
  numeroSeguimiento,
  onAceptar,
}: ConfirmacionCitaProps) {
  return (
    <div className="space-y-4 text-center mt-2">
      <div className="flex justify-center">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <div>
        <h3 className="mb-1 font-bold text-base" style={{ color: "#166534" }}>
          ¡Cita Solicitada Exitosamente!
        </h3>
        <p className="text-sm text-gray-600">Su solicitud ha sido registrada</p>
      </div>

      <Card
        className="border-2"
        style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Número de Seguimiento</CardTitle>
          <CardDescription className="text-sm">
            Guarde este número para consultar el estado de su cita
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
            {numeroSeguimiento}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onAceptar} className="flex-1">
          Aceptar
        </Button>
      </div>
    </div>
  );
}

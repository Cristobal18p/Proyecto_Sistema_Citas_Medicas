import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { UserPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { crearPaciente } from "../../services/pacientes";
import { CreatePaciente, Paciente } from "../../types/paciente";

interface RegistrarPacienteFormProps {
  onNuevoPaciente: (paciente: Paciente) => void;
}

export function RegistrarPacienteForm({
  onNuevoPaciente,
}: RegistrarPacienteFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fecha_nacimiento: "",
    telefono: "",
    email: "",
  });
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pacienteRegistrado, setPacienteRegistrado] = useState<Paciente | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paciente: CreatePaciente = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      cedula: formData.cedula,
      fecha_nacimiento: formData.fecha_nacimiento,
      telefono: formData.telefono,
      email: formData.email,
    };

    try {
      const nuevoPaciente: Paciente = await crearPaciente(paciente);
      onNuevoPaciente(nuevoPaciente);

      // Guardar datos para el diálogo de confirmación
      setPacienteRegistrado(nuevoPaciente);
      setMostrarConfirmacion(true);

      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "",
        telefono: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message || "No se pudo registrar el paciente");
      } else {
        toast.error("No se pudo registrar el paciente");
      }
    }

    // Reset form
    setFormData({
      nombre: "",
      apellido: "",
      cedula: "",
      fecha_nacimiento: "",
      telefono: "",
      email: "",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Registrar Nuevo Paciente
          </CardTitle>
          <CardDescription>
            Complete el formulario para registrar un nuevo paciente en el
            sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Ingrese el apellido"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  required
                />
              </div>

              {/* Cédula */}
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Ingrese la cédula"
                  value={formData.cedula}
                  onChange={(e) =>
                    setFormData({ ...formData, cedula: e.target.value })
                  }
                  required
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_nacimiento: e.target.value,
                    })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Ingrese el teléfono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Registrar Paciente
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog
        open={mostrarConfirmacion}
        onOpenChange={setMostrarConfirmacion}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              ¡Paciente Registrado Exitosamente!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-4">
              {pacienteRegistrado && (
                <div className="space-y-2 text-sm">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Nombre completo:
                      </span>
                      <span className="text-gray-900">
                        {pacienteRegistrado.nombre}{" "}
                        {pacienteRegistrado.apellido}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Cédula:</span>
                      <span className="text-gray-900">
                        {pacienteRegistrado.cedula}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Fecha de nacimiento:
                      </span>
                      <span className="text-gray-900">
                        {new Date(
                          pacienteRegistrado.fecha_nacimiento
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {pacienteRegistrado.telefono && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Teléfono:
                        </span>
                        <span className="text-gray-900">
                          {pacienteRegistrado.telefono}
                        </span>
                      </div>
                    )}
                    {pacienteRegistrado.email && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {pacienteRegistrado.email}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Estado:</span>
                      <span className="text-gray-900 capitalize">
                        {pacienteRegistrado.estado}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setMostrarConfirmacion(false)}
              className="w-full"
            >
              Aceptar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

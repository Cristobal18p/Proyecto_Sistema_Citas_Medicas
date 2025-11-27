import { useState } from "react";
import { Usuario } from "../types/login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { LogOut, Users, UserCog } from "lucide-react";
import { GestionUsuarios } from "./administrador/GestionUsuarios";
import { mockUsuarios, mockMedicos, Medico } from "../lib/mockData";

interface AdministradorDashboardProps {
  user: Usuario;
  onLogout: () => void;
}

export function AdministradorDashboard({
  user,
  onLogout,
}: AdministradorDashboardProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [medicos, setMedicos] = useState<Medico[]>(mockMedicos);

  const handleNuevoUsuario = (nuevoUsuario: Usuario) => {
    setUsuarios([...usuarios, nuevoUsuario]);
  };

  const handleActualizarUsuario = (usuarioActualizado: Usuario) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id_usuario === usuarioActualizado.id_usuario ? usuarioActualizado : u
      )
    );
  };

  const handleNuevoMedico = (nuevoMedico: Medico) => {
    setMedicos([...medicos, nuevoMedico]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-clinica.svg"
                alt="Logo Clínica"
                className="h-10 w-auto"
              />
              <div className="border-l border-blue-300 pl-3">
                <h1 className="text-xl font-bold text-blue-900">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600">
                  {user.nombre_completo}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid grid-cols-1 w-full max-w-md">
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gestión de Usuarios y Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <GestionUsuarios
              usuarios={usuarios}
              medicos={medicos}
              onNuevoUsuario={handleNuevoUsuario}
              onActualizarUsuario={handleActualizarUsuario}
              onNuevoMedico={handleNuevoMedico}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

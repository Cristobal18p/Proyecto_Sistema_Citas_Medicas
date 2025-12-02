import { useEffect, useState } from "react";
import { Login } from "../types/login";
import { Usuario, CrearUsuario, ActualizarUsuario } from "../types/usuario";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { LogOut, Users, UserCog } from "lucide-react";
import { GestionUsuarios } from "./administrador/GestionUsuarios";
import { Medico, MedicoDetalle } from "../types/medico";
import {
  getMedicosDetalle,
  createMedico,
  updateMedico,
} from "../services/medicos";
import {
  getUsuarios,
  createUsuario as apiCreateUsuario,
  updateUsuario as apiUpdateUsuario,
} from "../services/usuario";

interface AdministradorDashboardProps {
  user: Login;
  onLogout: () => void;
}

export function AdministradorDashboard({
  user,
  onLogout,
}: AdministradorDashboardProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataUsuarios = await getUsuarios();

        const normalizados: Usuario[] = (dataUsuarios as any[]).map(
          (u, idx) => {
            const nombreCompleto: string = u.nombre_completo ?? "";
            const partes = nombreCompleto.split(" ");
            const nombre = u.nombre ?? partes[0] ?? "";
            const apellido =
              u.apellido ??
              (partes.length > 1 ? partes.slice(1).join(" ") : "");

            return {
              id_usuario: String(u.id_usuario ?? idx + 1),
              id_medico: u.id_medico ?? "",
              nombre_usuario: u.nombre_usuario,
              nombre,
              apellido,
              nombre_completo: nombreCompleto || `${nombre} ${apellido}`.trim(),
              rol: u.rol,
              estado: u.estado,
            } as Usuario;
          }
        );

        setUsuarios(normalizados);

        // Cargar médicos (detalle) desde la API para poder rellenar el formulario al editar
        const dataMedicos = await getMedicosDetalle();

        const medicosNormalizados: Medico[] = (
          dataMedicos as MedicoDetalle[]
        ).map((m) => ({
          id_medico: String(m.id_medico),
          id_usuario: String(m.id_usuario),
          id_especialidad: String(m.id_especialidad),
          email_contacto: m.email_contacto ?? "",
          telefono_contacto: m.telefono_contacto ?? "",
        }));

        setMedicos(medicosNormalizados);
      } catch (error) {
        console.error("Error al cargar datos de administración", error);
      }
    };

    cargarDatos();
  }, []);

  const handleNuevoUsuario = async (
    nuevoUsuario: CrearUsuario,
    datosMedico?: {
      id_especialidad: string;
      email_contacto: string;
      telefono_contacto: string;
    }
  ) => {
    try {
      // 1. Crear el usuario primero
      const res = await apiCreateUsuario(nuevoUsuario);

      // Obtener el usuario creado del backend
      const usuarioCreado = res.usuario || res;
      const id_usuario_creado = String(usuarioCreado.id_usuario);

      let id_medico_creado: string | undefined = undefined;

      // 2. Si es médico, crear el registro de médico
      if (nuevoUsuario.rol === "medico" && datosMedico) {
        const medicoData = {
          id_usuario: id_usuario_creado,
          id_especialidad: datosMedico.id_especialidad,
          email_contacto: datosMedico.email_contacto,
          telefono_contacto: datosMedico.telefono_contacto,
        };

        const medicoCreado = await createMedico(medicoData);
        id_medico_creado = String(medicoCreado.id_medico);

        // Agregar a la lista de médicos
        setMedicos((prev) => [
          ...prev,
          {
            id_medico: id_medico_creado!,
            id_usuario: id_usuario_creado,
            id_especialidad: datosMedico.id_especialidad,
            email_contacto: datosMedico.email_contacto,
            telefono_contacto: datosMedico.telefono_contacto,
          },
        ]);
      }

      // 3. Agregar el usuario a la lista
      const usuarioConFormato: Usuario = {
        id_usuario: id_usuario_creado,
        nombre_usuario: usuarioCreado.nombre_usuario,
        nombre: usuarioCreado.nombre,
        apellido: usuarioCreado.apellido,
        nombre_completo:
          usuarioCreado.nombre_completo ||
          `${usuarioCreado.nombre} ${usuarioCreado.apellido}`.trim(),
        rol: usuarioCreado.rol,
        estado: usuarioCreado.estado,
        id_medico: id_medico_creado,
      };

      setUsuarios((prev) => [...prev, usuarioConFormato]);
    } catch (error) {
      console.error("Error al crear usuario", error);
      throw error;
    }
  };

  const handleActualizarUsuario = async (
    id_usuario: string,
    datosActualizar: ActualizarUsuario
  ) => {
    try {
      const res = await apiUpdateUsuario(id_usuario, datosActualizar);

      const usuarioFormateado: Usuario = {
        id_usuario: String(res.id_usuario),
        nombre_usuario: res.nombre_usuario,
        nombre: res.nombre,
        apellido: res.apellido,
        nombre_completo:
          res.nombre_completo || `${res.nombre} ${res.apellido}`.trim(),
        rol: res.rol,
        estado: res.estado,
        id_medico: res.id_medico,
      };

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === usuarioFormateado.id_usuario ? usuarioFormateado : u
        )
      );
    } catch (error) {
      console.error("Error al actualizar usuario", error);
    }
  };

  const handleNuevoMedico = (nuevoMedico: Medico) => {
    setMedicos([...medicos, nuevoMedico]);
  };

  const handleActualizarMedico = async (
    id_medico: string,
    datosActualizar: {
      id_especialidad: string;
      email_contacto: string;
      telefono_contacto: string;
    }
  ) => {
    try {
      const medicoActualizado = await updateMedico(id_medico, datosActualizar);

      setMedicos((prev) =>
        prev.map((m) =>
          m.id_medico === id_medico
            ? {
                ...m,
                id_especialidad: datosActualizar.id_especialidad,
                email_contacto: datosActualizar.email_contacto,
                telefono_contacto: datosActualizar.telefono_contacto,
              }
            : m
        )
      );
    } catch (error) {
      console.error("Error al actualizar médico", error);
      throw error;
    }
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
                <p className="text-sm text-gray-600">{user.nombre_completo}</p>
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
              onActualizarMedico={handleActualizarMedico}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

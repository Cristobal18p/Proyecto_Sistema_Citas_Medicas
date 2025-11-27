import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Usuario, UserRole } from "../../App";
import { Medico, mockEspecialidades } from "../../lib/mockData";
import { Users, Plus, Edit, Search } from "lucide-react";
import { toast } from "sonner";

interface GestionUsuariosProps {
  usuarios: Usuario[];
  medicos: Medico[];
  onNuevoUsuario: (usuario: Usuario) => void;
  onActualizarUsuario: (usuario: Usuario) => void;
  onNuevoMedico: (medico: Medico) => void;
}

export function GestionUsuarios({
  usuarios,
  medicos,
  onNuevoUsuario,
  onActualizarUsuario,
  onNuevoMedico,
}: GestionUsuariosProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    nombre: "",
    apellido: "",
    password: "",
    rol: "recepcion" as UserRole,
    estado: "activo" as "activo" | "inactivo" | "bloqueado",
    // Datos adicionales para médicos
    id_especialidad: "",
    email_contacto: "",
    telefono_contacto: "",
  });

  const abrirDialogoNuevo = () => {
    setEditando(false);
    setUsuarioEditando(null);
    setFormData({
      nombre_usuario: "",
      nombre: "",
      apellido: "",
      password: "",
      rol: "recepcion",
      estado: "activo",
      id_especialidad: "",
      email_contacto: "",
      telefono_contacto: "",
    });
    setDialogOpen(true);
  };

  const abrirDialogoEditar = (usuario: Usuario) => {
    setEditando(true);
    setUsuarioEditando(usuario);

    let datosMedico = {
      id_especialidad: "",
      email_contacto: "",
      telefono_contacto: "",
    };
    if (usuario.rol === "medico" && usuario.id_medico) {
      const medico = medicos.find((m) => m.id_medico === usuario.id_medico);
      if (medico) {
        datosMedico = {
          id_especialidad: medico.id_especialidad,
          email_contacto: medico.email_contacto,
          telefono_contacto: medico.telefono_contacto,
        };
      }
    }

    setFormData({
      nombre_usuario: usuario.nombre_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      password: "",
      rol: usuario.rol,
      estado: usuario.estado,
      ...datosMedico,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editando && usuarioEditando) {
      // Actualizar usuario
      const usuarioActualizado: Usuario = {
        ...usuarioEditando,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rol: formData.rol,
        estado: formData.estado,
      };
      onActualizarUsuario(usuarioActualizado);

      // Si cambió a rol médico y no tenía datos de médico, crearlos
      if (formData.rol === "medico" && !usuarioEditando.id_medico) {
        const nuevoMedico: Medico = {
          id_medico: `med_${Date.now()}`,
          id_usuario: usuarioEditando.id_usuario,
          id_especialidad: formData.id_especialidad,
          email_contacto: formData.email_contacto,
          telefono_contacto: formData.telefono_contacto,
        };
        onNuevoMedico(nuevoMedico);

        // Actualizar usuario con id_medico
        usuarioActualizado.id_medico = nuevoMedico.id_medico;
        onActualizarUsuario(usuarioActualizado);
      }

      toast.success("Usuario actualizado exitosamente");
    } else {
      // Crear nuevo usuario
      const nuevoUsuario: Usuario = {
        id_usuario: `usr_${Date.now()}`,
        nombre_usuario: formData.nombre_usuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rol: formData.rol,
        estado: formData.estado,
      };

      // Si es médico, crear también el registro de médico
      if (formData.rol === "medico") {
        const nuevoMedico: Medico = {
          id_medico: `med_${Date.now()}`,
          id_usuario: nuevoUsuario.id_usuario,
          id_especialidad: formData.id_especialidad,
          email_contacto: formData.email_contacto,
          telefono_contacto: formData.telefono_contacto,
        };
        onNuevoMedico(nuevoMedico);
        nuevoUsuario.id_medico = nuevoMedico.id_medico;
      }

      onNuevoUsuario(nuevoUsuario);
      toast.success("Usuario creado exitosamente");
    }

    setDialogOpen(false);
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      busqueda === "" ||
      u.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getRolBadge = (rol: UserRole) => {
    const badges = {
      recepcion: (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Recepción
        </Badge>
      ),
      medico: (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Médico
        </Badge>
      ),
      gerente: (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          Gerente
        </Badge>
      ),
      administrador: (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Administrador
        </Badge>
      ),
    };
    return badges[rol];
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      activo: (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Activo
        </Badge>
      ),
      inactivo: (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Inactivo
        </Badge>
      ),
      bloqueado: (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Bloqueado
        </Badge>
      ),
    };
    return badges[estado as keyof typeof badges];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios y Roles
            </CardTitle>
            <CardDescription>
              Administre los usuarios del sistema y sus roles
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={abrirDialogoNuevo}>
                <Plus className="w-4 h-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editando ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </DialogTitle>
                <DialogDescription>
                  Complete el formulario para{" "}
                  {editando ? "actualizar el" : "crear un nuevo"} usuario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre de usuario */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nombre_usuario">Nombre de Usuario *</Label>
                    <Input
                      id="nombre_usuario"
                      type="text"
                      placeholder="usuario123"
                      value={formData.nombre_usuario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_usuario: e.target.value,
                        })
                      }
                      required
                      disabled={editando}
                    />
                  </div>

                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Juan"
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
                      placeholder="Pérez"
                      value={formData.apellido}
                      onChange={(e) =>
                        setFormData({ ...formData, apellido: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Contraseña */}
                  {!editando && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required={!editando}
                      />
                    </div>
                  )}

                  {/* Rol */}
                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol *</Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(value: UserRole) =>
                        setFormData({ ...formData, rol: value })
                      }
                    >
                      <SelectTrigger id="rol">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recepcion">Recepción</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="administrador">
                          Administrador
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(
                        value: "activo" | "inactivo" | "bloqueado"
                      ) => setFormData({ ...formData, estado: value })}
                    >
                      <SelectTrigger id="estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="bloqueado">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Datos adicionales para médicos */}
                {formData.rol === "medico" && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h3 className="font-medium">Datos del Médico</h3>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Especialidad */}
                      <div className="space-y-2">
                        <Label htmlFor="especialidad">Especialidad *</Label>
                        <Select
                          value={formData.id_especialidad}
                          onValueChange={(value: string) =>
                            setFormData({ ...formData, id_especialidad: value })
                          }
                        >
                          <SelectTrigger id="especialidad">
                            <SelectValue placeholder="Seleccione una especialidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockEspecialidades.map((esp) => (
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

                      {/* Email de contacto */}
                      <div className="space-y-2">
                        <Label htmlFor="email_contacto">
                          Email de Contacto *
                        </Label>
                        <Input
                          id="email_contacto"
                          type="email"
                          placeholder="medico@hospital.com"
                          value={formData.email_contacto}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email_contacto: e.target.value,
                            })
                          }
                          required={formData.rol === "medico"}
                        />
                      </div>

                      {/* Teléfono de contacto */}
                      <div className="space-y-2">
                        <Label htmlFor="telefono_contacto">
                          Teléfono de Contacto *
                        </Label>
                        <Input
                          id="telefono_contacto"
                          type="tel"
                          placeholder="555-0000"
                          value={formData.telefono_contacto}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              telefono_contacto: e.target.value,
                            })
                          }
                          required={formData.rol === "medico"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editando ? "Actualizar" : "Crear"} Usuario
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre de usuario, nombre o apellido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Lista de usuarios */}
        <div className="space-y-3">
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id_usuario}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      {getRolBadge(usuario.rol)}
                      {getEstadoBadge(usuario.estado)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Usuario: {usuario.nombre_usuario}
                    </p>
                    {usuario.rol === "medico" && usuario.id_medico && (
                      <p className="text-sm text-gray-500">
                        ID Médico: {usuario.id_medico}
                      </p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => abrirDialogoEditar(usuario)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estadísticas */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl">{usuarios.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl text-blue-600">
                {usuarios.filter((u) => u.rol === "recepcion").length}
              </p>
              <p className="text-sm text-gray-600">Recepción</p>
            </div>
            <div>
              <p className="text-2xl text-green-600">
                {usuarios.filter((u) => u.rol === "medico").length}
              </p>
              <p className="text-sm text-gray-600">Médicos</p>
            </div>
            <div>
              <p className="text-2xl text-purple-600">
                {usuarios.filter((u) => u.rol === "gerente").length}
              </p>
              <p className="text-sm text-gray-600">Gerentes</p>
            </div>
            <div>
              <p className="text-2xl text-red-600">
                {usuarios.filter((u) => u.rol === "administrador").length}
              </p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

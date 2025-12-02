import { UserRole } from "./login";

// Representa un usuario (respuesta de la API)
export interface Usuario {
    id_usuario: string;
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    nombre_completo: string;
    rol: UserRole;
    estado: "activo" | "inactivo" | "bloqueado";
    id_medico?: string;
}

// Tipo para crear un nuevo usuario (sin id_usuario que se genera en BD)
export interface CrearUsuario {
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    contrasena: string; // Requerido al crear
    rol: UserRole;
    estado: "activo" | "inactivo" | "bloqueado";
}

// Tipo para actualizar usuario
export interface ActualizarUsuario {
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    rol: UserRole;
    estado: "activo" | "inactivo" | "bloqueado";
    contrasena?: string; // Opcional - solo si se quiere cambiar
}
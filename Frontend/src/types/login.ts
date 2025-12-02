// Tipos para autenticación
export type UserRole = "admin" | "gerente" | "recepcionista" | "medico";

// Representa la respuesta del login (usuario autenticado)
export interface Login {
  id_usuario: string;
  nombre_usuario: string;
  nombre_completo: string;
  rol: UserRole;
  estado: "activo" | "inactivo" | "bloqueado";
  id_medico: string; // Solo presente si el usuario es médico
}


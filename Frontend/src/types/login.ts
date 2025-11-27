// Representa un usuario del sistema
export interface Usuario {
  id_usuario: string;
  id_medico: string; 
  nombre_usuario: string;
  nombre_completo: string;
  rol: "paciente" | "medico" | "recepcionista" | "admin";
  estado: "activo" | "inactivo" | "bloqueado";
}


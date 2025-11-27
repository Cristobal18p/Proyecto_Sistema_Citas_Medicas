export interface Paciente {
  id_paciente: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  fecha_registro?: string;
  estado?: 'activo' | 'inactivo' | 'bloqueado';
}

// Portal de Paciente 
export interface ValidarIdentidad {
  cedula: string; 
  fecha_nacimiento: string; 
}

export interface CreatePaciente {
  nombre: string; 
  apellido: string; 
  cedula: string; 
  fecha_nacimiento: string; 
  telefono: string; 
  email: string; 
}


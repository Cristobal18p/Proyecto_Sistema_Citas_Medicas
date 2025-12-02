export interface Especialidad {
  id_especialidad: string;
  nombre_especialidad: string;
}

export interface Medico {
  id_medico: string;
  id_usuario?: string;
  id_especialidad: string;
  email_contacto?: string;
  telefono_contacto?: string;
  nombre_completo?: string;
  especialidad_nombre?: string;
}

// Interface específica para el detalle de médicos que devuelve el backend
// para el panel de administración (edición de usuario médico)
export interface MedicoDetalle {
  id_medico: string;
  id_usuario: string;
  id_especialidad: string;
  email_contacto: string | null;
  telefono_contacto: string | null;
}


export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
export interface DisponibilidadMedico {
  id_disponibilidad: string;
  id_medico: string;
  dia_semana: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
}

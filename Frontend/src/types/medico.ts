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


export  type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'; 
export interface DisponibilidadMedico {
  id_disponibilidad: string;
  id_medico: string;
  dia_semana: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
}

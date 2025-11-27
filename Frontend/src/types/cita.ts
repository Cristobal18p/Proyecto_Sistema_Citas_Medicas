// types/cita.ts
export interface Cita {
  id_cita: string;
  numero_seguimiento?: string;
  id_paciente: string;
  id_medico: string;
  fecha_cita?: string;
  hora_cita?: string;
  tipo_cita?: "nueva" | "control";
  estado_cita?: "pendiente" | "confirmada" | "atendido" | "cancelada";
  fecha_solicitud: string;
  fecha_atencion?: string;
  tipo_solicitud?: "presencial" | "telefonica" | "web";
  preferencia_turno?: "AM" | "PM";
  creado_por?: "paciente" | "recepcionista"
}

// Dashboard de Recepcion y Paciente
export interface CreateCita {
  id_paciente: string;
  id_medico: string;
  fecha_solicitud: string;
  tipo_cita: string;
  preferencia_turno: string;
  tipo_solicitud: string;
  creado_por?: string;

  // Solo recepción (confirmación inmediata)
  fecha_cita?: string;
  hora_cita?: string;
  fecha_confirmacion?: string;
}


// Portal de Paciente, Recepcion (Cita del dia, Todas la citas, citas pendientes), Medico, 
export interface CitaDetalle {
  id_cita: string;

  numero_seguimiento: string;
  estado_cita: "pendiente" | "confirmada" | "atendido" | "cancelada";
  tipo_cita: "nueva" | "control";

  // Datos de paciente y médico
  paciente_nombre?: string;
  medico_nombre?: string;
  especialidad?: string;

  // Fechas y horas
  fecha_solicitud: string;
  fecha_cita?: string;
  hora_cita?: string;
  preferencia_turno?: "AM" | "PM";
  tipo_solicitud?: "presencial" | "web";

  // Confirmación
  fecha_confirmacion?: string;
  cancelado_por?: "paciente" | "recepcion";
  id_medico: string;
}

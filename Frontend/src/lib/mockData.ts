import { Usuario } from '../App';

export interface Especialidad {
  id_especialidad: string;
  nombre_especialidad: string;
}

export interface Paciente {
  id_paciente: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  fecha_registro: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
}

export interface Medico {
  id_medico: string;
  id_usuario: string;
  id_especialidad: string;
  email_contacto: string;
  telefono_contacto: string;
  nombre_completo?: string;
  especialidad_nombre?: string;
}

export interface Cita {
  id_cita: string;
  numero_seguimiento: string;
  id_paciente: string;
  id_medico: string;
  fecha_cita: string;
  hora_cita: string;
  preferencia_turno: 'AM' | 'PM';
  tipo_cita: 'nueva' | 'control';
  estado: 'pendiente' | 'confirmada' | 'atendido' | 'cancelada';
  fecha_solicitud: string;
  fecha_confirmacion: string | null;
  tipo_solicitud: 'presencial' | 'telefonica' | 'web';
  paciente_nombre?: string;
  medico_nombre?: string;
  especialidad?: string;
}

export interface HistorialConsulta {
  id_consulta: string;
  id_cita: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
}

export interface DisponibilidadMedico {
  id_disponibilidad: string;
  id_medico: string;
  dia_semana: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hora_inicio: string;
  hora_fin: string;
}

// Mock users
export const mockUsuarios: Usuario[] = [
  {
    id_usuario: 'usr_001',
    nombre_usuario: 'recepcion1',
    nombre: 'María',
    apellido: 'González',
    rol: 'recepcion',
    estado: 'activo'
  },
  {
    id_usuario: 'usr_002',
    nombre_usuario: 'dr.perez',
    nombre: 'Carlos',
    apellido: 'Pérez',
    rol: 'medico',
    estado: 'activo',
    id_medico: 'med_001'
  },
  {
    id_usuario: 'usr_003',
    nombre_usuario: 'gerente1',
    nombre: 'Ana',
    apellido: 'Martínez',
    rol: 'gerente',
    estado: 'activo'
  },
  {
    id_usuario: 'usr_004',
    nombre_usuario: 'admin',
    nombre: 'Luis',
    apellido: 'Rodríguez',
    rol: 'administrador',
    estado: 'activo'
  },
  {
    id_usuario: 'usr_005',
    nombre_usuario: 'dra.lopez',
    nombre: 'Laura',
    apellido: 'López',
    rol: 'medico',
    estado: 'activo',
    id_medico: 'med_002'
  },
  {
    id_usuario: 'usr_006',
    nombre_usuario: 'dr.garcia',
    nombre: 'Miguel',
    apellido: 'García',
    rol: 'medico',
    estado: 'activo',
    id_medico: 'med_004'
  },
  {
    id_usuario: 'usr_007',
    nombre_usuario: 'recepcion2',
    nombre: 'Claudia',
    apellido: 'Fernández',
    rol: 'recepcion',
    estado: 'activo'
  }
];

// Mock especialidades
export const mockEspecialidades: Especialidad[] = [
  { id_especialidad: 'esp_001', nombre_especialidad: 'Cardiología' },
  { id_especialidad: 'esp_002', nombre_especialidad: 'Pediatría' },
  { id_especialidad: 'esp_003', nombre_especialidad: 'Dermatología' },
  { id_especialidad: 'esp_004', nombre_especialidad: 'Traumatología' },
  { id_especialidad: 'esp_005', nombre_especialidad: 'Neurología' },
  { id_especialidad: 'esp_006', nombre_especialidad: 'Oncología' },
  { id_especialidad: 'esp_007', nombre_especialidad: 'Ginecología' }
];

// Mock médicos
export const mockMedicos: Medico[] = [
  {
    id_medico: 'med_001',
    id_usuario: 'usr_002',
    id_especialidad: 'esp_001',
    email_contacto: 'carlos.perez@hospital.com',
    telefono_contacto: '555-0101',
    nombre_completo: 'Dr. Carlos Pérez',
    especialidad_nombre: 'Cardiología'
  },
  {
    id_medico: 'med_002',
    id_usuario: 'usr_005',
    id_especialidad: 'esp_002',
    email_contacto: 'laura.lopez@hospital.com',
    telefono_contacto: '555-0102',
    nombre_completo: 'Dra. Laura López',
    especialidad_nombre: 'Pediatría'
  },
  {
    id_medico: 'med_003',
    id_usuario: 'usr_006',
    id_especialidad: 'esp_001',
    email_contacto: 'jorge.silva@hospital.com',
    telefono_contacto: '555-0103',
    nombre_completo: 'Dr. Jorge Silva',
    especialidad_nombre: 'Cardiología'
  },
  {
    id_medico: 'med_004',
    id_usuario: 'usr_006',
    id_especialidad: 'esp_006',
    email_contacto: 'miguel.garcia@hospital.com',
    telefono_contacto: '555-0104',
    nombre_completo: 'Dr. Miguel García',
    especialidad_nombre: 'Oncología'
  },
  {
    id_medico: 'med_005',
    id_usuario: 'usr_008',
    id_especialidad: 'esp_007',
    email_contacto: 'paula.mendez@hospital.com',
    telefono_contacto: '555-0105',
    nombre_completo: 'Dra. Paula Méndez',
    especialidad_nombre: 'Ginecología'
  }
];

// Mock pacientes
export const mockPacientes: Paciente[] = [
  {
    id_paciente: 'pac_001',
    nombre: 'Juan',
    apellido: 'Ramírez',
    cedula: '12345678',
    telefono: '555-1001',
    email: 'juan.ramirez@email.com',
    fecha_nacimiento: '1985-03-15',
    fecha_registro: '2025-01-15',
    estado: 'activo'
  },
  {
    id_paciente: 'pac_002',
    nombre: 'Elena',
    apellido: 'Torres',
    cedula: '23456789',
    telefono: '555-1002',
    email: 'elena.torres@email.com',
    fecha_nacimiento: '1990-07-22',
    fecha_registro: '2025-02-20',
    estado: 'activo'
  },
  {
    id_paciente: 'pac_003',
    nombre: 'Roberto',
    apellido: 'Sánchez',
    cedula: '34567890',
    telefono: '555-1003',
    email: 'roberto.sanchez@email.com',
    fecha_nacimiento: '1978-11-08',
    fecha_registro: '2025-03-10',
    estado: 'activo'
  },
  {
    id_paciente: 'pac_004',
    nombre: 'Sofía',
    apellido: 'Morales',
    cedula: '45678901',
    telefono: '555-1004',
    email: 'sofia.morales@email.com',
    fecha_nacimiento: '1995-05-30',
    fecha_registro: '2025-04-05',
    estado: 'activo'
  }
];

// Mock citas
export const mockCitas: Cita[] = [
  {
    id_cita: 'cit_001',
    numero_seguimiento: 'SEG-2025-001',
    id_paciente: 'pac_001',
    id_medico: 'med_001',
    fecha_cita: '2025-11-20',
    hora_cita: '09:00',
    preferencia_turno: 'AM',
    tipo_cita: 'nueva',
    estado: 'confirmada',
    fecha_solicitud: '2025-11-10',
    fecha_confirmacion: '2025-11-11',
    tipo_solicitud: 'presencial',
    paciente_nombre: 'Juan Ramírez',
    medico_nombre: 'Dr. Carlos Pérez',
    especialidad: 'Cardiología'
  },
  {
    id_cita: 'cit_002',
    numero_seguimiento: 'SEG-2025-002',
    id_paciente: 'pac_002',
    id_medico: 'med_002',
    fecha_cita: '2025-11-19',
    hora_cita: '10:30',
    preferencia_turno: 'AM',
    tipo_cita: 'control',
    estado: 'confirmada',
    fecha_solicitud: '2025-11-14',
    fecha_confirmacion: null,
    tipo_solicitud: 'telefonica',
    paciente_nombre: 'Elena Torres',
    medico_nombre: 'Dra. Laura López',
    especialidad: 'Pediatría'
  },
  {
    id_cita: 'cit_003',
    numero_seguimiento: 'SEG-2025-003',
    id_paciente: 'pac_003',
    id_medico: 'med_001',
    fecha_cita: '2025-11-19',
    hora_cita: '14:00',
    preferencia_turno: 'PM',
    tipo_cita: 'nueva',
    estado: 'confirmada',
    fecha_solicitud: '2025-11-12',
    fecha_confirmacion: '2025-11-13',
    tipo_solicitud: 'web',
    paciente_nombre: 'Roberto Sánchez',
    medico_nombre: 'Dr. Carlos Pérez',
    especialidad: 'Cardiología'
  },
  {
    id_cita: 'cit_004',
    numero_seguimiento: 'SEG-2025-004',
    id_paciente: 'pac_004',
    id_medico: 'med_002',
    fecha_cita: '2025-11-20',
    hora_cita: '11:00',
    preferencia_turno: 'AM',
    tipo_cita: 'control',
    estado: 'atendido',
    fecha_solicitud: '2025-11-15',
    fecha_confirmacion: null,
    tipo_solicitud: 'presencial',
    paciente_nombre: 'Sofía Morales',
    medico_nombre: 'Dra. Laura López',
    especialidad: 'Pediatría'
  },
  {
    id_cita: 'cit_005',
    numero_seguimiento: 'SEG-2025-005',
    id_paciente: 'pac_001',
    id_medico: 'med_003',
    fecha_cita: '2025-11-18',
    hora_cita: '15:30',
    preferencia_turno: 'PM',
    tipo_cita: 'nueva',
    estado: 'atendido',
    fecha_solicitud: '2025-11-01',
    fecha_confirmacion: '2025-11-02',
    tipo_solicitud: 'web',
    paciente_nombre: 'Juan Ramírez',
    medico_nombre: 'Dr. Jorge Silva',
    especialidad: 'Dermatología'
  },
  {
    id_cita: 'cit_006',
    numero_seguimiento: 'SEG-2025-006',
    id_paciente: 'pac_005',
    id_medico: 'med_004',
    fecha_cita: '2025-11-19',
    hora_cita: '16:00',
    preferencia_turno: 'PM',
    tipo_cita: 'nueva',
    estado: 'cancelada',
    fecha_solicitud: '2025-11-15',
    fecha_confirmacion: null,
    tipo_solicitud: 'presencial',
    paciente_nombre: 'Andrés Fernández',
    medico_nombre: 'Dr. Miguel García',
    especialidad: 'Oncología'
  },

  {
    id_cita: 'cit_010',
    numero_seguimiento: 'SEG-2025-010',
    id_paciente: 'pac_010',
    id_medico: 'med_002',
    fecha_cita: '2025-11-18',
    hora_cita: '09:00',
    preferencia_turno: 'AM',
    tipo_cita: 'nueva',
    estado: 'confirmada',
    fecha_solicitud: '2025-11-14',
    fecha_confirmacion: '2025-11-15',
    tipo_solicitud: 'presencial',
    paciente_nombre: 'Andrés Castillo',
    medico_nombre: 'Dra. Laura López',
    especialidad: 'Pediatría'
  },
  {
    id_cita: 'cit_011',
    numero_seguimiento: 'SEG-2025-011',
    id_paciente: 'pac_011',
    id_medico: 'med_002',
    fecha_cita: '2025-11-20',
    hora_cita: '10:00',
    preferencia_turno: 'AM',
    tipo_cita: 'control',
    estado: 'confirmada',
    fecha_solicitud: '2025-11-15',
    fecha_confirmacion: '2025-11-16',
    tipo_solicitud: 'web',
    paciente_nombre: 'Paula Méndez',
    medico_nombre: 'Dra. Laura López',
    especialidad: 'Pediatría'
  },
  {
    id_cita: 'cit_012',
    numero_seguimiento: 'SEG-2025-012',
    id_paciente: 'pac_012',
    id_medico: 'med_002',
    fecha_cita: '2025-11-16',
    hora_cita: '15:00',
    preferencia_turno: 'PM',
    tipo_cita: 'nueva',
    estado: 'atendido',
    fecha_solicitud: '2025-11-16',
    fecha_confirmacion: '2025-11-16',
    tipo_solicitud: 'telefonica',
    paciente_nombre: 'Diego Fernández',
    medico_nombre: 'Dra. Laura López',
    especialidad: 'Pediatría'
  },
  {
    id_cita: 'cit_013',
    numero_seguimiento: 'SEG-2025-013',
    id_paciente: 'pac_013',
    id_medico: 'med_002',
    fecha_cita: '2025-11-16',
    hora_cita: '11:30',
    preferencia_turno: 'AM',
    tipo_cita: 'control',
    estado: 'confirmada',
    fecha_solicitud: '2025-11-12',
    fecha_confirmacion: '2025-11-13',
    tipo_solicitud: 'presencial',
    paciente_nombre: 'Lucía Navarro',
    medico_nombre: 'Dra. Laura López',
    especialidad: 'Pediatría'
  }

];

// Mock historial de consultas
export const mockHistorialConsultas: HistorialConsulta[] = [
  {
    id_consulta: 'cons_001',
    id_cita: 'cit_005',
    sintomas: 'Erupción cutánea en brazo derecho',
    diagnostico: 'Dermatitis de contacto',
    tratamiento: 'Crema tópica con corticoides, evitar alérgenos'
  },
  {
    id_consulta: 'cons_002',
    id_cita: 'cit_003',
    sintomas: 'Dolor en el pecho al esfuerzo',
    diagnostico: 'Angina estable',
    tratamiento: 'Beta bloqueadores y control de factores de riesgo'
  },
  {
    id_consulta: 'cons_003',
    id_cita: 'cit_006',
    sintomas: 'Fatiga persistente',
    diagnostico: 'Anemia leve',
    tratamiento: 'Suplementos de hierro y dieta balanceada'
  }
];

// Mock disponibilidad médicos
export const mockDisponibilidad: DisponibilidadMedico[] = [
  {
    id_disponibilidad: 'disp_001',
    id_medico: 'med_001',
    dia_semana: 'Lunes',
    hora_inicio: '08:00',
    hora_fin: '12:00'
  },
  {
    id_disponibilidad: 'disp_002',
    id_medico: 'med_001',
    dia_semana: 'Martes',
    hora_inicio: '14:00',
    hora_fin: '18:00'
  },
  {
    id_disponibilidad: 'disp_003',
    id_medico: 'med_001',
    dia_semana: 'Miércoles',
    hora_inicio: '08:00',
    hora_fin: '12:00'
  },
  {
    id_disponibilidad: 'disp_004',
    id_medico: 'med_002',
    dia_semana: 'Martes',
    hora_inicio: '09:00',
    hora_fin: '13:00'
  },
  {
    id_disponibilidad: 'disp_005',
    id_medico: 'med_002',
    dia_semana: 'Jueves',
    hora_inicio: '14:00',
    hora_fin: '18:00'
  },
  {
    id_disponibilidad: 'disp_006',
    id_medico: 'med_004',
    dia_semana: 'Viernes',
    hora_inicio: '08:00',
    hora_fin: '12:00'
  },
  {
    id_disponibilidad: 'disp_007',
    id_medico: 'med_005',
    dia_semana: 'Martes',
    hora_inicio: '10:00',
    hora_fin: '14:00'
  }
];




/*

  <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-green-800 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Días de Consulta del Médico
            </h3>
            <div className="flex flex-wrap gap-2">
              {diasDisponibles.length > 0 ? (
                diasDisponibles.map((dia, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-green-100 text-green-700"
                  >
                    {dia}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No hay horarios configurados
                </p>
              )}
            </div>
          </div>


*/
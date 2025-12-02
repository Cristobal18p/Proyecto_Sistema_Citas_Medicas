// Tipos para gestión de disponibilidad de médicos

export type DiaSemana =
    | "lunes"
    | "martes"
    | "miercoles"
    | "jueves"
    | "viernes"
    | "sabado"
    | "domingo";

export interface Disponibilidad {
    id_disponibilidad: string;
    id_medico: string;
    dia_semana: DiaSemana;
    hora_inicio: string; // "HH:MM:SS" formato 24h
    hora_fin: string;    // "HH:MM:SS" formato 24h

    // Campos adicionales del JOIN con médico y especialidad
    nombre_medico?: string;
    especialidad?: string;
}

export interface CrearDisponibilidad {
    id_medico: string;
    dia_semana: DiaSemana;
    hora_inicio: string; // "HH:MM:SS" o "HH:MM"
    hora_fin: string;    // "HH:MM:SS" o "HH:MM"
}

export interface ActualizarDisponibilidad {
    dia_semana: DiaSemana;
    hora_inicio: string;
    hora_fin: string;
}

// Array con los días de la semana en orden
export const DIAS_SEMANA: DiaSemana[] = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"
];

// Labels para mostrar en UI
export const DIAS_SEMANA_LABELS: Record<DiaSemana, string> = {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo"
};

// Helper para obtener el número del día (para ordenamiento)
export const getDiaNumero = (dia: DiaSemana): number => {
    const map: Record<DiaSemana, number> = {
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
        domingo: 7
    };
    return map[dia];
};

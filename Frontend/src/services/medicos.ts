import { API_URL } from "../config";
import {
  Medico,
  Especialidad,
  DisponibilidadMedico,
  MedicoDetalle,
} from "../types/medico";


// Obtener todas las Especialdiades
export async function getEspecialidades(): Promise<Especialidad[]> {
  const res = await fetch(`${API_URL}/api/especialidades`);
  if (!res.ok) throw new Error("Error al obtener especialidades");
  return res.json();
}

// Obtener todos los médicos
export async function getMedicos(): Promise<Medico[]> {
  const res = await fetch(`${API_URL}/api/medicos`);
  if (!res.ok) throw new Error("Error al obtener médicos");
  return res.json();
}

// Obtener detalle de médicos (para edición en dashboard admin)
export async function getMedicosDetalle(): Promise<MedicoDetalle[]> {
  const res = await fetch(`${API_URL}/api/medicos/detalle`);
  if (!res.ok) throw new Error("Error al obtener detalle de médicos");
  return res.json();
}

// Obtener disponibilidad de un médico
export async function getDisponibilidadMedico(id_medico: string): Promise<DisponibilidadMedico[]> {
  const res = await fetch(`${API_URL}/api/medicos/${id_medico}/disponibilidad`);
  if (!res.ok) throw new Error("Error al obtener disponibilidad");
  return res.json();
}

// Crear médico
export async function createMedico(data: {
  id_usuario: string;
  id_especialidad: string;
  email_contacto: string;
  telefono_contacto: string;
}): Promise<Medico> {
  const res = await fetch(`${API_URL}/api/medicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear médico");
  }

  return res.json();
}

// Actualizar médico
export async function updateMedico(
  id_medico: string,
  data: {
    id_especialidad: string;
    email_contacto: string;
    telefono_contacto: string;
  }
): Promise<Medico> {
  const res = await fetch(`${API_URL}/api/medicos/${id_medico}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al actualizar médico");
  }

  return res.json();
}

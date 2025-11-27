import { API_URL } from "../config";
import { Medico, Especialidad, DisponibilidadMedico } from "../types/medico";


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

// Obtener disponibilidad de un médico
export async function getDisponibilidadMedico(id_medico: string): Promise<DisponibilidadMedico[]> {
  const res = await fetch(`${API_URL}/api/medicos/${id_medico}/disponibilidad`);
  if (!res.ok) throw new Error("Error al obtener disponibilidad");
  return res.json();
}

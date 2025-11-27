import { API_URL } from "../config";
import { ValidarIdentidad, Paciente, CreatePaciente } from '../types/paciente';

// Obtener todos los pacientes
export async function getPacientes(): Promise<Paciente[]> {
  const res = await fetch(`${API_URL}/api/pacientes`);
  if (!res.ok) throw new Error("Error al obtener pacientes");
  return res.json();
}

// Validar los pacientes para uso del portal de pacientes. 
export async function validarPaciente(data: ValidarIdentidad): Promise<{ existe: boolean; paciente?: Paciente }> {
  const res = await fetch(`${API_URL}/api/pacientes/validar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al validar paciente");
  return res.json();
}

// Buscar paciente por cédula
export async function getPacientePorCedula(cedula: string): Promise<Paciente | null> {
  const res = await fetch(`${API_URL}/api/pacientes/${cedula}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Error al buscar paciente");
  }
  const data = await res.json();
  return data.paciente;
}

export const crearPaciente = async (data: CreatePaciente) => {
  const response = await fetch(`${API_URL}/api/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al registrar paciente");
  }

  return await response.json();
};


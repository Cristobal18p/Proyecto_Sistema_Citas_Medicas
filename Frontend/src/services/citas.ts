import { API_URL } from "../config";
import { CreateCita, CitaDetalle } from "../types/cita";

// Obtener todas las citas
export async function getCitas(): Promise<CitaDetalle[]> {
  // Usamos el endpoint con formato consistente (YYYY-MM-DD, HH24:MI)
  const res = await fetch(`${API_URL}/api/citas/todas`);
  if (!res.ok) throw new Error("Error al obtener citas");
  return res.json();
}

// Crear nueva cita
export async function createCitaRecepcion(cita: CreateCita): Promise<CitaDetalle> {
  const res = await fetch(`${API_URL}/api/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cita),
  });
  if (!res.ok) throw new Error("Error al crear cita");
  return res.json();
}

// Actualizar estado de cita
export async function actualizarEstadoCita(id: string, estado: string): Promise<CitaDetalle> {
  const res = await fetch(`${API_URL}/api/citas/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error al actualizar cita");
  return res.json();
}

// Para el portal de paciente, busqueda cita por numero de seguimiento. 
export async function getCitaPorSeguimiento(numero: string) {
  const res = await fetch(`${API_URL}/api/citas/seguimiento/${numero}`);
  if (!res.ok) throw new Error("Error al buscar cita");
  return res.json();
}

// Para cancelar la cita dentro del portal de paciente. 
export async function cancelarCita(numero_seguimiento: string, cancelado_por: "paciente" | "recepcion") {
  const res = await fetch(`${API_URL}/api/citas/${numero_seguimiento}/cancelar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cancelado_por }),
  });

  if (!res.ok) throw new Error("Error al cancelar cita");
  return res.json();
}

// Confirmar cita (asignar fecha y hora)
export async function confirmarCita(
  id_cita: string,
  fecha_cita: string,
  hora_cita: string
): Promise<CitaDetalle> {
  const res = await fetch(`${API_URL}/api/citas/${id_cita}/confirmar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fecha_cita, hora_cita }),
  });

  if (!res.ok) throw new Error("Error al confirmar cita");
  return res.json();
}

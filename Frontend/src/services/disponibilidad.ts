import { API_URL } from "../config";
import { Disponibilidad, CrearDisponibilidad, ActualizarDisponibilidad } from "../types/disponibilidad";

// Obtener toda la disponibilidad
export async function getDisponibilidad(): Promise<Disponibilidad[]> {
    const response = await fetch(`${API_URL}/api/disponibilidad`);
    if (!response.ok) {
        throw new Error("Error al obtener disponibilidad");
    }
    return response.json();
}

// Obtener disponibilidad por ID
export async function getDisponibilidadById(id: string): Promise<Disponibilidad> {
    const response = await fetch(`${API_URL}/api/disponibilidad/${id}`);
    if (!response.ok) {
        throw new Error("Error al obtener disponibilidad");
    }
    return response.json();
}

// Obtener disponibilidad de un médico específico
export async function getDisponibilidadPorMedico(id_medico: string): Promise<Disponibilidad[]> {
    const response = await fetch(`${API_URL}/api/disponibilidad/medico/${id_medico}`);
    if (!response.ok) {
        throw new Error("Error al obtener disponibilidad del médico");
    }
    return response.json();
}

// Crear nueva disponibilidad
export async function createDisponibilidad(datos: CrearDisponibilidad): Promise<Disponibilidad> {
    const response = await fetch(`${API_URL}/api/disponibilidad`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al crear disponibilidad");
    }

    return response.json();
}

// Actualizar disponibilidad existente
export async function updateDisponibilidad(
    id: string,
    datos: ActualizarDisponibilidad
): Promise<Disponibilidad> {
    const response = await fetch(`${API_URL}/api/disponibilidad/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar disponibilidad");
    }

    return response.json();
}

// Eliminar disponibilidad (soft delete)
export async function deleteDisponibilidad(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/disponibilidad/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al eliminar disponibilidad");
    }
}

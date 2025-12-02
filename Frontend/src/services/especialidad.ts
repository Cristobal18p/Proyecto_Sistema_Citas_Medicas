import { API_URL } from "../config";
import { Especialidad } from "../types/medico";

export async function getEspecialidades(): Promise<Especialidad[]> {
    const res = await fetch(`${API_URL}/api/especialidades`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al obtener especialidades");
    }

    return res.json();
}

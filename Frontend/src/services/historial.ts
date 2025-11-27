import { API_URL } from "../config";
import { HistorialConsulta } from "../types/cita";

export async function getHistoriales(): Promise<HistorialConsulta[]> {
    const res = await fetch(`${API_URL}/api/historial`);
    if (!res.ok) throw new Error("Error al obtener historiales");
    return res.json();
}

export async function getHistorial(id_consulta: string): Promise<HistorialConsulta> {
    const res = await fetch(`${API_URL}/api/historial/${id_consulta}`);
    if (!res.ok) throw new Error("Error al obtener historial");
    return res.json();
}

export async function crearHistorial(payload: HistorialConsulta): Promise<HistorialConsulta> {
    const res = await fetch(`${API_URL}/api/historial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear historial");
    return res.json();
}

export async function actualizarHistorial(id_consulta: string, payload: Partial<HistorialConsulta>): Promise<HistorialConsulta> {
    const res = await fetch(`${API_URL}/api/historial/${id_consulta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar historial");
    return res.json();
}

export async function eliminarHistorial(id_consulta: string): Promise<{ deleted: boolean }> {
    const res = await fetch(`${API_URL}/api/historial/${id_consulta}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar historial");
    return res.json();
}

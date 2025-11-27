import { API_URL } from "../config";
import { Usuario} from "../types/login";


export async function loginUsuario(
  nombre_usuario: string,
  contrasena: string
): Promise<Usuario> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_usuario, contrasena }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al iniciar sesión");
  }

  return res.json();
}


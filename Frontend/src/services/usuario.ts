import { API_URL } from "../config";
import { Login } from "../types/login";
import { Usuario, CrearUsuario, ActualizarUsuario } from "../types/usuario";

// Login - retorna datos de autenticación
export async function loginUsuario(
  nombre_usuario: string,
  contrasena: string
): Promise<Login> {
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

// Obtener lista de usuarios (para dashboard administrador)
export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(`${API_URL}/api/usuarios`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al obtener usuarios");
  }

  return res.json();
}

// Crear usuario
export async function createUsuario(
  data: CrearUsuario
): Promise<{ usuario?: Usuario } & Usuario> {
  const res = await fetch(`${API_URL}/api/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear usuario");
  }

  return res.json();
}

// Actualizar usuario
export async function updateUsuario(
  id_usuario: string,
  data: ActualizarUsuario
): Promise<Usuario> {
  const res = await fetch(`${API_URL}/api/usuarios/${id_usuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al actualizar usuario");
  }

  const response = await res.json();
  return response.usuario || response;
}

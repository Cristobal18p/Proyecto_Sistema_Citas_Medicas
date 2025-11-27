import * as AuthModel from "../models/auth.model.js";

export const loginUsuario = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ message: "Usuario y contraseña requeridos" });
  }

  try {
    const usuario = await AuthModel.validarCredenciales(nombre_usuario, contrasena);

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.json(usuario);
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

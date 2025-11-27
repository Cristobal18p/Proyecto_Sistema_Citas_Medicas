import pool from "../config/db.js";

export const validarCredenciales = async (nombre_usuario, contrasena) => {
  const result = await pool.query(
    `SELECT 
      u.id_usuario,
      u.nombre_usuario,
      u.nombre || ' ' || u.apellido AS nombre_completo,
      u.rol,
      u.estado,
      m.id_medico
    FROM usuario_sistema u
    LEFT JOIN medicos m ON m.id_usuario = u.id_usuario
    WHERE u.nombre_usuario = $1 AND u.password_hash = $2`,
    [nombre_usuario, contrasena]
  );

  return result.rows[0] || null;
};

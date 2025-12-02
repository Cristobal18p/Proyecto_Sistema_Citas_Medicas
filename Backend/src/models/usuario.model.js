import pool from "../config/db.js";

export const getAllUsuarios = async () => {
  const result = await pool.query(`
    SELECT 
      id_usuario,
      nombre_usuario,
      nombre,
      apellido,
      rol,
      estado
    FROM usuario_sistema
    ORDER BY id_usuario;
  `);

  return result.rows.map((u) => ({
    id_usuario: u.id_usuario,
    nombre_usuario: u.nombre_usuario,
    nombre: u.nombre,
    apellido: u.apellido,
    nombre_completo: `${u.nombre} ${u.apellido}`,
    rol: u.rol,
    estado: u.estado,
  }));
};

export const getUsuarioById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM usuario_sistema WHERE id_usuario = $1`,
    [id]
  );

  if (!result.rows[0]) return null;

  const u = result.rows[0];

  return {
    id_usuario: u.id_usuario,
    nombre_usuario: u.nombre_usuario,
    nombre: u.nombre,
    apellido: u.apellido,
    rol: u.rol,
    estado: u.estado,
  };
};

export const createUsuario = async (data) => {
  const { nombre_usuario, nombre, apellido, contrasena, rol, estado } = data;

  const result = await pool.query(
    `INSERT INTO usuario_sistema
      (nombre_usuario, nombre, apellido, password_hash, rol, estado)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *;`,
    [nombre_usuario, nombre, apellido, contrasena, rol, estado]
  );

  return {
    message: "Usuario creado correctamente",
    usuario: result.rows[0],
  };
};

/* ============================================================
   ACTUALIZAR USUARIO
   ============================================================ */

export const updateUsuario = async (id, data) => {
  const { nombre_usuario, nombre, apellido, contrasena, rol, estado } = data;

  // Si se proporciona contraseña, actualizar todo incluyendo password
  if (contrasena) {
    const result = await pool.query(
      `UPDATE usuario_sistema
       SET nombre_usuario = $1,
           nombre = $2,
           apellido = $3,
           password_hash = $4,
           rol = $5,
           estado = $6
       WHERE id_usuario = $7
       RETURNING *;`,
      [nombre_usuario, nombre, apellido, contrasena, rol, estado, id]
    );

    return {
      message: "Usuario actualizado correctamente",
      usuario: result.rows[0],
    };
  } else {
    // Si NO se proporciona contraseña, actualizar sin tocar password
    const result = await pool.query(
      `UPDATE usuario_sistema
       SET nombre_usuario = $1,
           nombre = $2,
           apellido = $3,
           rol = $4,
           estado = $5
       WHERE id_usuario = $6
       RETURNING *;`,
      [nombre_usuario, nombre, apellido, rol, estado, id]
    );

    return {
      message: "Usuario actualizado correctamente",
      usuario: result.rows[0],
    };
  }
};

/* ============================================================
   ELIMINAR USUARIO
   ============================================================ */

export const deleteUsuario = async (id) => {
  await pool.query(`DELETE FROM usuario_sistema WHERE id_usuario = $1`, [id]);

  return { message: "Usuario eliminado correctamente" };
};

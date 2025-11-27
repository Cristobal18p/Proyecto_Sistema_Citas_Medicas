import pool from '../config/db.js';


const mapRolFrontendToDB = (rol) => {
  switch (rol) {
    case "Recepcion": return "recepcionista";
    case "Medico": return "medico";
    case "Gerente": return "admin";
    case "Administrador": return "admin";
    default: return "paciente";
  }
};

// Convertir estado del FRONT a los valores de la BD
const mapEstadoFrontendToDB = (estado) => {
  switch (estado) {
    case "Activo": return "activo";
    case "Inactivo": return "inactivo";
    case "Bloqueado": return "inactivo"; // la BD NO soporta bloqueado
    default: return "activo";
  }
};

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

  return result.rows.map(u => ({
    nombre_completo: `${u.nombre} ${u.apellido}`,
    nombre_usuario: u.nombre_usuario,
    rol: u.rol,
    estado: u.estado
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

  const mappedRol = mapRolFrontendToDB(rol);
  const mappedEstado = mapEstadoFrontendToDB(estado);

  const result = await pool.query(
    `INSERT INTO usuario_sistema
      (nombre_usuario, nombre, apellido, password_hash, rol, estado)
     VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6)
     RETURNING *;`,
    [nombre_usuario, nombre, apellido, contrasena, mappedRol, mappedEstado]
  );

  return {
    message: "Usuario creado correctamente",
    usuario: result.rows[0]
  };
};

/* ============================================================
   ACTUALIZAR USUARIO
   ============================================================ */

export const updateUsuario = async (id, data) => {
  const { nombre_usuario, nombre, apellido, contrasena, rol, estado } = data;

  const mappedRol = mapRolFrontendToDB(rol);
  const mappedEstado = mapEstadoFrontendToDB(estado);

  const result = await pool.query(
    `UPDATE usuario_sistema
     SET nombre_usuario = $1,
         nombre = $2,
         apellido = $3,
         password_hash = crypt($4, gen_salt('bf')),
         rol = $5,
         estado = $6
     WHERE id_usuario = $7
     RETURNING *;`,
    [
      nombre_usuario,
      nombre,
      apellido,
      contrasena,
      mappedRol,
      mappedEstado,
      id
    ]
  );

  return {
    message: "Usuario actualizado correctamente",
    usuario: result.rows[0]
  };
};

/* ============================================================
   ELIMINAR USUARIO
   ============================================================ */

export const deleteUsuario = async (id) => {
  await pool.query(
    `DELETE FROM usuario_sistema WHERE id_usuario = $1`,
    [id]
  );

  return { message: 'Usuario eliminado correctamente' };
};

import pool from '../config/db.js';

export const crearPaciente = async ({
  nombre,
  apellido,
  cedula,
  fecha_nacimiento,
  telefono,
  email
}) => {
  const result = await pool.query(
    `INSERT INTO pacientes (
      nombre, apellido, cedula, fecha_nacimiento, telefono, email
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [nombre, apellido, cedula, fecha_nacimiento, telefono, email]
  );

  return result.rows[0];
};

export const validarPaciente = async (cedula, fecha_nacimiento) => {
  const result = await pool.query(
    "SELECT * FROM pacientes WHERE cedula = $1 AND fecha_nacimiento = $2",
    [cedula, fecha_nacimiento]
  );
  return result.rows[0] || null;
};

export const getPacientes = async () => {
  const result = await pool.query("SELECT * FROM pacientes ORDER BY nombre");
  return result.rows;
};

export const getPacientePorCedula = async (cedula) => {
  const result = await pool.query(
    "SELECT * FROM pacientes WHERE cedula = $1",
    [cedula]
  );
  return result.rows[0];
};
import pool from "../config/db.js";

export const findAllMedicos = async () => {
  const result = await pool.query(`
    SELECT 
      m.id_medico, 
      m.id_especialidad,
      u.nombre || ' ' || u.apellido AS nombre_completo
    FROM medicos m
    JOIN usuario_sistema u ON u.id_usuario = m.id_usuario
    ORDER BY nombre_completo
  `);
  return result.rows;
};

// Detalle de médicos para edición (incluye relación con usuario y datos de contacto)
export const findAllMedicosDetalle = async () => {
  const result = await pool.query(`
    SELECT 
      m.id_medico,
      m.id_usuario,
      m.id_especialidad,
      m.email_contacto,
      m.telefono_contacto
    FROM medicos m
    ORDER BY m.id_medico
  `);
  return result.rows;
};

export const createMedico = async (data) => {
  const { id_usuario, id_especialidad, email_contacto, telefono_contacto } =
    data;

  const result = await pool.query(
    `INSERT INTO medicos (id_usuario, id_especialidad, email_contacto, telefono_contacto)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [id_usuario, id_especialidad, email_contacto, telefono_contacto]
  );

  return result.rows[0];
};

export const updateMedico = async (id_medico, data) => {
  const { id_especialidad, email_contacto, telefono_contacto } = data;

  const result = await pool.query(
    `UPDATE medicos
     SET id_especialidad = $1,
         email_contacto = $2,
         telefono_contacto = $3
     WHERE id_medico = $4
     RETURNING *;`,
    [id_especialidad, email_contacto, telefono_contacto, id_medico]
  );

  return result.rows[0];
};

export const getDisponibilidadPorMedico = async (id_medico) => {
  const result = await pool.query(
    `
    SELECT 
      dia_semana,
      TO_CHAR(hora_inicio, 'HH24:MI') AS hora_inicio,
      TO_CHAR(hora_fin, 'HH24:MI') AS hora_fin
    FROM disponibilidad_medicos
    WHERE id_medico = $1
    ORDER BY dia_semana, hora_inicio
  `,
    [id_medico]
  );

  return result.rows;
};

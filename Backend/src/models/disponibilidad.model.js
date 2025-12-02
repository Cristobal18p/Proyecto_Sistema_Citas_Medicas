import pool from "../config/db.js";

export const findAllDisponibilidad = async () => {
  const result = await pool.query(`
    SELECT 
      dm.id_disponibilidad,
      dm.id_medico,
      dm.dia_semana,
      TO_CHAR(dm.hora_inicio, 'HH24:MI:SS') AS hora_inicio,
      TO_CHAR(dm.hora_fin, 'HH24:MI:SS') AS hora_fin,
      u.nombre || ' ' || u.apellido AS nombre_medico,
      e.nombre_especialidad AS especialidad
    FROM disponibilidad_medicos dm
    LEFT JOIN medicos m ON dm.id_medico = m.id_medico
    LEFT JOIN usuario_sistema u ON m.id_usuario = u.id_usuario
    LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    ORDER BY 
      CASE LOWER(dm.dia_semana)
        WHEN 'lunes' THEN 1
        WHEN 'martes' THEN 2
        WHEN 'miercoles' THEN 3
        WHEN 'jueves' THEN 4
        WHEN 'viernes' THEN 5
        WHEN 'sabado' THEN 6
        WHEN 'domingo' THEN 7
        ELSE 8
      END,
      dm.hora_inicio
  `);
  return result.rows;
};

export const findDisponibilidadById = async (id_disponibilidad) => {
  const result = await pool.query(
    `SELECT 
      dm.id_disponibilidad,
      dm.id_medico,
      dm.dia_semana,
      TO_CHAR(dm.hora_inicio, 'HH24:MI:SS') AS hora_inicio,
      TO_CHAR(dm.hora_fin, 'HH24:MI:SS') AS hora_fin
    FROM disponibilidad_medicos dm
    WHERE dm.id_disponibilidad = $1`,
    [id_disponibilidad]
  );
  return result.rows[0];
};

export const findDisponibilidadByMedico = async (id_medico) => {
  const result = await pool.query(
    `SELECT 
      dm.id_disponibilidad,
      dm.id_medico,
      dm.dia_semana,
      TO_CHAR(dm.hora_inicio, 'HH24:MI:SS') AS hora_inicio,
      TO_CHAR(dm.hora_fin, 'HH24:MI:SS') AS hora_fin,
      u.nombre || ' ' || u.apellido AS nombre_medico,
      e.nombre_especialidad AS especialidad
    FROM disponibilidad_medicos dm
    JOIN medicos m ON dm.id_medico = m.id_medico
    JOIN usuario_sistema u ON m.id_usuario = u.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE dm.id_medico = $1
    ORDER BY 
      CASE dm.dia_semana
        WHEN 'lunes' THEN 1
        WHEN 'martes' THEN 2
        WHEN 'miercoles' THEN 3
        WHEN 'jueves' THEN 4
        WHEN 'viernes' THEN 5
        WHEN 'sabado' THEN 6
        WHEN 'domingo' THEN 7
      END,
      dm.hora_inicio`,
    [id_medico]
  );
  return result.rows;
};

export const createDisponibilidad = async (data) => {
  const { id_medico, dia_semana, hora_inicio, hora_fin } = data;

  const result = await pool.query(
    `INSERT INTO disponibilidad_medicos (id_medico, dia_semana, hora_inicio, hora_fin)
     VALUES ($1, $2, $3, $4)
     RETURNING 
       id_disponibilidad,
       id_medico,
       dia_semana,
       TO_CHAR(hora_inicio, 'HH24:MI:SS') AS hora_inicio,
       TO_CHAR(hora_fin, 'HH24:MI:SS') AS hora_fin`,
    [id_medico, dia_semana, hora_inicio, hora_fin]
  );

  return result.rows[0];
};

export const updateDisponibilidad = async (id_disponibilidad, data) => {
  const { dia_semana, hora_inicio, hora_fin } = data;

  const result = await pool.query(
    `UPDATE disponibilidad_medicos
     SET dia_semana = $1,
         hora_inicio = $2,
         hora_fin = $3
     WHERE id_disponibilidad = $4
     RETURNING 
       id_disponibilidad,
       id_medico,
       dia_semana,
       TO_CHAR(hora_inicio, 'HH24:MI:SS') AS hora_inicio,
       TO_CHAR(hora_fin, 'HH24:MI:SS') AS hora_fin`,
    [dia_semana, hora_inicio, hora_fin, id_disponibilidad]
  );

  return result.rows[0];
};

export const deleteDisponibilidad = async (id_disponibilidad) => {
  // Hard delete - eliminar registro permanentemente
  const result = await pool.query(
    `DELETE FROM disponibilidad_medicos
     WHERE id_disponibilidad = $1
     RETURNING id_disponibilidad`,
    [id_disponibilidad]
  );

  return result.rows[0];
};

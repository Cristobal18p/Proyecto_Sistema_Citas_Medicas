import pool from '../config/db.js';

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

export const getDisponibilidadPorMedico = async (id_medico) => {
  const result = await pool.query(`
    SELECT 
      dia_semana,
      TO_CHAR(hora_inicio, 'HH24:MI') AS hora_inicio,
      TO_CHAR(hora_fin, 'HH24:MI') AS hora_fin
    FROM disponibilidad_medicos
    WHERE id_medico = $1
    ORDER BY dia_semana, hora_inicio
  `, [id_medico]);

  return result.rows;
};

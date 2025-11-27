import pool from '../config/db.js';
export const findAllEspecialidades = async () => {
  const result = await pool.query(
    "SELECT * FROM especialidades ORDER BY nombre_especialidad"
  );
  return result.rows;
};
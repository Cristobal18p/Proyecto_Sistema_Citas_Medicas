import pool from "../config/db.js";

export const getAllHistorial = async () => {
  const result = await pool.query(
    `SELECT 
       h.id_consulta,
       h.id_cita,
       h.sintomas,
       h.diagnostico,
       h.tratamiento,
       TO_CHAR(h.fecha_registro, 'YYYY-MM-DD HH24:MI') AS fecha_registro,
       c.numero_seguimiento,
       p.nombre || ' ' || p.apellido AS paciente_nombre,
       u.nombre || ' ' || u.apellido AS medico_nombre
     FROM historial_consulta h
     JOIN citas c ON c.id_cita = h.id_cita
     JOIN pacientes p ON p.id_paciente = c.id_paciente
     JOIN medicos m ON m.id_medico = c.id_medico
     JOIN usuario_sistema u ON u.id_usuario = m.id_usuario
     ORDER BY h.fecha_registro DESC`
  );
  return result.rows;
};

export const getHistorialById = async (id_consulta) => {
  const result = await pool.query(
    `SELECT 
       h.id_consulta,
       h.id_cita,
       h.sintomas,
       h.diagnostico,
       h.tratamiento,
       TO_CHAR(h.fecha_registro, 'YYYY-MM-DD HH24:MI') AS fecha_registro
     FROM historial_consulta h
     WHERE h.id_consulta = $1`,
    [id_consulta]
  );
  return result.rows[0] || null;
};

export const createHistorial = async ({
  id_cita,
  sintomas,
  diagnostico,
  tratamiento,
}) => {
  // Verificar que la cita exista
  const cita = await pool.query(
    `SELECT id_cita, estado FROM citas WHERE id_cita = $1`,
    [id_cita]
  );
  if (cita.rowCount === 0) throw new Error("La cita no existe");

  // Registrar historial
  const result = await pool.query(
    `INSERT INTO historial_consulta (id_cita, sintomas, diagnostico, tratamiento)
     VALUES ($1, $2, $3, $4)
     RETURNING id_consulta, id_cita, sintomas, diagnostico, tratamiento, TO_CHAR(fecha_registro, 'YYYY-MM-DD HH24:MI') AS fecha_registro`,
    [id_cita, sintomas, diagnostico, tratamiento]
  );

  // Marcar cita como atendida
  await pool.query(`UPDATE citas SET estado = 'atendida' WHERE id_cita = $1`, [
    id_cita,
  ]);

  return result.rows[0];
};

export const updateHistorial = async (
  id_consulta,
  { sintomas, diagnostico, tratamiento }
) => {
  const result = await pool.query(
    `UPDATE historial_consulta
     SET sintomas = COALESCE($2, sintomas),
         diagnostico = COALESCE($3, diagnostico),
         tratamiento = COALESCE($4, tratamiento)
     WHERE id_consulta = $1
     RETURNING id_consulta, id_cita, sintomas, diagnostico, tratamiento, TO_CHAR(fecha_registro, 'YYYY-MM-DD HH24:MI') AS fecha_registro`,
    [id_consulta, sintomas, diagnostico, tratamiento]
  );
  return result.rows[0] || null;
};

export const deleteHistorial = async (id_consulta) => {
  const result = await pool.query(
    `DELETE FROM historial_consulta WHERE id_consulta = $1 RETURNING id_consulta`,
    [id_consulta]
  );
  return { deleted: result.rowCount > 0 };
};

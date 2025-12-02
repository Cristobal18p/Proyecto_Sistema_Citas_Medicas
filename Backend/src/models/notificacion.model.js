import pool from "../config/db.js";

export const createNotificacion = async (data) => {
  const {
    id_cita,
    tipo_notificacion,
    email_destinatario,
    asunto,
    estado,
    fecha_programada,
  } = data;

  const query = `
    INSERT INTO notificacion_cita 
      (id_cita, tipo_notificacion, email_destinatario, asunto, estado, fecha_programada)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    id_cita,
    tipo_notificacion,
    email_destinatario,
    asunto,
    estado || "enviado",
    fecha_programada,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const markAsFailed = async (id_notificacion, mensaje_error) => {
  const query = `
    UPDATE notificacion_cita 
    SET estado = 'fallido', mensaje_error = $2
    WHERE id_notificacion = $1
    RETURNING *
  `;

  const result = await pool.query(query, [id_notificacion, mensaje_error]);
  return result.rows[0];
};

export const getPendientes = async () => {
  const query = `
    SELECT nc.*, c.fecha_cita, c.hora_cita, 
           p.nombre, p.apellido, p.email,
           CONCAT(u.nombre, ' ', u.apellido) as nombre_medico, 
           e.nombre_especialidad,
           c.numero_seguimiento
    FROM notificacion_cita nc
    JOIN citas c ON nc.id_cita = c.id_cita
    JOIN pacientes p ON c.id_paciente = p.id_paciente
    JOIN medico med ON c.id_medico = med.id_medico
    JOIN usuario_sistema u ON med.id_usuario = u.id_usuario
    JOIN especialidad e ON med.id_especialidad = e.id_especialidad
    WHERE nc.estado = 'pendiente'
      AND nc.fecha_programada <= NOW()
      AND c.estado_cita = 'confirmada'
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const exists = async (id_cita, tipo_notificacion) => {
  const query = `
    SELECT * FROM notificacion_cita 
    WHERE id_cita = $1 AND tipo_notificacion = $2
  `;

  const result = await pool.query(query, [id_cita, tipo_notificacion]);
  return result.rows.length > 0;
};

export const markAsEnviado = async (id_notificacion) => {
  const query = `
    UPDATE notificacion_cita 
    SET estado = 'enviado', fecha_envio = CURRENT_TIMESTAMP
    WHERE id_notificacion = $1
    RETURNING *
  `;

  const result = await pool.query(query, [id_notificacion]);
  return result.rows[0];
};

import pool from "../config/db.js";

// Crear cita tanto para paciente (web) | recepcion (presencial)
export const createCitaWeb = async (data) => {
  const {
    id_paciente,
    id_medico,
    fecha_solicitud,
    tipo_cita,
    preferencia_turno,
    tipo_solicitud,
    creado_por,
    fecha_cita,
    hora_cita,
    fecha_confirmacion,
  } = data;

  // Validación estricta: solo paciente puede usar esta función
  if (creado_por !== "paciente") {
    throw new Error("Solo los pacientes pueden crear citas por la web");
  }

  // Validación: no se permite asignar fecha ni hora desde la web
  if (fecha_cita || hora_cita || fecha_confirmacion) {
    throw new Error(
      "El paciente no puede asignar fecha, hora ni confirmar la cita"
    );
  }

  // Generar número de seguimiento
  const seqResult = await pool.query("SELECT nextval('seq_citas') AS numero");
  const numero = seqResult.rows[0].numero;
  const year = new Date().getFullYear();
  const numero_seguimiento = `SEG-${year}-${String(numero).padStart(3, "0")}`;

  const estado = "pendiente";

  const result = await pool.query(
    `INSERT INTO citas (
      id_paciente, id_medico, fecha_solicitud, numero_seguimiento,
      tipo_cita, preferencia_turno, tipo_solicitud,
      estado, creado_por
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7,
      $8, $9
    )
    RETURNING id_cita, numero_seguimiento, estado`,
    [
      id_paciente,
      id_medico,
      fecha_solicitud,
      numero_seguimiento,
      tipo_cita,
      preferencia_turno,
      tipo_solicitud,
      estado,
      creado_por,
    ]
  );

  return result.rows[0];
};

export const createCitaRecepcion = async (data) => {
  const {
    id_paciente,
    id_medico,
    fecha_solicitud,
    tipo_cita,
    preferencia_turno,
    tipo_solicitud,
    creado_por,
    fecha_cita,
    hora_cita,
  } = data;

  // Validación de origen
  if (creado_por !== "recepcion") {
    throw new Error("Solo recepción puede usar esta API");
  }

  // Validación obligatoria de fecha y hora
  if (!fecha_cita || !hora_cita) {
    throw new Error("Recepción debe asignar fecha y hora a la cita");
  }

  // Generar número de seguimiento
  const seqResult = await pool.query("SELECT nextval('seq_citas') AS numero");
  const numero = seqResult.rows[0].numero;
  const year = new Date().getFullYear();
  const numero_seguimiento = `SEG-${year}-${String(numero).padStart(3, "0")}`;

  const estado = "confirmada";
  const fecha_confirmacion = new Date().toISOString().split("T")[0];

  const result = await pool.query(
    `INSERT INTO citas (
      id_paciente, id_medico, fecha_solicitud, numero_seguimiento,
      tipo_cita, preferencia_turno, tipo_solicitud,
      estado, fecha_confirmacion, fecha_cita, hora_cita, creado_por
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7,
      $8, $9, $10, $11, $12
    )
    RETURNING id_cita, numero_seguimiento, estado, fecha_cita, hora_cita, fecha_confirmacion`,
    [
      id_paciente,
      id_medico,
      fecha_solicitud,
      numero_seguimiento,
      tipo_cita,
      preferencia_turno,
      tipo_solicitud,
      estado,
      fecha_confirmacion,
      fecha_cita,
      hora_cita,
      creado_por,
    ]
  );

  return result.rows[0];
};

export const getDetalleCitaPorSeguimiento = async (numero_seguimiento) => {
  const result = await pool.query(
    `SELECT 
      c.id_cita,
      c.numero_seguimiento,
      c.estado AS estado_cita,
      c.tipo_cita,
      c.id_medico,
      TO_CHAR(c.fecha_cita, 'DD/MM/YYYY') AS fecha_cita,
      TO_CHAR(c.hora_cita, 'HH12:MI') AS hora_cita,
      c.preferencia_turno,
      TO_CHAR(c.fecha_solicitud, 'DD/MM/YYYY') AS fecha_solicitud,
      TO_CHAR(c.fecha_confirmacion, 'DD/MM/YYYY') AS fecha_confirmacion,
      p.nombre || ' ' || p.apellido AS paciente_nombre,
      u.nombre || ' ' || u.apellido AS medico_nombre,
      e.nombre_especialidad AS especialidad
    FROM citas c
    JOIN pacientes p ON p.id_paciente = c.id_paciente
    LEFT JOIN medicos m ON m.id_medico = c.id_medico
    LEFT JOIN usuario_sistema u ON u.id_usuario = m.id_usuario
    LEFT JOIN especialidades e ON e.id_especialidad = m.id_especialidad
    WHERE c.numero_seguimiento = $1`,
    [numero_seguimiento]
  );

  return result.rows[0] || null;
};

export const getCitasFiltradas = async ({ paciente, medico, especialidad }) => {
  let query = `
    SELECT 
      c.id_cita,
      c.numero_seguimiento,
      c.id_medico,
      TO_CHAR(c.fecha_solicitud, 'DD/MM/YYYY') AS fecha_solicitud,
      TO_CHAR(c.fecha_cita, 'DD/MM/YYYY') AS fecha_cita,
      TO_CHAR(c.fecha_confirmacion, 'DD/MM/YYYY') AS fecha_confirmacion,
      TO_CHAR(c.hora_cita, 'HH12:MI AM') AS hora_cita,
      c.preferencia_turno,
      c.estado AS estado_cita,
      c.tipo_cita,
      p.nombre || ' ' || p.apellido AS paciente_nombre,
      u.nombre || ' ' || u.apellido AS medico_nombre,
      e.nombre_especialidad AS especialidad
    FROM citas c
    JOIN pacientes p ON p.id_paciente = c.id_paciente
    LEFT JOIN medicos m ON m.id_medico = c.id_medico
    LEFT JOIN usuario_sistema u ON u.id_usuario = m.id_usuario
    LEFT JOIN especialidades e ON e.id_especialidad = m.id_especialidad
    WHERE 1=1
  `;

  const values = [];
  let index = 1;

  if (paciente) {
    query += ` AND (LOWER(p.nombre) LIKE LOWER($${index}) OR LOWER(p.apellido) LIKE LOWER($${index}))`;
    values.push(`%${paciente}%`);
    index++;
  }

  if (medico) {
    query += ` AND (LOWER(u.nombre) LIKE LOWER($${index}) OR LOWER(u.apellido) LIKE LOWER($${index}))`;
    values.push(`%${medico}%`);
    index++;
  }

  if (especialidad) {
    query += ` AND LOWER(e.nombre_especialidad) LIKE LOWER($${index})`;
    values.push(`%${especialidad}%`);
    index++;
  }

  query += ` ORDER BY c.fecha_cita DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

export const cancelarCita = async (numero_seguimiento, cancelado_por) => {
  const result = await pool.query(
    `UPDATE citas
     SET estado = 'cancelada',
         cancelado_por = $2,
         fecha_confirmacion = CURRENT_DATE
     WHERE numero_seguimiento = $1
     RETURNING 
       id_cita,
       numero_seguimiento,
       estado AS estado_cita,
       tipo_cita,
       TO_CHAR(fecha_solicitud, 'YYYY-MM-DD') AS fecha_solicitud,
       TO_CHAR(fecha_cita, 'YYYY-MM-DD') AS fecha_cita,
       TO_CHAR(hora_cita, 'HH24:MI') AS hora_cita,
       preferencia_turno,
       tipo_solicitud,
       TO_CHAR(fecha_confirmacion, 'YYYY-MM-DD') AS fecha_confirmacion,
       cancelado_por,
       id_medico`,
    [numero_seguimiento, cancelado_por]
  );

  return result.rows[0];
};

export const confirmarCita = async (id_cita, fecha_cita, hora_cita) => {
  const result = await pool.query(
    `UPDATE citas
     SET estado = 'confirmada',
         fecha_cita = $2,
         hora_cita = $3,
         fecha_confirmacion = CURRENT_DATE
     WHERE id_cita = $1
     RETURNING 
       id_cita,
       numero_seguimiento,
       estado AS estado_cita,
       tipo_cita,
       TO_CHAR(fecha_solicitud, 'YYYY-MM-DD') AS fecha_solicitud,
       TO_CHAR(fecha_cita, 'YYYY-MM-DD') AS fecha_cita,
       TO_CHAR(hora_cita, 'HH24:MI') AS hora_cita,
       preferencia_turno,
       tipo_solicitud,
       TO_CHAR(fecha_confirmacion, 'YYYY-MM-DD') AS fecha_confirmacion,
       cancelado_por,
       id_medico`,
    [id_cita, fecha_cita, hora_cita]
  );

  return result.rows[0] || null;
};

export const getCitas = async () => {
  const result = await pool.query(`
    SELECT 
      c.id_cita, 
      c.id_medico,
      c.numero_seguimiento,
      c.estado AS estado_cita,
      c.tipo_cita,
      TO_CHAR(c.fecha_solicitud, 'YYYY-MM-DD') AS fecha_solicitud,
      TO_CHAR(c.fecha_cita, 'YYYY-MM-DD') AS fecha_cita,
      TO_CHAR(c.hora_cita, 'HH24:MI') AS hora_cita,
      c.preferencia_turno,
      TO_CHAR(c.fecha_confirmacion, 'YYYY-MM-DD') AS fecha_confirmacion,
      c.cancelado_por,
      p.nombre || ' ' || p.apellido AS paciente_nombre,
      u.nombre || ' ' || u.apellido AS medico_nombre,
      e.nombre_especialidad AS especialidad
    FROM citas c
    JOIN pacientes p ON p.id_paciente = c.id_paciente
    LEFT JOIN medicos m ON m.id_medico = c.id_medico
    LEFT JOIN usuario_sistema u ON u.id_usuario = m.id_usuario
    LEFT JOIN especialidades e ON e.id_especialidad = m.id_especialidad
    ORDER BY c.fecha_cita DESC NULLS LAST, c.hora_cita ASC
  `);

  return result.rows;
};

export const updateCita = async (
  id_cita,
  { fecha_cita, hora_cita, fecha_confirmacion }
) => {
  if (!fecha_cita && !hora_cita && !fecha_confirmacion) {
    throw new Error("Debe proporcionar al menos un campo para actualizar");
  }

  let query = `UPDATE citas SET `;
  const values = [];
  let index = 1;

  if (fecha_cita) {
    query += `fecha_cita = $${index}, `;
    values.push(fecha_cita);
    index++;
  }

  if (hora_cita) {
    query += `hora_cita = $${index}, `;
    values.push(hora_cita);
    index++;
  }

  if (fecha_confirmacion) {
    query += `fecha_confirmacion = $${index}, `;
    values.push(fecha_confirmacion);
    index++;
  }

  // Elimina la coma final
  query = query.slice(0, -2);

  // Ahora filtra por id_cita
  query += ` WHERE id_cita = $${index} RETURNING *`;
  values.push(id_cita);

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

export const updateEstadoCita = async (id_cita, nuevoEstado) => {
  const estadosValidos = ["pendiente", "confirmada", "cancelada", "atendida"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado inválido");
  }
  const result = await pool.query(
    `UPDATE citas SET estado = $2
     WHERE id_cita = $1
     RETURNING 
       id_cita,
       numero_seguimiento,
       estado AS estado_cita,
       tipo_cita,
       TO_CHAR(fecha_solicitud, 'YYYY-MM-DD') AS fecha_solicitud,
       TO_CHAR(fecha_cita, 'YYYY-MM-DD') AS fecha_cita,
       TO_CHAR(hora_cita, 'HH24:MI') AS hora_cita,
       preferencia_turno,
       tipo_solicitud,
       TO_CHAR(fecha_confirmacion, 'YYYY-MM-DD') AS fecha_confirmacion,
       cancelado_por,
       id_medico`,
    [id_cita, nuevoEstado]
  );
  return result.rows[0] || null;
};

export const obtenerCitasPorMedico = async (id_medico) => {
  const result = await pool.query(
    `SELECT 
      c.id_cita,
      c.numero_seguimiento,
      c.estado AS estado_cita,
      c.tipo_cita,
      TO_CHAR(c.fecha_solicitud, 'YYYY-MM-DD') AS fecha_solicitud,
      TO_CHAR(c.fecha_cita, 'YYYY-MM-DD') AS fecha_cita,
      TO_CHAR(c.hora_cita, 'HH24:MI') AS hora_cita,
      p.nombre || ' ' || p.apellido AS paciente_nombre,
      c.id_medico,
      p.id_paciente,
      e.nombre_especialidad AS especialidad,
      TO_CHAR(c.fecha_confirmacion, 'YYYY-MM-DD') AS fecha_confirmacion
    FROM citas c
    JOIN pacientes p ON c.id_paciente = p.id_paciente 
    JOIN medicos m On c.id_medico = m.id_medico
    JOIN especialidades e ON e.id_especialidad = m.id_especialidad
    WHERE c.id_medico = $1 AND c.estado IN ('confirmada', 'atendida')
    ORDER BY c.fecha_cita ASC, c.hora_cita ASC`,
    [id_medico]
  );

  return result.rows;
};

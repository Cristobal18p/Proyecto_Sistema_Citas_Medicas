import * as CitaModel from "../models/cita.model.js";
import * as NotificacionModel from "../models/notificacion.model.js";
import {
  enviarSolicitudCita,
  enviarConfirmacionCita,
} from "../services/email.service.js";

export const createCita = async (req, res) => {
  try {
    const { creado_por } = req.body;

    let nueva;
    if (creado_por === "paciente") {
      nueva = await CitaModel.createCitaWeb(req.body);
    } else if (creado_por === "recepcion") {
      nueva = await CitaModel.createCitaRecepcion(req.body);
    } else {
      throw new Error("Origen de creación inválido");
    }

    // Obtener detalle de la cita para enviar correos
    try {
      const detalleCita = await CitaModel.getDetalleCitaPorSeguimiento(
        nueva.numero_seguimiento
      );

      if (detalleCita && detalleCita.email_paciente) {
        // Si fue creado por paciente web, enviar correo de solicitud
        if (creado_por === "paciente") {
          await enviarSolicitudCita(detalleCita);
          await NotificacionModel.createNotificacion({
            id_cita: nueva.id_cita,
            tipo_notificacion: "solicitud",
            email_destinatario: detalleCita.email_paciente,
            asunto: "Solicitud de cita recibida",
          });
        }
        // Si fue creado por recepción Y tiene fecha/hora, enviar confirmación
        else if (
          creado_por === "recepcion" &&
          detalleCita.fecha_cita &&
          detalleCita.hora_cita
        ) {
          await enviarConfirmacionCita(detalleCita);
          await NotificacionModel.createNotificacion({
            id_cita: nueva.id_cita,
            tipo_notificacion: "confirmacion",
            email_destinatario: detalleCita.email_paciente,
            asunto: "Confirmación de cita médica",
          });

          // Programar recordatorio 24h antes
          const fechaCita = new Date(
            `${detalleCita.fecha_cita.split("/").reverse().join("-")}T${
              detalleCita.hora_cita
            }`
          );
          const fecha24hAntes = new Date(
            fechaCita.getTime() - 24 * 60 * 60 * 1000
          );

          await NotificacionModel.createNotificacion({
            id_cita: nueva.id_cita,
            tipo_notificacion: "recordatorio_24h",
            email_destinatario: detalleCita.email_paciente,
            asunto: "Recordatorio de cita - Mañana",
            estado: "pendiente",
            fecha_programada: fecha24hAntes.toISOString(),
          });

          console.log("✅ Correo de confirmación enviado por recepción");
          console.log("📅 Recordatorio programado para:", fecha24hAntes);
        }
      }
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError);
      // No fallar la creación de cita si falla el correo
    }

    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener detalle de cita por numero de seguimiento
export const ObtenerCitaPorSeguimiento = async (req, res) => {
  try {
    const cita = await CitaModel.getDetalleCitaPorSeguimiento(
      req.params.numero
    );

    if (!cita) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }
    res.json(cita);
  } catch (err) {
    console.error("Error al buscar cita", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener citas por filtros.
export const obtenerCitas = async (req, res) => {
  const { paciente, medico, especialidad } = req.query;

  try {
    const citas = await CitaModel.getCitasFiltradas({
      paciente,
      medico,
      especialidad,
    });

    res.json(citas);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Cancelar cita (Paciente o Recepción)
export const cancelarCitaController = async (req, res) => {
  const { numero } = req.params;
  const { cancelado_por } = req.body;

  if (!["paciente", "recepcion"].includes(cancelado_por)) {
    return res.status(400).json({ message: "Origen de cancelación inválido" });
  }

  try {
    const citaCancelada = await CitaModel.cancelarCita(numero, cancelado_por);

    if (!citaCancelada) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json(citaCancelada);
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    res.status(500).json({ message: "Error al cancelar la cita" });
  }
};

export const confirmarCitaController = async (req, res) => {
  const { id_cita } = req.params;
  const { fecha_cita, hora_cita } = req.body;

  if (!fecha_cita || !hora_cita) {
    return res
      .status(400)
      .json({ message: "Debe enviar fecha_cita y hora_cita" });
  }

  try {
    const citaConfirmada = await CitaModel.confirmarCita(
      id_cita,
      fecha_cita,
      hora_cita
    );

    if (!citaConfirmada) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // Enviar correo de confirmación
    try {
      const detalleCita = await CitaModel.getDetalleCitaPorSeguimiento(
        citaConfirmada.numero_seguimiento
      );

      if (detalleCita) {
        await enviarConfirmacionCita(detalleCita);
        await NotificacionModel.createNotificacion({
          id_cita: citaConfirmada.id_cita,
          tipo_notificacion: "confirmacion",
          email_destinatario: detalleCita.email_paciente,
          asunto: "Confirmación de cita médica",
        });

        // Programar recordatorio 24h antes
        const fechaCita = new Date(`${fecha_cita}T${hora_cita}`);
        const fecha24hAntes = new Date(
          fechaCita.getTime() - 24 * 60 * 60 * 1000
        );

        await NotificacionModel.createNotificacion({
          id_cita: citaConfirmada.id_cita,
          tipo_notificacion: "recordatorio_24h",
          email_destinatario: detalleCita.email_paciente,
          asunto: "Recordatorio de cita - Mañana",
          estado: "pendiente",
          fecha_programada: fecha24hAntes.toISOString(),
        });
      }
    } catch (emailError) {
      console.error("Error al enviar correo de confirmación:", emailError);
      // No fallar la confirmación si falla el correo
    }

    res.json(citaConfirmada);
  } catch (error) {
    console.error("Error al confirmar cita:", error);
    res.status(500).json({ message: "Error al confirmar la cita" });
  }
};

export const getCitas = async (req, res) => {
  try {
    const citas = await CitaModel.getCitas();
    res.json(citas);
  } catch (err) {
    console.error("Error al obtener citas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateCitaController = async (req, res) => {
  const { id } = req.params; // id de la cita
  const { fecha_cita, hora_cita, fecha_confirmacion } = req.body;

  try {
    const citaActualizada = await CitaModel.updateCita(id, {
      fecha_cita,
      hora_cita,
      fecha_confirmacion,
    });

    if (!citaActualizada) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json({
      message: "Cita actualizada correctamente",
      cita: citaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarEstadoCitaController = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ message: "Debe enviar estado" });
  try {
    const citaActualizada = await CitaModel.updateEstadoCita(id, estado);
    if (!citaActualizada)
      return res.status(404).json({ message: "Cita no encontrada" });
    res.json(citaActualizada);
  } catch (err) {
    console.error("Error al actualizar estado cita:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getCitasMedicos = async (req, res) => {
  const { id_medico } = req.params;

  try {
    const citas = await CitaModel.obtenerCitasPorMedico(id_medico);

    if (!citas || citas.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron citas para este médico" });
    }

    res.json({
      message: "Citas obtenidas correctamente",
      citas,
    });
  } catch (error) {
    console.error("Error al obtener citas del médico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

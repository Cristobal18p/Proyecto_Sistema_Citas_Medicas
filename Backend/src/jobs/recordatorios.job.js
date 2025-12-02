import cron from "node-cron";
import { getPendientes, markAsEnviado } from "../models/notificacion.model.js";
import { enviarRecordatorio24h } from "../services/email.service.js";

// Ejecutar cada hora para verificar recordatorios pendientes
export const iniciarCronRecordatorios = () => {
  // Ejecutar cada hora: '0 * * * *'
  // Para testing cada minuto: '* * * * *'
  cron.schedule("0 * * * *", async () => {
    console.log("🔔 [CRON] Verificando recordatorios de citas pendientes...");

    try {
      // Obtener notificaciones pendientes que ya llegó su hora de enviar
      const notificaciones = await getPendientes();

      if (notificaciones.length === 0) {
        console.log("✅ [CRON] No hay recordatorios pendientes por enviar");
        return;
      }

      console.log(
        `📧 [CRON] Encontrados ${notificaciones.length} recordatorio(s) por enviar`
      );

      // Enviar cada recordatorio
      for (const notif of notificaciones) {
        try {
          await enviarRecordatorio24h({
            email: notif.email,
            nombre: notif.nombre,
            apellido: notif.apellido,
            numero_seguimiento: notif.numero_seguimiento,
            fecha_cita: notif.fecha_cita,
            hora_cita: notif.hora_cita,
            nombre_medico: notif.nombre_medico,
            nombre_especialidad: notif.nombre_especialidad,
          });

          // Marcar como enviado
          await markAsEnviado(notif.id_notificacion);

          console.log(
            `✅ [CRON] Recordatorio enviado a ${notif.email} para cita ${notif.numero_seguimiento}`
          );
        } catch (error) {
          console.error(
            `❌ [CRON] Error al enviar recordatorio a ${notif.email}:`,
            error.message
          );
        }
      }

      console.log(`🎉 [CRON] Proceso de recordatorios completado`);
    } catch (error) {
      console.error("❌ [CRON] Error en el proceso de recordatorios:", error);
    }
  });

  console.log("✅ Cron job de recordatorios iniciado (se ejecuta cada hora)");
};

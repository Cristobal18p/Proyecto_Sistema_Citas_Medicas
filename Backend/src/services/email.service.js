import nodemailer from "nodemailer";

// Configurar transporter para Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// 1. Email de solicitud de cita
export const enviarSolicitudCita = async (cita) => {
  const mailOptions = {
    from: '"Clínica Santana" <noreply@clinicasantana.com>',
    to: cita.email_paciente || cita.email,
    subject: "Solicitud de Cita Recibida - Clínica Santana",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: #eff6ff; padding: 15px; margin: 15px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .highlight { color: #2563eb; font-weight: bold; font-size: 18px; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #1e40af; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="text-align: center; margin-bottom: 10px;">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0iIzI1NjNFQiIgb3BhY2l0eT0iMC4xIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4NSIgZmlsbD0iI0ZGRkZGRiIvPgogIDxyZWN0IHg9Ijg1IiB5PSI1MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwMCIgcng9IjQiIGZpbGw9IiMyNTYzRUIiLz4KICA8cmVjdCB4PSI1MCIgeT0iODUiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIi8+CiAgPGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iOCIgZmlsbD0iIzNCODJGNiIgb3BhY2l0eT0iMC42Ii8+CiAgPGNpcmNsZSBjeD0iMTMwIiBjeT0iNzAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuNiIvPgogIDxjaXJjbGUgY3g9IjcwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjM0I4MkY2IiBvcGFjaXR5PSIwLjYiLz4KICA8Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMzAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuNiIvPgogIDxwYXRoIGQ9Ik0gMzAgMTY1IEwgNTAgMTY1IEwgNjAgMTU1IEwgNzAgMTc1IEwgODAgMTQ1IEwgOTAgMTY1IEwgMTcwIDE2NSIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTUiIHN0cm9rZT0iIzI1NjNFQiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==" alt="Clínica Santana" style="height: 80px; width: 80px; margin-bottom: 10px;">
            </div>
            <h1>🏥 Clínica Santana</h1>
          </div>
          <div class="content">
            <h2>Solicitud de Cita Recibida</h2>
            <p>Estimado/a <strong>${cita.nombre_paciente || cita.nombre} ${
      cita.apellido_paciente || cita.apellido
    }</strong>,</p>
            <p>Hemos recibido su solicitud de cita médica. Los detalles son los siguientes:</p>
            
            <div class="info-box">
              <p style="margin: 5px 0;"><strong>📋 Número de Seguimiento:</strong> <span class="highlight">${
                cita.numero_seguimiento
              }</span></p>
              <p style="margin: 5px 0;"><strong>🏥 Especialidad:</strong> ${
                cita.especialidad || cita.nombre_especialidad
              }</p>
              <p style="margin: 5px 0;"><strong>📊 Estado:</strong> <span style="color: #f59e0b;">Pendiente de Confirmación</span></p>
            </div>

            <p>Su cita será revisada y confirmada por nuestro personal de recepción en las próximas horas. Recibirá un correo de confirmación con los detalles finales.</p>
            
            <p style="background-color: #fef3c7; padding: 10px; border-radius: 4px;"><strong>⚠️ Importante:</strong> Guarde su número de seguimiento <strong>${
              cita.numero_seguimiento
            }</strong> para cualquier consulta.</p>
            
            <div class="footer">
              <p><strong>Clínica Santana</strong></p>
              <p>Cuidando de su salud 💙</p>
              <p style="font-size: 10px; color: #9ca3af; margin-top: 10px;">Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// 2. Email de confirmación de cita
export const enviarConfirmacionCita = async (cita) => {
  const mailOptions = {
    from: '"Clínica Santana" <noreply@clinicasantana.com>',
    to: cita.email_paciente || cita.email,
    subject: "✅ Cita Confirmada - Clínica Santana",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
          .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: #d1fae5; padding: 15px; margin: 15px 0; border-left: 4px solid #059669; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .highlight { color: #059669; font-weight: bold; font-size: 18px; }
          .importante { background-color: #fef3c7; padding: 15px; border-radius: 4px; margin: 15px 0; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #047857; margin-top: 0; }
          ul { margin: 10px 0; padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="text-align: center; margin-bottom: 10px;">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0iIzI1NjNFQiIgb3BhY2l0eT0iMC4xIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4NSIgZmlsbD0iI0ZGRkZGRiIvPgogIDxyZWN0IHg9Ijg1IiB5PSI1MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwMCIgcng9IjQiIGZpbGw9IiMyNTYzRUIiLz4KICA8cmVjdCB4PSI1MCIgeT0iODUiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIi8+CiAgPGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iOCIgZmlsbD0iIzNCODJGNiIgb3BhY2l0eT0iMC42Ii8+CiAgPGNpcmNsZSBjeD0iMTMwIiBjeT0iNzAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuNiIvPgogIDxjaXJjbGUgY3g9IjcwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjM0I4MkY2IiBvcGFjaXR5PSIwLjYiLz4KICA8Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMzAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuNiIvPgogIDxwYXRoIGQ9Ik0gMzAgMTY1IEwgNTAgMTY1IEwgNjAgMTU1IEwgNzAgMTc1IEwgODAgMTQ1IEwgOTAgMTY1IEwgMTcwIDE2NSIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTUiIHN0cm9rZT0iIzI1NjNFQiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==" alt="Clínica Santana" style="height: 80px; width: 80px; margin-bottom: 10px;">
            </div>
            <h1>✅ Cita Confirmada</h1>
          </div>
          <div class="content">
            <p>Estimado/a <strong>${cita.nombre_paciente || cita.nombre} ${
      cita.apellido_paciente || cita.apellido
    }</strong>,</p>
            <p>Nos complace informarle que su cita ha sido <strong class="highlight">CONFIRMADA</strong> exitosamente.</p>
            
            <div class="info-box">
              <p style="margin: 5px 0;"><strong>📋 Número de Seguimiento:</strong> ${
                cita.numero_seguimiento
              }</p>
              <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${
                cita.fecha_cita
              }</p>
              <p style="margin: 5px 0;"><strong>🕐 Hora:</strong> ${
                cita.hora_cita
              }</p>
              <p style="margin: 5px 0;"><strong>👨‍⚕️ Médico:</strong> Dr(a). ${
                cita.medico_nombre || cita.nombre_medico
              }</p>
              <p style="margin: 5px 0;"><strong>🏥 Especialidad:</strong> ${
                cita.especialidad || cita.nombre_especialidad
              }</p>
            </div>

            <div class="importante">
              <p style="margin-top: 0;"><strong>⏰ Recomendaciones importantes:</strong></p>
              <ul style="margin-bottom: 0;">
                <li>Llegue <strong>10 minutos antes</strong> de su cita</li>
                <li>Traiga su <strong>documento de identidad</strong></li>
                <li>Si tiene <strong>exámenes previos</strong>, tráigalos consigo</li>
                <li>Use <strong>mascarilla</strong> dentro de las instalaciones</li>
              </ul>
            </div>

            <p style="background-color: #dbeafe; padding: 10px; border-radius: 4px;">🔔 Recibirá un recordatorio automático <strong>24 horas antes</strong> de su cita.</p>
            
            <div class="footer">
              <p><strong>Clínica Santana</strong></p>
              <p>Cuidando de su salud 💙</p>
              <p>📞 Contacto: (123) 456-7890 | 📧 info@clinicasantana.com</p>
              <p style="font-size: 10px; color: #9ca3af; margin-top: 10px;">Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// 3. Email de recordatorio 24h antes
export const enviarRecordatorio24h = async (cita) => {
  const mailOptions = {
    from: '"Clínica Santana" <noreply@clinicasantana.com>',
    to: cita.email || cita.email_paciente,
    subject: "🔔 Recordatorio: Cita Mañana - Clínica Santana",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
          .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: #fef3c7; padding: 15px; margin: 15px 0; border-left: 4px solid #f59e0b; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .highlight { color: #f59e0b; font-weight: bold; font-size: 22px; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #d97706; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="text-align: center; margin-bottom: 10px;">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0iIzI1NjNFQiIgb3BhY2l0eT0iMC4xIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4NSIgZmlsbD0iI0ZGRkZGRiIvPgogIDxyZWN0IHg9Ijg1IiB5PSI1MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwMCIgcng9IjQiIGZpbGw9IiMyNTYzRUIiLz4KICA8cmVjdCB4PSI1MCIgeT0iODUiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIi8+CiAgPGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iOCIgZmlsbD0iIzNCODJGNiIgb3BhY2l0eT0iMC42Ii8+CiAgPGNpcmNsZSBjeD0iMTMwIiBjeT0iNzAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuNiIvPgogIDxjaXJjbGUgY3g9IjcwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjM0I4MkY2IiBvcGFjaXR5PSIwLjYiLz4KICA8Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMzAiIHI9IjgiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuNiIvPgogIDxwYXRoIGQ9Ik0gMzAgMTY1IEwgNTAgMTY1IEwgNjAgMTU1IEwgNzAgMTc1IEwgODAgMTQ1IEwgOTAgMTY1IEwgMTcwIDE2NSIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTUiIHN0cm9rZT0iIzI1NjNFQiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==" alt="Clínica Santana" style="height: 80px; width: 80px; margin-bottom: 10px;">
            </div>
            <h1>🔔 Recordatorio de Cita</h1>
          </div>
          <div class="content">
            <p>Estimado/a <strong>${cita.nombre || cita.nombre_paciente} ${
      cita.apellido || cita.apellido_paciente
    }</strong>,</p>
            <p class="highlight">⏰ Le recordamos que tiene una cita médica MAÑANA</p>
            
            <div class="info-box">
              <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${
                cita.fecha_cita
              }</p>
              <p style="margin: 5px 0;"><strong>🕐 Hora:</strong> ${
                cita.hora_cita
              }</p>
              <p style="margin: 5px 0;"><strong>👨‍⚕️ Médico:</strong> Dr(a). ${
                cita.nombre_medico || cita.medico_nombre
              }</p>
              <p style="margin: 5px 0;"><strong>🏥 Especialidad:</strong> ${
                cita.nombre_especialidad || cita.especialidad
              }</p>
            </div>

            <p style="background-color: #fee2e2; padding: 15px; border-radius: 4px; border-left: 4px solid #ef4444;">
              <strong>⏰ IMPORTANTE:</strong> Por favor, llegue <strong>10 minutos antes</strong> de su hora programada.
            </p>
            
            <p>Si necesita <strong>cancelar o reprogramar</strong> su cita, comuníquese con nosotros lo antes posible al <strong>(123) 456-7890</strong>.</p>
            
            <div class="footer">
              <p><strong>Clínica Santana</strong></p>
              <p>Cuidando de su salud 💙</p>
              <p>📞 Contacto: (123) 456-7890</p>
              <p style="font-size: 10px; color: #9ca3af; margin-top: 10px;">Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

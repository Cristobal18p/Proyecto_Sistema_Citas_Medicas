import { Cita, DisponibilidadMedico } from '../lib/mockData';

interface DatosReporte {
  citas: Cita[];
  disponibilidad: DisponibilidadMedico[];
  citasPorMedico: Array<{
    medico: string;
    especialidad: string;
    total: number;
    atendidas: number;
    pendientes: number;
  }>;
  horasPorMedico: Array<{
    medico: string;
    especialidad: string;
    diasDisponibles: number;
    horasSemanales: number;
  }>;
}

export function generarReporteHTML(datos: DatosReporte): string {
  const fecha = new Date().toLocaleDateString('es-PA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalCitas = datos.citas.length;
  const citasPendientes = datos.citas.filter(c => c.estado === 'pendiente').length;
  const citasConfirmadas = datos.citas.filter(c => c.estado === 'confirmada').length;
  const citasAtendidas = datos.citas.filter(c => c.estado === 'atendido').length;
  const citasCanceladas = datos.citas.filter(c => c.estado === 'cancelada').length;
  const citasNuevas = datos.citas.filter(c => c.tipo_cita === 'nueva').length;
  const citasControl = datos.citas.filter(c => c.tipo_cita === 'control').length;

  // Logo SVG en base64
  const logoSVG = `data:image/svg+xml;base64,${btoa(`
<svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="95" fill="#2563EB" opacity="0.1"/>
  <circle cx="100" cy="100" r="85" fill="#FFFFFF"/>
  <rect x="85" y="50" width="30" height="100" rx="4" fill="#2563EB"/>
  <rect x="50" y="85" width="100" height="30" rx="4" fill="#2563EB"/>
  <circle cx="70" cy="70" r="8" fill="#3B82F6" opacity="0.6"/>
  <circle cx="130" cy="70" r="8" fill="#3B82F6" opacity="0.6"/>
  <circle cx="70" cy="130" r="8" fill="#3B82F6" opacity="0.6"/>
  <circle cx="130" cy="130" r="8" fill="#3B82F6" opacity="0.6"/>
  <path d="M 30 165 L 50 165 L 60 155 L 70 175 L 80 145 L 90 165 L 170 165" 
        stroke="#10B981" 
        stroke-width="3" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        fill="none"/>
  <circle cx="100" cy="100" r="95" stroke="#2563EB" stroke-width="2" fill="none"/>
</svg>
    `)}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte General - Clínica San Osorio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .logo-container {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .logo {
      max-width: 120px;
      height: auto;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    
    .header h1 {
      color: #1e3a8a;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .header h2 {
      color: #64748b;
      font-size: 18px;
      font-weight: normal;
      margin-bottom: 5px;
    }
    
    .fecha {
      color: #64748b;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section-title {
      background: #f1f5f9;
      color: #1e3a8a;
      padding: 12px 15px;
      font-size: 16px;
      font-weight: 600;
      border-left: 4px solid #2563eb;
      margin-bottom: 15px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    
    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 5px;
    }
    
    .stat-card .label {
      color: #64748b;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
    }
    
    thead {
      background: #1e3a8a;
      color: white;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    
    tbody tr:hover {
      background: #f8fafc;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .badge-pendiente {
      background: #fef3c7;
      color: #92400e;
    }
    
    .badge-confirmada {
      background: #d1fae5;
      color: #065f46;
    }
    
    .badge-atendido {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .badge-cancelada {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .stat-card {
        break-inside: avoid;
      }
      
      table {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- LOGO -->
  <div class="logo-container">
    <img src="${logoSVG}" alt="Logo Clínica" class="logo" />
  </div>
  
  <!-- HEADER -->
  <div class="header">
    <h1>Clínica San Osorio</h1>
    <h2>Reporte General de Gestión</h2>
    <p class="fecha">Generado el: ${fecha}</p>
  </div>

  <!-- ESTADÍSTICAS GENERALES -->
  <div class="section">
    <h3 class="section-title">📊 Estadísticas Generales</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${totalCitas}</div>
        <div class="label">Total Citas</div>
      </div>
      <div class="stat-card">
        <div class="value">${citasPendientes}</div>
        <div class="label">Pendientes</div>
      </div>
      <div class="stat-card">
        <div class="value">${citasConfirmadas}</div>
        <div class="label">Confirmadas</div>
      </div>
      <div class="stat-card">
        <div class="value">${citasAtendidas}</div>
        <div class="label">Atendidas</div>
      </div>
      <div class="stat-card">
        <div class="value">${citasCanceladas}</div>
        <div class="label">Canceladas</div>
      </div>
    </div>
  </div>

  <!-- DISTRIBUCIÓN POR TIPO -->
  <div class="section">
    <h3 class="section-title">📋 Distribución por Tipo de Cita</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${citasNuevas}</div>
        <div class="label">Citas Nuevas</div>
      </div>
      <div class="stat-card">
        <div class="value">${citasControl}</div>
        <div class="label">Citas de Control</div>
      </div>
      <div class="stat-card">
        <div class="value">${Math.round((citasNuevas / totalCitas) * 100) || 0}%</div>
        <div class="label">% Nuevas</div>
      </div>
      <div class="stat-card">
        <div class="value">${Math.round((citasControl / totalCitas) * 100) || 0}%</div>
        <div class="label">% Control</div>
      </div>
    </div>
  </div>

  <!-- RENDIMIENTO POR MÉDICO -->
  <div class="section">
    <h3 class="section-title">👨‍⚕️ Rendimiento por Médico</h3>
    <table>
      <thead>
        <tr>
          <th>Médico</th>
          <th>Especialidad</th>
          <th>Total Citas</th>
          <th>Atendidas</th>
          <th>Pendientes</th>
          <th>% Efectividad</th>
        </tr>
      </thead>
      <tbody>
        ${datos.citasPorMedico
      .sort((a, b) => b.total - a.total)
      .map(item => {
        const efectividad = item.total > 0 ? Math.round((item.atendidas / item.total) * 100) : 0;
        return `
              <tr>
                <td><strong>${item.medico}</strong></td>
                <td>${item.especialidad}</td>
                <td>${item.total}</td>
                <td>${item.atendidas}</td>
                <td>${item.pendientes}</td>
                <td>${efectividad}%</td>
              </tr>
            `;
      }).join('')}
      </tbody>
    </table>
  </div>

  <!-- DISPONIBILIDAD DE MÉDICOS -->
  <div class="section">
    <h3 class="section-title">⏰ Disponibilidad de Médicos</h3>
    <table>
      <thead>
        <tr>
          <th>Médico</th>
          <th>Especialidad</th>
          <th>Días Disponibles</th>
          <th>Horas Semanales</th>
        </tr>
      </thead>
      <tbody>
        ${datos.horasPorMedico
      .sort((a, b) => b.horasSemanales - a.horasSemanales)
      .map(item => `
            <tr>
              <td><strong>${item.medico}</strong></td>
              <td>${item.especialidad}</td>
              <td>${item.diasDisponibles} días</td>
              <td>${item.horasSemanales} horas</td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  </div>

  <!-- DETALLES DE CITAS RECIENTES -->
  <div class="section">
    <h3 class="section-title">📅 Últimas 10 Citas Registradas</h3>
    <table>
      <thead>
        <tr>
          <th>N° Seguimiento</th>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${datos.citas
      .slice(-10)
      .reverse()
      .map(cita => {
        const estadoBadgeClass =
          cita.estado === 'pendiente' ? 'badge-pendiente' :
            cita.estado === 'confirmada' ? 'badge-confirmada' :
              cita.estado === 'atendido' ? 'badge-atendido' : 'badge-cancelada';

        return `
              <tr>
                <td>${cita.numero_seguimiento}</td>
                <td>${cita.paciente_nombre}</td>
                <td>${cita.medico_nombre}</td>
                <td>${cita.fecha_cita.split('-').reverse().join('/')}</td>
                <td>${cita.tipo_cita === 'nueva' ? 'Nueva' : 'Control'}</td>
                <td><span class="badge ${estadoBadgeClass}">${cita.estado === 'pendiente' ? 'Pendiente' :
            cita.estado === 'confirmada' ? 'Confirmada' :
              cita.estado === 'atendido' ? 'Atendido' : 'Cancelada'
          }</span></td>
              </tr>
            `;
      }).join('')}
      </tbody>
    </table>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p><strong>Clínica San Osorio</strong> - Sistema de Citas Médicas</p>
    <p>Este documento es confidencial y de uso exclusivo para fines administrativos</p>
  </div>
</body>
</html>
  `.trim();
}

export function imprimirReportePDF(htmlContent: string) {
  // Crear iframe oculto
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Esperar a que se cargue el contenido antes de imprimir
    iframe.onload = () => {
      iframe.contentWindow?.print();

      // Eliminar el iframe después de imprimir
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }
}

# 🏥 Sistema de Citas Médicas - Clínica Santana

Sistema web completo para la gestión de citas médicas, pacientes, médicos y notificaciones automatizadas por correo electrónico.

## 📋 Descripción

Aplicación full-stack que permite la gestión integral de una clínica médica, incluyendo:

- **Portal de Pacientes**: Solicitud de citas en línea con seguimiento
- **Módulo de Recepción**: Gestión de citas, confirmación y registro de pacientes
- **Dashboard de Médicos**: Visualización de agenda y gestión de historiales clínicos
- **Panel de Gerencia**: Reportes, estadísticas y gestión de disponibilidad médica
- **Sistema de Notificaciones**: Emails automatizados para solicitudes, confirmaciones y recordatorios

## 🚀 Tecnologías

### Backend

- **Node.js** con Express
- **PostgreSQL** (Base de datos)
- **Nodemailer** (Envío de emails)
- **node-cron** (Tareas programadas)

### Frontend

- **React** con TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos)
- **Radix UI** (Componentes)
- **shadcn/ui** (UI Library)

## 📦 Estructura del Proyecto

```
Sistema de Citas Clinica Medica/
├── Backend/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de API
│   │   ├── services/       # Servicios (email)
│   │   ├── jobs/           # Tareas programadas (cron)
│   │   └── index.js        # Punto de entrada
│   ├── .env.example        # Variables de entorno (plantilla)
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Llamadas a API
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilidades (PDF, etc.)
│   │   └── App.tsx         # Componente principal
│   ├── public/             # Archivos estáticos
│   └── package.json
│
└── Database/
    ├── datos.sql           # Schema y datos iniciales
    └── migracion_*.sql     # Scripts de migración
```

## ⚙️ Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/Cristobal18p/Proyecto_Sistema_Citas_Medicas.git
cd Proyecto_Sistema_Citas_Medicas
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE clinica_db;
CREATE USER admin_clinica WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE clinica_db TO admin_clinica;
\q

# Importar schema y datos
psql -U admin_clinica -d clinica_db -f Database/datos.sql
```

### 3. Configurar Backend

```bash
cd Backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

**Archivo `.env`:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinica_db
DB_USER=admin_clinica
DB_PASSWORD=tu_password

MAILTRAP_USER=tu_mailtrap_user
MAILTRAP_PASS=tu_mailtrap_pass
```

### 4. Configurar Frontend

```bash
cd ../Frontend

# Instalar dependencias
npm install
```

### 5. Iniciar el Proyecto

**Terminal 1 - Backend:**

```bash
cd Backend
npm start
# Servidor en http://localhost:3000
```

**Terminal 2 - Frontend:**

```bash
cd Frontend
npm run dev
# Aplicación en http://localhost:5173
```

## 👥 Usuarios de Prueba

| Rol           | Usuario      | Contraseña     |
| ------------- | ------------ | -------------- |
| Administrador | `admin`      | `admin123`     |
| Gerente       | `gerente1`   | `gerente123`   |
| Recepcionista | `recepcion1` | `recepcion123` |
| Médico        | `medico1`    | `medico123`    |

## ✨ Funcionalidades Principales

### 🩺 Gestión de Citas

- Solicitud de citas desde portal de pacientes
- Confirmación por recepción con asignación de fecha/hora
- Estados: Pendiente, Confirmada, Atendida, Cancelada
- Número de seguimiento único por cita
- Cancelación por paciente o recepción

### 📧 Sistema de Notificaciones

- **Email de Solicitud**: Al crear cita desde portal (azul)
- **Email de Confirmación**: Al confirmar cita desde recepción (verde)
- **Recordatorio Automático**: 24 horas antes de la cita (amarillo)
- Templates HTML responsive con logo de clínica
- Integración con Mailtrap para desarrollo

### 📊 Reportes y Estadísticas

- Generación de reportes PDF
- Estadísticas por estado de cita
- Rendimiento por médico
- Distribución por tipo de cita
- Exportación a PDF con diseño profesional

### 🗓️ Disponibilidad de Médicos

- Gestión de horarios por día de semana
- Rango de horas de atención
- Visualización en dashboard de gerente
- Validación de disponibilidad al agendar

### 👨‍⚕️ Historiales Médicos

- Registro de diagnósticos
- Tratamientos y prescripciones
- Notas médicas por cita
- Historial completo del paciente

## 🔧 Scripts Disponibles

### Backend

```bash
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo con nodemon
```

### Frontend

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
```

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Citas

- `GET /api/citas` - Listar todas las citas
- `POST /api/citas` - Crear nueva cita
- `PUT /api/citas/:id/confirmar` - Confirmar cita
- `PUT /api/citas/:numero/cancelar` - Cancelar cita
- `GET /api/citas/seguimiento/:numero` - Consultar por seguimiento

### Pacientes

- `GET /api/pacientes` - Listar pacientes
- `POST /api/pacientes` - Registrar paciente
- `GET /api/pacientes/:id` - Detalle de paciente

### Médicos

- `GET /api/medicos` - Listar médicos
- `GET /api/medicos/:id/disponibilidad` - Ver disponibilidad

### Disponibilidad

- `GET /api/disponibilidad/medico/:id` - Disponibilidad por médico
- `POST /api/disponibilidad` - Crear disponibilidad
- `PUT /api/disponibilidad/:id` - Actualizar disponibilidad
- `DELETE /api/disponibilidad/:id` - Eliminar disponibilidad

## 🔐 Seguridad

- Validación de credenciales en backend
- Gestión de sesiones con localStorage
- Variables de entorno para credenciales sensibles
- `.gitignore` configurado para excluir archivos sensibles

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Verificar credenciales en .env
```

### Error "Cannot find module"

```bash
# Reinstalar dependencias
cd Backend && npm install
cd Frontend && npm install
```

### Emails no se envían

```bash
# Verificar credenciales de Mailtrap en .env
# Ver logs del backend para errores
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Cristobal Prado**

- GitHub: [@Cristobal18p](https://github.com/Cristobal18p)

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor abre un issue en GitHub.

---

⭐ Si este proyecto te fue útil, dale una estrella en GitHub!

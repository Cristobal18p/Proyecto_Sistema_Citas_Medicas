-- Crear usuario administrador
CREATE USER admin_clinica WITH PASSWORD 'YACCJ';
GRANT ALL PRIVILEGES ON DATABASE clinica_db TO admin_clinica;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin_clinica;
ALTER SCHEMA public OWNER TO admin_clinica;
GRANT CREATE ON SCHEMA public TO admin_clinica;

-- Crear tablas

CREATE TABLE usuario_sistema (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario VARCHAR NOT NULL UNIQUE,
    nombre VARCHAR NOT NULL,
    apellido VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    rol VARCHAR NOT NULL CHECK (rol IN ('admin', 'recepcionista', 'medico')),
    estado VARCHAR NOT NULL CHECK (estado IN ('activo', 'inactivo', 'bloqueado'))
);

CREATE TABLE pacientes (
    id_paciente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    apellido VARCHAR NOT NULL,
    cedula VARCHAR UNIQUE NOT NULL,
    telefono VARCHAR,
    email VARCHAR,
    fecha_nacimiento DATE, 
    fecha_registro DATE DEFAULT CURRENT_DATE,
    estado VARCHAR CHECK (estado IN ('activo','inactivo')) DEFAULT 'activo'
);

CREATE TABLE especialidades (
    id_especialidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_especialidad VARCHAR NOT NULL UNIQUE
);

CREATE TABLE medicos (
    id_medico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_especialidad INTEGER NOT NULL,
    email_contacto VARCHAR,
    telefono_contacto VARCHAR,
    CONSTRAINT fk_usuario_medico 
        FOREIGN KEY (id_usuario) REFERENCES usuario_sistema(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_especialidad_medico
        FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
        ON DELETE RESTRICT
);

CREATE TABLE disponibilidad_medicos (
    id_disponibilidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_medico INTEGER NOT NULL,
    dia_semana VARCHAR NOT NULL CHECK (dia_semana IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CONSTRAINT fk_medico_disponibilidad
        FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
        ON DELETE CASCADE
);

CREATE TABLE citas (
    id_cita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numero_seguimiento VARCHAR UNIQUE,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    fecha_cita DATE ,
    hora_cita TIME ,
    preferencia_turno VARCHAR CHECK (preferencia_turno IN ('AM','PM')),
    tipo_cita VARCHAR CHECK (tipo_cita IN ('nueva','control')),
    estado VARCHAR CHECK (estado IN ('pendiente','confirmada','cancelada','atendida')) DEFAULT 'pendiente',
    fecha_solicitud DATE DEFAULT CURRENT_DATE,
    fecha_confirmacion DATE,
    tipo_solicitud VARCHAR CHECK (tipo_solicitud IN ('web','presencial')),
    CONSTRAINT fk_paciente_cita 
        FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
        ON DELETE CASCADE,
    CONSTRAINT fk_medico_cita 
        FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
        ON DELETE CASCADE
);


-- Usuarios del sistema
INSERT INTO usuario_sistema (nombre_usuario, nombre, apellido, password_hash, rol, estado)
VALUES
('cgonzalez', 'Carlos', 'Gonzalez', 'hash123', 'admin', 'activo'),
('Dr.Prados', 'Cristobal', 'Prados', 'hash123', 'medico', 'activo'),
('Dr.Rivas', 'Juan', 'Rivas', 'hash123', 'medico', 'activo'),
('ybaso', 'Yohana', 'Baso', 'hash123', 'recepcionista', 'activo'),
('Dra.Santana', 'Angy', 'Santana', 'hash123', 'medico', 'activo');


-- Pacientes
INSERT INTO pacientes (nombre, apellido, cedula, telefono, email, fecha_nacimiento)
VALUES
('Jose', 'Perez', '8-123-456', '6000-1111', 'jp@example.com', '1995-03-12'),
('Mario', 'Mendoza', '8-234-567', '6000-2222', 'mario@example.com', '1988-07-25'),
('Laura', 'Rojas', '8-345-678', '6000-3333', 'laura@example.com', '1992-11-05'),
('Luis', 'Castillo', '8-456-789', '6000-4444', 'luis@example.com', '1980-01-30');


-- Especialidades
INSERT INTO especialidades (nombre_especialidad)
VALUES
('Medicina General'),
('Pediatría'),
('Dermatología'),
('Cardiología');

-- Tabla para registrar notificaciones/recordatorios enviados
CREATE TABLE notificacion_cita (
    id_notificacion SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL REFERENCES citas(id_cita) ON DELETE CASCADE,
    tipo_notificacion VARCHAR(50) NOT NULL 
        CHECK (tipo_notificacion IN ('solicitud', 'confirmacion', 'recordatorio_24h')),
    email_destinatario VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'enviado' 
        CHECK (estado IN ('enviado', 'fallido', 'pendiente')),
    mensaje_error TEXT,
    fecha_programada TIMESTAMP, -- Para recordatorios programados
    CONSTRAINT unique_notificacion UNIQUE (id_cita, tipo_notificacion)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_notificacion_cita ON notificacion_cita(id_cita);
CREATE INDEX idx_notificacion_tipo ON notificacion_cita(tipo_notificacion);
CREATE INDEX idx_notificacion_estado ON notificacion_cita(estado);
CREATE INDEX idx_notificacion_fecha_programada ON notificacion_cita(fecha_programada);





select * from usuario_sistema; 

-- Médicos
INSERT INTO medicos (id_usuario, id_especialidad, email_contacto, telefono_contacto)
VALUES
(2, 1, 'cprados@clinica.com', '7000-1111'),  -- Cristobal Prados, Medicina General
(3, 4, 'jrivas@clinica.com', '7000-2222'),   -- Juan Rivas, Cardiología
(5, 2, 'angysantana@clinica.com', '7000-3333');  -- Angy Santana, Pediatría

-- Disponibilidad (si agregas campo duracion_cita en la tabla)
-- ALTER TABLE disponibilidad_medicos ADD COLUMN duracion_cita INTEGER NOT NULL DEFAULT 30;
INSERT INTO disponibilidad_medicos (id_medico, dia_semana, hora_inicio, hora_fin)
VALUES
-- Cristobal Prados
(10, 'Lunes', '08:00', '12:00'),
(10, 'Miércoles', '13:00', '17:00'),

-- Juan Rivas
(11, 'Martes', '09:00', '15:00'),
(11, 'Jueves', '08:00', '12:00'),

-- Angy Santana
(12, 'Viernes', '08:00', '14:00');

select * from medicos; 

delete from medicos; 

-- Citas (corregidas según restricciones)
INSERT INTO citas (numero_seguimiento, id_paciente, id_medico, fecha_cita, hora_cita,
                   preferencia_turno, tipo_cita, estado, tipo_solicitud)
VALUES
('SEG-001', 1, 10, '2025-11-22', '09:00', 'AM', 'nueva', 'pendiente', 'web'),
('SEG-002', 2, 11, '2025-11-23', '10:30', 'AM', 'control', 'confirmada', 'presencial'),
('SEG-003', 3, 10, '2025-11-25', '14:00', 'PM', 'nueva', 'pendiente', 'web'),
('SEG-004', 4, 12, '2025-11-26', '11:00', 'AM', 'control', 'pendiente', 'web');



CREATE TABLE historial_consulta (
    id_consulta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    sintomas TEXT NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_historial
        FOREIGN KEY (id_cita) REFERENCES citas(id_cita)
        ON DELETE CASCADE
);


SELECT * FROM citas; 

INSERT INTO historial_consulta (id_cita, sintomas, diagnostico, tratamiento)
VALUES
-- Cita SEG-001 (pendiente → aún no atendida, no se registra historial)
-- Cita SEG-002 (confirmada → ya puede tener historial)
(6, 'Dolor de pecho y cansancio', 'Hipertensión leve', 'Dieta baja en sal y medicación antihipertensiva'); 

-- Cita SEG-003 (pendiente → aún no atendida, no se registra historial)
-- Cita SEG-004 (pendiente → aún no atendida, pero supongamos que se atendió)
--(4, 'Fiebre y tos persistente', 'Bronquitis aguda', 'Reposo, hidratación y antibióticos por 7 días');



SELECT * FROM usuario_sistema u join medicos m on m.id_usuario = u.id_usuario; 

SELECT * FROM PACIENTES;

SELECT * FROM PACIENTES P JOIN CITAS I ON I.ID_PACIENTE = P.ID_PACIENTE; 

SELECT * FROM MEDICOS M JOIN ESPECIALIDADES E ON E.ID_ESPECIALIDAD = M.ID_ESPECIALIDAD; 

SELECT *FROM CITAS; 
SELECT * FROM HISTORIAL_CONSULTA; 

SELECT * FROM HISTORIAL_CONSULTA H INNER JOIN CITAS C ON C.ID_CITA = H.ID_CITA;  



GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin_clinica;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO admin_clinica;

SELECT current_user;




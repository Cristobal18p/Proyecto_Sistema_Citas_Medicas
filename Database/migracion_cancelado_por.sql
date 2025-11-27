-- Agregar columna cancelado_por a la tabla citas
ALTER TABLE citas 
ADD COLUMN cancelado_por VARCHAR CHECK (cancelado_por IN ('paciente', 'recepcion'));

-- Comentario para documentar el cambio
COMMENT ON COLUMN citas.cancelado_por IS 'Indica quién canceló la cita: paciente o recepción';

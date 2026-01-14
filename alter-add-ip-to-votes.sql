-- Agregar campo ip_address a la tabla votes
-- Ejecutar este script en tu servidor MySQL

USE votacompa;

ALTER TABLE votes 
ADD COLUMN ip_address VARCHAR(45) AFTER reason;

-- Crear índice para búsquedas por IP
CREATE INDEX idx_votes_ip ON votes(ip_address);

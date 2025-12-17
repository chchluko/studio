-- Script para agregar autenticación con password a la tabla colleagues
-- Ejecutar en MySQL

USE votacompa;

-- Agregar campo de password
ALTER TABLE colleagues 
ADD COLUMN password VARCHAR(50) NOT NULL DEFAULT 'votati2025';

-- Agregar campos adicionales para gestión de sesiones y seguridad
ALTER TABLE colleagues
ADD COLUMN last_login DATETIME NULL,
ADD COLUMN failed_login_attempts INT DEFAULT 0,
ADD COLUMN account_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Opcional: Crear índice para mejorar performance de login
CREATE INDEX idx_colleagues_id_password ON colleagues(id, password);

-- Verificar cambios
DESCRIBE colleagues;

-- Ejemplo de cómo actualizar passwords específicos para algunos usuarios
-- UPDATE colleagues SET password = 'nuevoPassword123' WHERE id = '15774';
-- UPDATE colleagues SET password = 'password456' WHERE id = '9061';

SELECT 'Tabla colleagues actualizada con campos de autenticación' AS mensaje;

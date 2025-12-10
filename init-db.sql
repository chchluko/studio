-- Script de inicialización de la base de datos MySQL para VotaCompa
-- Ejecutar este script en tu servidor MySQL antes de iniciar la aplicación

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS votacompa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE votacompa;

-- Tabla de colegas/empleados
CREATE TABLE IF NOT EXISTS colleagues (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    photoUrl TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de votos
CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voterId VARCHAR(50) NOT NULL,
    candidateId VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voterId) REFERENCES colleagues(id) ON DELETE CASCADE,
    FOREIGN KEY (candidateId) REFERENCES colleagues(id) ON DELETE CASCADE,
    UNIQUE KEY unique_voter (voterId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_votes_candidate ON votes(candidateId);
CREATE INDEX idx_votes_timestamp ON votes(timestamp);
CREATE INDEX idx_colleagues_name ON colleagues(name);

-- Datos de ejemplo (opcional - comentar si no se necesitan)
-- INSERT INTO colleagues (id, name, department) VALUES 
-- ('001', 'Juan Pérez', 'Desarrollo'),
-- ('002', 'María García', 'Marketing'),
-- ('003', 'Carlos López', 'Ventas');

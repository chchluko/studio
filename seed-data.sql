-- Script opcional: Cargar datos de ejemplo en la base de datos
-- Ejecutar después de init-db.sql si deseas datos de prueba

USE votacompa;

-- Datos de ejemplo de empleados
INSERT INTO colleagues (id, name, department) VALUES 
('1', 'Ana Pérez', 'Diseñadora UX/UI'),
('2', 'Carlos García', 'Desarrollador Backend'),
('3', 'Luisa Fernández', 'Gerente de Proyecto'),
('4', 'Jorge Martínez', 'Ingeniero de Datos'),
('5', 'Sofía Rodríguez', 'Analista de Negocios'),
('6', 'Miguel González', 'Especialista en Marketing'),
('7', 'Valentina Torres', 'Desarrolladora Frontend'),
('8', 'Diego Rojas', 'Administrador de Sistemas'),
('9', 'Camila Díaz', 'Soporte Técnico'),
('10', 'Mateo Castillo', 'Diseñador Gráfico'),
('11', 'Isabella Vargas', 'Analista de Calidad (QA)'),
('12', 'Sebastián Morales', 'Scrum Master'),
('13', 'Usuario sin Foto', 'Tester')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    department = VALUES(department);

-- Verificar que los datos se cargaron correctamente
SELECT COUNT(*) as total_empleados FROM colleagues;
SELECT * FROM colleagues ORDER BY id;

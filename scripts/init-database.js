/**
 * Script de utilidad para inicializar la base de datos MySQL
 * Ejecutar con: node scripts/init-database.js
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function initDatabase() {
  console.log('🚀 Iniciando configuración de base de datos...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL no está definida en .env.local');
    process.exit(1);
  }

  // Parsear DATABASE_URL
  const dbUrl = new URL(process.env.DATABASE_URL);
  const dbName = dbUrl.pathname.substring(1);
  
  const config = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
  };

  let connection;

  try {
    // Conectar sin especificar base de datos
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado a MySQL');

    // Crear base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Base de datos '${dbName}' creada o ya existe`);

    // Usar la base de datos
    await connection.query(`USE \`${dbName}\``);

    // Leer y ejecutar init-db.sql
    const initSql = readFileSync(join(__dirname, '..', 'init-db.sql'), 'utf8');
    const statements = initSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('CREATE DATABASE') && !stmt.startsWith('USE'));

    for (const statement of statements) {
      if (statement) {
        await connection.query(statement);
      }
    }
    console.log('✅ Tablas creadas correctamente');

    // Preguntar si desea cargar datos de ejemplo
    console.log('\n¿Deseas cargar datos de ejemplo? (y/n)');
    console.log('Puedes cargarlos ejecutando: mysql -u root -p votacompa < seed-data.sql');

    console.log('\n✅ ¡Base de datos configurada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Verifica que .env.local tenga la cadena de conexión correcta');
    console.log('2. Ejecuta: npm run dev');
    console.log('3. Accede a http://localhost:9002\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();

import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'voting-system.log');

/**
 * Asegura que el directorio de logs existe
 */
async function ensureLogDirectory() {
  try {
    await fs.access(LOG_DIR);
  } catch {
    await fs.mkdir(LOG_DIR, { recursive: true });
  }
}

/**
 * Escribe un mensaje en el archivo de log
 */
export async function logToFile(message: string, data?: any) {
  try {
    await ensureLogDirectory();
    
    const timestamp = new Date().toISOString();
    const logEntry = data 
      ? `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n\n`
      : `[${timestamp}] ${message}\n\n`;
    
    await fs.appendFile(LOG_FILE, logEntry, 'utf-8');
  } catch (error) {
    // Si falla el logging, no queremos romper la aplicación
    console.error('Error escribiendo al log:', error);
  }
}

/**
 * Registra un intento de votación
 */
export async function logVoteAttempt(voterId: string, candidateId: string, ip?: string, success: boolean = true, error?: string) {
  const logData = {
    event: 'VOTE_ATTEMPT',
    voterId,
    candidateId,
    ip,
    success,
    error,
    timestamp: new Date().toISOString()
  };
  
  await logToFile(success ? '✅ Voto registrado exitosamente' : '❌ Error al registrar voto', logData);
}

/**
 * Registra la detección de IP
 */
export async function logIpDetection(ip: string, headers: Record<string, string | null>) {
  const logData = {
    event: 'IP_DETECTION',
    detectedIp: ip,
    headers,
    timestamp: new Date().toISOString()
  };
  
  await logToFile('🔍 Detección de IP del cliente', logData);
}

/**
 * Registra un login
 */
export async function logLogin(employeeId: string, success: boolean, ip?: string) {
  const logData = {
    event: 'LOGIN',
    employeeId,
    success,
    ip,
    timestamp: new Date().toISOString()
  };
  
  await logToFile(success ? '🔐 Login exitoso' : '🚫 Login fallido', logData);
}

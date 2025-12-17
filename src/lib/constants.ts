/**
 * Constantes de configuración del sistema
 */

import { cookies } from 'next/headers';

// Cookie de sesión del usuario
export const COOKIE_NAME = 'votacompa-user';

// ID del empleado administrador con acceso a funciones administrativas
export const ADMIN_EMPLOYEE_ID = '4279';

/**
 * Verifica si el usuario actual es administrador
 * @returns true si el usuario tiene permisos de administrador
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const userEmployeeId = cookieStore.get(COOKIE_NAME)?.value;
  return userEmployeeId === ADMIN_EMPLOYEE_ID;
}

/**
 * Verifica si un ID de empleado específico es administrador
 * @param employeeId - ID del empleado a verificar
 * @returns true si el empleado es administrador
 */
export function isAdmin(employeeId: string): boolean {
  return employeeId === ADMIN_EMPLOYEE_ID;
}

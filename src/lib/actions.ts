
'use server';

import { z } from 'zod';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginSchema, VoteSchema, BulkUploadSchema, PhotoUploadSchema } from '@/lib/schemas';
import { addVote, hasVoted as dbHasVoted, getColleagues, setColleagues, updateUserPhoto } from '@/lib/db';
import type { Colleague } from './data';
import { COOKIE_NAME } from '@/lib/constants';
import { logIpDetection, logVoteAttempt, logLogin } from '@/lib/logger';

/**
 * Obtiene la dirección IP del cliente desde los headers de la petición
 */
async function getClientIp(): Promise<string | undefined> {
  const headersList = await headers();
  
  // Log para debugging: mostrar todos los headers relevantes
  console.log('=== IP Detection Debug ===');
  console.log('x-forwarded-for:', headersList.get('x-forwarded-for'));
  console.log('x-real-ip:', headersList.get('x-real-ip'));
  console.log('cf-connecting-ip:', headersList.get('cf-connecting-ip'));
  console.log('x-client-ip:', headersList.get('x-client-ip'));
  console.log('forwarded:', headersList.get('forwarded'));
  
  // Intentar obtener la IP de varios headers comunes (en orden de prioridad)
  
  // 1. Cloudflare
  const cfConnectingIp = headersList.get('cf-connecting-ip');
  if (cfConnectingIp && cfConnectingIp !== '127.0.0.1') {
    console.log('IP detectada desde cf-connecting-ip:', cfConnectingIp);
    await logIpDetection(cfConnectingIp, {
      'x-forwarded-for': headersList.get('x-forwarded-for'),
      'x-real-ip': headersList.get('x-real-ip'),
      'cf-connecting-ip': cfConnectingIp,
      'x-client-ip': headersList.get('x-client-ip'),
    });
    return cfConnectingIp;
  }
  
  // 2. x-forwarded-for (común en proxies y load balancers)
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for puede contener múltiples IPs: "client, proxy1, proxy2"
    // Tomamos la primera (la del cliente real)
    const clientIp = forwardedFor.split(',')[0].trim();
    if (clientIp !== '127.0.0.1') {
      console.log('IP detectada desde x-forwarded-for:', clientIp);
      await logIpDetection(clientIp, {
        'x-forwarded-for': forwardedFor,
        'x-real-ip': headersList.get('x-real-ip'),
        'cf-connecting-ip': headersList.get('cf-connecting-ip'),
        'x-client-ip': headersList.get('x-client-ip'),
      });
      return clientIp;
    }
  }
  
  // 3. x-real-ip (común en Nginx)
  const realIp = headersList.get('x-real-ip');
  if (realIp && realIp !== '127.0.0.1') {
    console.log('IP detectada desde x-real-ip:', realIp);
    return realIp;
  }
  
  // 4. x-client-ip
  const clientIp = headersList.get('x-client-ip');
  if (clientIp && clientIp !== '127.0.0.1') {
    console.log('IP detectada desde x-client-ip:', clientIp);
    return clientIp;
  }
  
  // En desarrollo local, será 127.0.0.1
  // En producción con proxy, los headers arriba tendrán la IP real
  console.log('No se encontró IP de cliente en headers, usando localhost (desarrollo local)');
  
  // Guardar log en archivo
  const detectedIp = '127.0.0.1';
  await logIpDetection(detectedIp, {
    'x-forwarded-for': headersList.get('x-forwarded-for'),
    'x-real-ip': headersList.get('x-real-ip'),
    'cf-connecting-ip': headersList.get('cf-connecting-ip'),
    'x-client-ip': headersList.get('x-client-ip'),
  });
  
  return detectedIp;
}

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Datos de inicio de sesión inválidos.',
    };
  }
  
  const { employeeId, password } = validatedFields.data;

  // Obtener IP para logging
  const clientIp = await getClientIp();

  // Verificar credenciales
  const { verifyCredentials } = await import('@/lib/db');
  const user = await verifyCredentials(employeeId, password);

  if (!user) {
    await logLogin(employeeId, false, clientIp);
    return {
      error: 'Número de nómina o contraseña incorrectos.'
    }
  }
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, employeeId, {
    httpOnly: true,
    secure: false, // Cambiar a true solo si usas HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  console.log('Login successful for user:', employeeId);
  await logLogin(employeeId, true, clientIp);

  redirect('/vote');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/');
}

export async function voteAction(values: z.infer<typeof VoteSchema>) {
  const validatedFields = VoteSchema.safeParse(values);
  
  if (!validatedFields.success) {
    console.log('Validation failed:', validatedFields.error);
    return {
      error: 'Datos de votación inválidos. Asegúrate de seleccionar un compañero y escribir un motivo.',
    };
  }

  const { voterId, candidateId, reason } = validatedFields.data;
  
  if (!voterId) {
    console.log('No voterId provided');
    return {
      error: 'Error de sesión. Por favor, inicia sesión nuevamente.',
    };
  }

  console.log('VoteAction called for user:', voterId);

  const hasVoted = await dbHasVoted(voterId);
  console.log(`User ${voterId} has voted: ${hasVoted}`);
  
  if (hasVoted) {
     console.log('User already voted, returning error');
     return {
      error: 'Ya has emitido tu voto.',
    };
  }

  // Obtener la IP del cliente
  const clientIp = await getClientIp();
  console.log('Calling addVote with:', { voterId, candidateId, ip: clientIp });

  try {
    await addVote({
      voterId,
      candidateId,
      reason,
      ip_address: clientIp,
    });
    
    await logVoteAttempt(voterId, candidateId, clientIp, true);
    console.log('Vote added successfully, deleting cookie');
    // Cerrar sesión después de votar
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (error: any) {
    console.error('Error in voteAction:', error);
    await logVoteAttempt(voterId, candidateId, clientIp, false, error.message);
    return {
      error: 'Ocurrió un error al registrar tu voto. Inténtalo de nuevo.',
    };
  }

  console.log('Redirecting to success page');
  return redirect('/vote/success');
}


export async function checkUserAndVoteStatus() {
    const cookieStore = await cookies();
    const userEmployeeId = cookieStore.get(COOKIE_NAME)?.value;
    console.log('checkUserAndVoteStatus - userEmployeeId:', userEmployeeId);
    
    const colleagues = await getColleagues();
    console.log('checkUserAndVoteStatus - total colleagues:', colleagues.length);
    
    if (!userEmployeeId) {
        console.log('No userEmployeeId found, redirecting to home');
        redirect('/');
    }

    const user = colleagues.find(c => c.id === userEmployeeId);
    console.log('checkUserAndVoteStatus - user found:', user ? user.name : 'NOT FOUND');
    
    if (!user) {
        // This case should ideally not happen if login is correct
        console.log('User not found in colleagues, deleting cookie and redirecting');
        cookieStore.delete(COOKIE_NAME);
        redirect('/');
    }

    const userHasVoted = await dbHasVoted(userEmployeeId);
    
    return {
      user: user,
      userName: user.name,
      hasVoted: userHasVoted,
    };
}

export async function bulkUploadAction(values: z.infer<typeof BulkUploadSchema>) {
  const validatedFields = BulkUploadSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'El formato de los datos es inválido.',
      success: null,
    };
  }
  
  const { csvData } = validatedFields.data;
  
  try {
    const lines = csvData.trim().split('\n');
    const newColleagues: Colleague[] = lines.map(line => {
      const [id, name, department] = line.split(',').map(item => item.trim());
      if (!id || !name || !department) {
        throw new Error('Cada línea debe contener ID, Nombre y Departamento separados por comas.');
      }
      return { id, name, department, photoUrl: null, photoHint: null };
    });

    await setColleagues(newColleagues);

    return {
      error: null,
      success: `Se han cargado ${newColleagues.length} empleados correctamente.`,
    };

  } catch (error: any) {
    return {
      error: error.message || 'Error al procesar los datos.',
      success: null,
    }
  }
}

export async function updatePhotoAction(values: z.infer<typeof PhotoUploadSchema>) {
  const validatedFields = PhotoUploadSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return {
      error: 'URL de foto inválida.',
    };
  }
  
  const cookieStore = await cookies();
  const userEmployeeId = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!userEmployeeId) {
    return {
      error: 'Sesión no válida. Por favor, inicia sesión nuevamente.',
    };
  }
  
  const { photoUrl } = validatedFields.data;
  
  try {
    await updateUserPhoto(userEmployeeId, photoUrl);
    return {
      success: true,
    };
  } catch (error) {
    console.error('Update photo error:', error);
    return {
      error: 'No se pudo actualizar la foto. Intenta nuevamente.',
    };
  }
}

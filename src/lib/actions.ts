
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginSchema, VoteSchema, BulkUploadSchema } from '@/lib/schemas';
import { addVote, hasVoted as dbHasVoted, getColleagues, setColleagues } from '@/lib/db';
import type { Colleague } from './data';
import { COOKIE_NAME } from '@/lib/constants';

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Datos de inicio de sesión inválidos.',
    };
  }
  
  const { employeeId, password } = validatedFields.data;

  // Verificar credenciales
  const { verifyCredentials } = await import('@/lib/db');
  const user = await verifyCredentials(employeeId, password);

  if (!user) {
    return {
      error: 'Número de nómina o contraseña incorrectos.'
    }
  }
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, employeeId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  console.log('Login successful for user:', employeeId);

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

  console.log('Calling addVote with:', { voterId, candidateId });

  try {
    await addVote({
      voterId,
      candidateId,
      reason,
    });
    
    console.log('Vote added successfully, deleting cookie');
    // Cerrar sesión después de votar
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (error: any) {
    console.error('Error in voteAction:', error);
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

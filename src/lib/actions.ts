
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
  const colleagues = await getColleagues();

  if (!validatedFields.success) {
    return {
      error: 'Número de nómina inválido.',
    };
  }
  
  const { employeeId } = validatedFields.data;

  const userExists = colleagues.some(c => c.id === employeeId);

  if (!userExists) {
    return {
      error: 'El número de nómina no se encuentra en la lista de empleados autorizados.'
    }
  }
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, employeeId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  console.log('Cookie set for user:', employeeId);

  redirect('/vote');
}

export async function voteAction(values: z.infer<typeof VoteSchema>) {
  const validatedFields = VoteSchema.safeParse(values);
  const cookieStore = await cookies();
  const userEmployeeId = cookieStore.get(COOKIE_NAME)?.value;

  console.log('VoteAction called for user:', userEmployeeId);

  if (!userEmployeeId) {
    console.log('No user ID found, redirecting to home');
    return redirect('/');
  }

  const hasVoted = await dbHasVoted(userEmployeeId);
  console.log(`User ${userEmployeeId} has voted: ${hasVoted}`);
  
  if (hasVoted) {
     // This case should be rare as the UI is disabled, but it's a good safeguard.
     console.log('User already voted, returning error');
     return {
      error: 'Ya has emitido tu voto.',
    };
  }

  if (!validatedFields.success) {
    console.log('Validation failed:', validatedFields.error);
    return {
      error: 'Datos de votación inválidos. Asegúrate de seleccionar un compañero y escribir un motivo.',
    };
  }

  const { candidateId, reason } = validatedFields.data;
  console.log('Calling addVote with:', { voterId: userEmployeeId, candidateId });

  try {
    await addVote({
      voterId: userEmployeeId,
      candidateId,
      reason,
    });
    
    console.log('Vote added successfully, deleting cookie');
    // Cerrar sesión después de votar
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

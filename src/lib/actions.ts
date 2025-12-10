
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginSchema, VoteSchema } from '@/lib/schemas';
import { addVote, hasVoted as dbHasVoted } from '@/lib/db';
import { colleagues } from './data';

const COOKIE_NAME = 'votacompa-user';

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

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
  
  cookies().set(COOKIE_NAME, employeeId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  redirect('/vote');
}

export async function voteAction(values: z.infer<typeof VoteSchema>) {
  const validatedFields = VoteSchema.safeParse(values);
  const userEmployeeId = cookies().get(COOKIE_NAME)?.value;

  if (!userEmployeeId) {
    return redirect('/');
  }

  if (dbHasVoted(userEmployeeId)) {
     // This case should be rare as the UI is disabled, but it's a good safeguard.
     return {
      error: 'Ya has emitido tu voto.',
    };
  }

  if (!validatedFields.success) {
    return {
      error: 'Datos de votación inválidos. Asegúrate de seleccionar un compañero y escribir un motivo.',
    };
  }

  const { candidateId, reason } = validatedFields.data;

  try {
    addVote({
      voterId: userEmployeeId,
      candidateId,
      reason,
    });
  } catch (error) {
    return {
      error: 'Ocurrió un error al registrar tu voto. Inténtalo de nuevo.',
    };
  }

  return redirect('/vote/success');
}


export async function checkUserAndVoteStatus() {
    const userEmployeeId = cookies().get(COOKIE_NAME)?.value;
    if (!userEmployeeId) {
        redirect('/');
    }

    const user = colleagues.find(c => c.id === userEmployeeId);
    if (!user) {
        // This case should ideally not happen if login is correct
        cookies().delete(COOKIE_NAME);
        redirect('/');
    }

    const userHasVoted = dbHasVoted(userEmployeeId);
    
    return {
      userName: user.name,
      hasVoted: userHasVoted,
    };
}

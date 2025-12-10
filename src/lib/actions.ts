
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginSchema, VoteSchema } from '@/lib/schemas';
import { addVote, hasVoted } from '@/lib/db';

const COOKIE_NAME = 'votacompa-user';

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Correo electrónico inválido.',
    };
  }
  
  const { email } = validatedFields.data;

  // In a real app, you would verify the user exists in your database
  
  cookies().set(COOKIE_NAME, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  redirect('/vote');
}

export async function voteAction(values: z.infer<typeof VoteSchema>) {
  const validatedFields = VoteSchema.safeParse(values);
  const userEmail = cookies().get(COOKIE_NAME)?.value;

  if (!userEmail) {
    return redirect('/');
  }

  if (hasVoted(userEmail)) {
     return redirect('/vote/already-voted');
  }

  if (!validatedFields.success) {
    // This is a simplified error handling. 
    // In a real app, you might want to return specific field errors.
    return {
      error: 'Datos de votación inválidos. Asegúrate de seleccionar un compañero y escribir un motivo.',
    };
  }

  const { candidateId, reason } = validatedFields.data;

  try {
    addVote({
      voterEmail: userEmail,
      candidateId,
      reason,
    });
  } catch (error) {
    return {
      error: 'Ocurrió un error al registrar tu voto. Es posible que ya hayas votado.',
    };
  }

  return redirect('/vote/success');
}


export async function checkUserAndVoteStatus() {
    const userEmail = cookies().get(COOKIE_NAME)?.value;
    if (!userEmail) {
        redirect('/');
    }
    if (hasVoted(userEmail)) {
        redirect('/vote/already-voted');
    }
    return userEmail;
}

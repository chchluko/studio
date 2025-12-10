
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginSchema, VoteSchema, BulkUploadSchema } from '@/lib/schemas';
import { addVote, hasVoted as dbHasVoted, getColleagues, setColleagues, uploadPhotoAndUpdateProfile } from '@/lib/db';
import type { Colleague } from './data';
import { revalidatePath } from 'next/cache';

const COOKIE_NAME = 'votacompa-user';

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

  if (await dbHasVoted(userEmployeeId)) {
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
    await addVote({
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
    
    const colleagues = await getColleagues();

    const user = colleagues.find(c => c.id === userEmployeeId);
    if (!user) {
        // This case should ideally not happen if login is correct
        cookies().delete(COOKIE_NAME);
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
      const [id, name, role] = line.split(',').map(item => item.trim());
      if (!id || !name || !role) {
        throw new Error('Cada línea debe contener ID, Nombre y Rol separados por comas.');
      }
      return { id, name, role, photoUrl: null, photoHint: null };
    });

    await setColleagues(newColleagues);

    revalidatePath('/admin/employees');
    revalidatePath('/vote');

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

export async function uploadPhotoAction(userId: string, formData: FormData) {
  const file = formData.get('picture') as File;

  if (!file || file.size === 0) {
    return { error: 'Por favor, selecciona una imagen.' };
  }

  try {
    const newPhotoUrl = await uploadPhotoAndUpdateProfile(userId, file);
    revalidatePath('/vote'); // To refresh the user's photo
    return { success: '¡Foto actualizada con éxito!', newPhotoUrl };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { error: 'No se pudo subir la foto. Inténtalo de nuevo.' };
  }
}

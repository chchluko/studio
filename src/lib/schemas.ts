import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
});

export const VoteSchema = z.object({
  candidateId: z.string({ required_error: 'Debes seleccionar un compañero.' }).min(1, 'Debes seleccionar un compañero.'),
  reason: z.string().min(10, { message: 'El motivo debe tener al menos 10 caracteres.' }).max(500, { message: 'El motivo no puede exceder los 500 caracteres.' }),
});

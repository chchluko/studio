import { z } from 'zod';

export const LoginSchema = z.object({
  employeeId: z.string().min(1, { message: 'Por favor, introduce tu número de nómina.' }),
  password: z.string().min(1, { message: 'Por favor, introduce tu contraseña.' }),
});

export const VoteSchema = z.object({
  voterId: z.string().optional(),
  candidateId: z.string({ required_error: 'Debes seleccionar un compañero.' }).min(1, 'Debes seleccionar un compañero.'),
  reason: z.string().min(10, { message: 'El motivo debe tener al menos 10 caracteres.' }).max(500, { message: 'El motivo no puede exceder los 500 caracteres.' }),
});

export const BulkUploadSchema = z.object({
    csvData: z.string().min(1, { message: 'Por favor, introduce los datos de los empleados.' }),
});

export const PhotoUploadSchema = z.object({
  photoUrl: z.string().url({ message: 'Debe ser una URL válida.' }).min(1, { message: 'Por favor, introduce la URL de la foto.' }),
});

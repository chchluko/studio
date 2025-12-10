import { z } from 'zod';

export const LoginSchema = z.object({
  employeeId: z.string().min(1, { message: 'Por favor, introduce tu número de nómina.' }),
});

export const VoteSchema = z.object({
  candidateId: z.string({ required_error: 'Debes seleccionar un compañero.' }).min(1, 'Debes seleccionar un compañero.'),
  reason: z.string().min(10, { message: 'El motivo debe tener al menos 10 caracteres.' }).max(500, { message: 'El motivo no puede exceder los 500 caracteres.' }),
});

// Used for client-side form validation and server-side action
export type Vote = z.infer<typeof VoteSchema> & {
    id: string;
    voterId: string;
    timestamp: Date;
};

export const BulkUploadSchema = z.object({
    csvData: z.string().min(1, { message: 'Por favor, introduce los datos de los empleados.' }),
});

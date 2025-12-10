'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { bulkUploadAction } from '@/lib/actions';
import { BulkUploadSchema } from '@/lib/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export function BulkUploadForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof BulkUploadSchema>>({
    resolver: zodResolver(BulkUploadSchema),
    defaultValues: {
      csvData: '',
    },
  });

  const onSubmit = (values: z.infer<typeof BulkUploadSchema>) => {
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await bulkUploadAction(values);
      if (result?.error) {
        toast({
          title: 'Error en la Carga',
          description: result.error,
          variant: 'destructive',
        });
      }
      if (result?.success) {
        setSuccessMessage(result.success);
        form.reset();
        toast({
            title: 'Carga Exitosa',
            description: result.success,
        });
      }
    });
  };

  return (
    <>
      {successMessage && (
        <Alert variant="default" className="mb-4 bg-accent/50 border-accent">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="csvData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datos de Empleados (CSV)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="1,Ana Pérez,Diseñadora UX/UI\n2,Carlos García,Desarrollador Backend\n..."
                    className="min-h-[200px] resize-y font-mono"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Procesando...' : 'Cargar Empleados'}
          </Button>
        </form>
      </Form>
    </>
  );
}

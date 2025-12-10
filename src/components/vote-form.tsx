'use client';

import type { Colleague } from '@/lib/data';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import Image from 'next/image';
import { voteAction } from '@/lib/actions';
import { VoteSchema } from '@/lib/schemas';
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
import { Loader2, User, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface VoteFormProps {
  colleagues: Colleague[];
  userEmail: string;
}

export function VoteForm({ colleagues, userEmail }: VoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof VoteSchema>>({
    resolver: zodResolver(VoteSchema),
    defaultValues: {
      candidateId: '',
      reason: '',
    },
  });

  const onSubmit = (values: z.infer<typeof VoteSchema>) => {
    startTransition(async () => {
      const result = await voteAction(values);
      if (result?.error) {
        toast({
          title: 'Error en la votación',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="candidateId"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold">1. Elige a tu compañero</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  disabled={isPending}
                >
                  {colleagues.map((colleague) => (
                    <FormItem key={colleague.id}>
                      <FormControl>
                        <RadioGroupItem value={colleague.id} className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor={field.name + colleague.id} // Ensure unique id for label
                        onClick={() => form.setValue('candidateId', colleague.id)}
                        className="flex flex-col rounded-lg border-2 border-muted bg-popover text-popover-foreground transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-lg cursor-pointer"
                      >
                         <RadioGroupItem value={colleague.id} id={field.name + colleague.id} className="sr-only" />
                        <CardContent className="relative flex items-center space-x-4 p-4">
                          <Image
                            src={colleague.photoUrl}
                            alt={`Foto de ${colleague.name}`}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-full object-cover"
                            data-ai-hint={colleague.photoHint}
                          />
                          <div className="flex-1 space-y-1">
                            <p className="font-semibold">{colleague.name}</p>
                            <p className="text-sm text-muted-foreground">{colleague.role}</p>
                          </div>
                           {form.watch('candidateId') === colleague.id && (
                             <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                               <Check className="h-4 w-4" />
                             </div>
                           )}
                        </CardContent>
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl font-bold">2. Motivo de tu elección</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explica por qué crees que esta persona merece ser elegida..."
                  className="min-h-[120px] resize-none"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
               <p className="text-sm text-muted-foreground">
                Tu motivo es importante para reconocer el buen trabajo.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full text-lg py-6" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enviando voto...
            </>
          ) : (
            'Enviar Voto'
          )}
        </Button>
      </form>
    </Form>
  );
}

'use client';

import type { Colleague } from '@/lib/data';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
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
import { Loader2, User, Check, Search, Vote } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface VoteFormProps {
  colleagues: Colleague[];
  hasVoted: boolean;
}

export function VoteForm({ colleagues, hasVoted }: VoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
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
  
  const filteredColleagues = colleagues.filter((colleague) =>
    colleague.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedCandidate = colleagues.find(c => c.id === form.watch('candidateId'));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <FormLabel className="text-xl font-bold">1. Elige a tu compañero</FormLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isPending || hasVoted}
              />
            </div>
        </div>

        <FormField
          control={form.control}
          name="candidateId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  disabled={isPending || hasVoted}
                >
                  {filteredColleagues.map((colleague) => (
                    <FormItem key={colleague.id}>
                      <FormControl>
                        <RadioGroupItem value={colleague.id} className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor={field.name + colleague.id}
                        onClick={() => !hasVoted && form.setValue('candidateId', colleague.id)}
                        className={`flex flex-col rounded-lg border-2 border-muted bg-popover text-popover-foreground transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-lg ${hasVoted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                      >
                         <RadioGroupItem value={colleague.id} id={field.name + colleague.id} className="sr-only" />
                        <CardContent className="relative flex items-center space-x-4 p-4">
                           <Avatar className="h-20 w-20">
                            {colleague.photoUrl ? (
                              <AvatarImage 
                                src={colleague.photoUrl} 
                                alt={`Foto de ${colleague.name}`}
                                data-ai-hint={colleague.photoHint || ''}
                              />
                            ) : (
                               <AvatarFallback className="text-3xl">
                                <User />
                               </AvatarFallback>
                            )}
                          </Avatar>
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
        
        {filteredColleagues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
              <p>No se encontraron compañeros con ese nombre.</p>
          </div>
        )}

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
                  disabled={isPending || hasVoted}
                />
              </FormControl>
               <p className="text-sm text-muted-foreground">
                Tu motivo es importante para reconocer el buen trabajo.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
                type="button" 
                className="w-full text-lg py-6" 
                disabled={isPending || hasVoted || !form.watch('candidateId') || !form.watch('reason')}
            >
              {hasVoted ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Ya emitiste tu voto
                </>
              ) : isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando voto...
                </>
              ) : (
                <>
                  <Vote className="mr-2 h-5 w-5" />
                  Enviar Voto
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar tu voto</AlertDialogTitle>
              <AlertDialogDescription>
                Estás a punto de votar por <span className="font-bold">{selectedCandidate?.name}</span>. Una vez enviado, no podrás cambiar tu voto. ¿Estás seguro?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirmando...</> : 'Sí, confirmar voto'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}

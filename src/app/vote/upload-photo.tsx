
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import type { Colleague } from '@/lib/data';
import { uploadPhotoAction } from '@/lib/actions';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface UploadPhotoProps {
  user: Colleague;
}

export function UploadPhoto({ user }: UploadPhotoProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleUpload = async (formData: FormData) => {
    startTransition(async () => {
      const result = await uploadPhotoAction(user.id, formData);
      if (result.error) {
        toast({
          title: 'Error al subir la foto',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '¡Éxito!',
          description: result.success,
        });
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            {user.photoUrl ? (
                <AvatarImage src={user.photoUrl} alt={user.name} />
            ) : (
                <AvatarFallback>
                    <Camera className="h-4 w-4" />
                </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleUpload}>
            <DialogHeader>
            <DialogTitle>Actualizar tu foto de perfil</DialogTitle>
            <DialogDescription>
                Sube una nueva foto para que tus compañeros te reconozcan.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Foto</Label>
                <Input id="picture" name="picture" type="file" disabled={isPending} accept="image/*" required />
            </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Guardando...</> : 'Guardar Cambios'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

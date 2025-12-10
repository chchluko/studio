'use client';

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
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UploadPhotoProps {
  user: Colleague;
}

export function UploadPhoto({ user }: UploadPhotoProps) {
  const handleUpload = () => {
    toast({
      title: 'Próximamente',
      description: 'La funcionalidad para subir fotos aún no está implementada.',
    });
  };

  return (
    <Dialog>
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
        <DialogHeader>
          <DialogTitle>Actualizar tu foto de perfil</DialogTitle>
          <DialogDescription>
            Sube una nueva foto para que tus compañeros te reconozcan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Foto</Label>
            <Input id="picture" type="file" disabled />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" onClick={handleUpload} disabled>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

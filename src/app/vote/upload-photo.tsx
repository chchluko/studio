'use client';

import { useState, useTransition, useRef } from 'react';
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
import { Camera, Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UploadPhotoProps {
  user: Colleague;
}

export function UploadPhoto({ user }: UploadPhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Solo se permiten imágenes (JPG, PNG, GIF, WebP)',
          variant: 'destructive',
        });
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'La imagen es demasiado grande. Máximo 5MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona una imagen.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      try {
        const response = await fetch('/api/upload-photo', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || result.error) {
          toast({
            title: 'Error',
            description: result.error || 'Error al subir la foto',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Foto actualizada',
          description: 'Tu foto de perfil se ha actualizado correctamente.',
        });
        setIsOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        
        // Recargar la página para mostrar la nueva foto
        window.location.reload();
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Error',
          description: 'No se pudo subir la foto. Intenta nuevamente.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Actualizar tu foto de perfil</DialogTitle>
          <DialogDescription>
            Selecciona una imagen desde tu computadora. Máximo 5MB (JPG, PNG, GIF, WebP).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="photo">Seleccionar foto</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                disabled={isPending}
                className="cursor-pointer"
              />
              {selectedFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={isPending}
                >
                  ×
                </Button>
              )}
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>
          {previewUrl && (
            <div className="flex flex-col items-center gap-2">
              <Label>Vista previa</Label>
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl} alt="Vista previa" />
                <AvatarFallback>
                  <Camera className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleUpload} disabled={isPending || !selectedFile}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Guardar Foto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

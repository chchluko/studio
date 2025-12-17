'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/actions';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      size="sm"
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Cerrar Sesión
    </Button>
  );
}

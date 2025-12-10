import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VotaCompaLogo } from '@/components/votacompa-logo';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VoteSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="flex justify-center mb-8">
        <VotaCompaLogo />
      </div>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">¡Gracias por tu voto!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Tu voto ha sido registrado correctamente. Has contribuido a reconocer el esfuerzo de tus compañeros.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

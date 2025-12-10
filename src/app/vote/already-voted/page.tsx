import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VotaCompaLogo } from '@/components/votacompa-logo';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';

export default function AlreadyVotedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex justify-center mb-8">
        <VotaCompaLogo />
      </div>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <PartyPopper className="h-6 w-6 text-accent-foreground" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">¡Ya has votado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Gracias por participar. Tu voto ha sido contado. Solo se permite un voto por persona.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

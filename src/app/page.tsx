import { LoginForm } from '@/components/login-form';
import { VotaCompaLogo } from '@/components/votacompa-logo';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <VotaCompaLogo />
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Inicia sesión para votar
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Usa tu número de nómina para acceder al sistema de votación.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

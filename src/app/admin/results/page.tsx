import { getVotes, getColleagues } from '@/lib/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VotaCompaLogo } from '@/components/votacompa-logo';
import { RefreshHandler } from './refresh-handler';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
  const votes = await getVotes();
  const colleagues = await getColleagues();
  
  const votesWithNames = votes.map(vote => {
    const voter = colleagues.find(c => c.id === vote.voterId);
    const candidate = colleagues.find(c => c.id === vote.candidateId);
    return {
      ...vote,
      voterName: voter?.name || 'Desconocido',
      candidateName: candidate?.name || 'Desconocido',
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <RefreshHandler />
       <div className="absolute left-4 top-4">
        <Button asChild variant="outline">
            <Link href="/">
                <ArrowLeft className="mr-2" />
                Volver
            </Link>
        </Button>
      </div>
      <div className="mx-auto max-w-4xl">
         <header className="mb-8 space-y-4 text-center">
            <div className="flex justify-center">
             <VotaCompaLogo />
            </div>
             <h1 className="text-3xl font-bold tracking-tight">Resultados de la Votación</h1>
          <p className="text-lg text-muted-foreground">
            Aquí puedes ver los votos registrados en tiempo real.
          </p>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Votos Emitidos</CardTitle>
                <CardDescription>Total de votos: {votesWithNames.length}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">Votante</TableHead>
                            <TableHead className="font-semibold">Candidato</TableHead>
                            <TableHead className="font-semibold">Motivo</TableHead>
                            <TableHead className="text-right font-semibold">Fecha y Hora</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {votesWithNames.length > 0 ? (
                            votesWithNames.map((vote, index) => (
                                <TableRow key={index}>
                                    <TableCell>{vote.voterName}</TableCell>
                                    <TableCell>{vote.candidateName}</TableCell>
                                    <TableCell className="max-w-xs truncate">{vote.reason}</TableCell>
                                    <TableCell className="text-right">
                                        {format(vote.timestamp, "d MMM yyyy, HH:mm:ss", { locale: es })}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Aún no se han registrado votos.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { isCurrentUserAdmin } from '@/lib/constants';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect('/');
  }
  const votes = await getVotes();
  const colleagues = await getColleagues();

  // Contar votos por candidato
  const voteCount = votes.reduce((acc, vote) => {
    acc[vote.candidateId] = (acc[vote.candidateId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Crear ranking con información completa
  const ranking = Object.entries(voteCount)
    .map(([candidateId, count]) => {
      const colleague = colleagues.find(c => c.id === candidateId);
      return {
        id: candidateId,
        name: colleague?.name || 'Desconocido',
        department: colleague?.department || 'N/A',
        photoUrl: colleague?.photoUrl,
        votes: count,
      };
    })
    .sort((a, b) => b.votes - a.votes);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
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
          <h1 className="text-3xl font-bold tracking-tight">Ranking de Votaciones</h1>
          <p className="text-lg text-muted-foreground">
            Los compañeros más votados
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Ranking Actual
            </CardTitle>
            <CardDescription>
              Total de votos: {votes.length} | Candidatos votados: {ranking.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold w-[80px]">Posición</TableHead>
                    <TableHead className="font-semibold w-[100px]">Foto</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Departamento</TableHead>
                    <TableHead className="font-semibold text-right">Votos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.length > 0 ? (
                    ranking.map((candidate, index) => (
                      <TableRow 
                        key={candidate.id}
                        className={index === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}
                      >
                        <TableCell className="font-bold text-lg">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </TableCell>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={candidate.photoUrl || ''} alt={candidate.name} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.department}</TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {candidate.votes}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No hay votos registrados todavía.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/results">
              Ver Detalle de Votos
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/employees">
              Ver Empleados
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

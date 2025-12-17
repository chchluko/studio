import { getColleagues } from '@/lib/db';
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
import { ArrowLeft, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { isCurrentUserAdmin } from '@/lib/constants';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect('/');
  }
  const colleagues = await getColleagues();

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
             <h1 className="text-3xl font-bold tracking-tight">Lista de Empleados</h1>
          <p className="text-lg text-muted-foreground">
            Estos son todos los empleados actualmente en el sistema.
          </p>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Empleados Cargados</CardTitle>
                <CardDescription>Total de empleados: {colleagues.length}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold w-[100px]">Foto</TableHead>
                            <TableHead className="font-semibold">Nómina (ID)</TableHead>
                            <TableHead className="font-semibold">Nombre</TableHead>
                            <TableHead className="font-semibold">Departamento</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {colleagues.length > 0 ? (
                            colleagues.map((colleague) => (
                                <TableRow key={colleague.id}>
                                     <TableCell>
                                        <Avatar>
                                            <AvatarImage src={colleague.photoUrl || ''} alt={colleague.name} data-ai-hint={colleague.photoHint || ''} />
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-mono">{colleague.id}</TableCell>
                                    <TableCell>{colleague.name}</TableCell>
                                    <TableCell>{colleague.department}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No hay empleados cargados en el sistema.
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

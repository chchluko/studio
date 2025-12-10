
import { VotaCompaLogo } from '@/components/votacompa-logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BulkUploadForm } from './bulk-upload-form';

export default function BulkUploadPage() {
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
            <div className="mx-auto max-w-2xl">
                <header className="mb-8 space-y-4 text-center">
                    <div className="flex justify-center">
                        <VotaCompaLogo />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Carga Masiva de Empleados</h1>
                    <p className="text-lg text-muted-foreground">
                        Pega los datos de los empleados en formato CSV para actualizar la lista.
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Formato del Layout</CardTitle>
                        <CardDescription>
                           Cada línea debe contener: <code className="font-mono bg-muted p-1 rounded-sm">ID,Nombre Completo,Rol</code>.
                           Por ejemplo: <code className="font-mono bg-muted p-1 rounded-sm">123,Juan Perez,Desarrollador</code>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <BulkUploadForm />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

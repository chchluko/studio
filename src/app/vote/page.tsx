import { getColleagues } from '@/lib/db';
import { checkUserAndVoteStatus } from '@/lib/actions';
import { VoteForm } from '@/components/vote-form';
import { VotaCompaLogo } from '@/components/votacompa-logo';
import { LogoutButton } from '@/components/logout-button';
import { UploadPhoto } from './upload-photo';
import { isAdmin } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, BarChart, Users } from 'lucide-react';

export default async function VotePage() {
  const { userName, hasVoted, user } = await checkUserAndVoteStatus();
  const allColleagues = await getColleagues();
  const userIsAdmin = isAdmin(user.id);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          {userIsAdmin && (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/ranking">
                  <Trophy className="mr-2 h-4 w-4" />
                  Ranking
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/results">
                  <BarChart className="mr-2 h-4 w-4" />
                  Resultados
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/employees">
                  <Users className="mr-2 h-4 w-4" />
                  Empleados
                </Link>
              </Button>
            </div>
          )}
          {!userIsAdmin && <div />}
          <LogoutButton />
        </div>
        <header className="mb-8 space-y-4 text-center">
            <div className="flex justify-center">
             <VotaCompaLogo />
            </div>
          <div className="flex justify-center items-center gap-4">
            <p className="text-lg text-muted-foreground">
                Hola <span className="font-semibold text-primary">{userName}</span>. Es hora de reconocer a un gran compañero.
            </p>
            {user && <UploadPhoto user={user} />}
          </div>
        </header>

        <VoteForm colleagues={allColleagues} hasVoted={hasVoted} userId={user.id} />
      </div>
    </main>
  );
}

import { colleagues } from '@/lib/data';
import { checkUserAndVoteStatus } from '@/lib/actions';
import { VoteForm } from '@/components/vote-form';
import { VotaCompaLogo } from '@/components/votacompa-logo';

export default async function VotePage() {
  const userName = await checkUserAndVoteStatus();
  const allColleagues = colleagues;

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 space-y-4 text-center">
            <div className="flex justify-center">
             <VotaCompaLogo />
            </div>
          <p className="text-lg text-muted-foreground">
            Hola <span className="font-semibold text-primary">{userName}</span>. Es hora de reconocer a un gran compañero.
          </p>
        </header>

        <VoteForm colleagues={allColleagues} />
      </div>
    </main>
  );
}

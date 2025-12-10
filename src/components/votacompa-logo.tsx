import { Vote } from 'lucide-react';

export function VotaCompaLogo() {
  return (
    <div className="flex items-center gap-3">
      <Vote className="h-10 w-10 text-primary" />
      <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
        VotaCompa
      </h1>
    </div>
  );
}

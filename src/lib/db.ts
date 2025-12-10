// This is a mock in-memory database. Data will be lost on server restart.

interface Vote {
  voterEmail: string;
  candidateId: string;
  reason: string;
  timestamp: Date;
}

const votes: Vote[] = [];

/**
 * Checks if a user has already voted based on their email.
 * @param email The email of the user to check.
 * @returns `true` if the user has voted, `false` otherwise.
 */
export function hasVoted(email: string): boolean {
  return votes.some(vote => vote.voterEmail === email);
}

/**
 * Adds a new vote to the in-memory store.
 * Throws an error if the user has already voted.
 * @param vote The vote object to add.
 */
export function addVote(vote: Omit<Vote, 'timestamp'>): void {
  if (hasVoted(vote.voterEmail)) {
    throw new Error('El usuario ya ha votado.');
  }
  const newVote = { ...vote, timestamp: new Date() };
  votes.push(newVote);
}

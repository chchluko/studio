// This is a mock in-memory database. Data will be lost on server restart.
import type { Colleague } from './data';
import { colleagues as initialColleagues } from './data';


interface Vote {
  voterId: string;
  candidateId: string;
  reason: string;
  timestamp: Date;
}

const votes: Vote[] = [];
let colleagues: Colleague[] = [...initialColleagues];


/**
 * Gets the current list of colleagues.
 * @returns An array of colleagues.
 */
export function getColleagues(): Colleague[] {
    return colleagues;
}

/**
 * Replaces the current list of colleagues with a new one.
 * @param newColleagues The new array of colleagues.
 */
export function setColleagues(newColleagues: Colleague[]): void {
    colleagues = newColleagues;
    console.log('Colleagues list updated. Total:', colleagues.length);
}

/**
 * Checks if a user has already voted based on their employee ID.
 * @param employeeId The employee ID of the user to check.
 * @returns `true` if the user has voted, `false` otherwise.
 */
export function hasVoted(employeeId: string): boolean {
  return votes.some(vote => vote.voterId === employeeId);
}

/**
 * Adds a new vote to the in-memory store.
 * Throws an error if the user has already voted.
 * @param vote The vote object to add.
 */
export function addVote(vote: Omit<Vote, 'timestamp'>): void {
  if (hasVoted(vote.voterId)) {
    throw new Error('El usuario ya ha votado.');
  }
  const newVote = { ...vote, timestamp: new Date() };
  votes.push(newVote);
  console.log('Current votes:', votes);
}

/**
 * Gets all votes from the in-memory store.
 * @returns An array of all votes.
 */
export function getVotes(): Vote[] {
    return votes;
}

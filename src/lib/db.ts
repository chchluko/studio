// MySQL database connection
import mysql from 'mysql2/promise';
import type { Colleague } from './data';

interface Vote {
  voterId: string;
  candidateId: string;
  reason: string;
  timestamp: Date;
}

// Connection pool configuration
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Gets the current list of colleagues from MySQL.
 * @returns An array of colleagues.
 */
export async function getColleagues(): Promise<Colleague[]> {
  try {
    const [rows] = await pool.query<any[]>(
      'SELECT id, name, department, photoUrl FROM colleagues'
    );
    return rows;
  } catch (error) {
    console.error('Error getting colleagues:', error);
    return [];
  }
}

/**
 * Replaces the current list of colleagues with a new one.
 * @param newColleagues The new array of colleagues.
 */
export async function setColleagues(newColleagues: Colleague[]): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Clear existing colleagues
    await connection.query('DELETE FROM colleagues');
    
    // Insert new colleagues
    if (newColleagues.length > 0) {
      const values = newColleagues.map(c => [c.id, c.name, c.department, c.photoUrl]);
      await connection.query(
        'INSERT INTO colleagues (id, name, department, photoUrl) VALUES ?',
        [values]
      );
    }
    
    await connection.commit();
    console.log('Colleagues list updated. Total:', newColleagues.length);
  } catch (error) {
    await connection.rollback();
    console.error('Error setting colleagues:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Checks if a user has already voted based on their employee ID.
 * @param employeeId The employee ID of the user to check.
 * @returns `true` if the user has voted, `false` otherwise.
 */
export async function hasVoted(employeeId: string): Promise<boolean> {
  try {
    const [rows] = await pool.query<any[]>(
      'SELECT COUNT(*) as count FROM votes WHERE voterId = ?',
      [employeeId]
    );
    return rows[0].count > 0;
  } catch (error) {
    console.error('Error checking if user has voted:', error);
    return false;
  }
}

/**
 * Adds a new vote to the database.
 * Throws an error if the user has already voted.
 * @param vote The vote object to add.
 */
export async function addVote(vote: Omit<Vote, 'timestamp'>): Promise<void> {
  const hasAlreadyVoted = await hasVoted(vote.voterId);
  if (hasAlreadyVoted) {
    throw new Error('El usuario ya ha votado.');
  }
  
  try {
    await pool.query(
      'INSERT INTO votes (voterId, candidateId, reason, timestamp) VALUES (?, ?, ?, ?)',
      [vote.voterId, vote.candidateId, vote.reason, new Date()]
    );
    console.log('Vote added for voter:', vote.voterId);
  } catch (error) {
    console.error('Error adding vote:', error);
    throw error;
  }
}

/**
 * Gets all votes from the database.
 * @returns An array of all votes.
 */
export async function getVotes(): Promise<Vote[]> {
  try {
    const [rows] = await pool.query<any[]>(
      'SELECT voterId, candidateId, reason, timestamp FROM votes'
    );
    return rows;
  } catch (error) {
    console.error('Error getting votes:', error);
    return [];
  }
}

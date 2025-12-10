
'use server';

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  writeBatch,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebaseAdmin } from '@/firebase/server';
import type { Colleague } from './data';
import { colleagues as localColleagues } from './data';
import type { Vote } from './schemas';


async function getDb() {
    try {
        const { firestore } = await initializeFirebaseAdmin();
        return firestore;
    } catch (error) {
        console.warn("Could not initialize Firebase Admin SDK. Using mock data. Error:", (error as Error).message);
        return null;
    }
}

async function getStore() {
    try {
        const { storage } = await initializeFirebaseAdmin();
        return storage;
    } catch (error) {
        console.warn("Could not initialize Firebase Admin SDK for Storage. Using mock data. Error:", (error as Error).message);
        return null;
    }
}


/**
 * Gets the current list of colleagues from Firestore.
 * @returns An array of colleagues.
 */
export async function getColleagues(): Promise<Colleague[]> {
  const db = await getDb();
  if (!db) {
    return Promise.resolve(localColleagues);
  }
  const colleaguesCol = collection(db, 'candidates');
  const snapshot = await getDocs(colleaguesCol);
  if (snapshot.empty) {
    return localColleagues;
  }
  return snapshot.docs.map((doc) => ({ ...(doc.data() as Colleague), id: doc.id }));
}

/**
 * Replaces the current list of colleagues with a new one in Firestore.
 * This is a batch operation.
 * @param newColleagues The new array of colleagues.
 */
export async function setColleagues(newColleagues: Colleague[]): Promise<void> {
  const db = await getDb();
   if (!db) {
    console.log('DB not available, skipping setColleagues');
    return;
  }
  const batch = writeBatch(db);
  const colleaguesColRef = collection(db, 'candidates');

  // First, delete existing colleagues if necessary (or simply overwrite)
  // For simplicity, we'll assume overwriting is fine and IDs are consistent.
  // A more robust solution might delete all documents first.

  newColleagues.forEach((colleague) => {
    // We use the colleague's ID as the document ID in Firestore for consistency
    const docRef = doc(colleaguesColRef, colleague.id);
    batch.set(docRef, colleague);
  });

  await batch.commit();
  console.log('Colleagues list updated in Firestore. Total:', newColleagues.length);
}

/**
 * Checks if a user has already voted based on their UID.
 * @param userId The UID of the user to check.
 * @returns `true` if the user has voted, `false` otherwise.
 */
export async function hasVoted(userId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }
  const votesCol = collection(db, 'votes');
  const q = query(votesCol, where('voterId', '==', userId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Adds a new vote to the Firestore 'votes' collection.
 * Throws an error if the user has already voted.
 * @param vote The vote object to add.
 */
export async function addVote(vote: Omit<Vote, 'timestamp' | 'id'>): Promise<void> {
    const db = await getDb();
    if (!db) {
        console.log('DB not available, skipping addVote');
        return;
    }
    if (await hasVoted(vote.voterId)) {
        throw new Error('El usuario ya ha votado.');
    }
    const votesCol = collection(db, 'votes');
    await addDoc(votesCol, { ...vote, timestamp: serverTimestamp() });
}

/**
 * Gets all votes from the Firestore 'votes' collection.
 * @returns An array of all votes.
 */
export async function getVotes(): Promise<(Vote & {id: string})[]> {
    const db = await getDb();
    if (!db) {
        return [];
    }
    const votesCol = collection(db, 'votes');
    const snapshot = await getDocs(votesCol);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.timestamp as Timestamp;
        return { 
            ...(data as Vote), 
            id: doc.id, 
            timestamp: timestamp.toDate() 
        };
    });
}

/**
 * Uploads a photo for a user and updates their profile.
 * @param userId The ID of the user.
 * @param file The image file to upload.
 * @returns The new public URL of the photo.
 */
export async function uploadPhotoAndUpdateProfile(userId: string, file: File): Promise<string> {
    const storage = await getStore();
    const db = await getDb();

    if (!storage || !db) {
        throw new Error("El servicio de almacenamiento o base de datos no está disponible.");
    }

    // Create a storage reference
    const storageRef = ref(storage, `profile-photos/${userId}/${file.name}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update the user's document in Firestore
    const userDocRef = doc(db, 'candidates', userId);
    await setDoc(userDocRef, { photoUrl: downloadURL }, { merge: true });

    return downloadURL;
}


import { initializeApp, getApps, getApp, FirebaseApp, credential } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { firebaseConfig } from './config';

interface FirebaseAdminServices {
  app: FirebaseApp;
  firestore: Firestore;
  storage: Storage;
}

// Ensure you have the service account key in your environment variables
// For local development, you might use a .env.local file
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let adminApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let storage: Storage | null = null;

export async function initializeFirebaseAdmin(): Promise<FirebaseAdminServices> {
  if (!adminApp) {
    if (getApps().length > 0) {
      // This can happen in development with hot-reloading
      adminApp = getApp();
    } else if (serviceAccount) {
      adminApp = initializeApp({
        credential: credential.cert(serviceAccount),
        storageBucket: `${firebaseConfig.projectId}.appspot.com`,
      });
    } else {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set. Cannot initialize Firebase Admin SDK.');
    }
    firestore = getFirestore(adminApp);
    storage = getStorage(adminApp);
  }

  return { app: adminApp, firestore: firestore!, storage: storage! };
}


import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from 'firebase-admin/app';
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
    } else {
      adminApp = initializeApp({
        credential: {
          projectId: firebaseConfig.projectId,
          clientEmail: serviceAccount?.client_email,
          privateKey: serviceAccount?.private_key.replace(/\\n/g, '\n'),
        },
        storageBucket: `${firebaseConfig.projectId}.appspot.com`,
      });
    }
    firestore = getFirestore(adminApp);
    storage = getStorage(adminApp);
  }

  return { app: adminApp, firestore: firestore!, storage: storage! };
}

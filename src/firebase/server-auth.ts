
'use server';

import { headers } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

// This needs to be whatever was used to initialize the admin app in the middleware.
const ADMIN_APP_NAME = 'firebase-admin-app-server-auth';

function getAdminApp(): App {
  // Check if the app is already initialized
  const alreadyInitialized = getApps().some(app => app.name === ADMIN_APP_NAME);
  if (alreadyInitialized) {
    return getApps().find(app => app.name === ADMIN_APP_NAME)!;
  }

  // If not initialized, create it.
  // This configuration should ideally come from environment variables.
  // Note: This relies on the service account being available in the environment.
  return initializeApp({
    // When deployed to a Google Cloud environment, the SDK can auto-discover credentials.
    // For local development, you'd set the GOOGLE_APPLICATION_CREDENTIALS env var.
    credential: credential.applicationDefault(),
  }, ADMIN_APP_NAME);
}

/**
 * Verifies the user's ID token from the request headers and checks for admin claims.
 * @returns The decoded user token if the user is a valid admin, otherwise null.
 */
export async function getAdminAuthUser() {
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);

  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      
      // Check for the admin custom claim
      if (decodedToken.admin === true) {
        return decodedToken;
      }
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return null;
    }
  }

  return null;
}

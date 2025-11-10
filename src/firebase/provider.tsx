
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

// Extended user authentication state to include admin status
interface UserAuthState {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean; // Consolidated loading state
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  userError: Error | null;
}

// Return type for useAuth() - now provides extended auth state
export interface AuthHookResult {
    auth: Auth;
    user: User | null;
    isAdmin: boolean;
    isAuthLoading: boolean;
    userError: Error | null;
    signOut: () => Promise<void>;
}


// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isAdmin: false,
    isAuthLoading: true, // Start loading until first auth event
    userError: null,
  });

  useEffect(() => {
    if (!auth) {
      setUserAuthState({ user: null, isAdmin: false, isAuthLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState(prevState => ({ ...prevState, isAuthLoading: true }));

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const idTokenResult = await getIdTokenResult(firebaseUser);
            const isAdminClaim = idTokenResult.claims.admin === true;
            setUserAuthState({ user: firebaseUser, isAdmin: isAdminClaim, isAuthLoading: false, userError: null });
          } catch (error: any) {
            console.error("FirebaseProvider: Error getting ID token:", error);
            setUserAuthState({ user: firebaseUser, isAdmin: false, isAuthLoading: false, userError: error });
          }
        } else {
          setUserAuthState({ user: null, isAdmin: false, isAuthLoading: false, userError: null });
        }
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isAdmin: false, isAuthLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, [auth]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isAdmin: userAuthState.isAdmin,
      isAuthLoading: userAuthState.isAuthLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isAdmin: context.isAdmin,
    isAuthLoading: context.isAuthLoading,
    userError: context.userError,
  };
};

/** Hook to access the entire authentication context, including state and methods. */
export const useAuth = (): AuthHookResult => {
    const { auth, user, isAdmin, isAuthLoading, userError } = useFirebase();
    
    const signOut = () => {
        if (auth) {
            return auth.signOut();
        }
        return Promise.resolve();
    };

    return { auth, user, isAdmin, isAuthLoading, userError, signOut };
};


export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/** Hook for accessing the authenticated user's state, including admin status. */
export const useUser = (): UserHookResult => {
  const { user, isAdmin, isAuthLoading, userError } = useFirebase();
  return { user, isAdmin, isAuthLoading, userError };
};

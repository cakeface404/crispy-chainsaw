
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { getAuth } from 'firebase/auth/web-extension';
import { initializeApp, getApps, App } from 'firebase/app';
import { firebaseConfig } from './firebase/config';

const ADMIN_APP_NAME = 'firebase-admin-app';

function getAdminApp(): App {
  if (getApps().some(app => app.name === ADMIN_APP_NAME)) {
    return getApps().find(app => app.name === ADMIN_APP_NAME)!;
  }
  return initializeApp(firebaseConfig, ADMIN_APP_NAME);
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const idToken = request.cookies.get('idToken')?.value;
  const { pathname } = request.nextUrl;

  // All paths under /admin requires authentication and admin role
  if (pathname.startsWith('/admin')) {
    if (!idToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};

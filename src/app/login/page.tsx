
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, isAuthLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if a user who is already a logged-in admin lands on this page.
  useEffect(() => {
    if (!isAuthLoading && isAdmin) {
      router.push('/admin');
    }
  }, [isAuthLoading, isAdmin, router]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Authentication service is not available.' });
        return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On successful sign-in, the onAuthStateChanged listener in useAuth will update the state.
      // The AdminLayout will then handle the redirect to '/admin' if the user is an admin.
      toast({ title: 'Sign-In Successful', description: 'Redirecting to admin panel...' });
    } catch (error: any) {
      // Provide a clear error message for invalid credentials.
      toast({ 
        variant: 'destructive', 
        title: 'Authentication Failed', 
        description: 'The email or password you entered is incorrect. Please try again.' 
      });
      setIsLoading(false);
    }
  };

  // Render a loading state or nothing if we're still checking auth and the user might be an admin
  if (isAuthLoading || isAdmin) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

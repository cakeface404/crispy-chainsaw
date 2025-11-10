'use client';

import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Calendar, Sparkles, ShoppingBag, Bot, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/trends", label: "AI Trends", icon: Bot },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading, auth } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        const checkAdminStatus = async () => {
          const adminDocRef = doc(firestore, 'admins', user.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            router.push('/login');
          }
          setIsCheckingAdmin(false);
        };
        checkAdminStatus();
      } else {
        router.push('/login');
        setIsCheckingAdmin(false);
      }
    }
  }, [user, isUserLoading, firestore, router]);

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  if (isUserLoading || isCheckingAdmin) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  if (!isAdmin) {
    return null; // or a message indicating not authorized
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="size-7 text-primary" />
              <span className="text-lg font-semibold">Blak Whyte</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Avatar className="size-7">
                    <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/admin/100"} />
                    <AvatarFallback>{user?.displayName?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <span>{user?.displayName || 'Admin User'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-muted/30">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

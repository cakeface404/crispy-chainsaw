
'use client';

import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Calendar, Sparkles, ShoppingBag, Bot, Settings, LogOut } from "lucide-react";
import Link from "next/link";

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
  // The useAuth hook now provides all the necessary state.
  const { user, isAdmin, isAuthLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication check is complete.
    if (isAuthLoading) {
      return;
    }

    // If the check is done and the user is not an admin (or not logged in),
    // redirect them away.
    if (!isAdmin) {
      router.push('/login');
    }
  }, [user, isAdmin, isAuthLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // While checking auth, show a loading screen.
  if (isAuthLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading Admin Panel...</div>;
  }
  
  // If not an admin, show a redirecting message while the useEffect above does its work.
  if (!isAdmin) {
    return <div className="flex h-screen w-full items-center justify-center">Access Denied. Redirecting...</div>;
  }

  // Only render the admin layout if the user is a confirmed admin.
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
        <div className="flex-1 bg-muted/30">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

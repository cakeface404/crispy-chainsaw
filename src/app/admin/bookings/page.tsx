
"use client";

import { useCollection, useFirestore, useMemoFirebase, useAuth } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Booking, Service } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

// The user object is no longer joined here.
type BookingWithDetails = Booking & {
  service: Service | undefined;
};

export default function BookingsPage() {
  const firestore = useFirestore();
  const router = useRouter();

  // useAuth now returns isAdmin & a consolidated loading state `isAuthLoading`.
  const { isAdmin, isAuthLoading } = useAuth();

  // Redirect non-admins immediately if authentication check is complete.
  useMemo(() => {
    if (!isAuthLoading && !isAdmin) {
      router.push('/'); // Redirect to homepage or a login page
    }
  }, [isAuthLoading, isAdmin, router]);

  // Only define collections if firestore is available and user is confirmed to be an admin
  const bookingsCollection = useMemoFirebase(() => (firestore && isAdmin) ? collection(firestore, 'bookings') : null, [firestore, isAdmin]);
  const servicesCollection = useMemoFirebase(() => (firestore && isAdmin) ? collection(firestore, 'services') : null, [firestore, isAdmin]);
  
  const { data: bookingsData, isLoading: bookingsLoading } = useCollection<Booking>(bookingsCollection);
  const { data: servicesData, isLoading: servicesLoading } = useCollection<Service>(servicesCollection);

  const bookingsWithDetails: BookingWithDetails[] = useMemo(() => {
    if (!bookingsData || !servicesData) {
      return [];
    }
    // Updated join logic, user data is fetched per-row in columns.tsx now
    return bookingsData.map(booking => ({
      ...booking,
      service: servicesData.find(s => s.id === booking.serviceId),
    }));
  }, [bookingsData, servicesData]);

  // The main loading state now depends on auth check and data fetching
  const isLoading = isAuthLoading || bookingsLoading || servicesLoading;

  // Show a loading state while checking auth, or if user is not an admin, or data is loading
  if (isLoading || !isAdmin) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Bookings</h2>
      <p className="text-muted-foreground mb-6">
        Manage all client bookings. You can confirm, decline, or update payment status.
      </p>
      {/* 'columns.tsx' is now updated to fetch user name individually per row */}
      <DataTable columns={columns} data={bookingsWithDetails} />
    </div>
  );
}

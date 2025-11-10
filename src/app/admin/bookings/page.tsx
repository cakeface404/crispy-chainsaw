
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Booking, Service, User } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMemo } from "react";
import { useAuth } from "@/firebase/provider";

type BookingWithDetails = Booking & {
  service: Service | undefined;
  user: User | undefined;
};

export default function BookingsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();

  // Only define collections if firestore and user are available
  const bookingsCollection = useMemoFirebase(() => (firestore && user) ? collection(firestore, 'bookings') : null, [firestore, user]);
  const servicesCollection = useMemoFirebase(() => (firestore && user) ? collection(firestore, 'services') : null, [firestore, user]);
  const usersCollection = useMemoFirebase(() => (firestore && user) ? collection(firestore, 'users') : null, [firestore, user]);

  const { data: bookingsData, isLoading: bookingsLoading } = useCollection<Booking>(bookingsCollection);
  const { data: servicesData, isLoading: servicesLoading } = useCollection<Service>(servicesCollection);
  const { data: usersData, isLoading: usersLoading } = useCollection<User>(usersCollection);

  const bookingsWithDetails: BookingWithDetails[] = useMemo(() => {
    if (!bookingsData || !servicesData || !usersData) {
      return [];
    }
    return bookingsData.map(booking => ({
      ...booking,
      service: servicesData.find(s => s.id === booking.serviceId),
      user: usersData.find(u => u.id === booking.clientId),
    }));
  }, [bookingsData, servicesData, usersData]);

  const isLoading = isUserLoading || bookingsLoading || servicesLoading || usersLoading;

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Bookings</h2>
      <p className="text-muted-foreground mb-6">
        Manage all client bookings. You can confirm, decline, or update payment status.
      </p>
      <DataTable columns={columns} data={bookingsWithDetails} />
    </div>
  );
}

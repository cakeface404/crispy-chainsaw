"use client";

import { useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import type { Booking, Service, User } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMemo } from "react";

type BookingWithDetails = Booking & {
  service: Service | undefined;
  user: User | undefined;
};

export default function BookingsPage() {
  const firestore = useFirestore();

  const bookingsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'bookings') : null, [firestore]);
  const servicesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'services') : null, [firestore]);
  const usersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);

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

  if (bookingsLoading || servicesLoading || usersLoading) {
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

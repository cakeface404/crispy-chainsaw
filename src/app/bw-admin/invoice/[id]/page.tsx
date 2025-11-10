"use client";

import InvoiceTemplate from "../invoice-template";
import { useDoc, useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import type { Booking, Service, User } from "@/lib/types";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const bookingDoc = useMemoFirebase(() => firestore ? doc(firestore, "bookings", params.id) : null, [firestore, params.id]);
  const servicesCollection = useMemoFirebase(() => firestore ? collection(firestore, "services") : null, [firestore]);
  const usersCollection = useMemoFirebase(() => firestore ? collection(firestore, "users") : null, [firestore]);

  const { data: booking, isLoading: bookingLoading } = useDoc<Booking>(bookingDoc);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesCollection);
  const { data: users, isLoading: usersLoading } = useCollection<User>(usersCollection);

  if (bookingLoading || servicesLoading || usersLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!booking) {
    return <div className="text-center py-10">Booking not found.</div>;
  }

  const user = users?.find(u => u.id === booking.clientId);
  const service = services?.find(s => s.id === booking.serviceId);

  if (!user || !service) {
    return <div className="text-center py-10">Booking details could not be loaded.</div>;
  }

  return (
    <div className="bg-background">
      <InvoiceTemplate booking={booking} user={user} service={service} />
    </div>
  );
}

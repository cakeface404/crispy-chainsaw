import { bookings, services, users } from "@/lib/data";
import type { Booking, Service, User } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";

type BookingWithDetails = Booking & {
  service: Service | undefined;
  user: User | undefined;
};

export default function BookingsPage() {
  const bookingsWithDetails: BookingWithDetails[] = bookings.map(booking => ({
    ...booking,
    service: services.find(s => s.id === booking.serviceId),
    user: users.find(u => u.id === booking.userId),
  }));

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

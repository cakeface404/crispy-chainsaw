import { bookings, services, users } from "@/lib/data";
import InvoiceTemplate from "../invoice-template";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const booking = bookings.find(b => b.id === params.id);
  
  if (!booking) {
    return <div className="text-center py-10">Booking not found.</div>;
  }

  const user = users.find(u => u.id === booking.userId);
  const service = services.find(s => s.id === booking.serviceId);

  if (!user || !service) {
    return <div className="text-center py-10">Booking details could not be loaded.</div>;
  }

  return (
    <div className="bg-background">
      <InvoiceTemplate booking={booking} user={user} service={service} />
    </div>
  );
}

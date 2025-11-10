import BookingForm from "./booking-form";

export default function BookPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
          Book Your Experience
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Follow a few simple steps to schedule your next appointment with us.
        p>
      </div>
      <div className="max-w-4xl mx-auto">
        <BookingForm />
      </div>
    </div>
  );
}

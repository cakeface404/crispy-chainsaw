"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Booking, Service, User } from "@/lib/types";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import { Logo } from "@/components/logo";

interface InvoiceTemplateProps {
  booking: Booking;
  user: User;
  service: Service;
}

export default function InvoiceTemplate({ booking, user, service }: InvoiceTemplateProps) {
  const handlePrint = () => {
    window.print();
  };

  const amount = parseFloat(service?.price.toString() || '0')
  const formattedAmount = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount)

  const formattedTotal = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount)


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
      </div>
      <Card className="shadow-2xl">
        <CardHeader className="bg-muted/50 p-6">
          <div className="flex justify-between items-center">
            <div>
              <Logo className="h-12 w-12 text-primary mb-2" />
              <h1 className="text-2xl font-bold font-headline">Blak Whyte Studio</h1>
              <p className="text-muted-foreground">123 Luxury Lane, Suite 100, Glamour City, 12345</p>
            </div>
            <div className="text-right">
              <CardTitle className="text-4xl font-headline text-primary">INVOICE</CardTitle>
              <p className="text-muted-foreground"># {booking.id.replace('book_', '')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-bold">{user.name}</p>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold">Invoice Date:</span> {format(new Date(), 'PPP')}</p>
              <p><span className="font-semibold">Booking Date:</span> {format(new Date(booking.date), 'PPP')}</p>
              <p><span className="font-semibold">Status:</span> <span className="font-bold text-primary">{booking.paymentStatus}</span></p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Service Description</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell className="text-right">{service.duration} mins</TableCell>
                <TableCell className="text-right">{formattedAmount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator className="my-8" />

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formattedAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>R0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formattedTotal}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-6 text-center text-xs text-muted-foreground">
          <p>Thank you for your business! If you have any questions, please contact us at contact@blakwhyte.studio.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

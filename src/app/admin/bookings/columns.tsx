
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { doc } from 'firebase/firestore'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Booking, Service, User } from "@/lib/types"
import { sanitizePhoneNumberForWhatsApp } from "@/lib/utils"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"

// BookingWithDetails no longer contains the user object directly.
export type BookingWithDetails = Booking & {
  service: Service | undefined;
};

// A new component to fetch and display user details for a specific row.
const ClientCell = ({ clientId }: { clientId: string }) => {
  const firestore = useFirestore();
  const userDoc = useMemoFirebase(() => firestore ? doc(firestore, 'users', clientId) : null, [firestore, clientId]);
  const { data: user, isLoading } = useDoc<User>(userDoc);

  if (isLoading) {
    return <div className="pl-4">Loading...</div>;
  }
  
  if (!user) {
    return <div className="pl-4 text-muted-foreground">Unknown Client</div>;
  }
  
  return (
    <div className="pl-4">
      <div className="font-medium">{user?.name}</div>
      <div className="text-xs text-muted-foreground">{user?.email}</div>
    </div>
  );
};

// A new component to fetch user phone number for the WhatsApp link.
const WhatsAppActionItem = ({ clientId }: { clientId: string }) => {
    const firestore = useFirestore();
    const userDoc = useMemoFirebase(() => firestore ? doc(firestore, 'users', clientId) : null, [firestore, clientId]);
    const { data: user } = useDoc<User>(userDoc);

    if (!user?.phone) {
        return null;
    }

    return (
        <DropdownMenuItem>
            <a href={`https://wa.me/${sanitizePhoneNumberForWhatsApp(user.phone)}`} target="_blank" rel="noopener noreferrer">
                Contact (WhatsApp)
            </a>
        </DropdownMenuItem>
    )
}


export const columns: ColumnDef<BookingWithDetails>[] = [
  {
    // The accessorKey is now 'clientId', not 'user.name'.
    accessorKey: "clientId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    // The cell now uses the custom ClientCell component to fetch data.
    cell: ({ row }) => {
      const clientId = row.original.clientId;
      return <ClientCell clientId={clientId} />;
    }
  },
  {
    accessorKey: "service.name",
    header: "Service",
  },
  {
    accessorKey: "date",
    header: "Booking Date",
    cell: ({ row }) => {
      const booking = row.original;
      const date = new Date(booking.date);
      return format(date, "PPpp");
    },
  },
  {
    accessorKey: "service.price",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.service?.price.toString() || '0')
      const formatted = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variant = {
            'Confirmed': 'default',
            'Pending': 'secondary',
            'Completed': 'outline',
            'Cancelled': 'destructive',
        }[status] ?? 'default' as any;
        return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string
        return <Badge variant={status === 'Paid' ? 'default' : 'secondary'}>{status}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/invoice/${booking.id}`}>View Invoice</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Confirm Booking</DropdownMenuItem>
            <DropdownMenuItem>Decline Booking</DropdownMenuItem>
            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            {/* The WhatsApp link is now a separate component that fetches the user's phone number. */}
            <WhatsAppActionItem clientId={booking.clientId} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

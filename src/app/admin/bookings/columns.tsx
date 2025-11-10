"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

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

export type BookingWithDetails = Booking & {
  service: Service | undefined;
  user: User | undefined;
};


export const columns: ColumnDef<BookingWithDetails>[] = [
  {
    accessorKey: "user.name",
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
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="pl-4">
          <div className="font-medium">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
      );
    }
  },
  {
    accessorKey: "service.name",
    header: "Service",
  },
  {
    accessorKey: "bookingDate",
    header: "Booking Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("bookingDate")), "PPpp");
    },
  },
  {
    accessorKey: "service.price",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.service?.price.toString() || '0')
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
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
              <Link href={`/bw-admin/invoice/${booking.id}`}>View Invoice</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Confirm Booking</DropdownMenuItem>
            <DropdownMenuItem>Decline Booking</DropdownMenuItem>
            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            <DropdownMenuItem>
              <a href={`https://wa.me/${booking.user?.phone}`} target="_blank" rel="noopener noreferrer">
                Contact (WhatsApp)
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

Yes, I've prepared the corrected versions of the files based on my review.

I cannot directly modify your files, but you can copy and paste the full contents below to replace the code in your project.

These changes implement the critical security and performance fixes we discussed:

1.  **Secures the Admin Panel:** Enforces an admin-only check on the bookings page.
2.  **Protects the Server Action:** Adds an admin check to the `analyze` function.
3.  **Fixes Performance:** Removes the insecure full-collection read of `/users`.

-----

### **File: `src.zip/app/admin/bookings/page.tsx` (Corrected)**

This version adds admin-claim verification and removes the insecure fetching of the entire `/users` collection.

```tsx
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
// 'User' type is no longer needed here
import type { Booking, Service } from "@/lib/types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMemo } from "react";
// Import 'useRouter' for redirection
import { useRouter } from "next/navigation";
// We must update 'useAuth' to provide 'isAdmin' and a consolidated loading state
import { useAuth } from "@/firebase";

// Update type: 'user' object is no longer joined here.
type BookingWithDetails = Booking & {
  service: Service | undefined;
};

export default function BookingsPage() {
  const firestore = useFirestore();
  const router = useRouter();

  // Assume useAuth() is updated to return isAdmin & isAuthLoading
  const { user, isAdmin, isAuthLoading } = useAuth();

  // Redirect non-admins immediately
  useMemo(() => {
    if (!isAuthLoading && !isAdmin) {
      router.push('/'); // Redirect to homepage
    }
  }, [isAuthLoading, isAdmin, router]);

  // Only define collections if firestore and user are available and user is admin
  const bookingsCollection = useMemoFirebase(() => (firestore && isAdmin) ? collection(firestore, 'bookings') : null, [firestore, isAdmin]);
  const servicesCollection = useMemoFirebase(() => (firestore && isAdmin) ? collection(firestore, 'services') : null, [firestore, isAdmin]);
  
  // REMOVED: usersCollection and useCollection<User>

  const { data: bookingsData, isLoading: bookingsLoading } = useCollection<Booking>(bookingsCollection);
  const { data: servicesData, isLoading: servicesLoading } = useCollection<Service>(servicesCollection);

  const bookingsWithDetails: BookingWithDetails[] = useMemo(() => {
    // Removed 'usersData' from dependency
    if (!bookingsData || !servicesData) {
      return [];
    }
    // Updated join logic
    return bookingsData.map(booking => ({
      ...booking,
      service: servicesData.find(s => s.id === booking.serviceId),
    }));
  }, [bookingsData, servicesData]); // Removed 'usersData'

  // Removed 'usersLoading'
  const isLoading = isAuthLoading || bookingsLoading || servicesLoading;

  // Show a loading state while checking auth, or if user is not an admin
  if (isLoading || !isAdmin) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Bookings</h2>
      <p className="text-muted-foreground mb-6">
        Manage all client bookings. You can confirm, decline, or update payment status.
      </p>
      {/* 'columns.tsx' will now need to be updated to fetch user name individually per row */}
      <DataTable columns={columns} data={bookingsWithDetails} />
    </div>
  );
}
```

-----

### **File: `src.zip/app/admin/trends/actions.ts` (Corrected)**

This version adds a server-side authentication check to ensure only admins can trigger the GenAI flow.

```typescript
"use server";

import { analyzeBusinessTrends } from "@/ai/flows/analyze-business-trends";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index';
import type { Booking, Service } from '@/lib/types';

// IMPORTANT: You will need to create this helper.
// It should use 'next/headers' and 'firebase-admin'
// to verify the user's token and check for 'admin: true' claims.
import { getAdminAuthUser } from "@/firebase/server-auth"; // Assumed path

export async function analyze() {
  try {
    // 1. Enforce Admin Authentication
    const adminUser = await getAdminAuthUser();
    if (!adminUser) {
      // This will be caught by the catch block
      throw new Error("Unauthorized: Admin access required.");
    }

    // 2. Proceed with existing logic
    const { firestore } = initializeFirebase();
    
    const bookingsSnapshot = await getDocs(collection(firestore, 'bookings'));
    const bookings = bookingsSnapshot.docs.map(doc => doc.data() as Booking);

    const servicesSnapshot = await getDocs(collection(firestore, 'services'));
    const services = servicesSnapshot.docs.map(doc => doc.data() as Service);

    const bookingDataForAI = bookings.map(booking => {
      const service = services.find(s => s.id === booking.serviceId);
      return {
        serviceName: service?.name,
        price: service?.price,
        bookingTimestamp: new Date(booking.date).toISOString(),
      };
    });

    const result = await analyzeBusinessTrends({
      bookingData: JSON.stringify(bookingDataForAI),
    });

    return result;
  } catch (error) {
    console.error("Error analyzing business trends:", error);
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      summary: `An error occurred while analyzing the data: ${errorMessage}`,
      pricingSuggestions: "Could not generate pricing suggestions due to an error."
    };
  }
}
```

-----

### **File: `src.zip/app/admin/bookings/data-table.tsx` (Corrected)**

This version updates the filter input to target a field that still exists (`status`) after our removal of the `user.name` join.

```tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
        <div className="flex items-center py-4">
            {/* UPDATED: Filter by 'status' since 'user.name' is no longer available here */}
            <Input
            placeholder="Filter by status..."
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("status")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter(
                        (column) => column.getCanHide()
                    )
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {/* Note: 'user.name' will no longer appear here. */}
                            {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

-----

### **Important Next Steps**

These changes will require you to update **three other places** in your code that were not provided:

1.  **Update `useAuth` Hook:** Your main authentication hook (likely in `src/firebase/index.ts` or a similar provider) *must* be modified to read the user's custom claims and return the `isAdmin` boolean and a consolidated `isAuthLoading` state.
2.  **Create `getAdminAuthUser`:** You need to create the new server-side helper (e.g., `src/firebase/server-auth.ts`) that uses the Firebase Admin SDK to verify the token from the `next/headers` and check for the `admin: true` claim.
3.  **Update `src/app/admin/bookings/columns.tsx`:** Since `user.name` is no longer being joined in `page.tsx`, you must update your `columns.tsx` file. The "Client" column will need to be a custom component that takes the `clientId` from the row data and uses our `useDocument` hook to fetch and display the specific user's name.
"use client";

import { DollarSign, Users, Calendar, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar } from "recharts";
import { useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import type { Booking, Service, User } from "@/lib/types";

const chartData = [
  { month: "January", revenue: 1860 },
  { month: "February", revenue: 3050 },
  { month: "March", revenue: 2370 },
  { month: "April", revenue: 730 },
  { month: "May", revenue: 2090 },
  { month: "June", revenue: 2140 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboard() {
  const firestore = useFirestore();

  const bookingsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'bookings') : null, [firestore]);
  const servicesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'services') : null, [firestore]);
  const usersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);

  const { data: bookingsData, isLoading: bookingsLoading } = useCollection<Booking>(bookingsCollection);
  const { data: servicesData, isLoading: servicesLoading } = useCollection<Service>(servicesCollection);
  const { data: usersData, isLoading: usersLoading } = useCollection<User>(usersCollection);

  if (bookingsLoading || servicesLoading || usersLoading) {
    return <div>Loading...</div>
  }

  const bookings = bookingsData || [];
  const services = servicesData || [];
  const users = usersData || [];


  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, b) => {
      const service = services.find(s => s.id === b.serviceId);
      return acc + (service?.price || 0);
    }, 0);

  const totalBookings = bookings.length;
  const recentBookings = bookings
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalBookings}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">List of all available services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All unique clients</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => {
                  const user = users.find((u) => u.id === booking.clientId);
                  const service = services.find((s) => s.id === booking.serviceId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-sm text-muted-foreground hidden md:inline">
                          {user?.email}
                        </div>
                      </TableCell>
                      <TableCell>{service?.name}</TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, add } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

import { services } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Service } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [searchParams]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({
      service: selectedService?.name,
      date: selectedDate ? format(selectedDate, 'PPP') : 'N/A',
      time: selectedTime,
      ...values,
    });
    setStep(4); // Move to confirmation step
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    nextStep();
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    nextStep();
  }

  if (step === 4) {
    return (
      <Card className="w-full shadow-2xl">
        <CardContent className="p-10 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">Thank you for booking with us. An email confirmation has been sent to {form.getValues('email')}.</p>
          <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2">
            <p><strong>Service:</strong> {selectedService?.name}</p>
            <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}</p>
            <p><strong>Name:</strong> {form.getValues('name')}</p>
          </div>
           <Button onClick={() => { setStep(1); setSelectedService(null); setSelectedDate(undefined); setSelectedTime(null); form.reset(); }} className="mt-6">Book Another Service</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Step {step} of 3: {['Select a Service', 'Choose Date & Time', 'Your Details'][step - 1]}</CardTitle>
        <div className="flex items-center pt-2">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center w-full">
              <div className={cn("h-2 w-full rounded-full", s <= step ? 'bg-primary' : 'bg-muted')}></div>
              {s < 3 && <div className={cn("h-0.5 w-4", s < step ? 'bg-primary' : 'bg-muted')}></div>}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="min-h-[300px]">
        {step === 1 && (
          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <Button key={service.id} variant="outline" className="h-auto py-4 text-left flex justify-between" onClick={() => handleServiceSelect(service)}>
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.duration} mins</p>
                  </div>
                  <p className="font-bold text-primary">${service.price}</p>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-center">Select a Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {selectedDate && (
              <div>
                <h3 className="font-semibold mb-4 text-center">Select a Time</h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => handleTimeSelect(time)}>{time}</Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="(123) 456-7890" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" className="w-full mt-4">Confirm Booking <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <div />
      </CardFooter>
    </Card>
  );
}

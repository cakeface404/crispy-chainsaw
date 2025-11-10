"use server";

import { analyzeBusinessTrends } from "@/ai/flows/analyze-business-trends";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index';
import type { Booking, Service } from '@/lib/types';

export async function analyze() {
  try {
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
    return {
      summary: "An error occurred while analyzing the data. Please check the logs.",
      pricingSuggestions: "Could not generate pricing suggestions due to an error."
    };
  }
}

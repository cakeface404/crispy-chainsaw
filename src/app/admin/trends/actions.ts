
"use server";

import { analyzeBusinessTrends } from "@/ai/flows/analyze-business-trends";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index';
import type { Booking, Service } from '@/lib/types';
import { getAdminAuthUser } from "@/firebase/server-auth";

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

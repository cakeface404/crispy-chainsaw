"use server";

import { analyzeBusinessTrends } from "@/ai/flows/analyze-business-trends";
import { bookings, services } from "@/lib/data";

export async function analyze() {
  try {
    const bookingDataForAI = bookings.map(booking => {
      const service = services.find(s => s.id === booking.serviceId);
      return {
        serviceName: service?.name,
        price: service?.price,
        bookingTimestamp: booking.bookingDate.toISOString(),
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

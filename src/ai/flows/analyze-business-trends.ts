'use server';

/**
 * @fileOverview A business trend analyzer AI agent.
 *
 * - analyzeBusinessTrends - A function that handles the business trend analysis process.
 * - AnalyzeBusinessTrendsInput - The input type for the analyzeBusinessTrends function.
 * - AnalyzeBusinessTrendsOutput - The return type for the analyzeBusinessTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBusinessTrendsInputSchema = z.object({
  bookingData: z
    .string()
    .describe("A stringified JSON array of booking data from Firestore. Each object in the array should contain service name, price, and booking timestamp."),
});
export type AnalyzeBusinessTrendsInput = z.infer<typeof AnalyzeBusinessTrendsInputSchema>;

const AnalyzeBusinessTrendsOutputSchema = z.object({
  summary: z.string().describe("A summary of popular services and revenue trends over time."),
  pricingSuggestions: z.string().describe("Suggestions for pricing adjustments based on the identified trends."),
});
export type AnalyzeBusinessTrendsOutput = z.infer<typeof AnalyzeBusinessTrendsOutputSchema>;

export async function analyzeBusinessTrends(input: AnalyzeBusinessTrendsInput): Promise<AnalyzeBusinessTrendsOutput> {
  return analyzeBusinessTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBusinessTrendsPrompt',
  input: {schema: AnalyzeBusinessTrendsInputSchema},
  output: {schema: AnalyzeBusinessTrendsOutputSchema},
  prompt: `You are a business analyst specializing in pricing optimization for service-based businesses.

You will analyze booking data to identify popular services and revenue trends over time. Based on these trends, you will provide suggestions for pricing adjustments to optimize service offerings and profitability.

Booking Data: {{{bookingData}}}

Respond with a summary of the trends and specific, actionable pricing suggestions, in 2 distinct paragraphs, as requested by the output schema.`,
});

const analyzeBusinessTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessTrendsFlow',
    inputSchema: AnalyzeBusinessTrendsInputSchema,
    outputSchema: AnalyzeBusinessTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

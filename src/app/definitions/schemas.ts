import { z } from "zod";

export const ActivitySchema = z.object({
  location: z.string(),
  activity: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  description: z.string(),
  cost_usd: z.string().optional(),
  address: z.string().optional(),
  tip: z.string().optional().nullable(),
  unique_dish: z.string().optional().nullable(),
});

export const ItinerarySchema = z.object({
  itinerary: z.array(ActivitySchema),
});

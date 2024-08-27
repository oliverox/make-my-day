import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string().describe("A uniquely identifiable string for this item"),
  location: z
    .string()
    .describe("The string location of the recommendation if any"),
  activity: z.string().describe("A description of the activity"),
  start_time: z.string().describe("The start time of the activity"),
  end_time: z.string().describe("The end time of the activity"),
  description: z.string().describe("The start time of the activity"),
  cost_usd: z
    .string()
    .optional()
    .describe(
      "The approximate total cost the activity for the number of people involved",
    ),
  address: z
    .string()
    .optional()
    .describe("The physical address of the location"),
  tip: z
    .string()
    .optional()
    .nullable()
    .describe(
      "A string description of any helpful tip for that recommendatioin, if any",
    ),
  unique_dish: z
    .string()
    .optional()
    .nullable()
    .describe(
      "A string description of a unique dish associated with that recommendation, if any",
    ),
});

export const ItinerarySchema = z.object({
  itinerary: z.array(ActivitySchema),
});

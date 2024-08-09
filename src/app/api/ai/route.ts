import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export async function POST({ req }: { req: Request}) {
  const model = openai.chat("gpt-4o");
  const aiOutput = await generateObject({
    model,
    schema: z.object({
      itinerary: z.array(
        z.object({
          location: z.string(),
          activity: z.string(),
          start_time: z.string(),
          end_time: z.string(),
          description: z.string(),
          cost_usd: z.string().optional(),
          address: z.string().optional(),
          tip: z.string().optional().nullable(),
          unique_dish: z.string().optional().nullable(),
          phone: z.string().optional().nullable()
        }),
      ),
    }),
    mode: "json",
    system: "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.",
    prompt: "I want a full day itinerary for a family of four, including two kids aged 4 and 8, to the north of Mauritius starting with breakfast at 9AM to the evening with dinner at 8PM. What makes this trip unique is that it should include local food delights and restaurant names and contact number, kid-friendly activities as well as ample time to rest, and finally unique spots to visits that are not so commonly known by the public. Keep the tone friendly and educational. Make sure the locations proposed exist and restaurants are in operation.",
  });
  return aiOutput.toJsonResponse();
}
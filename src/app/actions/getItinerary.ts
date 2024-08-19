"use server";

import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { ItinerarySchema } from "~/app/definitions/schemas";

export async function getItinerary({
  date = new Date().toDateString(),
  region = "west coast",
  startTime = "9AM",
  endTime = "10PM",
  groupSize = "1_0",
  budget = null,
  activities = "local food_beach",
}: {
  date: string | null;
  region: string | null;
  startTime: string | null;
  endTime: string | null;
  groupSize: string | null;
  budget: string | null;
  activities: string | null;
}) {
  "use server";
  const stream = createStreamableValue();
  console.log("params received:", {
    date,
    region,
    budget,
    startTime,
    endTime,
    groupSize,
    activities,
  });
  const [numAdults, numKids] = groupSize ? groupSize.split("_") : ["1", "0"];
  const allRegions = region ? region.split('_').join(', ') : "the west";
  const allActivities= activities?.split('_').join(', ');
  const system =
    "You are a master day planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.";
  const prompt = `Create a full-day itinerary for ${numAdults} adults ${numKids !== "0" ? `and ${numKids} kids` : ''} exploring the ${allRegions} of Mauritius on ${date} from ${startTime}:00 to ${endTime}:00. The itinerary should feature unique and lesser-known spots, focusing on the following activities: ${allActivities} and authentic experiences. Please ensure that all suggested locations and restaurants are operational and respect their opening and closing hours ${budget ? ` and stay within a total budget of USD ${budget} for the entire day` : ''}. Include hidden gems that are not commonly frequented by tourists. Keep the tone friendly and engaging.`
  
  console.log(prompt);

  void (async () => {
    const { partialObjectStream } = await streamObject({
      // model: openai.chat("gpt-4o-2024-08-06", {
      //   structuredOutputs: true,
      // }),
      model: openai.chat("gpt-4o"),
      system,
      prompt,
      schema: ItinerarySchema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done(0);
  })();

  return { object: stream.value };
}

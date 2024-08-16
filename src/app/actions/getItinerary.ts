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
  groupSize = "1.0",
  activities = ["local food delights", "beach"],
}: {
  date?: string;
  region?: string;
  startTime?: string;
  endTime?: string;
  groupSize?: string;
  activities?: string[];
}) {
  "use server";
  const stream = createStreamableValue();
  console.log("params received:", {
    date,
    region,
    startTime,
    endTime,
    groupSize,
    activities,
  });
  const [numAdults, numKids] = groupSize.split("_");

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai.chat("gpt-4o"),
      system:
        "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.",
      prompt: `I want a full day itinerary for ${numAdults} adults ${numKids !== "0" ? `and ${numKids} kids` : "and no kids"}, to the ${region} of Mauritius on ${date} starting at ${startTime} up to ${endTime}. What makes this trip unique is that it should include the following activities: ${activities.join(", ")}. Make sure to add unique spots to visits that are not so commonly known by the public. Keep the tone friendly. Make sure the locations proposed exist and restaurants are in operation.`,
      schema: ItinerarySchema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}

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
  activities = ["local food delights", "beach"],
}: {
  date: string | null;
  region: string | null;
  startTime: string | null;
  endTime: string | null;
  groupSize: string | null;
  activities: string[] | null;
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
  const [numAdults, numKids] = groupSize ? groupSize.split("_") : ["1", "0"];
  const allRegions = region ? region.split('_').join(', ') : "local food delights";
  const system =
    "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.";
  const prompt = `I want a full day itinerary for ${numAdults} adults ${numKids !== "0" ? `and ${numKids} kids` : "and no kids"}, to ${allRegions} of Mauritius on ${date} starting at ${startTime} up to ${endTime}. What makes this trip unique is that it should include the following activities: ${activities ? activities.join(", ") : "local delights"}. Make sure to add unique spots to visits that are not so commonly known by the public. Keep the tone friendly. Make sure the locations proposed exist and restaurants are in operation.`;
  
  console.log(prompt);

  void (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai.chat("gpt-4o"),
      system,
      prompt,
      schema: ItinerarySchema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done();
  })();

  return { object: stream.value };
}

"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
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
  console.log("params received:", {
    date,
    region,
    startTime,
    endTime,
    groupSize,
    activities,
  });
  const [numAdults, numKids] = groupSize.split("_");
  const model = openai.chat("gpt-4o");
  const system =
    "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.";
  const prompt = `I want a full day itinerary for ${numAdults} adults ${numKids !== "0" ? `and ${numKids} kids` : "and no kids"}, to the ${region} of Mauritius on ${date} starting at ${startTime} up to ${endTime}. What makes this trip unique is that it should include the following activities: ${activities.join(", ")}. Make sure to add unique spots to visits that are not so commonly known by the public. Keep the tone friendly. Make sure the locations proposed exist and restaurants are in operation.`;
  console.log("prompt:", prompt);

  const output = await generateObject({
    model,
    schema: ItinerarySchema,
    mode: "json",
    system,
    prompt,
  });

  return { itineraryJson: JSON.stringify(output.object.itinerary) };
}

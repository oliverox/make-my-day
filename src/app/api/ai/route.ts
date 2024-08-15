export const runtime = "edge";
export const dynamic = "force-dynamic";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { NextRequest } from "next/server";
import { AiJson } from "~/app/definitions/schemas";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date") ?? new Date().toDateString();
  const region = searchParams.get("region") ?? "west coast";
  const groupSize = searchParams.get("group_size") ?? "1.0";
  const startTime = searchParams.get("start_time") ?? "9AM";
  const endTime = searchParams.get("end_time") ?? "10PM";
  const activities = searchParams.getAll('activities') ?? ['local food delights', 'beach'];

  const [numAdults, numKids] = groupSize.split(".");

  const model = openai.chat("gpt-4o");
  const system = "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.";
  const prompt = `I want a full day itinerary for ${numAdults} adults ${numKids !== "0" ? `and ${numKids} kids` : "and no kids"}, to the ${region} of Mauritius on ${date} starting at ${startTime} up to ${endTime}. What makes this trip unique is that it should include ${activities.join(', ')}, kid-friendly activities as well as ample time to rest, and finally unique spots to visits that are not so commonly known by the public. Keep the tone friendly and educational. Make sure the locations proposed exist and restaurants are in operation.`;
  console.log("prompt:", prompt);
  
  const aiOutput = await generateObject({
    model,
    schema: AiJson,
    mode: "json",
    system,
    prompt,
  });
  return aiOutput.toJsonResponse();
}

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AiJson } from '~/app/definitions/schemas';

export async function POST(/*req: Request*/) {
  const model = openai.chat("gpt-4o");
  const aiOutput = await generateObject({
    model,
    schema: AiJson,
    mode: "json",
    system: "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.",
    prompt: "I want a full day itinerary for a family of four, including two kids aged 4 and 8, to the north of Mauritius starting with breakfast at 9AM to the evening with dinner at 8PM. What makes this trip unique is that it should include local food delights and restaurant names and contact number, kid-friendly activities as well as ample time to rest, and finally unique spots to visits that are not so commonly known by the public. Keep the tone friendly and educational. Make sure the locations proposed exist and restaurants are in operation.",
  });
  return aiOutput.toJsonResponse();
}
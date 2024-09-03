import { streamObject } from "ai";
import { Redis } from "@upstash/redis";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import type { AI } from './serverActions';
import { ItinerarySchema } from "~/app/definitions/schemas";
import { getMutableAIState, createStreamableValue } from "ai/rsc";

export async function getItinerary() {
  "use server";

  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const redis = Redis.fromEnv();
  const redisKey = `mmd.${userId}`;
  const getCountry: Promise<string | null> = redis.hget(redisKey, "country");
  const getSelectedDate: Promise<string | null> = redis.hget(
    redisKey,
    "selectedDate",
  );
  const getStartEndTime: Promise<string | null> = redis.hget(
    redisKey,
    "startEndTime",
  );
  const getRegion: Promise<string | null> = redis.hget(redisKey, "region");
  const getGroupSize: Promise<string | null> = redis.hget(
    redisKey,
    "groupSize",
  );
  const getActivities: Promise<string | null> = redis.hget(
    redisKey,
    "activities",
  );
  const getBudget: Promise<string | null> = redis.hget(redisKey, "budget");
  const [
    country,
    selectedDate,
    startEndTime,
    region,
    groupSize,
    activities,
    budget,
  ] = await Promise.all([
    getCountry,
    getSelectedDate,
    getStartEndTime,
    getRegion,
    getGroupSize,
    getActivities,
    getBudget,
  ]);
  const [startTime, endTime] = startEndTime
    ? startEndTime.split("_")
    : ["09:00", "21:00"];

  console.log("params received:", {
    country,
    selectedDate,
    region,
    budget,
    startTime,
    endTime,
    groupSize,
    activities,
  });

  const [numAdults, numKids] = groupSize ? groupSize.split("_") : ["1", "0"];
  const allRegions = region ? region.split("_").join(", ") : "the west";
  const allActivities = activities?.split("_").join(", ");

  const stream = createStreamableValue();
  const history = getMutableAIState<typeof AI>();
  const system =
    `You are a master day planner specialized in ${country ?? "Mauritius"}. You come up with creative, fun, unique and exciting activities ` +
    "based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with" +
    " no additional description or context.";
  const prompt =
    `Create a full-day itinerary for ${numAdults} adults ${numKids !== "0" ? `and ${numKids} kids` : ""} exploring the ` +
    `${allRegions} of ${country ?? "Mauritius"} on ${selectedDate} from ${startTime}:00 to ${endTime}:00. The itinerary should feature unique and ` +
    `lesser-known spots, focusing on the following activities: ${allActivities} and authentic experiences. Please ensure that ` +
    `all suggested locations and restaurants are operational and respect their opening and closing ` +
    `hours ${budget ? ` and stay within a total budget of USD ${budget} for the entire day` : ""}. ` +
    `Include hidden gems that are not commonly frequented by tourists. Keep the tone friendly and engaging.`;

  history.update([...history.get(), { role: "user", content: prompt }]);

  console.log("history=", history.get());

  let response = "";

  void (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai.chat("gpt-4o"),
      system,
      messages: history.get(),
      schema: ItinerarySchema,
    });

    for await (const partialObject of partialObjectStream) {
      if (partialObject) {
        stream.update(partialObject);
        response = JSON.stringify(partialObject);
      }
    }
    stream.done(0);
    history.done([...history.get(), { role: "assistant", content: response }]);
    console.log("new history=", history.get());
  })();

  return { object: stream.value };
}
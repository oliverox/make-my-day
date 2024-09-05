import { streamObject } from "ai";
import { Redis } from "@upstash/redis";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import type { AI } from './serverActions';
import { ActivitySchema } from "~/app/_definitions/schemas";
import { getMutableAIState, createStreamableValue } from "ai/rsc";

export async function updateItinerary({ id }: { id: string }) {
  "use server";

  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const stream = createStreamableValue();
  const history = getMutableAIState<typeof AI>();
  const redis = Redis.fromEnv();
  const redisKey = `mmd.${userId}`;
  const country: string | null = await redis.hget(redisKey, "country");

  const system =
    `You are a master day planner specialized in ${country ?? "Mauritius"}. You come up with creative, fun, unique and exciting activities ` +
    "based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with ";
  ("no additional description or context.");

  console.log("history=", history.get());

  history.update([
    ...history.get(),
    {
      role: "user",
      content: `Replace the recommendation with id ${id} with something new. Only return the newly updated recommendation in JSON.`,
    },
  ]);

  let response = "";
  void (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai.chat("gpt-4o"),
      system,
      messages: history.get(),
      schema: ActivitySchema,
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

  console.log("updateItinerary response=", response);
  return { object: stream.value };
}
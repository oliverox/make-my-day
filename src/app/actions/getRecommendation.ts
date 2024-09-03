import { streamObject } from "ai";
import { Redis } from "@upstash/redis";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import type { AI } from "./serverActions";
import { ActivitySchema } from "~/app/definitions/schemas";
import { getMutableAIState, createStreamableValue } from "ai/rsc";

// async function getRecommendationFromGooglePlacesApi({
//   name,
//   location,
//   country,
// }: {
//   name: string;
//   location: string;
//   country: string;
// }) {
//   const response = await fetch(process.env.PLACES_API_URL!, {
//     method: "POST",
//     body: JSON.stringify({
//       textQuery: `${name}, ${location}, ${country}`,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//       "X-Goog-Api-Key": process.env.PLACES_API_KEY!,
//       "X-Goog-FieldMask":
//         "places.displayName,places.formattedAddress,places.priceLevel",
//     },
//   });
//   const json = await response.json();
//   console.log('json output=', JSON.stringify(json));
//   return json;
// }

export async function getRecommendation() {
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
  const activity: string | null = await redis.hget(redisKey, "reco_activity");
  const system =
    `You are a master at recommending the perfect activity to do in ${country ?? "Mauritius"}. You come up with creative, fun, unique and exciting activities ` +
    "based on the requirements of the user. You output the activity in JSON format. You return only the JSON with no additional description or context.";

  console.log("history=", history.get());

  history.update([
    ...history.get(),
    {
      role: "user",
      content: `Recommend a new ${activity} activity. Only return the newly updated recommendation in JSON.`,
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

    // let callOnce = false;
    for await (const partialObject of partialObjectStream) {
      if (partialObject) {
        stream.update(partialObject);
        response = JSON.stringify(partialObject);
        // const { name, location } = partialObject;
        // if (name && location && !callOnce) {
        //   const googleResp = await getRecommendationFromGooglePlacesApi({
        //     name,
        //     location,
        //     country: country ?? 'Mauritius'
        //   })
        //   // console.log('googleResp=', googleResp);
        //   callOnce = true;
        // }
      }
    }
    stream.done(0);
    history.done([...history.get(), { role: "assistant", content: response }]);
    console.log("new history=", history.get());
  })();

  console.log("recommended activity response=", response);
  return { object: stream.value };
}

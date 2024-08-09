import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  // Loader2,
  PhoneIcon,
  MapPinIcon,
  UtensilsIcon,
  SparklesIcon,
  DollarSignIcon,
} from "lucide-react";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AiJson } from '~/app/definitions/schemas';
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import type { z } from 'zod';

export default async function YourDayPage() {
  const model = openai.chat("gpt-4o");
  const aiOutput = await generateObject({
    model,
    schema: AiJson,
    mode: "json",
    system: "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, unique and exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You return only the JSON with no additional description or context.",
    prompt: "I want a full day itinerary for a family of four, including two kids aged 4 and 8, to the north of Mauritius starting with breakfast at 9AM to the evening with dinner at 8PM. What makes this trip unique is that it should include local food delights and restaurant names and contact number, kid-friendly activities as well as ample time to rest, and finally unique spots to visits that are not so commonly known by the public. Keep the tone friendly and educational. Make sure the locations proposed exist and restaurants are in operation.",
  });
  const aiJson = await aiOutput.toJsonResponse().json() as z.infer<typeof AiJson>;

  return (
    <UserComponentWrapper>
      <div className="flex flex-col gap-2">
        {aiJson.itinerary.map((item, index: number) => {
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  {item.start_time}: {item.activity}
                </CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <span>{item.location}</span>
                  {item.cost_usd !== "0" ? (
                    <div className="flex items-center">
                      <DollarSignIcon className="h-4 w-4" />
                      {item.cost_usd}
                    </div>
                  ) : (
                    ""
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p>{item.description}</p>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.address}</span>
                </div>
                {item.phone && item.phone.length > 0 && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.phone}</span>
                  </div>
                )}
                {item.unique_dish && item.unique_dish.length > 0 && (
                  <div className="flex items-center gap-2">
                    <UtensilsIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.unique_dish}</span>
                  </div>
                )}
                {item.tip && (
                  <div className="flex gap-2">
                    <div className="pt-1">
                      <SparklesIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{item.tip}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start"></CardFooter>
            </Card>
          );
        })}
      </div>
    </UserComponentWrapper>
  );
}

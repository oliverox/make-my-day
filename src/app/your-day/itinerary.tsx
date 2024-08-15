import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  MapPinIcon,
  UtensilsIcon,
  SparklesIcon,
  DollarSignIcon,
} from "lucide-react";
import { type AiJson } from "~/app/definitions/schemas";
import type { z } from "zod";

export async function Itinerary({ date }: { date: string }) {
  const json = (await fetch(`${process.env.BASE_URL}/api/ai?date=${date}`)).json();
  const aiJson = await json as z.infer<typeof AiJson>;
  console.log('aiJson=', aiJson);
  return (
    <div className="flex flex-col gap-4">
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
                  <span className="flex items-center">
                    <DollarSignIcon className="h-4 w-4" />
                    {item.cost_usd}
                  </span>
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
  );
}

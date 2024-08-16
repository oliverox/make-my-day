"use client";
import { useState } from "react";
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
import type { z } from "zod";
import { readStreamableValue } from "ai/rsc";
import { Button } from "~/components/ui/button";
import { getItinerary } from "~/app/actions/getItinerary";
import type { ActivitySchema, ItinerarySchema } from "~/app/definitions/schemas";

export const maxDuration = 60;
export const runtime = 'edge';

export function Itinerary({
  date,
  startTime,
  endTime,
  groupSize,
}: {
  date: string;
  startTime: string;
  endTime: string;
  groupSize: string;
}) {
  const [itinerary, setItinerary] = useState<string | undefined>();
  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-4">
      {!itinerary && (
        <Button
          size="lg"
          className="w-full uppercase"
          onClick={async () => {
            const { object } = await getItinerary({
              date,
              startTime,
              endTime,
              groupSize,
            });
            for await (const partialObject of readStreamableValue<
              z.infer<typeof ItinerarySchema>
            >(object)) {
              if (partialObject) {
                console.log("partialObject:", partialObject);
                setItinerary(JSON.stringify(partialObject.itinerary));
              }
            }
            console.log("itinerary=", itinerary);
          }}
        >
          Make My Day
        </Button>
      )}
      {itinerary &&
        itinerary.length > 0 &&
        (JSON.parse(itinerary) as z.infer<typeof ActivitySchema>[]).map(
          (item, index: number) => {
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
          },
        )}
    </div>
  );
}

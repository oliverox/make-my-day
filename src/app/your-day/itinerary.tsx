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
import type {
  ActivitySchema,
  ItinerarySchema,
} from "~/app/definitions/schemas";

export const maxDuration = 60;
export const runtime = "edge";

export function Itinerary({
  date,
  startTime,
  endTime,
  groupSize,
  region,
  activities
}: {
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  groupSize: string | null;
  region: string | null;
  activities: string[] | null;
}) {
  const [itinerary, setItinerary] = useState<string | undefined>();
  const [streaming, setStreaming] = useState(false);
  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-4">
      {!itinerary && (
        <Button
          size="lg"
          disabled={streaming}
          className="w-full uppercase"
          onClick={async () => {
            setStreaming(true);
            const { object } = await getItinerary({
              date,
              startTime,
              endTime,
              groupSize,
              region,
              activities
            });
            for await (const partialObject of readStreamableValue<
              z.infer<typeof ItinerarySchema>
            >(object)) {
              if (partialObject) {
                setItinerary(JSON.stringify(partialObject.itinerary));
              }
            }
          }}
        >
          {streaming ? "Making Your Day" : "Make My Day"}
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
                    {item.cost_usd && item.cost_usd !== "0" ? (
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
                  <div className="flex items-center gap-2">
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

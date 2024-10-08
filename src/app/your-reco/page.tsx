"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  HeartIcon,
  HouseIcon,
  MapPinIcon,
  UtensilsIcon,
  SparklesIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  DollarSignIcon,
  ThumbsDownIcon,
  LoaderPinwheelIcon,
  ArrowDownToLineIcon,
} from "lucide-react";
import Link from "next/link";
import type { z } from "zod";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { AI } from "~/app/actions/serverActions";
import type { ActivitySchema } from "../definitions/schemas";
import { useActions, useUIState, readStreamableValue } from "ai/rsc";

export default function Page() {
  const { getRecommendation } = useActions() as {
    getRecommendation: () => Promise<{
      object: z.infer<typeof ActivitySchema>;
    }>;
  };
  const [isStreaming, setStreaming] = useState(false);
  const [messages, setMessages] = useUIState<typeof AI>();
  const [items, setItems] = useState<z.infer<typeof ActivitySchema>[]>([]);

  const handleGetRecommendation = async () => {
    const { object } = await getRecommendation();
    for await (const recommendation of readStreamableValue<
      z.infer<typeof ActivitySchema>
      // @ts-expect-error Not sure why there is a type mismatch here
    >(object)) {
      if (recommendation) {
        console.log("current messages[]=", messages);
        console.log("setting messages[]:", recommendation);
        const allMessages = [...messages];
        allMessages[allMessages.length > 0 ? allMessages.length - 1 : 0] = {
          id: Date.now().toString(),
          role: "assistant",
          display: JSON.stringify(recommendation),
        };
        console.log("recommendation=", recommendation);
        setItems([recommendation]);
        setMessages(allMessages);
      } else {
        setStreaming(false);
      }
    }
  };

  return (
    <>
      {items?.map((item) => (
        <Card key={parseInt(item.id)}>
          <CardHeader>
            <CardTitle>{item.activity}</CardTitle>
            <CardDescription className="flex flex-col gap-1">
              <span>{item.location}</span>
              {item.cost_usd && item.cost_usd != "0" ? (
                <span className="flex items-center">
                  <DollarSignIcon className="h-4 w-4" />
                  {item.cost_usd}
                </span>
              ) : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p>{item.description}</p>
            {item.address && (
              <div className="flex gap-2">
                <div className="pt-1">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span>{item.address}</span>
              </div>
            )}
            {item.unique_dish && (
              <div className="flex gap-2">
                <div className="pt-1">
                  <UtensilsIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="w-fit">{item.unique_dish}</span>
              </div>
            )}
            {item.tip && (
              <div className="flex gap-2">
                <div className="pt-1">
                  <SparklesIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="w-fit">{item.tip}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-row justify-end gap-1">
            <Button variant="ghost" size="icon">
              <ThumbsDownIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleGetRecommendation()}
            >
              <RefreshCwIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardFooter>
        </Card>
      ))}
      {isStreaming && (
        <div className="flex justify-center py-4">
          <LoaderPinwheelIcon className="h-6 w-6 animate-spin" />
        </div>
      )}
      {!isStreaming && items.length === 0 && (
        <div className="flex flex-col gap-2">
          <p className="py-4 text-center text-sm">
            Tap on <span className="font-semibold">Make My Day</span> button
            below to generate your itinerary.
          </p>
          <Button className="gap-1 uppercase" onClick={handleGetRecommendation}>
            <HeartIcon className="h-5 w-5" />
            Make My Day
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full items-center gap-1 uppercase"
          >
            <Link href="/activities">
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full items-center gap-1 uppercase"
          >
            <Link href="/start">
              <HouseIcon className="h-5 w-5" />
              Start Over
            </Link>
          </Button>
        </div>
      )}
      {!isStreaming && items.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <Button size="lg" className="w-full items-center gap-2 uppercase">
            <ArrowDownToLineIcon className="h-5 w-5" />
            Save Recommendation
          </Button>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full items-center gap-1 uppercase"
          >
            <Link href="/quick-picks">
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full items-center gap-1 uppercase"
          >
            <Link href="/">
              <HouseIcon className="h-5 w-5" />
              Start Over
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

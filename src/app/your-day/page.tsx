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
  MessageCircleXIcon,
  MailIcon,
  HeartIcon,
  HouseIcon,
  MapPinIcon,
  UtensilsIcon,
  SparklesIcon,
  RefreshCwIcon,
  DollarSignIcon,
  LoaderPinwheelIcon,
} from "lucide-react";
import Link from "next/link";
import type { z } from "zod";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { AI } from "~/app/actions/serverActions";
import { useActions, useUIState, readStreamableValue } from "ai/rsc";
import type { ActivitySchema, ItinerarySchema } from "../definitions/schemas";

export default function Page() {
  const { getItinerary, updateItinerary } = useActions() as {
    getItinerary: () => Promise<{ object: z.infer<typeof ItinerarySchema> }>;
    updateItinerary: ({
      id,
    }: {
      id: string;
    }) => Promise<z.infer<typeof ActivitySchema>>;
  };
  const [isStreaming, setStreaming] = useState(false);
  const [messages, setMessages] = useUIState<typeof AI>();
  const [items, setItems] = useState<z.infer<typeof ActivitySchema>[]>([]);

  const handleGetItinerary = async () => {
    setStreaming(true);
    const { object } = await getItinerary();
    for await (const partialObject of readStreamableValue<
      z.infer<typeof ItinerarySchema>
      // @ts-expect-error Not sure why there is a type mismatch here
    >(object)) {
      if (partialObject) {
        console.log("current messages[]=", messages);
        console.log("setting messages[]:", partialObject.itinerary);
        const allMessages = [...messages];
        allMessages[allMessages.length > 0 ? allMessages.length - 1 : 0] = {
          id: Date.now().toString(),
          role: "assistant",
          display: JSON.stringify(partialObject.itinerary),
        };
        console.log("partialObject.itinerary=", partialObject.itinerary);
        setItems(partialObject.itinerary);
        setMessages(allMessages);
      } else {
        setStreaming(false);
      }
    }
  };

  const handleUpdateItinerary = async ({ id }: { id: string }) => {
    const updatedItem = await updateItinerary({ id });
    console.log("updated:", JSON.stringify(updatedItem));
    console.log("current messages=", messages);
    const newItems = [];
    for (const item of items) {
      if (item.id === updatedItem.id) {
        console.log("updating item id", item.id);
        newItems.push(updatedItem);
      } else {
        newItems.push(item);
      }
    }
    console.log("newItems=", newItems);
    setItems(newItems);
    console.log("setting messages...", {
      id: Date.now().toString(),
      role: "assistant",
      display: JSON.stringify(newItems),
    });
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        role: "assistant",
        display: JSON.stringify(newItems),
      },
    ]);
  };

  return (
    <>
      {items?.map((item) => (
        <Card key={parseInt(item.id)}>
          <CardHeader>
            <CardTitle>
              {item.start_time}: {item.activity}
            </CardTitle>
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
              <MessageCircleXIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleUpdateItinerary({ id: item.id })}
            >
              <RefreshCwIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <HeartIcon className="h-4 w-4 text-muted-foreground" />
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
        <Button className="uppercase" onClick={handleGetItinerary}>
          Make My Day
        </Button>
      )}
      {!isStreaming && items.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <Button size="lg" className="w-full items-center gap-2 uppercase">
            <MailIcon className="h-5 w-5" />
            Email Itinerary
          </Button>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full items-center gap-2 uppercase"
          >
            <Link href="/">
              <HouseIcon className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

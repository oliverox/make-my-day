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
  Loader2,
  PhoneIcon,
  MapPinIcon,
  UtensilsIcon,
  SparklesIcon,
  DollarSignIcon,
} from "lucide-react";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { api } from "~/trpc/react";

export default function YourDayPage() {
  const query = api.ai.post.useQuery({ text: "hello ai!" });
  console.log("output:", query.data);
  return (
    <UserComponentWrapper>
      {query.isLoading && <Loader2 className="h-6 w-6" />}
      {query.isSuccess && (
        <div className="flex flex-col gap-2">
          {query.data.object.itinerary.map((item, index) => {
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
      )}
    </UserComponentWrapper>
  );
}

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

export default async function YourDayPage() {
  const resp = await fetch(`${process.env.BASE_URL}/api/ai`, {
    method: 'POST'
  });
  console.log("resp=", resp);
  const aiJson = await resp.json();
  console.log("output:", aiJson);
  return (
    <UserComponentWrapper>
      <div className="flex flex-col gap-2">
        {aiJson.itinerary.map(
          (
            item: {
              location: string;
              activity: string;
              start_time: string;
              end_time: string;
              description: string;
              cost_usd?: string;
              address: string;
              tip: string;
              unique_dish: string | null;
              phone?: string;
            },
            index: number,
          ) => {
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
          },
        )}
      </div>
    </UserComponentWrapper>
  );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";
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
          {query.data.object.itinerary.map((activity, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{activity.time}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{activity.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </UserComponentWrapper>
  );
}

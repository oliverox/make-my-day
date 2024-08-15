import { Redis } from "@upstash/redis";
import Loading from "./loading";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { Suspense } from "react";
import { Itinerary } from "./itinerary";
import { auth } from "@clerk/nextjs/server";

export default async function YourDayPage() {
  const { userId } = auth();
  const redis = Redis.fromEnv();
  const selectedDate: string = (await redis.hget(
    `mmd.${userId}`,
    "selectedDate",
  ))!;
  const startEndTime: string = (await redis.hget(
    `mmd.${userId}`,
    "startEndTime",
  ))!;
  const groupSize: string = (await redis.hget(`mmd.${userId}`, "groupSize"))!;
  const [startTime, endTime] = startEndTime.split("_");

  return (
    <UserComponentWrapper>
      <div className="flex flex-col gap-2">
        <Suspense fallback={<Loading />}>
          <Itinerary
            date={selectedDate}
            startTime={startTime!}
            endTime={endTime!}
            groupSize={groupSize}
          />
        </Suspense>
      </div>
    </UserComponentWrapper>
  );
}

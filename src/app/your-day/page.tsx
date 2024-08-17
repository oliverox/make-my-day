import { Redis } from "@upstash/redis";
import { Itinerary } from "./itinerary";
import { auth } from "@clerk/nextjs/server";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from 'next/navigation';

export default async function YourDayPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/')
  }
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
      <Itinerary
        date={selectedDate}
        startTime={startTime!}
        endTime={endTime!}
        groupSize={groupSize}
      />
    </UserComponentWrapper>
  );
}

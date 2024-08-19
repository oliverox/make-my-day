import { Redis } from "@upstash/redis";
import { Itinerary } from "./itinerary";
import { auth } from "@clerk/nextjs/server";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from "next/navigation";

export default async function YourDayPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const redis = Redis.fromEnv();
  const redisKey = `mmd.${userId}`;
  const getSelectedDate: Promise<string | null> = redis.hget(
    redisKey,
    "selectedDate",
  );
  const getStartEndTime: Promise<string | null> = redis.hget(
    redisKey,
    "startEndTime",
  );
  const getRegion: Promise<string | null> = redis.hget(redisKey, "region");
  const getGroupSize: Promise<string | null> = redis.hget(
    redisKey,
    "groupSize",
  );
  const getActivities: Promise<string | null> = redis.hget(
    redisKey,
    "activities"
  );
  const getBudget: Promise<string | null> = redis.hget(redisKey, "budget");
  const [selectedDate, startEndTime, region, groupSize, activities, budget] =
    await Promise.all([
      getSelectedDate,
      getStartEndTime,
      getRegion,
      getGroupSize,
      getActivities,
      getBudget,
    ]);
  const [startTime, endTime] = startEndTime
    ? startEndTime.split("_")
    : ["09:00", "21:00"];

  return (
    <UserComponentWrapper>
      <Itinerary
        date={selectedDate}
        startTime={startTime!}
        endTime={endTime!}
        groupSize={groupSize}
        region={region}
        activities={activities}
        budget={budget}
      />
    </UserComponentWrapper>
  );
}

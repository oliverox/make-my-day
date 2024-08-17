import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { DayPicker } from "./dayPicker";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from 'next/navigation';

export default async function StartPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/')
  }
  const redis = Redis.fromEnv();
  let selectedDate:Date = (await redis.hget(`mmd.${userId}`, 'selectedDate'))!;
  if (!selectedDate) {
    selectedDate = new Date();
  }
  return (
    <UserComponentWrapper>
      <DayPicker selectedDateFromRedis={selectedDate} />
    </UserComponentWrapper>
  );
}

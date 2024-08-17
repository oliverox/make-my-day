import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { RegionPicker } from "./regionPicker";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from 'next/navigation';

export default async function StartPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/')
  }
  const redis = Redis.fromEnv();
  const region:string = (await redis.hget(`mmd.${userId}`, 'region'))!;
  return (
    <UserComponentWrapper>
      <RegionPicker defaultRegionFromRedis={region} />
    </UserComponentWrapper>
  );
}

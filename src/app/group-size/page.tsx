import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { GroupSizePicker } from './groupSizePicker';
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default async function GroupPage() {
  const { userId } = auth();
  if (!userId) {
    throw "Unauthorized";
  }
  const redis = Redis.fromEnv();
  const defaultGroupSize:string = (await redis.hget(`mmd.${userId}`, 'groupSize'))!;

  return (
    <UserComponentWrapper>
      <GroupSizePicker defaultGroupSize={defaultGroupSize} />
    </UserComponentWrapper>
  );
}

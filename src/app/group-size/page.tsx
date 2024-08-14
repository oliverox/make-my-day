import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { GroupSizePicker } from '~/components/groupSizePicker';
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default async function GroupPage() {
  const { userId } = auth();
  const redis = Redis.fromEnv();
  const defaultGroupSize = await redis.hget(`mmd.${userId}`, 'groupSize') as string;

  return (
    <UserComponentWrapper>
      <GroupSizePicker defaultGroupSize={defaultGroupSize} />
    </UserComponentWrapper>
  );
}

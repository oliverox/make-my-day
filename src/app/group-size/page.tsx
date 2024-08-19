import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { GroupSizePicker } from './groupSizePicker';
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from 'next/navigation';

export default async function GroupSizePage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const redis = Redis.fromEnv();
  const defaultGroupSize:string = (await redis.hget(`mmd.${userId}`, 'groupSize'))!;

  return (
    <UserComponentWrapper>
      <GroupSizePicker defaultGroupSize={defaultGroupSize} />
    </UserComponentWrapper>
  );
}

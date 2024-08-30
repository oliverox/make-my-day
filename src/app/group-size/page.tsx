import Link from 'next/link';
import { Redis } from "@upstash/redis";
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { GroupSizePicker } from './groupSizePicker';
import { UserComponentWrapper } from "~/components/userComponentWrapper";

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
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="w-full items-center gap-1 uppercase"
      >
        <Link href="/region">
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Link>
      </Button>
    </UserComponentWrapper>
  );
}

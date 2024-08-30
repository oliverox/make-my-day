import Link from 'next/link';
import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { RegionPicker } from "./regionPicker";
import { Button } from '~/components/ui/button';
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default async function RegionPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/')
  }
  const redis = Redis.fromEnv();
  const region:string = (await redis.hget(`mmd.${userId}`, 'region'))!;
  return (
    <UserComponentWrapper>
      <RegionPicker defaultRegionFromRedis={region} />
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="w-full items-center gap-1 uppercase"
      >
        <Link href="/calendar">
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Link>
      </Button>
    </UserComponentWrapper>
  );
}

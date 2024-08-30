import Link from "next/link";
import { Redis } from "@upstash/redis";
import { auth } from "@clerk/nextjs/server";
import { DayPicker } from "./dayPicker";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from "next/navigation";

export default async function StartPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const redis = Redis.fromEnv();
  let selectedDate: Date = (await redis.hget(`mmd.${userId}`, "selectedDate"))!;
  if (!selectedDate) {
    selectedDate = new Date();
  }
  return (
    <UserComponentWrapper>
      <DayPicker selectedDateFromRedis={selectedDate} />
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="w-full items-center gap-1 uppercase"
      >
        <Link href="/start">
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Link>
      </Button>
    </UserComponentWrapper>
  );
}

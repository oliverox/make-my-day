import Link from 'next/link';
import { Redis } from "@upstash/redis";
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeftIcon } from 'lucide-react';
import { BudgetSetter } from "./budgetSetter";
import { Button } from '~/components/ui/button';
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default async function BudgetPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const redis = Redis.fromEnv();
  const defaultBudget:string = (await redis.hget(`mmd.${userId}`, 'budget'))!;
  const budget = typeof defaultBudget === 'undefined' ? 0 : parseInt(defaultBudget);
  return (
    <UserComponentWrapper>
      <BudgetSetter defaultBudget={budget} />
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="w-full items-center gap-1 uppercase"
      >
        <Link href="/activities">
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Link>
      </Button>
    </UserComponentWrapper>
  );
}

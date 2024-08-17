import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server';
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { BudgetSetter } from "./budgetSetter";
import { redirect } from 'next/navigation';

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
    </UserComponentWrapper>
  );
}

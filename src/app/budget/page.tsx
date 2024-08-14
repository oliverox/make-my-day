import { Redis } from '@upstash/redis';
import { auth } from '@clerk/nextjs/server';
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { BudgetSetter } from './budgetSetter';

export default async function BudgetPage() {
  const { userId } = auth();
  const redis = Redis.fromEnv();
  const defaultBudget = await redis.hget(`mmd.${userId}`, 'budget') as string;

  return (
    <UserComponentWrapper>
      <BudgetSetter defaultBudget={defaultBudget} />
    </UserComponentWrapper>
  );
}

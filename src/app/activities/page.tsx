import { auth } from '@clerk/nextjs/server';
import { ActivitiesPicker } from "./activitiesPicker";
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { redirect } from 'next/navigation';

export default async function ActivitiesPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/')
  }
  return (
    <UserComponentWrapper>
      <ActivitiesPicker />
    </UserComponentWrapper>
  );
}

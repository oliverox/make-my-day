import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ActivitiesPicker } from "./activitiesPicker";
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default async function ActivitiesPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect('/')
  }
  return (
    <UserComponentWrapper>
      <ActivitiesPicker />
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

import Loading from './loading';
import { UserComponentWrapper } from "~/components/userComponentWrapper";
import { Suspense } from 'react';
import { Itinerary } from './itinerary';

export default async function YourDayPage({
  searchParams,
}: {
  searchParams: {
    date: string;
  };
}) {
  const { date } = searchParams;

  return (
    <UserComponentWrapper>
      <div className="flex flex-col gap-2">
        <Suspense fallback={<Loading />}>
          <Itinerary date={date} />
        </Suspense>
      </div>
    </UserComponentWrapper>
  );
}

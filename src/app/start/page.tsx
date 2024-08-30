import Link from "next/link";
import { Redis } from "@upstash/redis";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import { CountryPicker } from "./countryPicker";
import { saveToRedis } from "~/app/actions/saveToRedis";
import { UserComponentWrapper } from "~/components/userComponentWrapper";

const MenuButton = ({
  text,
  url,
}: {
  text: string;
  url: string;
}) => {
  return (
    <Button
      asChild
      className="flex h-24 items-center justify-center uppercase"
    >
      <Link href={url}>
        <span className="font-bold">{text}</span>
      </Link>
    </Button>
  );
};

export default async function StartPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const redis = Redis.fromEnv();
  let country: string = (await redis.hget(`mmd.${userId}`, "country"))!;
  if (!country) {
    country = "Mauritius";
    await saveToRedis({
      field: "country",
      value: country,
    });
  }

  return (
    <UserComponentWrapper>
      <div className="mt-4 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <CountryPicker defaultCountry={country} />
          <div className="grid grid-cols-2 gap-4">
            <MenuButton text="Full Day Plan" url="/calendar" />
            <MenuButton text="Flash Ideas" url="/calendar" />
            <span className="text-xs text-center">Create a personalized full-day itinerary tailored to your preferences.</span>
            <span className="text-xs text-center">Get instant recommendations for different occasions.</span>
            {/* <MenuButton text="Day Planning" url="/calendar" />
            <MenuButton text="Day Planning" url="/calendar" /> */}
          </div>
        </div>
      </div>
    </UserComponentWrapper>
  );
}

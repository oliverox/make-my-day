"use client";

import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { saveToRedis } from "~/app/actions/saveToRedis";

const ActivityButton = ({
  label,
  icon,
}: {
  label: string;
  icon: ReactElement | null;
}) => {
  return (
    <Button
      className="flex h-20 flex-col items-center justify-center gap-2"
      onClick={async () => {
        await saveToRedis({
          field: "reco_activity",
          value: label,
          redirectUrl: "/your-reco",
        });
      }}
    >
      {icon}
      <span className="text-center text-xs uppercase">{label}</span>
    </Button>
  );
};

export function ActivitiesPicker() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <span className="text-center">
          What would you like recommendations for?
        </span>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
          <ActivityButton label="beach" icon={null} />
          <ActivityButton label="local delight" icon={null} />
          <ActivityButton label="pub" icon={null} />
          <ActivityButton label="coffee" icon={null} />
          <ActivityButton label="fine dining" icon={null} />
          <ActivityButton label="kids-friendly" icon={null} />
          <ActivityButton label="biking" icon={null} />
          <ActivityButton label="hiking" icon={null} />
          <ActivityButton label="snorkeling" icon={null} />
          <ActivityButton label="waterfall" icon={null} />
          <ActivityButton label="catamaran" icon={null} />
          <ActivityButton label="fishing" icon={null} />
          <ActivityButton label="shopping" icon={null} />
          <ActivityButton label="museum" icon={null} />
          <ActivityButton label="sight-seeing" icon={null} />
          <ActivityButton label="mountain" icon={null} />
          <ActivityButton label="restaurant" icon={null} />
          <ActivityButton label="hidden gem" icon={null} />
          <ActivityButton label="popular" icon={null} />
          <ActivityButton label="surprise me" icon={null} />
        </div>
      </div>
    </div>
  );
}

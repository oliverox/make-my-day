"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { saveToRedis } from "~/app/actions/saveToRedis";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export function GroupSizePicker({
  defaultGroupSize,
}: {
  defaultGroupSize: string;
}) {
  const [groupSize, setGroupSize] = useState<string | undefined>(
    defaultGroupSize,
  );
  const [numKids, setNumKids] = useState(0);
  const [numAdults, setNumAdults] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <span className="text-center">Who&apos;s joining you?</span>
        <ToggleGroup
          type="single"
          size="lg"
          value={groupSize}
          className="grid grid-cols-2"
          onValueChange={(value) => {
            setGroupSize(value);
            if (value === "1") {
              setNumAdults(1);
              setNumKids(0);
            } else if (value === "2") {
              setNumAdults(2);
              setNumKids(0);
            } else if (value === "3") {
              setNumAdults(2);
              setNumKids(1);
            } else {
              setNumAdults(3);
              setNumKids(0);
            }
          }}
        >
          <ToggleGroupItem value="1" className="uppercase">
            It&apos;s just me
          </ToggleGroupItem>
          <ToggleGroupItem value="2" className="uppercase">
            With a partner
          </ToggleGroupItem>
          <ToggleGroupItem value="3" className="uppercase">
            Family with kids
          </ToggleGroupItem>
          <ToggleGroupItem value="4" className="uppercase">
            A Group
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {groupSize === "4" && (
        <div className="mt-4 flex flex-col gap-2">
          <span>Adults</span>
          <Input
            type="number"
            placeholder="How many adults?"
            value={!numAdults ? "" : numAdults}
            onInput={(e) => setNumAdults(parseInt(e.currentTarget.value))}
            className="h-12 rounded-sm border border-primary bg-transparent text-lg"
          />
        </div>
      )}
      {(groupSize === "3" || groupSize === "4") && (
        <div className="mt-4 flex flex-col gap-2">
          <span>Kids</span>
          <Input
            type="number"
            placeholder="How many kids?"
            value={!numKids ? "" : numKids}
            onInput={(e) => setNumKids(parseInt(e.currentTarget.value))}
            className="h-12 rounded-sm border border-primary bg-transparent text-lg"
          />
        </div>
      )}
      {groupSize && (
        <Button
          disabled={redirecting}
          className="mt-8 h-12"
          onClick={async () => {
            setRedirecting(true);
            await saveToRedis({
              field: "groupSize",
              value: `${numAdults}_${numKids}`,
              redirectUrl: "/activities",
            });
          }}
        >
          <span className="text-lg uppercase">Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

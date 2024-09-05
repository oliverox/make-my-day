"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { saveToRedis } from "~/app/_actions/saveToRedis";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export function RegionPicker({
  defaultRegionFromRedis,
}: {
  defaultRegionFromRedis: string;
}) {
  const [region, setRegion] = useState<string[] | undefined>(
    defaultRegionFromRedis ? defaultRegionFromRedis.split("_") : [],
  );
  const [redirecting, setRedirecting] = useState(false);

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <span className="text-center">
          Choose the regions you&apos;d like to visit in a day.
        </span>
        <ToggleGroup
          type="multiple"
          size="lg"
          value={region}
          className="grid grid-cols-3"
          onValueChange={(selectedRegions) => {
            setRegion(selectedRegions);
          }}
        >
          <ToggleGroupItem value="the north" className="uppercase col-start-2">
            North
          </ToggleGroupItem>
          <ToggleGroupItem value="the west" className="uppercase col-start-1">
            West
          </ToggleGroupItem>
          <ToggleGroupItem value="the center" className="uppercase">
            Center
          </ToggleGroupItem>
          <ToggleGroupItem value="the east" className="uppercase">
            East
          </ToggleGroupItem>
          <ToggleGroupItem value="the south" className="col-start-2 uppercase">
            South
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {region && (
        <Button
          disabled={redirecting}
          className="mt-8 h-12"
          onClick={async () => {
            setRedirecting(true);
            await saveToRedis({
              field: "region",
              value: region.join("_"),
              redirectUrl: "/group-size",
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

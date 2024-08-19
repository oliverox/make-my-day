"use client";

import { useState } from "react";
import { Button } from '~/components/ui/button';
import { saveToRedis } from "~/app/actions/saveToRedis";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { ShellIcon, UtensilsIcon, MartiniIcon, CoffeeIcon, ChevronRightIcon } from "lucide-react";

export function ActivitiesPicker() {
  const [activities, setActivities] = useState<string[]>([]);
  const [redirecting, setRedirecting] = useState(false);

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <span className="text-center">
          Select activities you&apos;d like to include.
        </span>
        <ToggleGroup
          type="multiple"
          size="lg"
          value={activities}
          className="grid grid-cols-2 gap-4"
          onValueChange={(selectedRegions) => {
            setActivities(selectedRegions);
          }}
          variant="outline"
        >
          <ToggleGroupItem
            value="beach"
            className="gap-2 border-gray-300 uppercase data-[state=on]:border-2 data-[state=on]:border-primary"
          >
            <ShellIcon className="h-5 w-5" />
            <span className="text-xs">Beach</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="local food"
            className="gap-2 border-gray-300 uppercase data-[state=on]:border-2 data-[state=on]:border-primary"
          >
            <UtensilsIcon className="h-5 w-5" />
            <span className="text-xs"> Local Food</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="pub"
            className="gap-2 border-gray-300 uppercase data-[state=on]:border-2 data-[state=on]:border-primary"
          >
            <MartiniIcon className="h-5 w-5" />
            <span className="text-xs">Pub</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="coffee"
            className="gap-2 border-gray-300 uppercase data-[state=on]:border-2 data-[state=on]:border-primary"
          >
            <CoffeeIcon className="h-5 w-5" />
            <span className="text-xs">Coffee</span>
          </ToggleGroupItem>
        </ToggleGroup>
        {activities && activities.length > 0 && (
        <Button
          disabled={redirecting}
          className="mt-2"
          onClick={async () => {
            setRedirecting(true);
            await saveToRedis({
              field: "activities",
              value: activities.join('_'),
              redirectUrl: "/budget",
            });
          }}
        >
          <span className="text-lg uppercase">Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default function GroupPage() {
  const [groupSize, setGroupSize] = useState<string | undefined>(undefined);
  const [numKids, setNumKids] = useState(0);

  useEffect(() => {
    const groupSizeLS = window.localStorage.getItem("mmd.groupSize");
    const numKidsLS = window.localStorage.getItem('mmd.numKids');
    if (groupSizeLS) {
      setGroupSize(groupSizeLS);
    }
    if (numKidsLS) {
      setNumKids(parseInt(numKidsLS));
    }
  }, []);

  const onGroupSizeChange = (size: string) => {
    window.localStorage.setItem("mmd.groupSize", size);
    setGroupSize(size);
    if (size !== '2+') {
      setNumKids(0);
      window.localStorage.removeItem('mmd.numKids');
    }
  };

  const onNumKidsChange = (num: string) => {
    window.localStorage.setItem('mmd.numKids', num);
    setNumKids(parseInt(num));
  }

  return (
    <UserComponentWrapper>
      <div className="mt-4 flex flex-col gap-2">
        <span>Who else is in?</span>
        <ToggleGroup
          type="single"
          size="lg"
          value={groupSize}
          onValueChange={(value) => onGroupSizeChange(value)}
        >
          <ToggleGroupItem value="1" className="uppercase">
            Just me
          </ToggleGroupItem>
          <ToggleGroupItem value="2" className="uppercase">
            A partner
          </ToggleGroupItem>
          <ToggleGroupItem value="2+" className="uppercase">
            Family with kids
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {groupSize === "2+" && (
        <div className="mt-4 flex flex-col gap-2">
          <span>Kids</span>
          <Input
            type="number"
            placeholder="How many kids?"
            value={!numKids ? '' : numKids}
            onInput={(e) => onNumKidsChange(e.currentTarget.value)}
            className="h-12 rounded-sm border border-primary bg-transparent text-lg"
          />
        </div>
      )}
      {groupSize && (
        <Button className="mt-8 h-12" asChild>
          <Link href="/budget">
            <span className="text-lg">Next</span>
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </Button>
      )}
    </UserComponentWrapper>
  );
}

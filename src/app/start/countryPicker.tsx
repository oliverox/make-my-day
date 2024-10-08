"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MapPinIcon } from 'lucide-react';
import { saveToRedis } from "~/app/actions/saveToRedis";

export function CountryPicker({ defaultCountry }: { defaultCountry: string }) {
  const [country, setCountry] = useState(defaultCountry);

  useEffect(() => {
    void saveToRedis({
      field: "country",
      value: country,
    });
  }, [country]);
  return (
    <div className="flex flex-row items-center justify-center gap-2 pb-4 text-lg">
      <span className="text-center">I am visiting</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none flex flex-row gap-1 items-center">
          <span className="underline underline-offset-8 decoration-dotted">{country}</span>
          <MapPinIcon className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Which country are you visiting?</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={async () => setCountry("Mauritius")}>
              <span>Mauritius</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCountry("Singapore")}>
              <span>Singapore</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

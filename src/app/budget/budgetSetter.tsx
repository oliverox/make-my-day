"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowBigRightIcon } from "lucide-react";
import { saveToRedis } from "~/app/actions/saveToRedis";

export function BudgetSetter({ defaultBudget }: { defaultBudget: number }) {
  const [hasBudget, setHasBudget] = useState(defaultBudget !== 0);
  const [budget, setBudget] = useState(defaultBudget);
  const [redirecting, setRedirecting] = useState(false);

  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-center">Do you want to set a day budget?</span>
        <RadioGroup
          value={hasBudget ? "SET_BUDGET" : "NO_BUDGET"}
          className="mt-4 flex flex-row gap-8"
          onValueChange={(value) =>
            value === "NO_BUDGET" ? setHasBudget(false) : setHasBudget(true)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="NO_BUDGET"
              id="option-no-budget"
              className="h-5 w-5"
            />
            <Label htmlFor="option-no-budget" className="text-lg">
              No Budget
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="SET_BUDGET"
              id="option-budget"
              className="h-5 w-5"
            />
            <Label htmlFor="option-budget" className="text-lg">
              Set Day Budget
            </Label>
          </div>
        </RadioGroup>
      </div>
      {hasBudget && (
        <div className="mt-4">
          <div className="mt-4 flex flex-col gap-2">
            <span>Budget for the day (USD)</span>
            <Input
              type="number"
              placeholder="What's your max daily budget?"
              defaultValue={budget}
              onInput={(e) => setBudget(parseInt(e.currentTarget.value))}
              className="h-12 rounded-sm border border-primary bg-transparent text-lg"
            />
          </div>
        </div>
      )}
      <Button
        disabled={redirecting}
        className="mt-8 h-12"
        onClick={async () => {
          setRedirecting(true);
          await saveToRedis({
            field: "budget",
            value: hasBudget ? `${budget}` : "0",
            redirectUrl: "/your-day",
          });
        }}
      >
        <span className="text-lg uppercase">Next</span>
        <ArrowBigRightIcon className="h-5 w-5" />
      </Button>
    </>
  );
}

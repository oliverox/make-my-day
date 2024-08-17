"use client";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { ChevronRightIcon } from "lucide-react";
import { Slider } from "~/components/ui/slider";
import { saveToRedis } from "~/app/actions/saveToRedis";

export function DayPicker({
  selectedDateFromRedis,
}: {
  selectedDateFromRedis: Date;
}) {
  const [startEndTime, setStartEndTime] = useState<number[]>([9, 23]);
  const [selectedDate, setSelectedDate] = useState(
    new Date(selectedDateFromRedis),
  );
  const [redirecting, setRedirecting] = useState(false);
  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Pick a day to plan</span>
        <div className="flex gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() =>
              setSelectedDate(dayjs(new Date()).add(1, "day").toDate())
            }
          >
            Tomorrow
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => (date ? setSelectedDate(date) : null)}
          disabled={(date) =>
            date < dayjs(new Date()).subtract(1, "day").toDate()
          }
          className="flex h-full rounded-md border bg-white"
          classNames={{
            months:
              "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            row: "w-full mt-2",
            root: `shadow-lg p-5`,
          }}
        />
      </div>
      <div className="flex flex-col gap-3 px-2">
        <div className="flex flex-row items-center justify-between">
          <span>
            Start time<br />
            <strong>{dayjs().hour(startEndTime[0]!).format("HH")}:00</strong>
          </span>
          <span className="text-right">
            End time<br />
            <strong>{dayjs().hour(startEndTime[1]!).format("HH")}:00</strong>
          </span>
        </div>
        <Slider
          defaultValue={[startEndTime[0]!, startEndTime[1]!]}
          min={6}
          max={24}
          step={1}
          minStepsBetweenThumbs={1}
          onValueChange={(times: number[]) => setStartEndTime(times)}
        />
      </div>
      {selectedDate && (
        <Button
          disabled={redirecting}
          className="mt-4 h-12 flex-1"
          onClick={async () => {
            setRedirecting(true);
            await saveToRedis({
              field: "startEndTime",
              value: `${startEndTime[0]}_${startEndTime[1]}`,
            });
            await saveToRedis({
              field: "selectedDate",
              value: selectedDate.toDateString(),
              redirectUrl: "/region",
            });
          }}
        >
          <span className="text-lg uppercase">
            {dayjs(selectedDate).format("ddd D MMM")}
          </span>
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
